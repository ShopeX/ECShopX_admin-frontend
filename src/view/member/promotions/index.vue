<template>
  <div>
    <SpPlatformTip h5 app alipay />
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="基础注册促销" name="first">
        <general :active-name="activeName" />
      </el-tab-pane>
      <el-tab-pane label="赠送(付费会员卡)" name="third">
        <sale-member-card :active-name="activeName" />
      </el-tab-pane>
      <el-tab-pane label="注册送积分" name="fourth">
        <point :active-name="activeName" />
      </el-tab-pane>
    </el-tabs>
  </div>
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
