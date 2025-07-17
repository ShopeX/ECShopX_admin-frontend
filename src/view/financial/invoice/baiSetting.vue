<template>
  <div>
    <SpForm v-model="form" :reset-btn="false" submit-btn-text="保存配置" :form-list="formList" @onSubmit="onSaveConfig" />
  </div>
</template>

<script>
import { formSchema } from './baiSettingSchema'
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
      api.financial.getBaiInvoiceSetting(this.id).then((res) => {
        this.form = {
          ...generatorParams(formSchema(this), res)
        }
      })
    },
    onSaveConfig() {
      console.log(this.form)
      api.financial
        .setBaiInvoiceSetting({
          ...this.form,
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
