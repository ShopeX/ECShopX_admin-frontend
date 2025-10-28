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
<style lang="scss">
.wgt-content {
  &.padded {
    padding: 10px 0;
  }
  .wgt-hd {
    padding: 10px;
    .title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    .sub-title {
      color: #666;
      margin-left: 4px;
    }
  }
  .wgt-bd {
    padding: 0 10px;
    .content-item {
      background-color: #fff;
      padding: 15px;
      white-space: pre-wrap; /* 保留换行和空格 */
      &:not(:last-child) {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
<template>
  <div
    :class="{
      'wgt-content': true,
      padded: value.padded
    }"
  >
    <div v-if="value.title || value.subtitle" class="wgt-hd">
      <span class="title">{{ value.title }}</span>
      <span class="sub-title">{{ value.subtitle }}</span>
    </div>
    <div class="wgt-bd">
      <!-- 挂件自定义部分 -->
      <div class="content-item" v-html="value.data" />
    </div>
  </div>
</template>

<script>
import config from './config'
export default {
  name: 'Writing',
  wgtName: '文本内容',
  wgtDesc: '',
  wgtIcon: 'wgt-content',
  config: config,
  props: {
    value: [Object, Array]
  },
  data() {
    return {
      currentIndex: 1
    }
  },
  computed: {
    sourceUrl() {
      const { data } = this.value
      return data?.url || ''
    }
  },
  created() {},
  methods: {}
}
</script>
