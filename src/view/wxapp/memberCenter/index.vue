<template>
  <SpPage>
    <SpPlatformTip h5 app alipay />
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="会员中心BANNER" name="banner">
        <bannerTemplates />
      </el-tab-pane>
      <el-tab-pane label="菜单隐藏显示设置" name="menuoption">
        <menuoptionTemplates />
      </el-tab-pane>
      <el-tab-pane v-if="!VERSION_IN_PURCHASE()" label="页面跳转设置" name="redirect">
        <redirectTemplates />
      </el-tab-pane>
      <!-- <el-tab-pane
        v-if="!VERSION_IN_PURCHASE()"
        label="微信分享"
        name="wechatshare"
      >
        <wechatshareTemplates />
      </el-tab-pane> -->
    </el-tabs>
  </SpPage>
</template>

<script>
import bannerTemplates from './comps/banner'
import redirectTemplates from './comps/redirect'
import menuoptionTemplates from './comps/menuoption'
import wechatshareTemplates from './comps/share'
export default {
  components: {
    bannerTemplates,
    redirectTemplates,
    menuoptionTemplates,
    wechatshareTemplates
  },
  data() {
    return {
      activeName: 'banner'
    }
  },
  mounted() {
    if ('undefined' != typeof this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
  },
  methods: {}
}
</script>

<style lang="scss"></style>
