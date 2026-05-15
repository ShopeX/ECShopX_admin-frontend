## 最近一次变更摘要

**时间**: 2026-04-23

**时间**: 2026-05-06

**涉及文件**:
- `src/view/decorate/wgts/wgt_hotzone/config.js` (修改)
- `src/view/decorate/wgts/wgt_hotzone/index.vue` (修改)
- `src/view/mall/goods/physical/list.vue` (修改)
- `src/view/mall/goods/physical/supplier_goods_check.vue` (修改)
- `src/components/sp-picker/pickers/picker-marketing.vue` (修改)
- `src/components/template_links/comps/list.vue` (修改)
- `src/i18n/locales/zh-CN.json` (修改)
- `src/i18n/locales/en.json` (修改)
- `src/i18n/locales/ar.json` (修改)

**主要改动**:
- **热区挂件**：修正后台「横向/纵向」选项与 `animation` 取值、图片占位高度计算及预览样式类的对应关系，使「横向滚动」场景下高度与样式一致。
- **实物商品列表**：批量停售/开售二次确认改用独立文案键（`g8h9i0j1` / `k2l3m4n5`），弹窗标题使用 `d41d8cd9.02d981`，避免与其它功能共用键导致文案错乱。
- **zh-CN 国际化**：删除重复的 `d41d8cd9.p0q1r2` 等四条易冲突键；`en`/`ar` 补充上述停售确认相关翻译。
- **供应商商品审核**：审核弹窗关闭时重置表单；切换为「通过」时清空驳回原因；提交批量审核时使用临时 `payload`，避免把 `item_ids` 写回持久表单状态。
- **装修/链接**：页面路径中 `coupon_list` 的展示名由「优惠券」统一为「领券中心」（`223cc8af.2f3635` 三语言）；营销页选择器与模板链接列表与该键对齐。

**一句话概括**: fix: 热区横纵向与供应商审核、领券中心路径文案
