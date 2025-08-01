<template>
  <SpPage>
    <SpForm v-model="form" :reset-btn="false" submit-btn-text="保存配置" :form-list="formList" @onSubmit="onSaveConfig" />
  </SpPage>
</template>

<script>
import { formSchema } from './invoiceConfirmationSchema'
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
      api.financial.getInvoiceComfirmSetting(this.id).then((res) => {
        this.form = {
          ...generatorParams(formSchema(this), res),
          special_invoice_confirm_open:res.special_invoice_confirm_open == '1'
        }
      })
    },
    onSaveConfig() {
      console.log(this.form)
      api.financial
        .setInvoiceComfirmSetting({
          ...this.form,
          special_invoice_confirm_open:this.form.special_invoice_confirm_open ? 1 : 0
        })
        .then((res) => {
          this.$message.success('发送成功')
          this.confirmDialogShow = false
        })
    }
  }
}
</script>

<style scoped lang="scss"></style>
