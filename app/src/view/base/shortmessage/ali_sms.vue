<template>
  <div class="ali-sms-page">
    <div class="btn">
      <router-link class="link" to="{}">切换短信商</router-link>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基础配置" name="baseConfig">
        <base-config></base-config>
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
      <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import baseConfig from './cpn/base_config.vue'
export default {
  components:{
    baseConfig
  },
  data() {
    return {
      activeName: 'baseConfig'
    }
  },
  methods: {
    handleClick() {},
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
    right: 20px;
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
