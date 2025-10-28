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
    <div>
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="易联云配置" name="first">
          <yilianyunTemplates ref="yilianyunTemplates" :get-status="yilianyunTemplates" />
        </el-tab-pane>
        <el-tab-pane label="门店配置" name="second">
          <shopPosTemplates ref="shopPosTemplates" :get-status="shopPosTemplates" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <router-view />
  </SpPage>
</template>

<script>
import yilianyunTemplates from './setting'
import shopPosTemplates from './shop'

export default {
  components: {
    yilianyunTemplates,
    shopPosTemplates
  },
  data() {
    return {
      loading: false,
      yilianyunTemplates: false,
      shopPosTemplates: false,
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
        this.yilianyunTemplates = true
      } else if (this.activeName === 'second') {
        this.shopPosTemplates = true
      }
    }
  }
}
</script>

<style scoped></style>
