## 本次变更总结

**时间**: 2026-04-02

**涉及文件**:
- `src/view/goods/saleCategory.vue` (修改)

**主要改动**:
- 销售分类页：在 **PLATFORM 版本**（`VERSION_PLATFORM()` 为真）下隐藏「前端是否展示」总开关、表格「前台是否显示」列，以及弹窗内对应表单项。
- `mounted` 中仅在非 PLATFORM 时调用 `fetchSaleableFilter()`，避免多余接口请求。
- 去掉未使用的 `@/utils` 导入（展示控制仍使用原型上的 `VERSION_PLATFORM()` 等）。

**一句话概括**: 销售分类：PLATFORM 版本隐藏前端展示相关开关与列
