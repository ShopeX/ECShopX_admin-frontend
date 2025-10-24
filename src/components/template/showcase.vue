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
  <div class="component-wrap" :class="{ 'component-padded': base.padded, active: active }">
    <div class="current-active" />
    <div v-if="base.title" class="component-header">
      <div class="component-title">
        <div>{{ base.title }}</div>
        <div class="subtitle">
          {{ base.subtitle }}
        </div>
      </div>
      <!-- <div class="component-more">
        <div class="three-dot"></div>
      </div> -->
    </div>
    <div :class="'showcase-scheme-' + config.style">
      <div class="scheme-item">
        <div class="layout layout-1">
          <img v-if="data[0]" class="show-img" :src="wximageurl + data[0].imgUrl">
        </div>
      </div>
      <div class="scheme-item">
        <div class="layout layout-2">
          <img v-if="data[1]" class="show-img" :src="wximageurl + data[1].imgUrl">
        </div>
        <div class="layout layout-3">
          <img v-if="data[2]" class="show-img" :src="wximageurl + data[2].imgUrl">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    res: {
      type: Object,
      default: {}
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      base: {},
      config: {},
      data: []
    }
  },
  watch: {
    res(value) {
      if (value) {
        this.setData(value)
      }
    }
  },
  mounted() {
    this.setData(this.res)
  },
  methods: {
    setData(val) {
      this.base = val.base
      this.config = val.config
      this.data = val.data
    }
  }
}
</script>

<style scoped lang="scss">
.showcase-scheme-1 {
  display: flex;
  .scheme-item {
    flex: 1;
  }
  .layout {
    position: relative;
    width: 100%;
    &::after {
      display: flex;
      content: '';
    }
    &.layout-1 {
      &::after {
        padding-top: 150%;
      }
    }
    &.layout-2 {
      &::after {
        padding-top: 85%;
      }
    }
    &.layout-3 {
      &::after {
        padding-top: 65%;
      }
    }
    .show-img {
      position: absolute;
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
