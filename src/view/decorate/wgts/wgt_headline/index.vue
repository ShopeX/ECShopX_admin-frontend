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
<style lang="scss" scoped>
.wgt-headline {
  .wgt-content {
    line-height: 60px;
    font-size: 20px;
    color: #333;
    font-weight: 600;
    padding: 0 8px;
  }
  .left {
    text-align: left;
  }
  .center {
    text-align: center;
  }
}
</style>

<template>
  <div
    :class="{
      'wgt-headline': true,
      padded: value.padded
    }"
  >
    <div
      class="wgt-bd"
      :class="{
        spaced: value.spaced
      }"
    >
      <!-- 挂件自定义部分 -->
      <div
        :class="[
          'wgt-content',
          {
            center: value.float === 'center',
            left: value.float === 'left'
          }
        ]"
      >
        <span> {{ value.title }} </span>
      </div>
      <!-- 挂件自定义部分 -->
    </div>
  </div>
</template>
<script>
import config from './config'
export default {
  name: 'Headline',
  wgtName: '文字标题',
  wgtDesc: '',
  wgtIcon: 'wgt-headline',
  config: config,
  props: {
    value: [Object, Array]
  }
}
</script>
