## 本次变更总结

**时间**: 2026-04-16

**涉及文件**:
- `src/view/wxapp/shopInfo/index.vue` (修改)
- `src/view/member/promotions/pluspricebuy/list.vue` (修改)

**主要改动**:
- **商城信息**：去掉「登录页背景图」表单项及相关数据与保存字段；`handleImgChange` 仅处理门店 LOGO；移除未使用的 `uploadMaterial` 引用。
- **加价购列表**：待开始状态下编辑/删除图标包在 `pluspricebuy-waiting-actions` 内；为 `.operating-icons` 增加 `flex` + `nowrap` + `white-space: nowrap`，避免操作列换行；图标区增加内边距与字号便于点击（用户后续可自行去掉 `gap`，以 margin 等方式控距）。

**一句话概括**: feat: 商城信息移除登录页背景配置；加价购待开始操作列单行展示并优化图标区
