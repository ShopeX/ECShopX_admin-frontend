<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div class="ali-sms-page">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="$t('efb95152.b6453a')" name="base_config" />
        <el-tab-pane :label="$t('efb95152.2d7288')" name="send_sms" />
        <el-tab-pane :label="$t('efb95152.f32c04')" name="sms_signatures" />
        <el-tab-pane :label="$t('efb95152.dbe8ba')" name="sms_template" />
        <el-tab-pane :label="$t('efb95152.dabdd1')" name="sms_sendLog" />
        <el-tab-pane :label="$t('efb95152.74abf5')" name="sms_MassLog" />
      </el-tabs>

      <router-view />
    </div>
  </SpPage>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'base_config'
    }
  },
  mounted() {
    this.activeName = this.$route.meta
    this.routePath = this.$route.path
  },
  updated() {
    this.activeName = this.$route.meta
  },
  methods: {
    handleClick(tab, event) {
      this.activeName = tab.name
      if (tab.name == 'base_config') {
        this.$router.push({ path: `/setting/system-config/sms-service` })
      } else {
        this.$router.push({ path: `${this.$route.matched[1].path}/${tab.name}` })
      }
    },
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
    right: 100px;
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
