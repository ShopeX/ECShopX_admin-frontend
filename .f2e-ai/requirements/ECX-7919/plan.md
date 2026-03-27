# Plan — ECX-7919

## 目标

商品挂件（wgt_goods）数据类型增加「积分商品」选项，支持在装修侧选择积分商品并拉取货架商品接口展示。

## 范围

- 装修-商品挂件：数据类型下拉、数据配置区、列表拉取逻辑
- 公共商品属性组件 attr-data.vue：积分商品选择入口与选择器联动
- 不涉及其他挂件或模板接口协议变更

## 步骤

1. **wgt_goods/config.js**
   - 在「数据类型」options 中增加一项：`{ label: 积分商品, value: 'point' }`（文案使用 i18n 46e04a5c.fe0ea1）。
   - 选择「积分商品」时与「指定商品」等共用同一数据配置区域（已有 AttrDataVue 会展示）。

2. **attr-data.vue**
   - 当 `type === 'point'` 时增加一块与「指定商品」同风格的可点击区域，展示已选数量或「选择积分商品」。
   - 增加计算属性 `pointGoodsDisplayText`。
   - 在 type 的 watch 中处理 `type === 'point'` 时对 localValue 的初始化/同步。
   - 增加方法 `handleSelectPointGoods()`：调用 `$picker.goodsitem({ isPointGoods: true, multiple: true, ... })`，确认后 `$emit('input', { id: ids.join(','), info: { length, type: 'point' } })`。

3. **wgt_goods/index.vue**
   - 在「需要 data 才请求列表」的 dataType 判断中纳入 `point`。
   - 在「根据 data 变化拉列表」的 watch 中纳入 `point`。
   - 在 getGoodsList 的 switch(dataType) 中为 `point` 走与 `items` 相同分支：`params.data_value = this.value?.data.id.split(',')`。

## 验收

- 装修页选中商品挂件，数据类型可选「积分商品」。
- 选择「积分商品」后出现选择入口，点击可打开积分商品选择器，多选后确定，列表按所选 id 拉取并展示（依赖后端 getShelvesGoods 支持 data_type=point）。

## 备注

- 实现已完成，本文档为事后补写便于追溯。
