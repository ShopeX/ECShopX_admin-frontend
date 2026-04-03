#!/usr/bin/env python3
import argparse
import hashlib
import json
import sys


def _hash(text: str, length: int) -> str:
    return hashlib.md5(text.encode("utf-8")).hexdigest()[:length]


def make_key(path: str, text: str) -> str:
    key1 = _hash(path, 8)
    key2 = _hash(text, 6)
    return f"{key1}.{key2}"


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate i18n key from path and text")
    parser.add_argument("--path", help="Source file path")
    parser.add_argument("--text", help="Chinese text")
    parser.add_argument("--jsonl", action="store_true", help="Read JSONL from stdin")
    args = parser.parse_args()

    if args.jsonl:
        for line in sys.stdin:
            line = line.strip()
            if not line:
                continue
            obj = json.loads(line)
            path = obj.get("path", "")
            text = obj.get("text", "")
            obj["key"] = make_key(path, text)
            sys.stdout.write(json.dumps(obj, ensure_ascii=False) + "\n")
        return 0

    path = args.path or ""
    text = args.text
    if text is None:
        text = sys.stdin.read().strip()
    if not path:
        sys.stderr.write("--path is required\n")
        return 2
    if not text:
        sys.stderr.write("--text is required\n")
        return 2

    sys.stdout.write(make_key(path, text))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
