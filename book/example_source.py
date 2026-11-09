"""Read executable examples from README without running their top-level API calls."""

import ast
from pathlib import Path
import re

README = Path(__file__).resolve().parent.parent / "README.md"


def find_python_block(marker: str) -> str:
    """Return the unique Python fence containing marker, including quoted fences."""
    blocks = []
    current = None
    depth = 0
    fence = ""
    for line in README.read_text(encoding="utf-8").splitlines():
        if current is None:
            match = re.fullmatch(r"((?:> ?)*)((?:`){3,})python\s*", line)
            if match:
                current = []
                depth = match.group(1).count(">")
                fence = match.group(2)
            continue
        code_line = line
        for _ in range(depth):
            if code_line.startswith(">"):
                code_line = code_line[1:]
                if code_line.startswith(" "):
                    code_line = code_line[1:]
        if code_line.strip() == fence:
            blocks.append("\n".join(current) + "\n")
            current = None
        else:
            current.append(code_line)
    matches = [block for block in blocks if marker in block]
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
