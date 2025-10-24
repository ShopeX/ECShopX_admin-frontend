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
  <div
    :class="{
      'wgt-search': true,
      padded: value.padded
    }"
  >
    <div v-if="value.title || value.subtitle" class="wgt-hd">
      <span class="title">{{ value.title }}</span>
      <span class="sub-title">{{ value.subtitle }}</span>
    </div>
    <div
      class="wgt-bd"
      :class="{
        spaced: value.spaced
      }"
    >
      <!-- 挂件自定义部分 -->
      <div class="search-container">
        <i class="ecx-icon icon-sousuo" />
        <span class="placeholder"> {{ value.placeholder }} </span>
      </div>
      <!-- 挂件自定义部分 -->
    </div>
  </div>
</template>
<script>
import config from './config'
export default {
  name: 'Search',
  wgtName: '搜索',
  wgtDesc: '',
  wgtIcon: 'wgt-search',
  config: config,
  props: {
    value: [Object, Array]
  }
}
</script>
<style lang="scss" scoped>
.wgt-search {
  &.padded {
    padding: 10px 0;
  }
  .search-container {
    display: flex;
    align-items: center;
    height: 30px;
    background: #fff;
    border-radius: 30px;
    padding: 5px 10px;
    margin: 0 8px;
    box-sizing: border-box;
    .placeholder {
      margin-left: 4px;
      font-size: 13px;
    }
  }
}
</style>
