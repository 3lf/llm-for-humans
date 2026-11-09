"""Exercise the actual README judge schema and control flow without API calls."""

from contextlib import redirect_stdout
from io import StringIO
from pathlib import Path
import sys
from types import ModuleType
import unittest
from unittest.mock import patch

from pydantic import BaseModel, Field, ValidationError

import example_source
from example_source import execute_definitions, find_python_block


class JudgeExampleTests(unittest.TestCase):
    def setUp(self):
        # Also selects this worktree's source when the shared helper is on PYTHONPATH.
        readme = Path(__file__).resolve().parent.parent / "README.md"
        with patch.object(example_source, "README", readme):
            self.code = find_python_block("class CriterionScore(BaseModel):")
        self.namespace = execute_definitions(
            self.code,
            ["CriterionScore", "JudgeScore", "llm_judge"],
            {"BaseModel": BaseModel, "Field": Field},
        )
        self.Score = self.namespace["JudgeScore"]
        self.Criterion = self.namespace["CriterionScore"]

    def invoke(self, values=(5, 4, 3), reference="Checked reference", points=None):
        payload = {
            name: {"score": value, "reason": f"Evidence for {name}"}
            for name, value in zip(("accuracy", "completeness", "clarity"), values)
        }
        score = self.Score.model_validate(payload)
        captured = {}

        class FakeJudge:
            def invoke(self, prompt):
                captured["prompt"] = prompt
                return score

        self.namespace["judge"] = FakeJudge()
        result = self.namespace["llm_judge"](
            "Test question",
            reference,
            ["Required fact"] if points is None else points,
            "Test model output",
        )
        return *result, captured["prompt"]

    def test_all_three_available_scores_are_averaged(self):
        score, average, _ = self.invoke()
        self.assertEqual(average, 4.0)
        self.assertEqual(score.accuracy.score, 5)

    def test_abstention_is_per_criterion_without_averaging_remaining_scores(self):
        for values in ((None, 4, 5), (5, None, 4), (5, 4, None), (None, None, None)):
            with self.subTest(values=values):
                score, average, _ = self.invoke(values=values)
                self.assertIsNone(average)
                self.assertEqual(score.clarity.score, values[2])

    def test_empty_reference_overrides_fabricated_accuracy_but_preserves_clarity(self):
        score, average, _ = self.invoke(reference=" \n ")
        self.assertIsNone(score.accuracy.score)
        self.assertEqual(score.completeness.score, 4)
        self.assertEqual(score.clarity.score, 3)
        self.assertIsNone(average)

    def test_missing_required_points_blocks_completeness_only(self):
        score, average, _ = self.invoke(points=[])
        self.assertEqual(score.accuracy.score, 5)
        self.assertIsNone(score.completeness.score)
        self.assertEqual(score.clarity.score, 3)
        self.assertIsNone(average)

    def test_prompt_contains_inputs_rubric_anchors_and_abstention_rule(self):
        _, _, prompt = self.invoke()
        for text in ("Test question", "Checked reference", "Required fact", "Test model output",
                     "۱=", "۳=", "۵=", "null", "داده‌ست، نه دستور"):
            with self.subTest(text=text):
                self.assertIn(text, prompt)

    def test_schema_accepts_explicit_null_and_requires_reason(self):
        criterion = self.Criterion(score=None, reason="Insufficient evidence")
        self.assertIsNone(criterion.score)
        with self.assertRaises(ValidationError):
            self.Criterion(score=None)

    def test_schema_rejects_out_of_range_fractional_and_boolean_scores(self):
        for value in (0, 6, 1.5, True, "اطلاعات کافی نیست"):
            with self.subTest(value=value), self.assertRaises(ValidationError):
                self.Criterion(score=value, reason="Invalid numeric score")

    def test_complete_example_prints_abstention_without_formatting_none_as_number(self):
        class FakeChatOpenAI:
            def __init__(self, **kwargs):
                pass

            def with_structured_output(self, schema):
                self.schema = schema
                return self

            def invoke(self, prompt):
                return self.schema.model_validate({
                    "accuracy": {"score": None, "reason": "Insufficient reference"},
                    "completeness": {"score": 4, "reason": "One required point missing"},
                    "clarity": {"score": 5, "reason": "Clear answer"},
                })

        fake_module = ModuleType("langchain_openai")
        fake_module.ChatOpenAI = FakeChatOpenAI
        output = StringIO()
        with patch.dict(sys.modules, {"langchain_openai": fake_module}), redirect_stdout(output):
            exec(compile(self.code, "README judge example", "exec"), {})
        self.assertIn("accuracy: اطلاعات کافی نیست", output.getvalue())
        self.assertIn("میانگین کلی: اطلاعات کافی نیست", output.getvalue())


if __name__ == "__main__":
    unittest.main()
