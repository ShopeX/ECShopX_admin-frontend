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
  <el-form ref="form" label-width="100px">
    <el-form-item label="AppId">
      <el-input v-model="form.app_id" style="width: 300px" />
      <br>
    </el-form-item>
    <el-form-item label="AppSecret">
      <el-input v-model="form.app_secret" type="textarea" :rows="5" placeholder="请输入内容" />
      <br>
    </el-form-item>
    <el-form-item label="支付渠道id">
      <el-input
        v-model="form.payment_channel_id"
        type="textarea"
        :rows="5"
        placeholder="请输入内容"
      />
      <br>
      <span class="frm-tips">支付渠道id(易百分配)</span>
    </el-form-item>
    <!-- <el-form-item label="温馨提示">
      <span class="frm-tips">您绑定的企业支付宝账号必须开通<a href="https://b.alipay.com/signing/productDetail.htm?productId=I1011000290000001001" target="_blank">手机网站支付</a></span>
    </el-form-item> -->
    <div class="section-footer with-border content-center">
      <el-button v-loading="loading" type="primary" @click="onSubmit"> 保存 </el-button>
    </div>
  </el-form>
</template>
<script>
import { setPaymentSetting, getPaymentSetting } from '../../../../api/trade'
export default {
  data() {
    return {
      activeName: 'alipay',
      loading: false,
      form: {
        app_id: '',
        app_secret: '',
        payment_channel_id: '',
        is_open: true
      }
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    handleClick() {
      this.getConfig()
    },
    getConfig() {
      let query = { pay_type: 'ebuy' }
      getPaymentSetting(query).then(response => {
        this.form = response.data.data
      })
    },
    onSubmit() {
      this.loading = true
      this.form.pay_type = 'ebuy'
      setPaymentSetting(this.form)
        .then(response => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.loading = false
        })
        .catch(error => {
          this.loading = false
        })
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
