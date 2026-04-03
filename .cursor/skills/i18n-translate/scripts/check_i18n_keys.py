#!/usr/bin/env python3
"""Check i18n key usage against locale files.

Scans src/ for $t('key') / this.$t('key') / i18n.t('key') usage and
compares with locale JSON files. Optionally removes unused keys.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


PATTERNS = [
    re.compile(r"\$t\(\s*['\"]([^'\"]+)['\"]"),
    re.compile(r"this\.\$t\(\s*['\"]([^'\"]+)['\"]"),
    re.compile(r"\bi18n\.t\(\s*['\"]([^'\"]+)['\"]"),
]


def collect_keys(src_dir: Path) -> set[str]:
    keys: set[str] = set()
    for path in src_dir.rglob("*"):
        if not path.is_file():
            continue
        if path.suffix not in {".vue", ".js", ".ts"}:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except Exception:
            text = path.read_text()
        for pat in PATTERNS:
            keys.update(pat.findall(text))
    return keys


def load_locale_files(locales_dir: Path) -> dict[Path, dict]:
    files = []
    # Prefer standard files if present
    for name in ("zh-CN.json", "en.json", "ar.json"):
        p = locales_dir / name
        if p.exists():
            files.append(p)
    if not files:
        files = sorted(locales_dir.glob("*.json"))
    locales = {}
    for p in files:
        try:
            data = json.loads(p.read_text(encoding="utf-8"))
        except Exception:
            data = json.loads(p.read_text())
        locales[p] = data
    return locales


def main() -> int:
    parser = argparse.ArgumentParser(description="Check i18n key usage against locale files")
    parser.add_argument("--src", default="src", help="Source dir to scan (default: src)")
    parser.add_argument(
        "--locales",
        default="src/i18n/locales",
        help="Locales dir containing json files (default: src/i18n/locales)",
    )
    parser.add_argument(
        "--list",
        action="store_true",
        help="Print full missing/unused key lists",
    )
    parser.add_argument(
        "--clean",
        action="store_true",
        help="Remove unused keys from locale files",
    )
    parser.add_argument(
        "--no-fail",
        action="store_true",
        help="Always exit 0 (even if missing keys exist)",
    )
    args = parser.parse_args()

    src_dir = Path(args.src)
    locales_dir = Path(args.locales)

    if not src_dir.exists():
        print(f"[error] src dir not found: {src_dir}", file=sys.stderr)
        return 2
    if not locales_dir.exists():
        print(f"[error] locales dir not found: {locales_dir}", file=sys.stderr)
        return 2

    used_keys = collect_keys(src_dir)
    locales = load_locale_files(locales_dir)

    print(f"used keys: {len(used_keys)}")

    any_missing = False
    for loc_path, data in locales.items():
        keys = set(data.keys())
        missing = sorted(used_keys - keys)
        unused = sorted(keys - used_keys)

        print(f"{loc_path.name}: missing={len(missing)} unused={len(unused)}")
        if missing:
            any_missing = True
        if args.list:
            if missing:
                print(f"-- missing in {loc_path.name} --")
                print("\n".join(missing))
            if unused:
                print(f"-- unused in {loc_path.name} --")
                print("\n".join(unused))

        if args.clean and unused:
            new_data = {k: data[k] for k in data.keys() if k in used_keys}
            loc_path.write_text(json.dumps(new_data, ensure_ascii=False, indent=2, sort_keys=True))

    if any_missing and not args.no_fail:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
