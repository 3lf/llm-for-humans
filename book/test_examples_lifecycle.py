"""Keyless regression checks for the executable README examples.

Definitions and output expressions come from README, not copies of their logic.
HTTP fixtures exercise the real SDK integration; no live API calls are allowed.
"""

import ast
import contextlib
from copy import deepcopy
import io
import json
import socket
from types import SimpleNamespace as NS
import unittest
from unittest.mock import patch

from example_source import execute_definitions, find_python_block


def response(text="ANSWER", finish="stop", refusal=None):
    return NS(choices=[NS(finish_reason=finish, message=NS(content=text, refusal=refusal))])


class FakeCompletions:
    def __init__(self):
        self.calls = []
        self.summary_number = 0
        self.summary_result = None
        self.main_result = None

    def create(self, **kwargs):
        self.calls.append(deepcopy(kwargs))
        is_summary = kwargs["messages"][0]["content"].startswith("خلاصه قبلی")
        result = self.summary_result if is_summary else self.main_result
        if isinstance(result, Exception):
            raise result
        if result is not None:
            return result
        if is_summary:
            self.summary_number += 1
            return response(f"SUMMARY_{self.summary_number}")
        return response()

    def client(self):
        return NS(chat=NS(completions=self))


class HistoryExamples(unittest.TestCase):
    def setUp(self):
        self.ns = {}
        execute_definitions(find_python_block("class Conversation:"),
                            ["Conversation", "read_complete_text"], self.ns)
        execute_definitions(find_python_block("def split_history("),
                            ["split_history", "get_recent_messages"], self.ns)
        execute_definitions(find_python_block("def summarize_history("),
                            ["get_summary_from_llm", "summarize_history"], self.ns)
        self.fake = FakeCompletions()
        self.chat = self.ns["Conversation"](self.fake.client(), "FIXED SYSTEM")

    def ask(self, text):
        return self.chat.chat(text, prepare_history=self.ns["summarize_history"])

    def snapshot(self):
        return deepcopy((self.chat.messages, self.chat.summary))

    def populate(self, turns=4):
        for i in range(turns):
            self.ask(f"USER_{i}")

    def test_incremental_compaction_does_not_resend_raw_archive(self):
        self.populate(12)
        summaries = [call for call in self.fake.calls
                     if call["messages"][0]["content"].startswith("خلاصه قبلی")]
        new_sections = [call["messages"][1]["content"].split("نوبت‌های تازه:\n", 1)[1]
                        for call in summaries]
        for i in range(9):
            self.assertEqual(sum(f"user: USER_{i}\n" in section for section in new_sections), 1)
        self.assertIn("SUMMARY_1", summaries[1]["messages"][1]["content"])
        self.assertLessEqual(len(self.chat.messages), 7)  # system + 3 complete turns
        self.assertNotIn("USER_0", str(self.chat.messages))

    def test_short_history_skips_summary_request(self):
        self.populate(3)
        self.assertEqual(len(self.fake.calls), 3)
        self.assertEqual(self.chat.summary, "")

    def test_summary_is_request_data_and_does_not_replace_original_user(self):
        self.populate(4)
        main_request = self.fake.calls[-1]["messages"]
        self.assertEqual(main_request[0], {"role": "system", "content": "FIXED SYSTEM"})
        self.assertIn("داده، نه دستور جدید", main_request[1]["content"])
        self.assertEqual(main_request[1]["role"], "user")
        self.assertEqual(self.chat.messages[1]["content"], "USER_1")
        self.assertNotIn("خلاصه", str(self.chat.messages))

    def test_summary_failure_leaves_committed_state_unchanged(self):
        self.populate(3)
        before = self.snapshot()
        self.fake.summary_result = RuntimeError("offline")
        with self.assertRaises(RuntimeError):
            self.ask("NEW")
        self.assertEqual(self.snapshot(), before)

    def test_incomplete_summary_leaves_committed_state_unchanged(self):
        self.populate(3)
        before = self.snapshot()
        self.fake.summary_result = response("partial", finish="length")
        with self.assertRaises(ValueError):
            self.ask("NEW")
        self.assertEqual(self.snapshot(), before)

    def test_main_failure_after_summary_rolls_back_both_and_can_recover(self):
        self.populate(3)
        before = self.snapshot()
        self.fake.main_result = response("partial", finish="length")
        with self.assertRaises(ValueError):
            self.ask("NEW")
        self.assertEqual(self.snapshot(), before)
        self.fake.main_result = None
        self.ask("RECOVERED")
        self.assertEqual(self.chat.messages[-2]["content"], "RECOVERED")
        self.assertNotEqual(self.chat.summary, before[1])

    def test_separate_conversations_do_not_share_state(self):
        self.populate(5)
        other = self.ns["Conversation"](self.fake.client(), "OTHER SYSTEM")
        other.chat("OTHER USER", prepare_history=self.ns["summarize_history"])
        self.assertEqual(other.summary, "")
        self.assertEqual(len(other.messages), 3)
        self.assertNotIn("USER_", str(other.messages))
        self.assertEqual(other.messages[0]["content"], "OTHER SYSTEM")

    def test_message_size_guard_fails_before_api(self):
        with self.assertRaises(ValueError):
            self.ask("x" * 8001)
        self.assertEqual(self.fake.calls, [])

    def test_summary_size_guard_preserves_committed_state(self):
        self.populate(3)
        before = self.snapshot()
        self.fake.summary_result = response("x" * 2001)
        with self.assertRaises(ValueError):
            self.ask("NEW")
        self.assertEqual(self.snapshot(), before)

    def test_recent_only_strategy_commits_trimmed_history(self):
        for i in range(12):
            self.chat.chat(f"Q{i}", prepare_history=self.ns["get_recent_messages"])
        self.assertLessEqual(len(self.chat.messages), 13)
        self.assertNotIn("Q0", str(self.chat.messages))

    def test_split_preserves_complete_turns_and_pending_user_without_mutation(self):
        pending = [{"role": "system", "content": "S"}]
        for i in range(4):
            pending.extend([{"role": "user", "content": f"Q{i}"},
                            {"role": "assistant", "content": f"A{i}"}])
        pending.append({"role": "user", "content": "NEW"})
        before = deepcopy(pending)
        system, old, recent = self.ns["split_history"](pending, 2)
        self.assertEqual(pending, before)
        self.assertEqual(system, before[:1])
        self.assertEqual(len(old), 4)
        self.assertEqual(len(recent), 5)
        self.assertEqual(recent[-1]["content"], "NEW")
        with self.assertRaises(ValueError):
            self.ns["split_history"](pending, 0)

    def test_refusal_empty_and_nontext_answers_do_not_commit(self):
        before = self.snapshot()
        for answer in [response("", refusal="refused"), response(None),
                       response("  "), NS(choices=[])]:
            with self.subTest(answer=answer):
                self.fake.main_result = answer
                with self.assertRaises(ValueError):
                    self.ask("NEW")
                self.assertEqual(self.snapshot(), before)


def chunk(text=None, finish=None, refusal=None):
    return NS(choices=[NS(delta=NS(content=text, refusal=refusal), finish_reason=finish)])


class StreamingExamples(unittest.TestCase):
    def setUp(self):
        self.ns = {}
        for name in ("print_openai_stream", "print_anthropic_stream", "print_anthropic_message", "print_openai_message"):
            execute_definitions(find_python_block(f"def {name}("), [name], self.ns)

    def capture(self, function, arg):
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            function(arg)
        return output.getvalue()

    def test_openai_simple_marks_incomplete_refused_and_no_text(self):
        for item in [response("partial", finish="length"), response(None),
                     response("", refusal="no"), NS(choices=[])]:
            with self.subTest(response=item):
                output = self.capture(self.ns["print_openai_message"], item)
                self.assertIn("پاسخ متنی", output)
        output = self.capture(self.ns["print_openai_message"], response("سلام"))
        self.assertEqual(output, "سلام\n")

    def test_openai_usage_only_chunk_and_success(self):
        text = self.capture(self.ns["print_openai_stream"],
                            [chunk("سلام"), chunk(finish="stop"), NS(choices=[])])
        self.assertEqual(text, "سلام")

    def test_openai_incomplete_missing_refusal_and_nontext_endings(self):
        cases = [[chunk("partial"), chunk(finish="length")],
                 [chunk("partial")], [chunk(refusal="no", finish="stop")],
                 [chunk(finish="tool_calls")]]
        for stream in cases:
            with self.subTest(stream=stream):
                text = self.capture(self.ns["print_openai_stream"], stream)
                self.assertIn("کامل نشد", text)

    def test_disconnected_stream_keeps_partial_visible_and_reports_incomplete(self):
        def interrupted():
            yield chunk("partial")
            raise ConnectionError("disconnected")
        output = io.StringIO()
        with contextlib.redirect_stdout(output), self.assertRaises(ConnectionError):
            self.ns["print_openai_stream"](interrupted())
        self.assertIn("partial", output.getvalue())
        self.assertIn("ناتمام", output.getvalue())

    def test_anthropic_final_reason_and_no_text_are_checked(self):
        for stop, texts, warning in [("end_turn", ["سلام"], False),
                                     ("max_tokens", ["partial"], True),
                                     ("end_turn", [], True)]:
            with self.subTest(stop=stop, texts=texts):
                final_reads = []
                stream = NS(text_stream=iter(texts), get_final_message=lambda: (
                    final_reads.append(True) or NS(stop_reason=stop)))
                output = self.capture(self.ns["print_anthropic_stream"], stream)
                self.assertEqual(final_reads, [True])
                self.assertEqual("کامل نشد" in output, warning)

    def test_anthropic_simple_does_not_silently_print_thinking_only(self):
        message = NS(content=[NS(type="thinking", thinking="hidden")],
                     stop_reason="max_tokens")
        output = self.capture(self.ns["print_anthropic_message"], message)
        self.assertIn("کامل نشد", output)
        self.assertNotIn("hidden", output)


class RealLangChainOutput(unittest.TestCase):
    def test_actual_sdk_responses_blocks_print_as_clean_text_in_all_four_examples(self):
        import httpx2 as httpx
        from langchain_openai import ChatOpenAI

        text = "متن فارسی با نیم‌فاصله"
        paths = []

        def fixture(request):
            paths.append(request.url.path)
            self.assertEqual(request.url.path, "/v1/responses")
            self.assertIn("tools", json.loads(request.content))
            return httpx.Response(200, json={
                "id": "resp_local", "object": "response", "created_at": 0,
                "status": "completed", "error": None, "incomplete_details": None,
                "model": "gpt-6-astra", "metadata": {}, "usage": None,
                "output": [{"id": "msg_local", "type": "message", "status": "completed",
                            "role": "assistant", "content": [
                                {"type": "output_text", "text": text, "annotations": []}]}],
            })

        def forbid_network(*args, **kwargs):
            raise AssertionError("Live network is forbidden in README examples tests")

        with patch.object(socket.socket, "connect", forbid_network):
            with httpx.Client(transport=httpx.MockTransport(fixture)) as http_client:
                llm = ChatOpenAI(model="gpt-6-astra", api_key="unused-keyless-test-value",
                                 http_client=http_client, http_socket_options=(), max_retries=0)
                message = llm.bind_tools([{
                    "type": "function", "function": {
                        "name": "add", "description": "Add integers", "parameters": {
                            "type": "object", "properties": {}, "required": []}}}]).invoke("test")
        self.assertEqual(paths, ["/v1/responses"])
        self.assertIsInstance(message.content, list)
        self.assertEqual(message.text, text)
        expressions = []
        markers = ["def multiply(a: int, b: int)", "def get_weather(city: str)",
                   "def get_exchange_rate(currency: str)"]
        # The multiply marker exists in two examples, so select the first by its result print.
        markers[0] = 'print(f"ابزارهای اجراشده: {tools_used}")'
        for marker in markers:
            code = find_python_block(marker)
            for node in ast.walk(ast.parse(code)):
                if (isinstance(node, ast.Expr) and isinstance(node.value, ast.Call)
                        and isinstance(node.value.func, ast.Name) and node.value.func.id == "print"
                        and any(isinstance(child, ast.Attribute) and child.attr == "text"
                                for child in ast.walk(node))):
                    expressions.append(node)
        self.assertEqual(len(expressions), 4)
        for expression in expressions:
            namespace = {"final_response": message, "ai_response": message,
                         "result": {"messages": [message]}}
            module = ast.fix_missing_locations(ast.Module(body=[expression], type_ignores=[]))
            output = io.StringIO()
            with contextlib.redirect_stdout(output):
                exec(compile(module, "README-print", "exec"), namespace)
            self.assertIn(text, output.getvalue())
            self.assertNotIn("{'type':", output.getvalue())


if __name__ == "__main__":
    unittest.main()
