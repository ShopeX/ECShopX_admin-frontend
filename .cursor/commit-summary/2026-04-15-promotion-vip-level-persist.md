## 本次变更总结

**时间**: 2026-04-15

**涉及文件**:
- `src/view/member/promotions/goodslimit/add.vue` (修改)
- `src/view/member/promotions/pluspricebuy/add.vue` (修改)
- `src/view/member/promotions/pluspricebuy/list.vue` (修改)

**主要改动**:
- 修复限购、加价购活动中会员等级勾选保存后回显不生效：统一复选框值类型，并在提交/回显时做类型归一化。
- 修复加价购活动列表默认“全部商品类型”传参导致列表为空：`item_type=0` 时不作为过滤条件提交。
- 修复加价购列表页 `tabList` 在 `data` 与 `computed` 重复定义造成的 Vue 警告。

**一句话概括**: fix: 修复加价购与限购会员等级回显及列表展示
