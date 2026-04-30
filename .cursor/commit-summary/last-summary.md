## 本次变更总结

**时间**: 2026-04-14

**涉及文件**:
- `src/view/mall/goods/physical/list.vue` (修改)
- `src/i18n/locales/zh-CN.json` (修改)
- `src/i18n/locales/en.json` (修改)
- `src/i18n/locales/ar.json` (修改)

**主要改动**:
- **审核状态列**：驳回原因展示条件由未定义的 `loginType == 'supplier'` 改为 **`IS_SUPPLIER()`**，消除 `ReferenceError: loginType is not defined`，避免表格渲染失败。
- **批量提交审核**：`$confirm` 正文不再使用与「自定义运费」冲突的 **`d41d8cd9.b2c3d4`**；新增专用键 **`d41d8cd9.b1a2c3`**（中/英/阿），并删除 zh-CN 中重复的 `b2c3d4` 条目，保留「自定义运费」定义。

**一句话概括**: fix: 自营商品列表审核列 loginType 与批量审核确认文案
