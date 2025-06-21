<template>
  <div class="bg-white h-full px-10 py-10 relative flex flex-col justify-center">
    <!-- form: {{ form }} -->
    <div>
      <div class="text-3xl font-bold mb-3">店铺管理中心</div>
      <div class="text-sm text-muted-foreground">请输入您的帐户信息以开始管理您的项目</div>
    </div>

    <div class="mt-12">
      <LoginForm ref="formRef" />
    </div>

    <div class="mt-16">
      <el-button type="primary" class="w-full" :loading="loading" @click="handleLogin">
        登录
      </el-button>
    </div>

    <div class="absolute -bottom-0.5 left-0 w-full text-center text-sm text-muted-foreground">
      <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">沪ICP备05002918号</a>
    </div>
  </div>
</template>

<script>
import { useForm } from '@/composables'

const [Form, FormApi] = useForm({
  formItems: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户名'
      },
      fieldName: 'account',
      rules: [{ required: true, message: '请输入用户名' }]
    },
    {
      component: 'Input',
      componentProps: {
        type: 'password',
        placeholder: '密码'
      },
      fieldName: 'pwd',
      rules: [{ required: true, message: '请输入密码' }]
    }
  ],
  showDefaultActions: false
})

export default {
  name: 'Login',
  components: {
    LoginForm: Form
  },
  data() {
    return {
      formApi: FormApi,
      loading: false
    }
  },
  async mounted() {
    const { level } = await this.$api.login.getAuthorizeLeve()
    if (level === 'img_code') {
      await this.$api.login.getImageCode({ type: 'login' })
    }
  },
  methods: {
    async handleLogin() {
      const formData = this.formApi.getFieldsValue()
      this.loading = true
      try {
        const { token } = await this.$api.auth.login({
          username: formData.account,
          password: formData.pwd,
          logintype: formData.loginType
          // product_model: this.VUE_APP_PRODUCT_MODEL,
          // agreement_id
        })
        if (token) {
          this.$store.commit('user/setToken', { token })
          this.$message.success('登录成功')
          await this.$store.dispatch('user/fetchPermissions')
          debugger
          // this.$router.push('/')
        }
      } catch (error) {
        // console.error('登录失败:', error)
        // this.$message.error(error.message || '登录失败')
      } finally {
        this.loading = false
      }
    },
    handleError(error) {
      console.error('表单错误:', error)
      this.$message.error('表单验证失败，请检查输入')
    },
    handleReset() {
      console.log('表单重置')
      this.$message.info('表单已重置')
    }
  }
}
</script>

<style lang="scss" scoped></style>
