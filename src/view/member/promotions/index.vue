<template>
  <div>
    <SpPlatformTip h5 app alipay />
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="index"
        :label="item.name"
        :name="item.activeName"
      >
        <general v-if="activeName === 'first'" :get-status="general_status" />
        <sale-member-card v-if="activeName === 'third'" :get-status="sale_member_card" />
        <point v-if="activeName === 'fourth'" :get-status="point" />
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
      activeName: 'first',
      general_status: true,
      distributor: false,
      sale_member_card: false,
      point: false,
      tabList: [
        { name: '基础注册促销', activeName: 'first' },
        { name: '赠送(付费会员卡)', activeName: 'third' },
        { name: '注册送积分', activeName: 'fourth' }
      ]
    }
  },
  mounted() {
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
    handleClick() {
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
