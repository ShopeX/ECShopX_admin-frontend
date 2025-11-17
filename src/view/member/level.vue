<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
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
