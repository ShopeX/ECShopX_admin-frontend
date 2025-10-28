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
        const resp = await this.$api.third.getDmcrmSetting()
        this.form.app_key = resp.data.data.app_key
        this.form.app_secret = resp.data.data.app_secret
        this.form.ent_sign = resp.data.data.ent_sign
        this.form.is_open = resp.data.data.is_open ? true : false
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
