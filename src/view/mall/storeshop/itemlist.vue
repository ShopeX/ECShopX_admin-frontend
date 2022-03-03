<template>
  <el-tabs
    v-model="activeName"
    type="border-card"
    @tab-click="handleClick"
  >
    <el-tab-pane
      label="发布总部商品"
      name="relmall"
    >
      <relMallList
        :is-load="relmall_status"
        :distributor-id="distributor_id"
      />
    </el-tab-pane>
    <!--el-tab-pane label="店铺商品" name="shopself">
      <shopSelftList :is-load="shopself_status" :distributor-id="distributor_id"></shopSelftList>
    </el-tab-pane-->
  </el-tabs>
</template>

<script>
import shopSelftList from './shopselftlist'
import relMallList from './relmalllist'

export default {
  components: {
    shopSelftList,
    relMallList
  },
  data () {
    return {
      activeName: 'relmall',
      shopself_status: true,
      relmall_status: false,
      distributor_id: ''
    }
  },
  mounted () {
    if (this.$route.query.distributor_id) {
      this.distributor_id = this.$route.query.distributor_id
    }
    if (this.$route.query.name) {
      this.activeName = this.$route.query.name
    }
    if (this.activeName === 'shopself') {
      this.shopself_status = true
      this.relmall_status = false
    } else if (this.activeName === 'relmall') {
      this.shopself_status = false
      this.relmall_status = true
    }
  },
  methods: {
    handleClick () {
      if (this.activeName === 'shopself') {
        this.shopself_status = true
        this.relmall_status = false
      } else if (this.activeName === 'relmall') {
        this.shopself_status = false
        this.relmall_status = true
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
