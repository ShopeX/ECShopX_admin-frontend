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
  <div class="main">
    <div v-loading="true" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { unescape } from '@/utils'
export default {
  data() {
    return {
      code: '',
      loginFrom: '',
      loginType: ''
    }
  },
  mounted() {
    this.init()
    this.shunyunLogin()
  },
  methods: {
    ...mapMutations([
      'SET_TOKEN',
      'SET_TOKEN_EXP',
      'SET_USERINFO',
      'SET_LOGIN_TYPE',
      'SET_LOGIN_FROM',
      'SET_VERSION_MODE'
    ]),
    init() {
      let { code } = this.$route.query
      this.code = code
      this.loginType = this.$route.meta.type
      this.loginFrom = this.$route.meta.from
      this.$store.dispatch('setLoginFrom', this.loginFrom)
      if (this.loginType) {
        this.$store.dispatch('setLoginType', this.loginType)
      }
    },
    async shunyunLogin() {
      if (!this.code) {
        this.$message({
          message: '登录失败，缺失code！',
          type: 'error',
          duration: 3 * 1000
        })
        return
      }

      try {
        const { token } = await this.$api.auth.shunyunLogin({ code: this.code })
        if (token) {
          this.loginSuccess(token)
        } else {
          this.$message({
            message: '登录失败，请联系管理员',
            type: 'error',
            duration: 3 * 1000
          })
        }
      } catch (e) {
        console.error(e)
        if (e.data.data.code == 400401) {
          this.getAgreementContent()
        }
      }
    },
    async loginSuccess(token) {
      this.SET_TOKEN({ token })
      this.SET_TOKEN_EXP({ exp: new Date().getTime() })
      this.SET_LOGIN_FROM({ loginFrom: this.loginFrom })
      this.$message({
        message: '登录成功',
        type: 'success'
      })
      const userInfo = await this.$api.login.getAdminInfo()
      let base64Url = token.split('.')[1]
      // const { menu_type } = await this.$api.wechat.getAuthorizerInfo()
      const { menu_type } = JSON.parse(atob(base64Url))
      console.log('menu_type', menu_type)
      this.SET_USERINFO(userInfo)
      // this.SET_VERSION_MODE(menu_type)
      this.SET_VERSION_MODE('shuyun')
      this.SET_LOGIN_TYPE({ loginType: this.loginType || userInfo.logintype })
      if (this.loginType == 'distributor') {
        this.$router.push({ path: '/shopadmin/shoplist' })
      } else if (this.loginType == 'dealer') {
        const isShow = localStorage.getItem('dealer_isShow')
        if (isShow) {
          this.$router.push({
            path: '/dealer/adapay_member/info'
          })
          return
        }
        this.$router.push({ path: '/dealer/index' })
      } else if (this.loginType == 'merchant') {
        this.$router.push({ path: '/merchant' })
      } else {
        window.location.href = '/'
      }
    },
    async getAgreementContent() {
      const { agreement_id, content } = await this.$api.auth.getAgreementContent()
      this.agreementId = agreement_id
      this.agreementContent = unescape(content)
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  height: 500px;
  width: 100%;
  margin-top: 250px;
}
</style>
