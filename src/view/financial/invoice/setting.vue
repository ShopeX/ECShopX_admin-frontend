<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpForm
      v-model="form"
      :reset-btn="false"
      :submit-btn-text="$t('4a23b087.be5fbb')"
      :form-list="formList"
      @onSubmit="onSaveConfig"
    />
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
          invoice_status: res.invoice_status == 1
        }
      })
    },
    onSaveConfig() {
      console.log(this.form)
      api.financial
        .setInvoiceSetting({
          ...this.form,
          invoice_status: this.form.invoice_status ? 1 : 0
        })
        .then((res) => {
          this.$message.success(this.$t('4a23b087.3b1083'))
          this.confirmDialogShow = false
        })
    }
  }
}
</script>

<style scoped lang="scss"></style>
