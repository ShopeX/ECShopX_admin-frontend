## 本次变更总结

**时间**: 2026-03-09

**涉及文件**:
- src/view/decorate/wgts/wgt_classify/config.js (修改)
- src/view/decorate/wgts/wgt_contentPartition/config.js (修改)
- src/view/decorate/wgts/wgt_coupon/config.js (修改)
- src/view/decorate/wgts/wgt_goods/config.js (修改)
- src/view/decorate/wgts/wgt_group/config.js (修改)
- src/view/decorate/wgts/wgt_hotranking/config.js (修改)
- src/view/decorate/wgts/wgt_hotzone/config.js (修改)
- src/view/decorate/wgts/wgt_locationModule/config.js (修改)
- src/view/decorate/wgts/wgt_ranking/config.js (修改)
- src/view/decorate/wgts/wgt_shop/config.js (修改)
- src/view/decorate/wgts/wgt_speedkill/config.js (修改)
- src/view/decorate/wgts/wgt_store-alphabet/config.js (修改)

**主要改动**:
- 装修挂件（decorate/wgts）：在 12 个 wgt 的 config.js 中，为 transformIn 与 transformOut 统一补全 id 透传。
  - transformIn：在返回对象中增加 `id: v?.id`，保证入参 id 带入组件内部。
  - transformOut：在 pickBy 映射中增加 `id: 'id'`，保证保存/上报数据带 id。
- 涉及 wgt：contentPartition、locationModule、classify、coupon、goods、group、hotranking、hotzone、ranking、speedkill、store-alphabet、shop。

**一句话概括**: feat(decorate): 装修挂件 transformIn/transformOut 统一透传 id
