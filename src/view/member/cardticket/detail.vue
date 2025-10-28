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
    <el-tab-pane :label="title + '-卡券领取记录'" name="first">
      <receive :get-status="receive" />
    </el-tab-pane>
    <el-tab-pane :label="title + '-卡券使用记录'" name="second">
      <used :get-status="used" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import receive from './detail/receive.vue'
import used from './detail/used.vue'

export default {
  components: {
    receive,
    used
  },
  data() {
    return {
      title: '',
      activeName: 'first',
      receive: false,
      used: false
    }
  },
  mounted() {
    if (this.$route.query.name) {
      this.activeName = this.$route.query.name
    }
    if (this.$route.query.title) {
      this.title = this.$route.query.title
    }
    if (this.activeName === 'first') {
      this.receive = true
    } else if (this.activeName === 'second') {
      this.used = true
    }
  },
  methods: {
    //充值送钱
    handleClick(tab, event) {
      if (this.activeName === 'first') {
        this.receive = true
      } else if (this.activeName === 'second') {
        this.used = true
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
