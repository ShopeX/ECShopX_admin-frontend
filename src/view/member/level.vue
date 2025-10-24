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
  <SpPage :title="activeName == 'second' ? '会员等级' : '付费会员等级'">
    <div class="section-white">
      <el-tabs v-model="activeName" type="card">
        <!-- <el-tab-pane
          label="基础设置"
          name="first"
        >
          <card-setting />
        </el-tab-pane> -->
        <el-tab-pane label="等级设置" name="second">
          <card-level ref="cardLevel" />
        </el-tab-pane>
        <el-tab-pane label="付费等级设置" name="thrid">
          <card-viplevel ref="cardViplevel" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <template>
      <div class="text-center">
        <template v-if="activeName == 'second'">
          <el-button v-if="!VERSION_SHUYUN()" @click="addGrade('cardLevel')">
            添加等级卡
          </el-button>
          <el-button type="primary" @click="saveGrade('cardLevel')"> 保存 </el-button>
        </template>
        <template v-if="activeName == 'thrid'">
          <el-button v-if="!VERSION_SHUYUN()" @click="addGrade('cardViplevel')">
            添加等级卡
          </el-button>
          <el-button type="primary" @click="saveGrade('cardViplevel')"> 保存 </el-button>
        </template>
      </div>
    </template>
  </SpPage>
</template>
<script>
import cardViplevel from './comps/cpViplevel.vue'
import cardLevel from './comps/cpLevel.vue'
export default {
  components: {
    cardLevel,
    cardViplevel
  },
  data() {
    return {
      activeName: 'second'
    }
  },
  methods: {
    addGrade(val) {
      this.$refs[val].addGrade()
    },
    saveGrade(val) {
      this.$refs[val].saveGrade()
    }
  }
}
</script>
