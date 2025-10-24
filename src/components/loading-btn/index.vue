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
  <el-button :type="type" :size="size" :loading="loading" @click="btnHandle">
    {{ text }}
  </el-button>
</template>

<script>
export default {
  props: {
    size: {
      default: 'medium'
    },
    type: {
      default: 'primary'
    },
    text: {
      default: '确定'
    }
  },

  data() {
    return {
      loading: false
    }
  },
  methods: {
    btnHandle() {
      this.loading = true
      this.$emit('clickHandle')
    },
    closeLoading() {
      this.loading = false
    }
  }
}
</script>

<style></style>
