## 本次变更总结

**时间**: 2026-04-23

**涉及文件**:
- `src/components/sp-decorate/index.vue` (修改)
- `src/view/decorate/index.vue` (修改)
- `src/view/decorate/comps/configsetting.js` (修改)
- `src/view/decorate/wgts/wgt_goodsCard/config.js` (修改)
- `src/view/decorate/wgts/wgt_goodsCard/index.vue` (修改)

**主要改动**:
- **落库名与组件名对齐**：`goodsCard` 挂件 Vue `name` 改为 `goodsCard`，与 `config.name` 一致，避免与商城 `Goods` 混淆；保存/预览通过 `findWidgetForPersistedName` 用 `config.name` 解析挂件。
- **装修保存与回显**：`SpDecorate`、`decorate/index` 的 `onSave` / `onSaveTemplate` 等改为按 `persistedName` 查找挂件并调用 `transformOut`，场景 `1005` 下旧数据 `goods` 兼容映射到 `goodsCard`。
- **商品卡片配置**：`transformIn`/`transformOut` 接入 `transformInBase`、`createTransformOutBase`，正确读写外边距/内边距及内外背景；移除误标为「组件间距」的 `padded` 开关项。
- **商品卡片 UI**：去掉标题区与 `padded` 相关样式；卡片块用 `getInnerStyle` + 默认白底与圆角；列表项信息区改为纵向 flex 布局。
- **全局样式注入**：`configsetting` 为 `goodsCard` 增加与 `goods` 相同的内边距（`innerPadding`）自动配置。

**一句话概括**: fix: 软文商品卡片 goodsCard 落库解析、样式转换与预览保存一致
