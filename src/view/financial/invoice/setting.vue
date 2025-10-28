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
    <SpForm v-model="form" :reset-btn="false" submit-btn-text="保存" :form-list="formList" @onSubmit="onSaveConfig" />
  </SpPage>
</template>

<script>
import { formSchema } from './settingSchema'
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
      }
    }
  },
  computed: {
    formList() {
      return formSchema(this)
    }
  },
  mounted() {
    this.getDeatl()
  },
  methods: {
    getDeatl() {
      api.financial.getInvoiceSetting(this.id).then((res) => {
        this.form = {
          ...generatorParams(formSchema(this), res),
          invoice_status:res.invoice_status == 1
        }
      })
    },
    onSaveConfig() {
      console.log(this.form)
      api.financial
        .setInvoiceSetting({
          ...this.form,
          invoice_status:this.form.invoice_status ? 1 : 0
        })
        .then((res) => {
          this.$message.success('保存成功')
          this.confirmDialogShow = false
        })
    }
  }
}
</script>

<style scoped lang="scss"></style>
