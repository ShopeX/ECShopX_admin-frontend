<template>
  <div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="腾讯有数参数配置" name="youshu">
        <youshu />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import youshu from './dataAnalysis/youshu'

export default {
  components: {
    youshu
  },
  data() {
    return {
      showDialog: false,
      activeName: 'youshu',
      payType: {
        chinapnr: false,
        ebuy: false,
        balance: false,
        point: false
      }
    }
  },
  mounted() {
    if ('undefined' != typeof this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
  },
  methods: {
    handleClick(tab, event) {},
    handleChange() {
      this.showDialog = true
    },
    cancelAction() {
      this.showDialog = false
    },
    handleSubmit() {
      this.showDialog = false
    }
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 10px;
  .frm-tips {
    color: #ff0000;
  }
}
</style>
