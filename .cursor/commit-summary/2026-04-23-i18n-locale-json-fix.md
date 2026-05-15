## 本次变更总结

**时间**: 2026-04-23

**涉及文件**:
- `src/i18n/locales/zh-CN.json` (修改)
- `src/i18n/locales/en.json` (修改)
- `src/i18n/locales/ar.json` (修改)

**主要改动**:
- 修正三份语言包文件**末尾**的 JSON 结构：`41f42a3e.fe6d9b` 与 `bea3f44a.e01a11`（导出任务提示）之间补上**尾随逗号**，避免非法 JSON。
- `en.json` / `ar.json`：原先在 `fe6d9b` 后错误闭合 `}`，已将 `bea3f44a.e01a11` 收回到根对象内，与中文包字段一致。

**一句话概括**: fix: 修复 zh/en/ar 语言包末尾 JSON 结构与导出提示文案 key
