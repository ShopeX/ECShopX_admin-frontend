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
    <div v-if="$route.path.indexOf('detail') === -1">
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.name"
          :name="item.activeName"
        >
          <order v-if="activeName == 'order'" />
          <orderlog v-if="activeName == 'orderlog'" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <router-view />
  </SpPage>
</template>
<script>
import order from './components/order'
import orderlog from './components/orderlog'
export default {
  components: {
    order,
    orderlog
  },
  data() {
    return {
      activeName: 'order',
      tabList: [
        { name: '退款单', activeName: 'order' },
        { name: '退款失败日志', activeName: 'orderlog' }
      ]
    }
  },
  mounted() {},
  methods: {
    handleTabClick: function () {}
  }
}
</script>
