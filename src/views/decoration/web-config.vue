<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage title="商城全局配置">
    <template slot="page-footer">
      <div class="text-center">
        <el-button type="primary" :loading="loading" @click="onSubmit">保存</el-button>
      </div>
    </template>
    <Form class="mx-4" />
  </SpPage>
</template>

<script>
import { useForm } from '@/composables'

const IMAGE_PICKER_PROPS = {
  size: 'small'
}

const [Form, FormApi] = useForm({
  formType: 'displayForm',
  labelWidth: '120px',
  formItems: [
    {
      component: 'Divider',
      fieldName: 'divider_logo',
      label: '商城 Logo'
    },
    {
      component: 'ImagePicker',
      componentProps: IMAGE_PICKER_PROPS,
      fieldName: 'logo_light',
      label: '浅色 Logo'
    },
    {
      component: 'ImagePicker',
      componentProps: IMAGE_PICKER_PROPS,
      fieldName: 'logo_dark',
      label: '深色 Logo'
    },
    {
      component: 'Divider',
      fieldName: 'divider_login',
      label: '登录页'
    },
    {
      component: 'ImagePicker',
      componentProps: IMAGE_PICKER_PROPS,
      fieldName: 'login_background',
      label: '背景图'
    },
    {
      component: 'Divider',
      fieldName: 'divider_seo',
      label: 'SEO 配置'
    },
    {
      component: 'Input',
      fieldName: 'title',
      label: '网站标题'
    },
    {
      component: 'Input',
      fieldName: 'mate_description',
      label: '站点描述'
    },
    {
      component: 'Textarea',
      componentProps: {
        rows: 3
      },
      fieldName: 'mate_keywords',
      label: '关键词',
      tip: '多个关键词请使用英文逗号隔开'
    }
  ],
  showDefaultActions: false
})

export default {
  name: 'WebConfig',
  components: {
    Form
  },
  data() {
    return {
      loading: false
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true
      try {
        const [loginPageSetting = {}, tdkSetting = {}] = await Promise.all([
          this.$api.webtemplate.getLoginPageSetting(),
          this.$api.tdkset.getTdkglobalset()
        ])

        FormApi.setFieldsValue({
          logo_light: loginPageSetting.logo_light || '',
          logo_dark: loginPageSetting.logo_dark || '',
          login_background: loginPageSetting.background || '',
          title: tdkSetting.title || '',
          mate_description: tdkSetting.mate_description || '',
          mate_keywords: tdkSetting.mate_keywords || ''
        })
      } finally {
        this.loading = false
      }
    },
    async onSubmit() {
      this.loading = true
      try {
        const values = FormApi.getFieldsValue()
        await Promise.all([
          this.$api.webtemplate.saveLoginPageSetting({
            logo_light: values.logo_light,
            logo_dark: values.logo_dark,
            background: values.login_background
          }),
          this.$api.tdkset.saveTdkglobalset({
            title: values.title,
            mate_description: values.mate_description,
            mate_keywords: values.mate_keywords
          })
        ])
        this.$message.success('保存成功')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
