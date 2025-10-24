<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <div class="sp-goods-card">
    <SpImage :src="info.pics[0]" width="64" height="64" />
    <div class="sp-goods-card__info">
      <div class="sp-goods-card__info-title">{{ info.item_name }}</div>
      <div class="sp-goods-card__info-price">
        <SpPrice :value="info.price / 100" />
      </div>
    </div>

    <slot name="delete" />
  </div>
</template>

<script>
export default {
  name: 'SpGoodsCard',
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.sp-goods-card {
  background-color: #fff;
  border-radius: 4px;
  padding: 10px;
  display: flex;
  align-items: center;
  position: relative;
  &:hover {
    .sp-goods-card__delete {
      display: flex;
    }
  }
  &__info {
    margin-left: 10px;
    line-height: initial;
    height: 64px;
    flex: 1;
  }
  &__info-title {
    font-size: 14px;
    color: #333;
    @include multi-ellipsis(2);
  }
  &__info-price {
    font-size: 14px;
    color: #333;
  }
  &__delete {
    position: absolute;
    right: 0;
    top: 0;
    width: 20px;
    height: 20px;
    background-color: #bfbfbf;
    display: flex;
    align-items: center;
    justify-content: center;
    display: none;
    .icon-trash-alt1 {
      font-size: 14px;
      color: #fff;
    }
  }
}
</style>
