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
  <div class="dealer_index">
    <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app />
    <div class="step">
      <el-steps :active="active" align-center finish-status="success">
        <!-- <el-step title="提交开户资料" :description="active!=0?'完成':'已提交审核，请耐心等待～'"></el-step>
        <el-step title="支付渠道入驻" :description="active==2 || active==3 || active==1?'完成':'已提交审核，请耐心等待～'"></el-step>
        <el-step title="提交图片信息" :description="active== 4 || active==3 ?'完成':'已提交审核，请耐心等待～'">></el-step>
        <el-step title="入网完成" :description="active==4 || active==3 ?'完成':''"></el-step> -->

        <el-step title="提交开户资料" />
        <el-step title="支付渠道入驻" />
        <el-step title="提交证照信息" />
        <el-step title="入网完成" />
      </el-steps>
    </div>
    <!-- <el-button style="margin-top: 12px;" @click="next">下一步</el-button> -->
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0
    }
  },
  created() {
    this.getStepHandle()
    // this.$router.push('/setting/adapay_merchant/pay_setting')
    // this.$router.push('/setting/adapay_merchant/picture')
  },
  methods: {
    // 查询开户步骤
    async getStepHandle() {
      const { step, info } = await this.$api.adapay.getStep()
      const { MerchantEntry, MerchantResident, SubmitLicense } = info
      this.active = step - 1

      if (this.active == 1) {
        // this.$router.push('/setting/adapay_merchant/pay_setting')
      } else if (this.active == 2) {
        if (!SubmitLicense.audit_status) {
          this.$router.push('/applications/adapay/adapay_merchant/pay_setting')
          return
        }
        this.$router.push('/applications/adapay/adapay_merchant/picture')
      } else if (this.active == 3) {
        this.$router.push('/applications/adapay/adapay_merchant/netin')
        this.active = 4
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dealer_index {
  .step {
    padding-bottom: 50px;
    // background: #f5f5f5;
  }
}
</style>

<style lang="scss">
// .dealer_index {
//   .el-step__title.is-success {
//     color: #1890ff;
//   }
//   .el-step__head.is-success {
//     color: #1890ff;
//     border-color: #1890ff;
//   }
// }
</style>
