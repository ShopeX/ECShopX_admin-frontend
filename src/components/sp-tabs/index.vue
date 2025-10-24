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
  <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
    <el-tab-pane
      v-for="(item, index) in tabList"
      :key="index"
      :label="item.label"
      :name="item.name"
    />
  </el-tabs>
</template>

<script>
export default {
  name: 'SpTabs',
  props: {
    tabList: {
      type: Array,
      default: () => []
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeName: this.value
    }
  },
  methods: {
    handleTabClick() {
      this.$emit('input', this.activeName)
      this.$emit('change', this.activeName)
    }
  }
}
</script>

<style lang="scss" scoped></style>
