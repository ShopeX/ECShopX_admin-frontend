<template>
  <div class="ali-sms-page">
    <div class="btn">
      <router-link class="link" to="/setting/datamessage">切换短信商</router-link>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基础配置" name="base_config"></el-tab-pane>
      <el-tab-pane label="发送短信" name="send_sms"></el-tab-pane>
      <el-tab-pane label="短信签名" name="sms_signatures"></el-tab-pane>
      <el-tab-pane label="短信模板" name="sms_template"></el-tab-pane>
      <el-tab-pane label="短信发送记录" name="sms_sendLog"></el-tab-pane>
      <el-tab-pane label="短信群发记录" name="sms_MassLog"></el-tab-pane>
    </el-tabs>

    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'base_config'
    }
  },
  mounted(){
    this.activeName = this.$route.meta
  },
  methods: {
    handleClick(tab, event) {
      this.activeName = tab.name
      if (tab.name=='base_config') {
        this.$router.push({ path:`/setting/datamessage/ali_sms`})
      }else{
        this.$router.push({ path:`/setting/datamessage/ali_sms/${tab.name}`})
      }
      
      
    },
    switchSMS() {
      console.log(1)
    }
  },
  updated(){
     this.activeName = this.$route.meta
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
