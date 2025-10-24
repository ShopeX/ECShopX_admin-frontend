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
.wgt-heading {
  .wgt-content {
    white-space: pre-wrap; /* 保留换行和空格 */
    padding: 0 8px;
  }
}
</style>

<template>
  <div
    :class="{
      'wgt-heading': true,
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
      <div class="wgt-content" :style="computedStyle">
        {{ value.title }}
      </div>
    </div>
  </div>
</template>
<script>
import config from './config'
export default {
  name: 'Heading',
  wgtName: '标题',
  wgtDesc: '',
  wgtIcon: 'wgt-headline',
  config: config,
  props: {
    value: [Object, Array]
  },
  computed: {
    computedStyle() {
      return {
        'text-align': this.value.align,
        'font-size': `${this.value.fontSize}px`,
        color: this.value.color,
        'line-height': this.value.lineHeight,
        'font-weight': this.value.weight ? 'bold' : 'normal',
        'font-style': this.value.italic ? 'italic' : 'normal'
      }
    }
  }
}
</script>
