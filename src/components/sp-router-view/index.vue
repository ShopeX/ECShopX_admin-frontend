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
  <div class="sp-router-view">
    <div v-show="!showRouterView">
      <slot />
    </div>
    <router-view v-show="showRouterView" />
  </div>
</template>

<script>
export default {
  name: 'SpRouterView',
  data() {
    return {
      currentRoute: null
    }
  },
  computed: {
    showRouterView() {
      const { matched } = this.$route
      return matched.length == 3
    }
  },
  created() {
    this.currentRoute = this.$route
  },
  methods: {
    onActivated() {
      this.$parent.$activated(this.currentRoute, this.$route)
    }
  }
}
</script>

<style lang="scss" scoped></style>
