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
  <!-- <el-tabs
    v-model="activeName"
    type="border-card"
    @tab-click="handleClick"
  >
    <el-tab-pane
      label="发布总部商品"
      name="relmall"
    >
      
    </el-tab-pane>
    <el-tab-pane label="店铺商品" name="shopself">
      <shopSelftList :is-load="shopself_status" :distributor-id="distributor_id"></shopSelftList>
    </el-tab-pane>
  </el-tabs> -->
  <relMallList :is-load="relmall_status" :distributor-id="distributor_id" />
</template>

<script>
import shopSelftList from './shopselftlist'
import relMallList from './relmalllist'

export default {
  components: {
    shopSelftList,
    relMallList
  },
  data() {
    return {
      activeName: 'relmall',
      shopself_status: true,
      relmall_status: false,
      distributor_id: ''
    }
  },
  mounted() {
    if (this.$route.query.distributor_id) {
      this.distributor_id = this.$route.query.distributor_id
    }
    if (this.$route.query.name) {
      this.activeName = this.$route.query.name
    }
    if (this.activeName === 'shopself') {
      this.shopself_status = true
      this.relmall_status = false
    } else if (this.activeName === 'relmall') {
      this.shopself_status = false
      this.relmall_status = true
    }
  },
  methods: {
    handleClick() {
      if (this.activeName === 'shopself') {
        this.shopself_status = true
        this.relmall_status = false
      } else if (this.activeName === 'relmall') {
        this.shopself_status = false
        this.relmall_status = true
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
