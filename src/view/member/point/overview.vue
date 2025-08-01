<template>
  <SpPage>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="总览" name="all">
        <total-view />
      </el-tab-pane>
      <el-tab-pane label="积分记录" name="pointRecord">
        <point-record :get-status="trade" />
      </el-tab-pane>
    </el-tabs>
  </SpPage>
</template>

<script>
import totalView from './totalview.vue'
import pointRecord from './pointrecord.vue'

export default {
  components: {
    totalView,
    pointRecord
  },
  data() {
    return {
      activeName: 'all',
      trade: false
    }
  },
  methods: {
    handleClick(tab, event) {
      if (this.activeName == 'pointRecord') {
        this.trade = true
      }
    }
  }
}
</script>
