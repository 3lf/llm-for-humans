"""Keyless regression tests of the README's RAG code, using real LCEL and SDK HTTP.

Chroma and the splitter are small fakes. A local HTTP transport supplies SDK
responses; no request reaches a model or demonstrates model quality/security.
"""

import ast
import json
import os
import socket
import unittest
from unittest.mock import patch

import httpx2
from langchain_core.documents import Document
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableLambda, RunnablePassthrough
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from openai import APIConnectionError, AuthenticationError, InternalServerError, RateLimitError

from example_source import execute_definitions, find_python_block


CAPSTONE = find_python_block('collection_name=f"support-demo-')
FIRST_RAG = find_python_block('collection_name=f"rag-demo-')


def no_network(*args, **kwargs):
    raise AssertionError("Network disabled: only local MockTransport is allowed")


def source_namespace(code, state, *, response_errors=(), retrieval_error=None):
    """Run actual snippet setup, replacing storage/splitting and HTTP only."""
    class Splitter:
        def __init__(self, **kwargs):
            state["splitter"] = kwargs

        def create_documents(self, texts, metadatas=None):
            return [Document(page_content=text, metadata=metadata)
                    for text, metadata in zip(texts, metadatas or [{} for _ in texts])]

    class Store:
        @classmethod
        def from_documents(cls, docs, embeddings, **kwargs):
            state["embedding_retries"] = embeddings.max_retries
            state["store_options"] = kwargs
            state["documents"] = list(docs)
            return cls()

        def as_retriever(self, **kwargs):
            def retrieve(question):
                state["retrieval_attempts"] += 1
                if retrieval_error is not None:
                    raise retrieval_error
                chosen = state["documents"]
                filters = kwargs.get("search_kwargs", {}).get("filter", {})
                return [doc for doc in chosen
                        if all(doc.metadata.get(k) == v for k, v in filters.items())][:2]
            return RunnableLambda(retrieve)

        def delete(self, *, ids):
            state["deleted_ids"] = ids

    pending_errors = iter(response_errors)

    def http_reply(request):
        state["response_attempts"] += 1
        state["requests"].append(json.loads(request.content))
        failure = next(pending_errors, None)
        if failure is not None:
            status, body = failure
            return httpx2.Response(status, json={"error": body})
        if request.url.path.endswith("/responses"):
            return httpx2.Response(200, json={
                "id": "resp_local", "object": "response", "created_at": 0,
                "status": "completed", "model": "gpt-6-luna",
                "output": [{"id": "msg_local", "type": "message", "role": "assistant",
                            "status": "completed", "content": [
                                {"type": "output_text", "text": "Local fake answer", "annotations": []}]}],
                "usage": {"input_tokens": 1, "output_tokens": 1, "total_tokens": 2},
            })
        return httpx2.Response(200, json={
            "id": "chatcmpl_local", "object": "chat.completion", "created": 0,
            "model": "gpt-6-luna", "choices": [{"index": 0, "finish_reason": "stop",
                "message": {"role": "assistant", "content": "Local fake answer"}}],
            "usage": {"prompt_tokens": 1, "completion_tokens": 1, "total_tokens": 2},
        })

    client = httpx2.Client(transport=httpx2.MockTransport(http_reply))
    state["http_client"] = client

    def chat_model(**kwargs):
        state["model_options"] = kwargs
        return ChatOpenAI(**kwargs, http_client=client)

    namespace = {
        "os": os, "uuid4": lambda: type("Id", (), {"hex": "local"})(),
        "APIConnectionError": APIConnectionError, "InternalServerError": InternalServerError,
        "RateLimitError": RateLimitError, "ChatOpenAI": chat_model,
        "OpenAIEmbeddings": OpenAIEmbeddings, "Chroma": Store,
        "RecursiveCharacterTextSplitter": Splitter,
        "ChatPromptTemplate": ChatPromptTemplate, "StrOutputParser": StrOutputParser,
        "RunnablePassthrough": RunnablePassthrough,
    }
    # Imports and top-level example invoke/print are omitted; definitions,
    # constructors, predicate, prompts and chain composition come from README.
    selected = [node for node in ast.parse(code).body
                if not isinstance(node, (ast.Import, ast.ImportFrom, ast.Expr))
                and not (isinstance(node, ast.Assign)
                         and any(isinstance(target, ast.Name) and target.id == "answer"
                                 for target in node.targets))]
    exec(compile(ast.Module(body=selected, type_ignores=[]), "README RAG example", "exec"), namespace)
    return namespace


def state():
    return {"response_attempts": 0, "retrieval_attempts": 0, "requests": []}


class RAGExamplesTests(unittest.TestCase):
    def setUp(self):
        self.network_guard = patch("socket.create_connection", side_effect=no_network)
        self.network_guard.start()
        self.credentials = patch.dict(os.environ, {"OPENAI_API_KEY": "local-keyless-test", "LANGCHAIN_OPENAI_TCP_KEEPALIVE": "0"})
        self.credentials.start()
        # Keep the actual README retry predicate/cap; skip waiting in tests only.
        self.backoff = patch("tenacity.wait.wait_exponential_jitter.__call__", return_value=0)
        self.backoff.start()
        self.clients = []

    def tearDown(self):
        for client in self.clients:
            client.close()
        self.backoff.stop()
        self.credentials.stop()
        self.network_guard.stop()

    def build(self, code=CAPSTONE, **kwargs):
        observed = state()
        namespace = source_namespace(code, observed, **kwargs)
        self.clients.append(observed["http_client"])
        return namespace, observed

    def test_quota_and_billing_are_not_retried_by_real_sdk_chain(self):
        fixtures = [
            {"type": "insufficient_quota", "code": None},
            {"type": None, "code": "insufficient_quota"},
            {"type": "rate_limit_error", "code": "billing_hard_limit_reached"},
            {"type": "billing_limit_reached", "code": "rate_limit_exceeded"},
            {"type": None, "code": "unknown_429"},
        ]
        for details in fixtures:
            with self.subTest(details=details):
                ns, observed = self.build(response_errors=[(429, {"message": "Synthetic", **details})] * 3)
                with self.assertRaises(RateLimitError):
                    ns["chain"].invoke("Hours?")
                self.assertEqual(observed["response_attempts"], 1)
                self.assertEqual(observed["retrieval_attempts"], 1)
                self.assertEqual(observed["model_options"]["max_retries"], 0)

    def test_known_rate_limit_gets_three_total_attempts_and_one_retrieval(self):
        error = (429, {"message": "Synthetic", "type": "requests", "code": "rate_limit_exceeded"})
        ns, observed = self.build(response_errors=[error] * 3)
        with self.assertRaises(RateLimitError):
            ns["chain"].invoke("Hours?")
        self.assertEqual(observed["response_attempts"], 3)
        self.assertEqual(observed["retrieval_attempts"], 1)

    def test_transient_server_error_recovers_without_retrieving_again(self):
        ns, observed = self.build(response_errors=[(503, {"message": "Synthetic", "code": "server_is_overloaded"})])
        self.assertEqual(ns["chain"].invoke("Hours?"), "Local fake answer")
        self.assertEqual(observed["response_attempts"], 2)
        self.assertEqual(observed["retrieval_attempts"], 1)

    def test_authentication_failure_is_not_retried(self):
        ns, observed = self.build(response_errors=[(401, {"message": "Synthetic", "code": "invalid_api_key"})])
        with self.assertRaises(AuthenticationError) as raised:
            ns["chain"].invoke("Hours?")
        self.assertEqual(raised.exception.status_code, 401)
        self.assertEqual(observed["response_attempts"], 1)

    def test_predicate_checks_flat_or_nested_body_and_denial_wins(self):
        namespace = execute_definitions(CAPSTONE, ["is_transient"], {
            "APIConnectionError": APIConnectionError, "InternalServerError": InternalServerError,
            "RateLimitError": RateLimitError,
        })
        predicate = namespace["is_transient"]
        request = httpx2.Request("POST", "https://example.invalid/local")
        response = httpx2.Response(429, request=request)
        for nested in (False, True):
            for code, expected in (("rate_limit_exceeded", True), ("slow_down", True),
                                   ("insufficient_quota", False), ("billing_hard_limit_reached", False),
                                   ("unknown_429", False)):
                with self.subTest(nested=nested, code=code):
                    body = {"type": None, "code": code}
                    if nested:
                        body = {"error": body}
                    error = RateLimitError("Synthetic", response=response, body=body)
                    self.assertEqual(predicate(error), expected)
        self.assertTrue(predicate(APIConnectionError(request=request)))
        self.assertFalse(predicate(ValueError("Not transient")))
        unknown = RateLimitError("Synthetic", response=response, body={"type": [], "code": {}})
        self.assertFalse(predicate(unknown))

    def test_retrieval_failure_stays_outside_model_retry(self):
        request = httpx2.Request("POST", "https://example.invalid/local")
        error = APIConnectionError(request=request)
        ns, observed = self.build(retrieval_error=error)
        with self.assertRaises(APIConnectionError):
            ns["chain"].invoke("Hours?")
        self.assertEqual(observed["retrieval_attempts"], 1)
        self.assertEqual(observed["response_attempts"], 0)
        self.assertEqual(observed["embedding_retries"], 2)

    def test_capstone_is_single_turn_with_static_few_shot(self):
        ns, observed = self.build()
        ns["chain"].invoke("First unique question")
        ns["chain"].invoke("Second unique question")
        self.assertNotIn("First unique question", json.dumps(observed["requests"][1]))
        self.assertIn("Second unique question", json.dumps(observed["requests"][1]))

    def test_first_rag_metadata_ids_boundaries_and_educational_filter_delete(self):
        ns, observed = self.build(FIRST_RAG)
        self.assertEqual(ns["rag_chain"].invoke("Hours?"), "Local fake answer")
        self.assertEqual(ns["chunk_ids"], ["hours:v1:0", "returns:v1:0", "address:v1:0", "support:v1:0"])
        self.assertEqual(observed["store_options"]["ids"], ns["chunk_ids"])
        self.assertEqual([doc.metadata["source"] for doc in ns["chunks"]],
                         ["hours", "returns", "address", "support"])
        messages = ns["prompt"].invoke({"context": "UNTRUSTED DATA", "question": "Hours?"}).to_messages()
        self.assertEqual([m.type for m in messages], ["system", "human"])
        self.assertIn("داده", messages[0].content)
        self.assertIn("<context>\nUNTRUSTED DATA\n</context>", messages[1].content)
        # This tests data placement only; it proves no prompt-injection protection.
        with patch("builtins.print"):
            exec(find_python_block('old_ids = [chunk_id'), ns)
        self.assertEqual(observed["deleted_ids"], ["returns:v1:0"])
        filtered = ns["hours_retriever"].invoke("Hours?")
        self.assertEqual([doc.metadata["source"] for doc in filtered], ["hours"])


if __name__ == "__main__":
    unittest.main()
