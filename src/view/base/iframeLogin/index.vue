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
  <div class="main">
    <div v-loading="true" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      key: ''
    }
  },
  mounted() {
    let { code } = this.$route.query
    if (code) {
      window.top.location.href = `${window.location.origin}/login?code=${code}`
    } else {
      window.top.location.href = `${window.location.origin}/login`
    }
  },
  methods: {
    name() {}
  }
}
</script>

<style lang="scss" scoped>
.main {
  height: 500px;
  width: 100%;
  margin-top: 250px;
  // transform: translateY(-50%);
}
</style>
