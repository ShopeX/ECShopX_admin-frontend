<template>
  <div class="bg-white h-full px-10 py-10 relative flex flex-col justify-center">
    <!-- form: {{ form }} -->
    <div>
      <div class="text-3xl font-bold mb-3">{{ systemTitle }}</div>
      <div class="text-sm text-muted-foreground">请输入您的帐户信息以开始管理您的项目</div>
    </div>

    <div class="mt-12">
      <LoginForm ref="formRef" />
    </div>

    <div class="mt-16">
      <el-button type="primary" class="w-full h-[40px]" :loading="loading" @click="handleLogin">
        登录
      </el-button>
    </div>

    <div class="absolute -bottom-0.5 left-0 w-full text-center text-sm text-muted-foreground">
      <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">{{ recoderNumber }}</a>
    </div>
  </div>
</template>

<script>
import { useForm } from '@/composables'
import Config from '@/config'
import { getSystemTitle } from '@/utils'

const [Form, FormApi] = useForm({
  formItems: [
    {
      component: 'Select',
      componentProps: {
        placeholder: '请输入用户名',
        options: [
          {
            label: '管理员',
            value: 'admin'
          },
          {
            label: '员工',
            value: 'staff'
          }
        ]
      },
      fieldName: 'loginType',
      value: 'admin'
    },
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
  labelWidth: '0',
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
      loading: false,
      recoderNumber: Config.recoder_number
    }
  },
  computed: {
    systemTitle: () => {
      return getSystemTitle()
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
          // agreement_id
        })
        if (token) {
          const tokenArray = token.split('.')
          const { menu_type } = JSON.parse(atob(tokenArray[1]))
          this.$store.commit('system/setVersionMode', { versionMode: menu_type })
          this.$store.commit('user/setToken', { token })
          this.$store.commit('user/setLoginType', { login_type: formData.loginType })
          this.$message.success('登录成功')
          const accessMenus = await this.$store.dispatch('user/fetchAccessMenus')
          console.log('accessMenus', accessMenus)
          await this.$store.dispatch('user/fetchAccountInfo')
          // this.$router.push('/')
          setTimeout(() => {
            if (accessMenus.length == 1 && accessMenus[0].url == '/activelicense') {
              window.location.href = '/activelicense'
            } else {
              window.location.href = '/'
            }
            // this.$router.push('/')
          }, 700)
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
