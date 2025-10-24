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
    <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="会员中心BANNER" name="banner">
        <bannerTemplates />
      </el-tab-pane>
      <el-tab-pane label="菜单隐藏显示设置" name="menuoption">
        <menuoptionTemplates />
      </el-tab-pane>
      <el-tab-pane v-if="!VERSION_IN_PURCHASE()" label="页面跳转设置" name="redirect">
        <redirectTemplates />
      </el-tab-pane>
      <!-- <el-tab-pane
        v-if="!VERSION_IN_PURCHASE()"
        label="微信分享"
        name="wechatshare"
      >
        <wechatshareTemplates />
      </el-tab-pane> -->
    </el-tabs>
  </SpPage>
</template>

<script>
import bannerTemplates from './comps/banner'
import redirectTemplates from './comps/redirect'
import menuoptionTemplates from './comps/menuoption'
import wechatshareTemplates from './comps/share'
export default {
  components: {
    bannerTemplates,
    redirectTemplates,
    menuoptionTemplates,
    wechatshareTemplates
  },
  data() {
    return {
      activeName: 'banner'
    }
  },
  mounted() {
    if ('undefined' != typeof this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
  },
  methods: {}
}
</script>

<style lang="scss"></style>
