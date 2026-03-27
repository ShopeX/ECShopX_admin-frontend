<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <template slot="page-footer">
      <div class="text-center">
        <el-button :loading="loading" type="primary" @click="onSubmit">
{{
          $t('fea687f2.be5fbb')
        }}
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
      component: ({ h, value, onInput }) => {
        return (
          <SpRichText
            value={value}
            onChange={(val) => {
              onInput(val)
            }}
          />
        )
      },
      fieldName: 'pc_privacy_content',
      label: i18n.t('fea687f2.aea08c'),
      value: ''
    },
    {
      component: ({ h, value, onInput }) => {
        return (
          <SpRichText
            value={value}
            onChange={(val) => {
              onInput(val)
            }}
          />
        )
      },
      fieldName: 'h5_privacy_content',
      label: i18n.t('fea687f2.ae004d'),
      value: ''
    }
  ],
  formType: 'displayForm',
  labelWidth: '150px',
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
    this.getConfig()
  },
  methods: {
    async getConfig() {
      this.loading = true
      try {
        const data = await this.$api.system.getWebPrivacyStatement()
        FormApi.setFieldsValue(data)
      } catch (error) {
        console.error('获取隐私声明配置失败:', error)
      } finally {
        this.loading = false
      }
    },
    async onSubmit() {
      try {
        await FormApi.validate()
        const formData = FormApi.getFieldsValue()
        this.loading = true
        await this.$api.system.saveWebPrivacyStatement(formData)
        this.$message({
          type: 'success',
          message: this.$t('fea687f2.3b1083')
        })
        this.loading = false
        this.getConfig()
      } catch (error) {
        if (error !== false) {
          this.$message({
            type: 'error',
            message: this.$t('fea687f2.6de920')
          })
        }
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
