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
      formData: {
        appKey: '',
        appSecret: ''
      }
    }
  },
  computed: {
    formItems() {
      return [
        {
          component: 'input',
          componentProps: {
            placeholder: this.$t('ac4d83f6.d9bebe'),
            clearable: true
          },
          fieldName: 'appKey',
          formItemClass: 'w-2/4',
          label: 'appKey',
          rules: [{ required: true, message: this.$t('ac4d83f6.d9bebe'), trigger: 'blur' }]
        },
        {
          component: 'input',
          componentProps: {
            placeholder: this.$t('ac4d83f6.c3744f'),
            clearable: true
          },
          fieldName: 'appSecret',
          formItemClass: 'w-2/4',
          label: 'appSecret',
          rules: [{ required: true, message: this.$t('ac4d83f6.c3744f'), trigger: 'blur' }]
        }
      ]
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
        this.$message.success(this.$t('ac4d83f6.b374d9'))
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
