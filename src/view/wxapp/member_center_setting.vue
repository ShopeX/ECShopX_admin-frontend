<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-card shadow="never" :header="$t('ee36ad5b.b04a32')">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane :label="$t('ee36ad5b.256f27')" name="banner">
        <bannerTemplates />
      </el-tab-pane>
      <el-tab-pane :label="$t('d1e146de.fa23d6')" name="menuoption">
        <menuoptionTemplates />
      </el-tab-pane>
      <el-tab-pane v-if="!VERSION_IN_PURCHASE()" :label="$t('d1e146de.1f2e8b')" name="redirect">
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
  </el-card>
</template>

<script>
import bannerTemplates from '../base/setting/memberCenter/banner'
import redirectTemplates from '../base/setting/memberCenter/redirect'
import menuoptionTemplates from '../base/setting/memberCenter/menuoption'
import wechatshareTemplates from '../base/setting/memberCenter/share'
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
  methods: {
    handleClick(tab, event) {
      if (this.activeName === 'banner') {
      } else if (this.activeName === 'redirect') {
      }
    }
  }
}
</script>

<style lang="scss"></style>
