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
<template lang="html">
  <div>
    <alllist v-if="$route.path.indexOf('editor') === -1" ref="alllist" :get-status="alllist" />
    <router-view />
  </div>
</template>

<script>
import alllist from './list.vue'

export default {
  provide() {
    return {
      refresh: this.refresh
    }
  },
  components: {
    alllist
  },
  data() {
    return {
      activeName: 'first',
      alllist: true
    }
  },
  mounted() {
    if (this.$route.query.name) {
      this.activeName = this.$route.query.name
    }
    if (this.activeName === 'first') {
      this.alllist = true
    }
  },
  methods: {
    //充值送钱
    handleClick(tab, event) {
      if (this.activeName === 'first') {
        this.alllist = true
      }
    },
    refresh() {
      this.$refs.getActivityLists
      this.$refs.getCurrencyInfo
    }
  }
}
</script>

<style scoped lang="scss"></style>
