<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <SpPage>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane v-if="!isHfpay" label="微信支付配置" name="wxpay">
        <wxpayTemplates />
      </el-tab-pane>
      <el-tab-pane
        v-if="!isHfpay && !VERSION_IN_PURCHASE() && !VERSION_SHUYUN()"
        label="支付宝支付配置"
        name="alipay"
      >
        <alipayTemplates />
      </el-tab-pane>
      <!-- <el-tab-pane label="ebuy支付配置" name="ebuypay" v-if="!isHfpay">
        <ebuypayTemplates></ebuypayTemplates>
      </el-tab-pane> -->
      <el-tab-pane
        v-if="isHfpay && !VERSION_IN_PURCHASE() && !VERSION_SHUYUN()"
        label="汇付天下支付配置"
        name="hfpay"
      >
        <hfpayTemplates />
      </el-tab-pane>
      <el-tab-pane
        v-if="!isHfpay && !VERSION_IN_PURCHASE() && !VERSION_SHUYUN()"
        label="Adapay支付配置"
        name="adapay"
      >
        <adapayTemplates />
      </el-tab-pane>
      <el-tab-pane v-if="!VERSION_SHUYUN()" label="银联商务支付配置" name="chinaumspay">
        <chinaumspayTemplates />
      </el-tab-pane>
      <el-tab-pane v-if="!VERSION_SHUYUN() && !VERSION_B2C()" label="线下转帐" name="offline">
        <offlinePay />
      </el-tab-pane>
      <el-tab-pane label="汇付斗拱支付配置" name="bspay">
        <bspayTemplates />
      </el-tab-pane>
      <!-- <el-tab-pane label="默认积分抵扣配置" name="point">
        <pointpay />
      </el-tab-pane> -->
    </el-tabs>
  </SpPage>
</template>
<script>
import alipayTemplates from './payment/alipay'
import wxpayTemplates from './payment/wxpay'
import ebuypayTemplates from './payment/ebuypay'
import hfpayTemplates from './payment/hfpay'
import adapayTemplates from './payment/adapay'
import chinaumspayTemplates from './payment/chinaumspay'
import pointpay from './payment/pointpay'
import offlinePay from './payment/offlinepay'
import bspayTemplates from './payment/bspay'

import { hfpayVersionStatus } from '@/api/fenzhang'

export default {
  components: {
    alipayTemplates,
    wxpayTemplates,
    ebuypayTemplates,
    bspayTemplates,
    hfpayTemplates,
    adapayTemplates,
    chinaumspayTemplates,
    pointpay,
    offlinePay
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
    hfpayVersionStatus().then(res => {
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
