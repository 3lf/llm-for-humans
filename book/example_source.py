"""Read executable examples from README without running their top-level API calls."""

import ast
from pathlib import Path
import re

README = Path(__file__).resolve().parent.parent / "README.md"


def _quote_prefix(line):
    """Match the same quote depth and fence rules as book/source-qa.mjs."""
    cursor, depth = 0, 0
    while True:
        match = re.match(r" {0,3}> ?", line[cursor:])
        if not match:
            break
        cursor += match.end()
        depth += 1
    return line[cursor:], depth


def _python_blocks(source):
    blocks, lines = [], []
    fence = None
    for line in source.splitlines():
        body, depth = _quote_prefix(line)
        if fence is None:
            opener = re.fullmatch(r"( {0,3})(`{3,}|~{3,})(.*)", body)
            if not opener:
                continue
            indentation, marker, info = opener.groups()
            if marker[0] == "`" and "`" in info:
                continue
            language = info.strip().split(maxsplit=1)
            fence = (marker[0], len(marker), depth, len(indentation),
                     bool(language and language[0] == "python"))
            lines = []
            continue
        character, length, quote_depth, indentation, is_python = fence
        closer = re.fullmatch(r" {0,3}(`+|~+)[ \t]*", body)
        if (closer and depth == quote_depth
                and closer[1][0] == character and len(closer[1]) >= length):
            if is_python:
                blocks.append("\n".join(lines) + "\n")
            fence = None
            continue
        if is_python:
            # Strip only the opener's quote prefix; a further > is code content.
            code_line = line
            for _ in range(quote_depth):
                prefix = re.match(r" {0,3}> ?", code_line)
                if not prefix:
                    break
                code_line = code_line[prefix.end():]
            remove = min(indentation, len(code_line) - len(code_line.lstrip(" ")))
            lines.append(code_line[remove:])
    return blocks


def find_python_block(marker: str) -> str:
    """Return the unique executable Python fence containing marker.

    Every outer fence is tracked, so a displayed Python fence inside a text or
    Markdown example is never mistaken for an executable example.
    """
    matches = [block for block in _python_blocks(README.read_text(encoding="utf-8"))
               if marker in block]
    if len(matches) != 1:
        raise ValueError(f"Expected one Python example for {marker!r}; found {len(matches)}")
    return matches[0]


def execute_definitions(code: str, names, namespace: dict) -> dict:
    """Execute only named top-level definitions in the supplied dependency namespace.

    Imports and sample API invocations are deliberately omitted. This is a source
    extraction helper, not a sandbox: selected definitions are trusted repo code.
    """
    requested = set(names)
    definitions = [
        node
        for node in ast.parse(code).body
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef))
        and node.name in requested
    ]
    found = [node.name for node in definitions]
    if set(found) != requested or len(found) != len(requested):
        raise ValueError(f"Missing or duplicate definitions: {requested!r}; found {found!r}")
    module = ast.fix_missing_locations(ast.Module(body=definitions, type_ignores=[]))
    exec(compile(module, str(README), "exec"), namespace)
    return namespace
