## 本次变更总结

**时间**: 2026-04-13

**涉及文件**:
- `src/components/sp-form/index.vue` (修改)
- `src/i18n/locales/zh-CN.json` (修改)
- `src/i18n/locales/en.json` (修改)
- `src/i18n/locales/ar.json` (修改)
- `src/view/goods/saleCategory.vue` (修改)
- `src/view/mall/trade/examineTransfer.vue` (修改)

**主要改动**:
- **销售分类**：「投放」生成小程序码/复制链接时，页面路径由 `pages/item/list` 改为 `subpages/item/list`。
- **国际化**：键 `0e7dabe2.63cd0e`（销售分类页总开关旁文案）由「前端是否展示」改为「店铺分类展示与查询」，并同步 en、ar。
- **SpForm**：`el-form-item` 的 `style` 支持与 `item.style` 对象合并，便于单项自定义样式。
- **转账审核弹窗**：收款银行名称 / 收款银行账号 / 收款银联号三行去掉 `display: 'inline'`，改为默认块级纵向排布。

**一句话概括**: feat: 销售分类投放路径与开关文案，SpForm 支持 item.style
