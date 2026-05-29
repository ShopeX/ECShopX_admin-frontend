#!/usr/bin/env python3
"""
One-off: align sp-web-decoration i18n keys with gen_i18n_key.py (path + Chinese text).
Adds new hash keys to zh-CN/en/ar; keeps legacy keys in JSON for old saved DSL.
"""
from __future__ import annotations

import hashlib
import json
import os
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
ROOT = REPO / "src/components/sp-web-decoration"


def make_key(path: str, text: str) -> str:
    p = hashlib.md5(path.encode("utf-8")).hexdigest()[:8]
    t = hashlib.md5(text.encode("utf-8")).hexdigest()[:6]
    return f"{p}.{t}"


def is_i18n_key(s: str) -> bool:
    if s.startswith("decorationeditor."):
        return True
    if re.match(r"^[0-9a-f]{8}\.[0-9a-f]{6}$", s):
        return True
    return False


def collect_keys_from_source(content: str) -> set[str]:
    out: set[str] = set()
    patterns = [
        re.compile(r"\$t\(\s*'([^']+)'"),
        re.compile(r'\$t\(\s*"([^"]+)"'),
        re.compile(r"this\.\$t\(\s*'([^']+)'"),
        re.compile(r"this\.\$t\(\s*\"([^\"]+)\""),
        re.compile(r"titleKey:\s*'([^']+)'"),
        re.compile(r"titleKey:\s*\"([^\"]+)\""),
        re.compile(r"messageKey:\s*'([^']+)'"),
        re.compile(r"\|\|\s*'([^']+)'"),
        re.compile(r'\|\|\s*"([^"]+)"'),
    ]
    for p in patterns:
        for m in p.finditer(content):
            k = m.group(1)
            if is_i18n_key(k):
                out.add(k)
    return out


def rel_posix(p: Path) -> str:
    s = p.relative_to(REPO).as_posix()
    if not s.startswith("src/"):
        s = "src/" + s
    return s


def main() -> int:
    zh_path = REPO / "src/i18n/locales/zh-CN.json"
    with zh_path.open("r", encoding="utf-8") as f:
        zh: dict = json.load(f)
    with (REPO / "src/i18n/locales/en.json").open("r", encoding="utf-8") as f:
        en: dict = json.load(f)
    with (REPO / "src/i18n/locales/ar.json").open("r", encoding="utf-8") as f:
        ar: dict = json.load(f)

    files = [p for p in ROOT.rglob("*") if p.suffix in (".vue", ".js")]

    all_changes: list[tuple[str, str, str, str]] = []  # file, old, new, text

    for fpath in sorted(files):
        rel = rel_posix(fpath)
        if rel.startswith("src/components/sp-web-decoration/scripts/"):
            continue
        text_src = fpath.read_text(encoding="utf-8")
        keys = collect_keys_from_source(text_src)
        for k in keys:
            c = zh.get(k)
            if c is None:
                print(f"MISSING_ZH: {rel} key={k}", file=sys.stderr)
                continue
            new_k = make_key(rel, c)
            if k != new_k:
                all_changes.append((rel, k, new_k, c))

    by_file: dict[str, list[tuple[str, str, str]]] = {}
    for rel, o, n, c in all_changes:
        by_file.setdefault(rel, []).append((o, n, c))

    for rel, pairs in sorted(by_file.items()):
        print(f"--- {rel} {len(pairs)} replacements")
        for o, n, c in pairs:
            print(f"  {o} -> {n} ({c[:32]}...)" if len(c) > 32 else f"  {o} -> {n} ({c})")

    # Deduplicate locale additions (same new key from one old key is unique)
    seen_new: dict[str, tuple[str, str]] = {}  # new_k -> (old_k, text)
    for rel, o, n, c in all_changes:
        if n in seen_new and seen_new[n][0] != o:
            ex_o, ex_c = seen_new[n]
            if ex_c != c:
                print(
                    f"COLLISION new key {n}: {ex_o}/{ex_c} vs {o}/{c}",
                    file=sys.stderr,
                )
        seen_new[n] = (o, c)

    if os.environ.get("DRY") == "1":
        print("DRY=1: no file writes", file=sys.stderr)
        return 0

    # Update source files
    for fpath in sorted(files):
        rel = rel_posix(fpath)
        if rel not in by_file:
            continue
        content = fpath.read_text(encoding="utf-8")
        # longest old keys first to avoid partial substrings
        order = sorted(by_file[rel], key=lambda x: -len(x[0]))
        for old, new, _ in order:
            if old == new:
                continue
            content = content.replace(f"'{old}'", f"'{new}'")
            content = content.replace(f'"{old}"', f'"{new}"')
        fpath.write_text(content, encoding="utf-8")
        print(f"WROTE: {rel}")

    # Add new keys to locales
    for _, old, new, _c in all_changes:
        if old == new:
            continue
        if new in zh and zh.get(new) != zh.get(old):
            pass
        if old not in zh:
            continue
        zh[new] = zh[old]
        if old in en:
            en[new] = en[old]
        if old in ar:
            ar[new] = ar[old]

    for path, data in [
        (zh_path, zh),
        (REPO / "src/i18n/locales/en.json", en),
        (REPO / "src/i18n/locales/ar.json", ar),
    ]:
        path.write_text(
            # Preserve key order; only append/overwrite entries from this script.
            json.dumps(data, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
    print("LOCALES updated.", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
