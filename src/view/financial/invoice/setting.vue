<template>
  <div>
    <SpForm v-model="form" :reset-btn="false" submit-btn-text="保存" :form-list="formList" @onSubmit="onSaveConfig" />
  </div>
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
    // getDeatl() {
    //   api.order.getInvoice(this.id).then((res) => {
    //     this.form = {
    //       ...generatorParams(formSchema(this), res),
    //       invoice_file_url: res.invoice_file_url
    //     }
    //   })
    // },
    onSaveConfig() {
      console.log(this.form)
      // api.order
      //   .resendInvoiceEmail({
      //     invoice_id: this.id,
      //     confirm_email: this.confirmForm.email
      //   })
      //   .then((res) => {
      //     this.$message.success('发送成功')
      //     this.confirmDialogShow = false
      //   })
    }
  }
}
</script>

<style scoped lang="scss"></style>
