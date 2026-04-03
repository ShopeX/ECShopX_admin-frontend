#!/usr/bin/env python3
"""Scan directory for i18n translation status.

For each file (excluding comment content):
- Contains Chinese -> 未翻译完
- No Chinese and contains $t( -> 已翻译
- Otherwise -> 无需翻译

Generates a report in .cursor/skills/i18n-translate/plans/{path_slug}.md
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

# File extensions to scan (same as check_i18n_keys)
DEFAULT_EXTENSIONS = (".vue", ".js", ".ts", ".jsx", ".tsx")

# Chinese character range (CJK Unified Ideographs, common)
CHINESE_RE = re.compile(r"[\u4e00-\u9fff\u3400-\u4dbf]")

# $t( usage
T_METHOD_RE = re.compile(r"\$t\s*\(")


def strip_comments(content: str, ext: str) -> str:
    """Remove comment parts so we don't count Chinese or $t in comments."""
    out = content
    # Block comment: /* ... */
    out = re.sub(r"/\*[\s\S]*?\*/", " ", out)
    # Line comment: // to EOL
    out = re.sub(r"//[^\n]*", "\n", out)
    # HTML/Vue template comment: <!-- ... -->
    out = re.sub(r"<!--[\s\S]*?-->", " ", out)
    return out


def classify_file(file_path: Path, root: Path) -> str:
    """Return '未翻译完' | '已翻译' | '无需翻译'."""
    try:
        text = file_path.read_text(encoding="utf-8")
    except Exception:
        try:
            text = file_path.read_text()
        except Exception:
            return "无需翻译"  # unreadable

    code = strip_comments(text, file_path.suffix.lower())
    has_chinese = CHINESE_RE.search(code) is not None
    has_t = T_METHOD_RE.search(code) is not None

    if has_chinese:
        return "未翻译完"
    if has_t:
        return "已翻译"
    return "无需翻译"


def path_to_slug(target_path: str) -> str:
    """e.g. src/view/mall -> src_view_mall."""
    normalized = target_path.strip().strip("/")
    if not normalized:
        return "root"
    return normalized.replace("/", "_").replace("\\", "_")


def scan_dir(
    root: Path,
    extensions: tuple[str, ...],
    recursive: bool = True,
) -> dict[str, list[str]]:
    """Scan root (and subdirs if recursive), return mapping status -> list of relative paths."""
    result: dict[str, list[str]] = {
        "未翻译完": [],
        "已翻译": [],
        "无需翻译": [],
    }
    if recursive:
        paths = root.rglob("*")
    else:
        paths = (p for p in root.iterdir() if p.is_file())
    for path in paths:
        if not path.is_file():
            continue
        if path.suffix.lower() not in extensions:
            continue
        try:
            rel = path.relative_to(root)
        except ValueError:
            continue
        rel_str = str(rel).replace("\\", "/")
        status = classify_file(path, root)
        result[status].append(rel_str)
    for key in result:
        result[key].sort()
    return result


def write_report(
    plans_dir: Path,
    slug: str,
    scan_root: Path,
    result: dict[str, list[str]],
) -> Path:
    """Write plans/{slug}.md and return the file path."""
    plans_dir.mkdir(parents=True, exist_ok=True)
    report_path = plans_dir / f"{slug}.md"
    total = sum(len(v) for v in result.values())
    lines = [
        "# i18n 扫描结果",
        "",
        f"**扫描目录**: `{scan_root}`",
        f"**报告文件**: `{report_path.name}`",
        "",
        "## 统计",
        "",
        "| 状态 | 数量 | 占比 |",
        "|------|------|------|",
    ]
    for status in ("未翻译完", "已翻译", "无需翻译"):
        count = len(result[status])
        pct = f"{100 * count / total:.1f}%" if total else "0%"
        lines.append(f"| {status} | {count} | {pct} |")
    lines.append(f"| **合计** | **{total}** | 100% |")
    lines.extend([
        "",
        "## 未翻译完",
        "",
    ])
    if result["未翻译完"]:
        for p in result["未翻译完"]:
            lines.append(f"- `{p}`")
    else:
        lines.append("（无）")
    lines.extend([
        "",
        "## 已翻译",
        "",
    ])
    if result["已翻译"]:
        for p in result["已翻译"]:
            lines.append(f"- `{p}`")
    else:
        lines.append("（无）")
    lines.extend([
        "",
        "## 无需翻译",
        "",
    ])
    if result["无需翻译"]:
        for p in result["无需翻译"]:
            lines.append(f"- `{p}`")
    else:
        lines.append("（无）")
    lines.append("")
    report_path.write_text("\n".join(lines), encoding="utf-8")
    return report_path


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Scan directory for i18n status and generate plans report",
    )
    parser.add_argument(
        "path",
        nargs="?",
        default="src",
        help="Directory to scan (default: src). e.g. src/view/mall",
    )
    parser.add_argument(
        "--extensions",
        default=",".join(DEFAULT_EXTENSIONS),
        help=f"Comma-separated extensions (default: {','.join(DEFAULT_EXTENSIONS)})",
    )
    parser.add_argument(
        "--cwd",
        default=".",
        help="Project root (default: current dir). Scan path is relative to this.",
    )
    parser.add_argument(
        "--plans-dir",
        default=None,
        help="Plans output dir (default: .cursor/skills/i18n-translate/plans under cwd)",
    )
    parser.add_argument(
        "--no-report",
        action="store_true",
        help="Only print stats, do not write report file",
    )
    parser.add_argument(
        "--no-recursive",
        action="store_true",
        help="Only scan files directly in the given directory (no subdirs)",
    )
    args = parser.parse_args()

    cwd = Path(args.cwd).resolve()
    scan_root = (cwd / args.path).resolve()
    if not scan_root.is_dir():
        print(f"[error] 目录不存在: {scan_root}", file=sys.stderr)
        return 2

    extensions = tuple(e.strip() for e in args.extensions.split(",") if e.strip())
    if not extensions:
        extensions = DEFAULT_EXTENSIONS

    result = scan_dir(scan_root, extensions, recursive=not getattr(args, "no_recursive", False))
    total = sum(len(v) for v in result.values())

    print(f"扫描目录: {scan_root}")
    print(f"总文件数: {total}")
    for status in ("未翻译完", "已翻译", "无需翻译"):
        print(f"  {status}: {len(result[status])}")

    if args.no_report:
        return 0

    plans_dir = Path(args.plans_dir) if args.plans_dir else (cwd / ".cursor" / "skills" / "i18n-translate" / "plans")
    slug = path_to_slug(args.path)
    report_path = write_report(plans_dir, slug, scan_root, result)
    print(f"报告已写入: {report_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
