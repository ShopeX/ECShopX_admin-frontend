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
  <SpPage class="merchantsClassification">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="index"
        :label="item.name"
        :name="item.activeName"
      >
        <Classify v-if="activeName == 'class'" />
        <Base-cpn v-if="activeName == 'base'" />
      </el-tab-pane>
    </el-tabs>
  </SpPage>
</template>

<script>
import Classify from './cpn/classify.vue'
import BaseCpn from './cpn/base.vue'

export default {
  components: { Classify, BaseCpn },
  data() {
    return {
      activeName: 'class',
      tabList: [
        { name: '商家分类', activeName: 'class' },
        { name: '基础配置', activeName: 'base' }
      ]
    }
  }
}
</script>

<style></style>
