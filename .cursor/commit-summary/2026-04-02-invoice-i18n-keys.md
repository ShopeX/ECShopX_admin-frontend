## 本次变更总结

**时间**: 2026-04-02

**涉及文件**:
- `src/view/financial/invoice/constants.js`（修改）
- `src/view/financial/invoice/list.vue`（修改）
- `src/view/financial/invoice/listSchema.js`（修改）
- `src/view/financial/invoice/invoiceTax.vue`（修改）
- `src/view/financial/invoice/information.vue`（修改）
- `src/view/applications/pointmall/orderList.vue`（修改）

**主要改动**:
- 发票 `constants`：列表项由 `label`/`title` 存 i18n key 改为统一字段 **`i18nKey`**，并补充注释说明须通过 `$t` 展示。
- 发票列表页：用计算属性 **`invoiceStatusTabItems`**、**`invoiceSourceOptions`** 生成已翻译的 `label`；`typeList` 统一为 `label` 字段。
- 发票 `listSchema` 弹窗选项改为 `vm.$t(item.i18nKey)`，移除未使用的 `invoice_source_arr` 导入。
- `invoiceTax.vue` / `information.vue`：删除未使用的 `status` 引用。
- 积分商城 `orderList.vue`：开票状态下拉 `:label="$t(item.i18nKey)"`；表格列用 **`invoiceStatusText`** 经 `$t` 展示状态文案（修复此前直接输出 key 的问题）。

**一句话概括**: 发票开票状态枚举改为 i18nKey，列表/弹窗/积分订单列表统一用 $t 展示文案
