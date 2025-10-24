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
  <div class="bg-white h-full px-10 py-10 relative flex flex-col justify-center">
    <div v-loading="true" />
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      code: ''
    }
  },
  async mounted() {
    this.init()
  },
  methods: {
    init() {
      let { code } = this.$route.query
      this.code = code
      if (!this.code) {
        this.$message.error('登录失败，缺失code！')
        return
      }
      this.handleLogin()
    },
    async handleLogin() {
      try {
        const { token } = await this.$api.auth.shunyunLogin({ code: this.code })
        if (token) {
          const tokenArray = token.split('.')
          const { menu_type } = JSON.parse(atob(tokenArray[1]))
          this.$store.commit('system/setVersionMode', { versionMode: menu_type })
          this.$store.commit('user/setToken', { token })
          this.$store.commit('user/setLoginType', { login_type: 'admin' })
          this.$message.success('登录成功')
          await this.$store.dispatch('user/fetchAccessMenus')
          await this.$store.dispatch('user/fetchAccountInfo')
          setTimeout(() => {
            window.location.href = '/'
          }, 700)
        }
      } catch (error) {
        // console.error('登录失败:', error)
        // this.$message.error(error.message || '登录失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
