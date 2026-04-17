<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage :title="$t('fe5e608b.2efe2e')">
    <template slot="page-footer">
      <div class="text-center">
        <el-button type="primary" :loading="loading" @click="onSubmit">
          {{ $t('fe5e608b.be5fbb') }}
        </el-button>
      </div>
    </template>
    <Form />
  </SpPage>
</template>

<script>
import { useForm } from '@/composables'
import { i18n } from '@/i18n'

const [Form, FormApi] = useForm({
  formItems: [
    {
      component: 'ImagePicker',
      componentProps: {
        size: 'small'
      },
      fieldName: 'logo',
      label: i18n.t('fe5e608b.8c53d5')
    },
    {
      component: 'ImagePicker',
      componentProps: {
        size: 'small'
      },
      fieldName: 'background',
      label: i18n.t('fe5e608b.543aa6')
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
      this.$message.success(this.$t('fe5e608b.fbd249'))
      this.loading = false
    }
  }
}
</script>

<style lang="scss"></style>
