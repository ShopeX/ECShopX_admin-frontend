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
  <SpPage>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="总览" name="all">
        <total-view />
      </el-tab-pane>
      <el-tab-pane label="积分记录" name="pointRecord">
        <point-record :get-status="trade" />
      </el-tab-pane>
    </el-tabs>
  </SpPage>
</template>

<script>
import totalView from './totalview.vue'
import pointRecord from './pointrecord.vue'

export default {
  components: {
    totalView,
    pointRecord
  },
  data() {
    return {
      activeName: 'all',
      trade: false
    }
  },
  methods: {
    handleClick(tab, event) {
      if (this.activeName == 'pointRecord') {
        this.trade = true
      }
    }
  }
}
</script>
