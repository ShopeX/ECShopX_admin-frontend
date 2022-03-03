<template>
  <el-tabs
    v-model="activeName"
    type="border-card"
    @tab-click="handleClick"
  >
    <el-tab-pane
      label="基础注册促销"
      name="first"
    >
      <general :get-status="general_status" />
    </el-tab-pane>
    <!-- <el-tab-pane label="分销商注册促销" name="second">
      <distributor :get-status="distributor"></distributor>
    </el-tab-pane> -->
    <el-tab-pane
      label="赠送(付费会员卡)"
      name="third"
    >
      <sale-member-card :get-status="sale_member_card" />
    </el-tab-pane>
    <el-tab-pane
      label="注册送积分"
      name="fourth"
    >
      <point :get-status="point" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
// import distributor from './distributorIndex'
import general from './register'
import saleMemberCard from './saleMemberCard'
import point from './point'

export default {
  components: {
    // distributor,
    general,
    saleMemberCard,
    point
  },
  data () {
    return {
      activeName: 'first',
      general_status: true,
      distributor: false,
      sale_member_card: false,
      point: false
    }
  },
  mounted () {
    if (this.$route.query.name) {
      this.activeName = this.$route.query.name
    }
    if (this.activeName === 'first') {
      this.general_status = true
      this.distributor = false
      this.sale_member_card = false
      this.point = false
    } else if (this.activeName === 'second') {
      this.general_status = false
      this.distributor = true
      this.sale_member_card = false
      this.point = false
    } else if (this.activeName === 'fourth') {
      this.general_status = false
      this.distributor = false
      this.sale_member_card = false
      this.point = true
    }
  },
  methods: {
    //充值送钱
    handleClick () {
      if (this.activeName === 'first') {
        this.general_status = true
        this.distributor = false
        this.sale_member_card = false
        this.point = false
      } else if (this.activeName === 'second') {
        this.general_status = false
        this.distributor = true
        this.sale_member_card = false
        this.point = false
      } else if (this.activeName === 'third') {
        this.general_status = false
        this.distributor = false
        this.sale_member_card = true
        this.point = false
      } else if (this.activeName === 'fourth') {
        this.general_status = false
        this.distributor = false
        this.sale_member_card = false
        this.point = true
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
