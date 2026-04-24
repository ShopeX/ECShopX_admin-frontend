## 本次变更总结

**时间**: 2026-04-21

**涉及文件**:
- `src/view/mall/goods/physical/list.vue` (修改)
- `src/i18n/locales/zh-CN.json` (修改)
- `src/i18n/locales/en.json` (修改)
- `src/i18n/locales/ar.json` (修改)

**主要改动**:
- 修复“商品管理 > 自营商品”中点击“同步至所有店铺”时确认弹窗文案错误（显示为“审核失败”）的问题。
- 新增独立 i18n key `6f19b2ab.6b3d7e` 作为同步确认文案，避免复用冲突 key 导致串文案。
- 同步补齐中/英/阿三语文案，并将确认框标题改为稳定的提示文案 key。

**一句话概括**: fix: 修复自营商品同步所有店铺时弹窗误显示审核失败
