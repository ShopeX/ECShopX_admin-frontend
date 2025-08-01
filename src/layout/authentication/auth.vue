<template>
  <div class="h-full flex w-full relative">
    <!-- 头部logo和应用名称 -->
    <div class="absolute top-0 left-0 flex items-center gap-2 px-4 py-4">
      <SpImage :src="logo" height="30" fit="contain" />
    </div>

    <div class="absolute top-4 right-10 px-4 z-20 flex items-center gap-1">
      <SpLanguage>
        <span class="text-sm ml-1">{{ currentLang }}</span>
      </SpLanguage>
    </div>

    <!-- 系统介绍 -->
    <div class="flex-1">
      <div class="login-background" :style="loginBackGroundStyle" />
    </div>

    <!-- 登录 -->
    <AuthForm class="w-[34%]" />
  </div>
</template>

<script>
import DEFAULT_CONFIG from '@/config'
import i18n from '@/i18n'
import AuthForm from './auth-form.vue'
export default {
  name: 'Auth',
  components: {
    AuthForm
  },
  data() {
    return {
      currentLang: ''
    }
  },
  computed: {
    logo: () => {
      return require(`@/assets/images/${DEFAULT_CONFIG.logo}`)
    },
    systemTitle: () => {
      return DEFAULT_CONFIG.systemTitle
    },
    loginBackGroundStyle: () => {
      return {
        'background-image': `url(${require(`@/assets/images/${DEFAULT_CONFIG.loginBackground}`)})`,
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
