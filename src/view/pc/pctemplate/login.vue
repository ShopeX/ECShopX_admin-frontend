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
  <SpPage title="登录页配置">
    <template slot="page-footer">
      <div class="text-center">
        <el-button type="primary" :loading="loading" @click="onSubmit"> 保存 </el-button>
      </div>
    </template>
    <Form />
  </SpPage>
</template>

<script>
import { useForm } from '@/composables'

const [Form, FormApi] = useForm({
  formItems: [
    {
      component: 'ImagePicker',
      componentProps: {
        size: 'small'
      },
      fieldName: 'logo',
      label: '商城Logo'
    },
    {
      component: 'ImagePicker',
      componentProps: {
        size: 'small'
      },
      fieldName: 'background',
      label: '背景图'
    }
  ],
  showDefaultActions: false
})

export default {
  components: {
    Form
  },
  data() {
    return {
      loading: false
    }
  },
  mounted() {
    this.getLoginPageSetting()
  },
  methods: {
    async getLoginPageSetting() {
      const res = await this.$api.webtemplate.getLoginPageSetting()
      FormApi.setFieldsValue({
        logo: res.logo,
        background: res.background
      })
    },
    async onSubmit() {
      this.loading = true
      const params = FormApi.getFieldsValue()
      await this.$api.webtemplate.saveLoginPageSetting(params)
      this.$message.success('保存成功！')
      this.loading = false
    }
  }
}
</script>

<style lang="scss"></style>
