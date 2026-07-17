<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage :title="$t('42c71eaf.1d2582')">
    <template slot="page-footer">
      <div class="text-center">
        <el-button type="primary" :loading="loading" @click="onSubmit">{{
          $t('42c71eaf.be5fbb')
        }}</el-button>
      </div>
    </template>
    <Form class="mx-4" />
  </SpPage>
</template>

<script>
import { i18n } from '@/i18n'
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
      label: i18n.t('42c71eaf.73a7f4')
    },
    {
      component: 'ImagePicker',
      componentProps: IMAGE_PICKER_PROPS,
      fieldName: 'logo_light',
      label: i18n.t('42c71eaf.02f5fe')
    },
    {
      component: 'ImagePicker',
      componentProps: IMAGE_PICKER_PROPS,
      fieldName: 'logo_dark',
      label: i18n.t('42c71eaf.e22e6e')
    },
    {
      component: 'Divider',
      fieldName: 'divider_login',
      label: i18n.t('42c71eaf.7de289')
    },
    {
      component: 'ImagePicker',
      componentProps: IMAGE_PICKER_PROPS,
      fieldName: 'login_background',
      label: i18n.t('42c71eaf.543aa6')
    },
    {
      component: 'Divider',
      fieldName: 'divider_seo',
      label: i18n.t('42c71eaf.1efa53')
    },
    {
      component: 'Input',
      fieldName: 'title',
      label: i18n.t('42c71eaf.276aff')
    },
    {
      component: 'Input',
      fieldName: 'mate_description',
      label: i18n.t('42c71eaf.fefb77')
    },
    {
      component: 'Textarea',
      componentProps: {
        rows: 3
      },
      fieldName: 'mate_keywords',
      label: i18n.t('42c71eaf.9699a5'),
      tip: i18n.t('42c71eaf.7dfe5d')
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
        this.$message.success(this.$t('42c71eaf.3b1083'))
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
