<template>
  <div class="h-full flex w-full relative">
    <!-- 头部logo和应用名称 -->
    <div class="absolute top-0 left-0 flex items-center gap-2 px-4 py-4">
      <SpImage :src="logo" height="30" fit="contain" />
      <p class="text-2xl">{{ systemTitle }}</p>
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
import AuthForm from './auth-form.vue'
export default {
  name: 'Auth',
  components: {
    AuthForm
  },
  data() {
    return {}
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
