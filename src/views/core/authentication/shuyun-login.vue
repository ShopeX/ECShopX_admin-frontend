<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="bg-white h-full px-10 py-10 relative flex flex-col justify-center">
    <div v-loading="true" />
  </div>
</template>

<script>
import { decodeJwtPayload, resolveAppPath } from '@/utils'
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
        this.$message.error(this.$t('c97126a1.bf6e3f'))
        return
      }
      this.handleLogin()
    },
    async handleLogin() {
      try {
        const { token } = await this.$api.auth.shunyunLogin({ code: this.code })
        if (token) {
          const { menu_type } = decodeJwtPayload(token)
          this.$store.commit('system/setVersionMode', { versionMode: menu_type })
          this.$store.commit('user/setToken', { token })
          this.$store.commit('user/setLoginType', { login_type: 'admin' })
          this.$message.success(this.$t('24b2720c.71fa3b'))
          await this.$store.dispatch('user/fetchAccessMenus')
          await this.$store.dispatch('user/fetchAccountInfo')
          setTimeout(() => {
            window.location.href = resolveAppPath('/')
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
