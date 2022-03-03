<!--
 * @Author: your name
 * @Date: 2021-01-12 11:04:09
 * @LastEditTime: 2021-01-25 16:09:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/work/espier-shop/app/src/view/wxapp/member_center_setting.vue
-->
<template>
  <el-card
    shadow="never"
    header="会员中心设置"
  >
    <el-tabs
      v-model="activeName"
      type="border-card"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="会员中心BANNER"
        name="banner"
      >
        <bannerTemplates />
      </el-tab-pane>
      <!-- <el-tab-pane label="菜单隐藏显示设置" name="menuoption">
        <menuoptionTemplates></menuoptionTemplates>
      </el-tab-pane> -->
      <!-- <el-tab-pane label="页面跳转设置" name="redirect">
        <redirectTemplates></redirectTemplates>
      </el-tab-pane> -->
      <el-tab-pane
        label="分享"
        name="wechatshare"
      >
        <wechatshareTemplates />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import bannerTemplates from '../../base/setting/memberCenter/banner'
import redirectTemplates from '../../base/setting/memberCenter/redirect'
import menuoptionTemplates from '../../base/setting/memberCenter/menuoption'
import wechatshareTemplates from '../../base/setting/memberCenter/share'
export default {
  components: {
    bannerTemplates,
    redirectTemplates,
    menuoptionTemplates,
    wechatshareTemplates
  },
  data () {
    return {
      activeName: 'banner'
    }
  },
  mounted () {
    if ('undefined' != typeof this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
  },
  methods: {
    handleClick (tab, event) {
      if (this.activeName === 'banner') {
      } else if (this.activeName === 'redirect') {
      }
    }
  }
}
</script>

<style lang="scss"></style>
