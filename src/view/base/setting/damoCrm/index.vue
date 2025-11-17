<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage v-loading="loading">
    <SpFormPlus
      ref="crmform"
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
            clearable: true,
          },
          fieldName: 'app_key',
          formItemClass: 'w-2/4',
          label: 'appKey',
          rules: [
            { required: true, message: '请输入appKey', trigger: 'blur' }
          ]
        },
        {
          component: 'input',
          componentProps: {
            placeholder: '请输入appSecret',
            clearable: true,
          },
          fieldName: 'app_secret',
          formItemClass: 'w-2/4',
          label: 'appSecret',
          rules: [
            { required: true, message: '请输入appSecret', trigger: 'blur' }
          ]
        },
        {
          component: 'input',
          componentProps: {
            placeholder: '请输入企业标识',
            clearable: true,
          },
          fieldName: 'ent_sign',
          formItemClass: 'w-2/4',
          label: '企业标识',
          rules: [
            { required: true, message: '请输入企业标识', trigger: 'blur' }
          ]
        },
        {
          fieldName: 'is_open',
          label: '是否启用',
          component: 'switch',
          value: false,
          componentProps: {
            activeColor: '#13ce66',
            inactiveColor: '#ff4949'
          }
        }
      ],
      formData: {
        app_key: '',
        app_secret: '',
        ent_sign: '',
        is_open: false
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
        const data = await this.$api.third.getDmcrmSetting()
        console.log(data, data.app_key)
        this.formData.app_key = data.app_key
        this.formData.app_secret = data.app_secret
        this.formData.ent_sign = data.ent_sign
        this.formData.is_open = data.is_open ? true : false
        this.loading = false
      } catch (error) {
        console.log(error)
        this.loading = false
      }
    },
    async handleSubmit(formData) {
      try {
        console.log(formData, '--')
        await this.$api.third.setDmcrmSetting(formData)
        this.$message.success('更新成功，重新登录后生效')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
