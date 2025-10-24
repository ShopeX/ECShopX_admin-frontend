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
                clearable
                on-input={onInput}
              >
                <i
                  slot='suffix'
                  on-click={() => {
                    this.showPassword = !this.showPassword
                  }}
                  class={[
                    'el-input__icon',
                    this.showPassword ? 'el-icon-view-off' : 'el-icon-view'
                  ]}
                />
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
                clearable
                on-input={onInput}
              >
                <i
                  slot='suffix'
                  on-click={() => {
                    this.showConfirmPassword = !this.showConfirmPassword
                  }}
                  class={[
                    'el-input__icon',
                    this.showConfirmPassword ? 'el-icon-view-off' : 'el-icon-view'
                  ]}
                />
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
    async validate() { // 暴露给layout-header弹框
      await this.$refs.changePasswordForm.validate()
    },
    async getFieldsValue() { // 暴露给layout-header弹框
      return this.$refs.changePasswordForm.getFieldsValue()
    },
    async onSubmit() { // 暴露给layout-header弹框
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
