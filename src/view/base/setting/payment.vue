<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane v-if="!isHfpay" label="微信支付配置" name="wxpay">
        <wxpayTemplates />
      </el-tab-pane>
      <el-tab-pane v-if="!isHfpay && !VERSION_IN_PURCHASE" label="支付宝支付配置" name="alipay">
        <alipayTemplates />
      </el-tab-pane>
      <!-- <el-tab-pane label="ebuy支付配置" name="ebuypay" v-if="!isHfpay">
        <ebuypayTemplates></ebuypayTemplates>
      </el-tab-pane> -->
      <el-tab-pane v-if="isHfpay && !VERSION_IN_PURCHASE" label="汇付天下支付配置" name="hfpay">
        <hfpayTemplates />
      </el-tab-pane>
      <el-tab-pane v-if="!isHfpay && !VERSION_IN_PURCHASE" label="Adapay支付配置" name="adapay">
        <adapayTemplates />
      </el-tab-pane>
      <el-tab-pane label="银联商务支付配置" name="chinaumspay">
        <chinaumspayTemplates />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import alipayTemplates from './payment/alipay'
import wxpayTemplates from './payment/wxpay'
import ebuypayTemplates from './payment/ebuypay'
import hfpayTemplates from './payment/hfpay'
import adapayTemplates from './payment/adapay'
import chinaumspayTemplates from './payment/chinaumspay'

import { hfpayVersionStatus } from '@/api/fenzhang'

export default {
  components: {
    alipayTemplates,
    wxpayTemplates,
    ebuypayTemplates,
    hfpayTemplates,
    adapayTemplates,
    chinaumspayTemplates
  },
  data() {
    return {
      showDialog: false,
      activeName: 'wxpay',
      isHfpay: false,
      payType: {
        chinapnr: false,
        ebuy: false,
        balance: false,
        point: false
      }
    }
  },
  mounted() {
    if ('undefined' != typeof this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
    hfpayVersionStatus().then((res) => {
      let data = res.data.data
      if (data.hfpay_version_status) {
        this.activeName = 'hfpay'
        this.isHfpay = true
      } else {
        this.activeName = 'wxpay'
        this.isHfpay = false
      }
    })
  },
  methods: {
    handleClick(tab, event) {
      if (this.activeName === 'wxpay') {
      } else if (this.activeName === 'alipay') {
      }
    },
    handleChange() {
      this.showDialog = true
    },
    cancelAction() {
      this.showDialog = false
    },
    handleSubmit() {
      this.showDialog = false
    }
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 10px;
  .frm-tips {
    color: #ff0000;
  }
}
</style>
