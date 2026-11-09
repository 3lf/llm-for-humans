"""Check that README extraction respects Markdown display/code boundaries."""

from types import SimpleNamespace
import unittest
from unittest.mock import patch

import example_source
from example_source import execute_definitions, find_python_block


class ExampleSourceTests(unittest.TestCase):
    def find(self, source, marker):
        reader = SimpleNamespace(read_text=lambda **kwargs: source)
        with patch.object(example_source, "README", reader):
            return find_python_block(marker)

    def test_python_fence_displayed_in_nonpython_outer_fence_is_not_executable(self):
        for opening, closing in [("````text", "````"), ("~~~~markdown", "~~~~")]:
            source = (f"{opening}\n```python\ndef displayed_only():\n    return 1\n"
                      f"```\n{closing}\n```python\ndef real_example():\n    return 2\n```\n")
            with self.subTest(opening=opening):
                with self.assertRaisesRegex(ValueError, "found 0"):
                    self.find(source, "displayed_only")
                self.assertEqual(self.find(source, "real_example"),
                                 "def real_example():\n    return 2\n")

    def test_shorter_and_wrong_character_closers_do_not_end_outer_fence(self):
        source = ("````text\n```\n~~~~\n```python\ndisplayed_only = True\n```\n"
                  "````\n```python\nreal_example = True\n```\n")
        with self.assertRaisesRegex(ValueError, "found 0"):
            self.find(source, "displayed_only")
        self.assertEqual(self.find(source, "real_example"), "real_example = True\n")

    def test_quoted_outer_fence_needs_matching_quote_depth_to_close(self):
        source = ("> ````text\n````\n> ```python\n> displayed_only = True\n> ```\n"
                  "> ````\n> ```python\n> real_example = True\n> ```\n")
        with self.assertRaisesRegex(ValueError, "found 0"):
            self.find(source, "displayed_only")
        self.assertEqual(self.find(source, "real_example"), "real_example = True\n")

    def test_tilde_python_fence_and_longer_closer_are_supported(self):
        source = "~~~python\ndef real_example():\n    return 3\n~~~~~\n"
        self.assertEqual(self.find(source, "real_example"),
                         "def real_example():\n    return 3\n")

    def test_nested_quote_prefix_and_fence_indentation_are_removed(self):
        source = "> >   ```python\n> >   def real_example():\n> >       return 4\n> >   ```\n"
        code = self.find(source, "real_example")
        namespace = execute_definitions(code, ["real_example"], {})
        self.assertEqual(namespace["real_example"](), 4)

    def test_duplicate_markers_fail_instead_of_picking_an_arbitrary_example(self):
        source = "```python\nmarker = 1\n```\n```python\nmarker = 2\n```\n"
        with self.assertRaisesRegex(ValueError, "found 2"):
            self.find(source, "marker")

    def test_definition_selection_does_not_run_imports_or_sample_api_calls(self):
        code = ("import nonexistent_example_dependency\n"
                "raise RuntimeError('sample API calls must not run')\n"
                "def example():\n    return 5\n")
        namespace = execute_definitions(code, ["example"], {})
        self.assertEqual(namespace["example"](), 5)
        with self.assertRaises(ValueError):
            execute_definitions(code, ["missing"], {})


if __name__ == "__main__":
    unittest.main()
