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
    class="component-wrap"
    :class="{ 'component-padded': base.padded && !config.fixTop, active: active }"
    :style="config.fixTop ? 'height: 63px' : ''"
  >
    <div class="current-active" />
    <div class="search" :class="{ fixed: config.fixTop }">
      <div class="view-flex view-flex-middle">
        <div class="view-flex-item view-flex view-flex-middle view-flex-center search-box">
          <i class="search-icon" /> 搜索想要的商品
        </div>
        <!-- <div v-if="res.config.scanCode" class="scancode">
          <svg class="svg-icon" aria-hidden="true">
            <use xlink:href="#icon-scan"></use>
          </svg>
          <div>扫码购</div>
        </div> -->
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
      config: {}
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
      this.nama = val.name
      this.base = val.base
      this.config = val.config
    }
  }
}
</script>

<style scoped lang="scss">
.search {
  padding: 10px;
  background: #fff;
  &.fixed {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    z-index: 98;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  }
}
.scancode {
  padding-left: 10px;
  font-size: 10px;
  color: #666;
  text-align: center;
  .svg-icon {
    width: 20px;
    height: 20px;
  }
}
.search {
  &-box {
    padding: 7.5px 0;
    border-radius: 25px;
    background-color: #efefef;
    font-size: 14px;
    color: #999;
    .search-icon {
      margin-right: 5px;
    }
  }
}
</style>
