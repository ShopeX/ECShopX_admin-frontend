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
.page-404 {
  text-align: center;
  .context-404 {
    margin-top: 100px;
    font-size: 50px;
  }
}
</style>
<template>
  <div class="page-404">
    <div class="context-404">404</div>
    <el-button @click="goBack"> 返回 </el-button>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
