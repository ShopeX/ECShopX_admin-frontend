<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="h-full w-full relative" :style="loginBackGroundStyle">
    <!-- 头部logo和应用名称 -->

    <div
      class="w-[530px] mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      <div class="mb-4 flex items-center justify-end">
        <SpLanguage>
          <span class="text-[13px] ml-1">{{ currentLang }}</span>
        </SpLanguage>
      </div>

      <AuthForm />

      <div class="mt-8">
        <LicenseLogo />
      </div>
    </div>
    <!-- 登录 -->
  </div>
</template>

<script>
import DEFAULT_CONFIG from '@/config'
import i18n from '@/i18n'
import AuthForm from './auth-form.vue'
import LicenseLogo from '@/layout/basic/components/license-logo'
export default {
  name: 'Auth',
  components: {
    AuthForm,
    LicenseLogo
  },
  data() {
    return {
      currentLang: '',
      isYD:process.env.VUE_APP_PLATFORM == 'yd'
    }
  },
  methods: {},
  computed: {
    logo: () => {
      return require(`@/assets/images/${DEFAULT_CONFIG.logo}`)
    },
    systemTitle: () => {
      return DEFAULT_CONFIG.systemTitle
    },
    loginBackGroundStyle: () => {
      return {
        'background-image': `url(/images/${DEFAULT_CONFIG.loginBackground})`,
        height: '100%',
        'background-size': 'cover',
        'background-position': 'center'
      }
    }
  },
  mounted() {
    this.currentLang = i18n[this.$store.state.system.lang]
  }
}
</script>

<style lang="scss" scoped>
.login-background {
  // background: linear-gradient(154deg, #07070915 30%, hsl(var(--primary) / 30%) 48%, #07070915 64%);
  // filter: blur(100px);
  // height: 100%;
}
</style>
