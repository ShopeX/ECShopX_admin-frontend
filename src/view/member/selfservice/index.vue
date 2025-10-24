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
  <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
    <el-tab-pane label="表单模板" name="first">
      <formTemplate ref="formTemplate" :get-status="formTemplate" />
    </el-tab-pane>
    <el-tab-pane label="表单配置项" name="second">
      <formSetting :get-status="formSetting" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import formTemplate from './formtemplatelist.vue'
import formSetting from './formsettinglist.vue'

export default {
  provide() {
    return {
      refresh: this.refresh
    }
  },
  components: {
    formTemplate,
    formSetting
  },
  data() {
    return {
      activeName: 'first',
      formSetting: false,
      formTemplate: false
    }
  },
  mounted() {
    if (this.$route.query.name) {
      this.activeName = this.$route.query.name
    }
    if (this.activeName === 'first') {
      this.formSetting = true
    } else if (this.activeName === 'second') {
      this.formTemplate = true
    }
  },
  methods: {
    //充值送钱
    handleClick(tab, event) {
      if (this.activeName === 'first') {
        this.formSetting = true
      } else if (this.activeName === 'second') {
        this.formTemplate = true
      }
    },
    refresh() {
      this.$refs.getDataList
    }
  }
}
</script>

<style scoped lang="scss"></style>
