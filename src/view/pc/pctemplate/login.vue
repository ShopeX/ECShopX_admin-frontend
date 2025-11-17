<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
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
