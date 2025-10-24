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
  <div class="data-placeholder" :style="'height:' + height">
    <div class="placeholder-content">
      <i class="iconfont icon-route" />
      <div>暂无数据</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      placeholderVisible: false
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.setData(val)
      }
    }
  },
  methods: {
    setData(val) {
      this.placeholderVisible = val
    }
  }
}
</script>

<style scoped lang="scss">
.data-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 200px;
  .placeholder-content {
    text-align: center;
    i {
      font-size: 48px;
      color: #efefef;
      margin-bottom: 10px;
    }
    font-size: 14px;
    color: #ccc;
  }
}
</style>
