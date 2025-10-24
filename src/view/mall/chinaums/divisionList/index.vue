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
  <div>
    <div v-if="$route.path.indexOf('detail') === -1">
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.name"
          :name="item.activeName"
        >
          <transfer v-if="activeName == 'transfer'" />
          <transferdetail v-if="activeName == 'transferdetail'" />
          <transferlog v-if="activeName == 'transferlog'" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <router-view />
  </div>
</template>
<script>
import transfer from './components/transfer'
import transferdetail from './components/transferdetail'
import transferlog from './components/transferlog'
export default {
  components: {
    transfer,
    transferdetail,
    transferlog
  },
  data() {
    return {
      activeName: 'transfer',
      tabList: [
        { name: '划付单', activeName: 'transfer' },
        { name: '划付单明细', activeName: 'transferdetail' },
        { name: '划付失败日志', activeName: 'transferlog' }
      ]
    }
  },
  mounted() {},
  methods: {
    handleTabClick: function () {}
  }
}
</script>
