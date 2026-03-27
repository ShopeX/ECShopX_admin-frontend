<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="change-password-form">
    <SpFormPlus
      ref="changePasswordForm"
      v-model="formData"
      form-type="normalForm"
      :form-items="formItems"
      label-width="100px"
      :show-default-actions="false"
    />
  </div>
</template>

<script>
import { i18n } from '@/i18n'

export default {
  data() {
    return {
      formData: {
        newPassword: '',
        confirmPassword: ''
      },
      showPassword: false,
      showConfirmPassword: false
    }
  },
  computed: {
    formItems() {
      return [
        {
          fieldName: 'newPassword',
          formItemClass: 'w-2/3',
          label: i18n.t('a70b3bb4.7fc88a'),
          component: ({ value, onInput }) => {
            return (
              <el-input
                v-model={value}
                type={this.showPassword ? 'text' : 'password'}
                placeholder={i18n.t('a70b3bb4.abdd7e')}
                on-input={onInput}
              >
                <div
                  slot='suffix'
                  class='h-full w-[25px] flex items-center justify-center'
                  on-click={() => {
                    this.showPassword = !this.showPassword
                  }}
                >
                  <SpIcon name={this.showPassword ? 'preview-open' : 'preview-close'} size='16' />
                </div>
              </el-input>
            )
          },
          rules: [
            { required: true, message: i18n.t('a70b3bb4.abdd7e'), trigger: 'blur' },
            { min: 6, message: i18n.t('a70b3bb4.b12b49'), trigger: 'blur' }
          ]
        },
        {
          component: ({ value, onInput }) => {
            return (
              <el-input
                v-model={value}
                type={this.showConfirmPassword ? 'text' : 'password'}
                placeholder={i18n.t('a70b3bb4.a7a9a2')}
                on-input={onInput}
              >
                <div
                  slot='suffix'
                  class='h-full w-[25px] flex items-center justify-center'
                  on-click={() => {
                    this.showConfirmPassword = !this.showConfirmPassword
                  }}
                >
                  <SpIcon
                    name={this.showConfirmPassword ? 'preview-open' : 'preview-close'}
                    size='16'
                  />
                </div>
              </el-input>
            )
          },
          fieldName: 'confirmPassword',
          formItemClass: 'w-2/3',
          label: i18n.t('a70b3bb4.3fbdde'),
          rules: [
            {
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error(i18n.t('a70b3bb4.a7a9a2')))
                  return
                } else if (value !== this.formData.newPassword) {
                  callback(new Error(i18n.t('a70b3bb4.6046d6')))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ]
        }
      ]
    }
  },
  methods: {
    async validate() {
      // 暴露给layout-header弹框
      await this.$refs.changePasswordForm.validate()
    },
    async getFieldsValue() {
      // 暴露给layout-header弹框
      return this.$refs.changePasswordForm.getFieldsValue()
    },
    async onSubmit() {
      // 暴露给layout-header弹框
      try {
        await this.$refs.changePasswordForm.handleSubmit()
        await this.handleSubmit(this.formData)
      } catch (error) {
        throw new Error(error)
      }
    },
    async handleSubmit(formData) {
      try {
        await this.$api.login.updateAdminInfo({
          pwd: formData.newPassword,
          repwd: formData.confirmPassword
        })
        this.$message.success(i18n.t('a70b3bb4.0259a1'))
      } catch (error) {
        throw new Error(i18n.t('a70b3bb4.e0cd5c'))
      }
    }
  }
}
</script>
