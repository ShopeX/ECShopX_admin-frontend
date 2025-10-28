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
    <el-form-item label="默认积分支付">
      <el-switch v-model="form.point_pay_first" active-color="#13ce66" inactive-color="#aaaaaa" />
      <span class="frm-tips"> 开启默认积分支付功能，消费者下单时优先使用积分支付下单</span>
    </el-form-item>

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
      activeName: 'point_pay',
      loading: false,
      form: {
        point_pay_first: 0
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
      let query = {}
      if (this.activeName == 'point_pay') {
        query = { pay_type: 'point_pay' }
        getPaymentSetting(query).then(response => {
          console.log('response == ', response)
          this.form = response.data.data
          this.form.point_pay_first = response.data.data.point_pay_first == '1' ? true : false
        })
      }
    },
    onSubmit() {
      this.loading = true
      let query = {}
      if (this.activeName == 'point_pay') {
        query = {
          pay_type: 'point_pay',
          point_pay_first: this.form.point_pay_first ? 1 : 0
        }
      }
      setPaymentSetting(query)
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
