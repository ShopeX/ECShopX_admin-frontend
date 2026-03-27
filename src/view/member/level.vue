<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage :title="activeName == 'second' ? $t('c5e8d16d.6c1583') : $t('c5e8d16d.36a735')">
    <div class="section-white">
      <el-tabs v-model="activeName" type="card">
        <!-- <el-tab-pane
          label="基础设置"
          name="first"
        >
          <card-setting />
        </el-tab-pane> -->
        <el-tab-pane :label="$t('c5e8d16d.795682')" name="second">
          <card-level ref="cardLevel" />
        </el-tab-pane>
        <el-tab-pane :label="$t('c5e8d16d.de2408')" name="thrid">
          <card-viplevel ref="cardViplevel" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <template>
      <div class="text-center">
        <template v-if="activeName == 'second'">
          <el-button v-if="!VERSION_SHUYUN()" @click="addGrade('cardLevel')">
            {{ $t('c5e8d16d.0b369f') }}
          </el-button>
          <el-button type="primary" @click="saveGrade('cardLevel')">
            {{ $t('c5e8d16d.be5fbb') }}
          </el-button>
        </template>
        <template v-if="activeName == 'thrid'">
          <el-button v-if="!VERSION_SHUYUN()" @click="addGrade('cardViplevel')">
            {{ $t('c5e8d16d.0b369f') }}
          </el-button>
          <el-button type="primary" @click="saveGrade('cardViplevel')">
            {{ $t('c5e8d16d.be5fbb') }}
          </el-button>
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
