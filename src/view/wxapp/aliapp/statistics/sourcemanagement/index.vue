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
  <div class="section-white content-padded">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="监控列表" name="monito">
        <monito-list />
      </el-tab-pane>
      <el-tab-pane label="来源列表" name="source">
        <source-list />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import monitoList from './monito_list.vue'
import sourceList from './source_list.vue'

export default {
  components: {
    monitoList,
    sourceList
  },
  data() {
    return {
      activeName: 'monito'
    }
  },
  methods: {
    handleClick(tab, event) {}
  }
}
</script>
