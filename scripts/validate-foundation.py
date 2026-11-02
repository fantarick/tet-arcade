#!/usr/bin/env python3
"""Validate repository foundation documents without third-party dependencies."""

from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent.parent

REQUIRED = [
    "README.md",
    "AGENTS.md",
    "CONTRIBUTING.md",
    "CODE_OF_CONDUCT.md",
    "SECURITY.md",
    "LICENSE",
    "docs/product-requirements.md",
    "docs/architecture.md",
    "docs/roadmap.md",
    "docs/development.md",
    "docs/decisions/0001-ethereum-first.md",
    "docs/decisions/0002-happi-isolation.md",
    "docs/decisions/0003-no-custody.md",
    "scripts/happi-preflight.sh",
    "scripts/validate-foundation.py",
    ".github/workflows/foundation.yml",
    ".github/PULL_REQUEST_TEMPLATE.md",
    ".github/ISSUE_TEMPLATE/bug_report.yml",
    ".github/ISSUE_TEMPLATE/feature_request.yml",
]

LINK = re.compile(r"\[[^\]]+\]\(([^)]+)\)")
errors = []

for relative in REQUIRED:
    path = ROOT / relative
    if not path.is_file():
        errors.append(f"Missing required file: {relative}")

for path in sorted(ROOT.rglob("*.md")):
    if any(part in {"node_modules", ".git"} for part in path.parts):
        continue

    relative = path.relative_to(ROOT)
    try:
        text = path.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as exc:
        errors.append(f"Cannot read {relative} as UTF-8: {exc}")
        continue

    if not text.endswith("\n"):
        errors.append(f"Missing terminal newline: {relative}")
    if "\r" in text:
        errors.append(f"CRLF line endings not allowed: {relative}")

    for number, line in enumerate(text.splitlines(), 1):
        if line.endswith((" ", "\t")):
            errors.append(f"Trailing whitespace: {relative}:{number}")

    for match in LINK.finditer(text):
        target = match.group(1).split(" ", 1)[0].split("#", 1)[0]
        if not target or target.startswith(("https://", "http://", "mailto:", "/")):
            continue
        resolved = path.parent / target
        if not resolved.exists():
            errors.append(f"Broken local link in {relative}: {target}")

if errors:
    for error in errors:
        print(f"ERROR: {error}", file=sys.stderr)
    sys.exit(1)

print(f"Foundation validation passed ({len(REQUIRED)} required paths).")
