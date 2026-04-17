## 本次变更总结

**时间**: 2026-04-13

**涉及文件**:
- `src/view/mall/goods/physical/list.vue` (修改)

**主要改动**:
- **自营商品列表**（路由 `product-manage/self-products`）：太阳码弹窗 `el-dialog` 增加 `custom-class="goods-self-products-sun-code-dialog"`。
- 在该类下为 `.page-code`、`.page-code-img`、`.page-btns` 增加 flex 布局与间距，使二维码与「下载码 / 复制链接」按钮在弹窗内水平居中、排列一致。

**一句话概括**: style: 自营商品列表太阳码弹窗二维码与按钮居中
