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
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="腾讯有数参数配置" name="youshu">
        <youshu />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import youshu from './dataAnalysis/youshu'

export default {
  components: {
    youshu
  },
  data() {
    return {
      showDialog: false,
      activeName: 'youshu',
      payType: {
        chinapnr: false,
        ebuy: false,
        balance: false,
        point: false
      }
    }
  },
  mounted() {
    if ('undefined' != typeof this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
  },
  methods: {
    handleClick(tab, event) {},
    handleChange() {
      this.showDialog = true
    },
    cancelAction() {
      this.showDialog = false
    },
    handleSubmit() {
      this.showDialog = false
    }
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 10px;
  .frm-tips {
    color: #ff0000;
  }
}
</style>
