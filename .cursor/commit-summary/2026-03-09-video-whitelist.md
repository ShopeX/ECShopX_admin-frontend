## 本次变更总结

**时间**: 2026-03-09

**涉及文件**:
- src/components/sp-video-picker/index.vue (修改)
- src/view/mall/marketing/storewhitelist.vue (修改)

**主要改动**:
- **富文本/商品视频**：SpVideoPicker 上传视频后支持删除。
  - 删除图标改为 el-icon-circle-close，补充样式与 hover，并 stopPropagation 避免误触；移除 render 中的 console.log。
- **店铺白名单**：导出与列表勾选。
  - 选择列移至表格第一列并设宽，保证勾选框可见；tableList 初始为 []，selectMobile 初始为 []。
  - 导出逻辑：有勾选时传 search_mobile 导出选中项，无勾选时按当前筛选条件导出全部，不再提示「请选择数据」；去掉导出处的 console.log。

**一句话概括**: fix: 商品视频可删除 + 店铺白名单勾选列与导出逻辑优化
