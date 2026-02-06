<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage v-loading="loading">
    <SpFormPlus
      ref="kujialeform"
      v-model="formData"
      form-type="normalForm"
      :form-items="formItems"
      label-width="100px"
      @submit="handleSubmit"
    />
  </SpPage>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      lock: false,
      formItems: [
        {
          component: 'input',
          componentProps: {
            placeholder: '请输入appKey',
            clearable: true
          },
          fieldName: 'appKey',
          formItemClass: 'w-2/4',
          label: 'appKey',
          rules: [{ required: true, message: '请输入appKey', trigger: 'blur' }]
        },
        {
          component: 'input',
          componentProps: {
            placeholder: '请输入appSecret',
            clearable: true
          },
          fieldName: 'appSecret',
          formItemClass: 'w-2/4',
          label: 'appSecret',
          rules: [{ required: true, message: '请输入appSecret', trigger: 'blur' }]
        }
      ],
      formData: {
        appKey: '',
        appSecret: ''
      }
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    async getConfig() {
      this.loading = true
      try {
        const data = await this.$api.third.getKujialeSetting()
        console.log(data, data.appKey)
        this.formData.appKey = data.appKey
        this.formData.appSecret = data.appSecret
        this.loading = false
      } catch (error) {
        console.log(error)
        this.loading = false
      }
    },
    async handleSubmit(formData) {
      try {
        console.log(formData, '--')
        await this.$api.third.setKujialeSetting(formData)
        this.$message.success('更新成功，重新登录后生效')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
