<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <SpPageHeader title="账号信息" />
    <SpForm
      ref="form"
      v-model="form"
      submit
      :form-list="formList"
      :reset-btn="false"
      submit-btn-text="保存"
      @onSubmit="onSubmit"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      changePwdEnabled: false,
      form: {
        mobile: '',
        username: '',
        head_portrait: '',
        pwd: '',
        repwd: ''
      },
      formList: [
        {
          label: '账户',
          key: 'mobile',
          type: 'text'
        },
        {
          label: '昵称',
          key: 'username',
          type: 'input'
        },
        {
          label: '头像',
          key: 'head_portrait',
          component: ({ key }, form) => {
            return <SpImagePicker v-model={form[key]} />
          }
        },
        {
          label: '修改密码',
          key: 'pwd',
          type: 'input',
          isShow: () => this.changePwdEnabled && !this.VERSION_SHUYUN()
        },
        {
          label: '确认密码',
          key: 'repwd',
          type: 'input',
          isShow: () => this.changePwdEnabled && !this.VERSION_SHUYUN()
        },
        {
          label: '修改密码',
          key: 'changePwd',
          type: 'button',
          component: () => {
            return (
              <el-link
                type="primary"
                href="https://account.shopex.cn/account/security"
                target="_blank"
              >
                商派账号中心
              </el-link>
            )
          },
          tip: '超级管理员需通过商派账号中心进行修改密码',
          isShow: () => !this.changePwdEnabled && !this.VERSION_SHUYUN()
        }
      ]
    }
  },
  mounted() {
    this.getAdminInfo()
  },
  methods: {
    async getAdminInfo() {
      const res = await this.$api.login.getAdminInfo()
      this.changePwdEnabled = res.logintype !== 'admin1'
      this.form.mobile = res.mobile
      this.form.username = res.username
      this.form.head_portrait = res.head_portrait
    },
    onSubmit() {
      console.log(this.form)
      const that = this
      this.$api.login.updateAdminInfo(this.form).then(response => {
        if (response.status) {
          this.$message({
            message: '更新成功',
            type: 'success',
            onClose() {
              that.$router.go(-1)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
