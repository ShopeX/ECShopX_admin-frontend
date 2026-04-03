---
name: i18n-translate
description: Translate Chinese UI strings in this repo into i18n keys with a hash-based key scheme, replace UI strings with $t(), and update zh-CN/en/ar locale files. Use when asked to i18n-translate or replace Chinese text under src/.
---

# i18n Translate

## Overview
Translate user-facing Chinese text under `src/` into i18n keys and replace with `$t()`-based lookups, using a deterministic hash key scheme to avoid collisions.

## Workflow

### 1) Scope and Scan
- Work only under `src/` unless explicitly told otherwise.
- Find Chinese strings with `rg -n "[\u4e00-\u9fff]" src` or a targeted subset of files.
- **Do not translate comment text**. Ignore all comments (`//`, `/* */`, `<!-- -->`) even if they contain Chinese.
- Ignore logs unless they are user-facing.

### 2) Decide What to Translate (Skip “code-registered” Chinese)
Translate **UI-facing** strings only. Skip Chinese text that is **code-registered** or data-bound and must remain stable for logic or backend contracts. Use these heuristics:

Translate:
- Template text nodes and labels
- Button text
- Placeholders and tips
- Validation messages / $message / $confirm copy
- Table column labels and UI action names

Do **not** translate:
- Strings used as identifiers, keys, enums, or backend codes (e.g., API params, comparison values, switch cases, dataset keys)
- Strings used in logs or debug output (unless explicitly required)
- Brand names or externally mandated proper nouns

If uncertain, prefer **not** translating and leave a short note.

### 3) Generate Keys (Hash Rule)

**CRITICAL: You MUST use the script to generate keys. DO NOT manually create keys or guess the hash values.**

Key format: `{file_hash}.{text_hash}`
- `file_hash` = md5 hash of the file path, first 8 hex chars
- `text_hash` = md5 hash of the Chinese text, first 6 hex chars

**Always run this script** (path relative to workspace root):

```bash
python3 .cursor/skills/i18n-translate/scripts/gen_i18n_key.py --path "src/views/xxx.vue" --text "中文文本"
# Output example: a1b2c3d4.e5f6a7
```

For batch processing, use JSONL mode (recommended for efficiency):
```bash
cat << 'EOF' | python3 .cursor/skills/i18n-translate/scripts/gen_i18n_key.py --jsonl
{"path":"src/views/xxx.vue","text":"文本1"}
{"path":"src/views/xxx.vue","text":"文本2"}
EOF
```

**DO NOT:**
- ❌ Make up keys like `d2e3f4a5.a1b2c3` without running the script
- ❌ Use semantic keys like `common.download` or `withdraw.status`
- ❌ Copy keys from other files without regenerating
- ❌ Assume you know what the hash output will be

**DO:**
- ✅ Run the script for every Chinese text before replacing
- ✅ Use the exact output from the script as the key
- ✅ Use JSONL mode for batch processing multiple texts in one file

### 4) Replace Strings with $t()
Use appropriate `$t()` usage by context:
- Template text: `{{ $t('key') }}`
- Attributes: `:placeholder="$t('key')"`
- JS strings: `this.$t('key')` (or `t('key')` if you already bind `const t = this.$t.bind(this)`)
- Render functions: `t('key')` or `this.$t('key')`

### 5) Update Locale Files (Overwrite if Key Exists)
Update all three locale files:
- `src/i18n/locales/zh-CN.json`
- `src/i18n/locales/en.json`
- `src/i18n/locales/ar.json`

Rules:
- zh-CN value = original Chinese text
- en/ar value = **MUST first lookup from existing translations** (see below), then translate if not found
- If the key already exists, **overwrite** with the new value

### 5.1) CRITICAL: Lookup Existing Translations First

**Before translating any Chinese text to English/Arabic, you MUST search in the existing translation reference file:**

```
src/i18n/lang/index.json
```

This file contains ~44,000 lines of already calibrated translations in this format:
```json
{
  "key": {
    "zh-cn": "中文文本",
    "en": "English translation",
    "ar": "الترجمة العربية"
  }
}
```

**Lookup Process:**
1. For each Chinese text you need to translate, search in `index.json` by the Chinese value (`zh-cn` field)
2. If found, use the existing `en` and `ar` values directly - these are professionally calibrated
3. Only if NOT found in `index.json`, then generate your own translation

**Example:**
- Chinese text: "删除成功"
- Search in index.json for `"zh-cn": "删除成功"`
- If found: use the existing `en` and `ar` values
- If not found: translate as "Deleted successfully" / "تم الحذف بنجاح"

**DO NOT:**
- ❌ Skip the lookup step and translate directly
- ❌ Ignore existing translations in `index.json`
- ❌ Use your own translation when a calibrated one exists

**DO:**
- ✅ Always search `index.json` first for each Chinese text
- ✅ Use `grep` or similar to find: `grep -A2 '"zh-cn": "中文文本"' src/i18n/lang/index.json`
- ✅ Prioritize existing calibrated translations over AI-generated ones
- ✅ Only generate new translations for texts not found in `index.json`

### 6) Verify
- Re-scan modified files to ensure the Chinese UI text is removed.
- Keep diffs focused and avoid refactors.

## Resources

All scripts are located in `.cursor/skills/i18n-translate/scripts/` relative to the workspace root.

### gen_i18n_key.py
Generate keys from file path and Chinese text.

Usage:
```bash
python3 .cursor/skills/i18n-translate/scripts/gen_i18n_key.py --path <file> --text <chinese>
```

JSONL mode (recommended for batch processing):
```bash
cat items.jsonl | python3 .cursor/skills/i18n-translate/scripts/gen_i18n_key.py --jsonl
# input line: {"path":"...","text":"..."}
# output line: {"path":"...","text":"...","key":"..."}
```

Example with heredoc:
```bash
cat << 'EOF' | python3 .cursor/skills/i18n-translate/scripts/gen_i18n_key.py --jsonl
{"path":"src/view/mall/marketing/withdraw.vue","text":"提现状态"}
{"path":"src/view/mall/marketing/withdraw.vue","text":"分销商手机号"}
EOF
```

### check_i18n_keys.py
Check i18n key usage vs locale files.

Usage:
```bash
python3 .cursor/skills/i18n-translate/scripts/check_i18n_keys.py --src src --locales src/i18n/locales
```

Options:
- `--list` Print full missing/unused lists
- `--clean` Remove unused keys from locale files
- `--no-fail` Always exit 0 even if missing keys exist
