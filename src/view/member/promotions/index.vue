<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane :label="$t('dfc4d05a.d8bc17')" name="first">
        <general :active-name="activeName" />
      </el-tab-pane>
      <el-tab-pane :label="$t('dfc4d05a.262138')" name="third">
        <sale-member-card :active-name="activeName" />
      </el-tab-pane>
      <el-tab-pane :label="$t('dfc4d05a.450ff4')" name="fourth">
        <point :active-name="activeName" />
      </el-tab-pane>
    </el-tabs>
  </SpPage>
</template>

<script>
import general from './register'
import saleMemberCard from './saleMemberCard'
import point from './point'

export default {
  components: {
    general,
    saleMemberCard,
    point
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  mounted() {
    if (this.$route.query.name) {
      this.activeName = this.$route.query.name
    }
  }
}
</script>

<style scoped lang="scss"></style>
