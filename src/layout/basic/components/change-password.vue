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
      :showDefaultActions="false"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        newPassword: '',
        confirmPassword: ''
      },
      showPassword: false,
      showConfirmPassword: false,
      formItems: [
        {
          fieldName: 'newPassword',
          formItemClass: 'w-2/3',
          label: '修改密码',
          component: ({ value, onInput }) => {
            return (
              <el-input
                v-model={value}
                type={this.showPassword ? 'text' : 'password'}
                placeholder='请输入新密码'
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
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
          ]
        },
        {
          component: ({ value, onInput }) => {
            return (
              <el-input
                v-model={value}
                type={this.showConfirmPassword ? 'text' : 'password'}
                placeholder='请输入确认密码'
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
          label: '确认密码',
          rules: [
            {
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error('请输入确认密码'))
                  return
                } else if (value !== this.formData.newPassword) {
                  callback(new Error('两次输入的密码不一致'))
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
        this.$message.success('密码修改成功，请重新登录')
      } catch (error) {
        throw new Error('密码修改失败')
      }
    }
  }
}
</script>
