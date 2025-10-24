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
    <div>
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="发票配置" name="first">
          <fapiaoTemplates ref="fapiaoTemplates" :get-status="fapiaoTemplates" />
        </el-tab-pane>
        <el-tab-pane label="航信配置" name="second">
          <hangxinemplates ref="hangxinemplates" :get-status="hangxinemplates" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <router-view />
  </div>
</template>

<script>
import hangxinemplates from './hangxin'
import fapiaoTemplates from './fapiaoset'

export default {
  components: {
    hangxinemplates,
    fapiaoTemplates
  },
  data() {
    return {
      loading: false,
      hangxinemplates: false,
      fapiaoTemplates: false,
      activeName: 'first',
      list: []
    }
  },
  mounted() {
    if ('undefined' != typeof this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
  },
  methods: {
    handleClick(tab, event) {
      if (this.activeName === 'first') {
        this.hangxinemplates = true
      } else if (this.activeName === 'second') {
        this.fapiaoTemplates = true
      }
    }
  }
}
</script>

<style scoped></style>
