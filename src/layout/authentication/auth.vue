<template>
  <div class="h-full flex w-full relative">
    <div class="absolute">12</div>

    <!-- 头部logo和应用名称 -->
    <div class="absolute top-0 left-0 flex items-center gap-2 px-4 py-4">
      <SpImage
        src="https://unpkg.com/@vbenjs/static-source@0.1.7/source/logo-v1.webp"
        height="40"
        fit="contain"
      />
      <p class="text-2xl">B2B2C商城管理系统</p>
    </div>

    <!-- 系统介绍 -->
    <div class="flex-1">
      <div class="login-background">test</div>
    </div>

    <!-- 登录 -->
    <AuthForm class="w-[34%]" />
  </div>
</template>

<script>
import AuthForm from './auth-form.vue'
export default {
  name: 'Auth',
  components: {
    AuthForm
  }
}
</script>

<style lang="scss" scoped>
.login-background {
  background: linear-gradient(154deg, #07070915 30%, hsl(var(--primary) / 30%) 48%, #07070915 64%);
  filter: blur(100px);
}
</style>
