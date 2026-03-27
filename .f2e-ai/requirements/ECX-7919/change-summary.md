# Change Summary

## 需求与计划摘要

- **requirement-id**: ECX-7919
- **目标**: 商品挂件（wgt_goods）数据类型增加「积分商品」选项，支持在装修侧选择积分商品并拉取货架商品展示。

## 改动范围

- `src/view/decorate/wgts/wgt_goods/config.js`
  - 数据类型 options 增加 `{ label: i18n.t('46e04a5c.fe0ea1'), value: 'point' }`。
- `src/view/decorate/comps/goods-attr/attr-data.vue`
  - 新增 `type === 'point'` 时的模板块（积分商品选择入口）、计算属性 `pointGoodsDisplayText`、watch 中对 `point` 的 localValue 同步、方法 `handleSelectPointGoods()`（调用 goodsitem 弹窗 isPointGoods: true，emit id 与 info.type='point'）。
- `src/view/decorate/wgts/wgt_goods/index.vue`
  - 在需 data 才请求的 dataType 列表与 watch 中纳入 `point`；在 getGoodsList 的 switch 中为 `point` 与 `items` 同样设置 `params.data_value = this.value?.data.id.split(',')`。

## 关键逻辑或接口变化

- 无对外 API 签名变更；商品挂件请求货架商品时增加 `data_type: 'point'` 及对应 `data_value`（积分商品 id 数组），后端需支持该类型。
- 选择积分商品后数据结构与「指定商品」一致：`data: { id: 'id1,id2,...', info: { length, type: 'point' } }`。

## 测试与验收情况

- 装修页选中商品挂件 → 数据类型可选「积分商品」→ 出现选择入口 → 点击打开积分商品选择器 → 多选确定后列表按所选 id 拉取（依赖后端支持 data_type=point）。

## 遗留问题与后续建议

- 无。后端若尚未支持 `data_type=point`，需在货架挂件商品接口中增加对 point 类型及 data_value 的解析与返回。
