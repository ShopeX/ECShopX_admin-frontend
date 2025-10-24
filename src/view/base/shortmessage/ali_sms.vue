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
    <div class="ali-sms-page">
      <div class="btn">
        <router-link class="link" to="/setting/system-config/sms-service"> 切换短信商 </router-link>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基础配置" name="base_config" />
        <el-tab-pane label="发送短信" name="send_sms" />
        <el-tab-pane label="短信签名" name="sms_signatures" />
        <el-tab-pane label="短信模板" name="sms_template" />
        <el-tab-pane label="短信发送记录" name="sms_sendLog" />
        <el-tab-pane label="短信群发记录" name="sms_MassLog" />
      </el-tabs>

      <router-view />
    </div>
  </SpPage>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'base_config'
    }
  },
  mounted() {
    this.activeName = this.$route.meta
    this.routePath = this.$route.path
  },
  updated() {
    this.activeName = this.$route.meta
  },
  methods: {
    handleClick(tab, event) {
      this.activeName = tab.name
      if (tab.name == 'base_config') {
        this.$router.push({ path: `/setting/system-config/sms-service/ali_sms` })
      } else {
        this.$router.push({ path: `${this.routePath}/${tab.name}` })
      }
    },
    switchSMS() {
      console.log(1)
    }
  }
}
</script>

<style lang="scss" scoped>
.ali-sms-page {
  .btn {
    position: absolute;
    right: 100px;
    text-align: right;
    z-index: 999;
    .link {
      color: #999;
      font-size: 14px;
      line-height: 40px;
      &:hover {
        color: #1480e3;
      }
    }
  }
}
</style>
