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
  <SpPage class="invoice-detail-page">
    <SpForm v-model="form" size="min" :form-list="formList" :submit="false" />

    <!-- 请确认重发邮箱 -->
    <SpDialog
      ref="dialogRef2"
      v-model="confirmDialogShow"
      title="请确认重发邮箱"
      confirm-btn-text="邮箱正确并发送"
      :modal="false"
      class="base-form"
      :form="confirmForm"
      :form-list="confirmRuleForm"
      :confirm-status="confirmStatus"
      @onSubmit="onConfirmFormSubmit"
    />
  </SpPage>
</template>

<script>
import { formSchema } from './detailSchema'
import { generatorParams } from '@/utils/schemaHelper'
import api from '@/api'
export default {
  data() {
    return {
      form: {
        ...generatorParams(formSchema(this))
      },
      confirmDialogShow: false,
      confirmForm: {
        email: ''
      },
      confirmStatus:false,
      confirmRuleForm: [
        {
          key: 'email',
          label: '邮箱',
          type: 'input',
          defaultValue: '',
          required: true,
          tip:'电子发票需要一定时间才能发送到您的邮箱,请耐心等待'
        }
      ]
    }
  },
  computed: {
    formList() {
      return formSchema(this)
    }
  },
  mounted() {
    this.id = this.$route.query.id
    if (this.id) {
      this.getInvoice()
    }
  },
  methods: {
    showPdHandle() {
      console.log(this.form)
      window.open(this.form.invoice_file_url, '_blank')
    },
    sendEmailHandle() {
      this.confirmDialogShow = true
      this.confirmForm = {
        // email: this.form.email
        email:''
      }
    },
    getInvoice() {
      api.financial.getInvoiceDetail(this.id).then((res) => {
        this.form = {
          ...generatorParams(formSchema(this), res),
          invoice_file_url: res.invoice_file_url
        }
      })
    },
    onConfirmFormSubmit() {
      console.log(this.confirmForm)
      this.confirmStatus = true
      api.financial
        .resendInvoiceEmail({
          id: this.id,
          confirm_email: this.confirmForm.email
        })
        .then((res) => {
          this.$message.success('发送成功')
          this.confirmDialogShow = false
        }).finally(()=>{
          this.confirmStatus = false
        })
    }
  }
}
</script>

<style lang="scss">
.invoice-detail-page .sp-form .el-form-item{
  &.inline{
    width: 33% !important;
  }
}
</style>

