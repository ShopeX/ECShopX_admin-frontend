<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template lang="html">
  <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
    <el-tab-pane :label="title + $t('58e31c14.6daed7')" name="first">
      <receive :get-status="receive" />
    </el-tab-pane>
    <el-tab-pane :label="title + $t('58e31c14.7a2076')" name="second">
      <used :get-status="used" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import receive from './detail/receive.vue'
import used from './detail/used.vue'

export default {
  components: {
    receive,
    used
  },
  data() {
    return {
      title: '',
      activeName: 'first',
      receive: false,
      used: false
    }
  },
  mounted() {
    if (this.$route.query.name) {
      this.activeName = this.$route.query.name
    }
    if (this.$route.query.title) {
      this.title = this.$route.query.title
    }
    if (this.activeName === 'first') {
      this.receive = true
    } else if (this.activeName === 'second') {
      this.used = true
    }
  },
  methods: {
    //充值送钱
    handleClick(tab, event) {
      if (this.activeName === 'first') {
        this.receive = true
      } else if (this.activeName === 'second') {
        this.used = true
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
