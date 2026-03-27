<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="page-login bg-white relative flex flex-col justify-center">
    <div>
      <img src="/images/logo.png" alt="logo" width="300">
      <!-- <div class="text-[14px] mt-2 ml-2 text-[#BЗBЗB3]">总部</div> -->
      <!-- If you remove or alter Shopex brand identifiers, you must obtain a branding removal license from Shopex.  Contact us at:  http://www.shopex.cn to purchase a branding removal license.   -->
      <div class="text-[28px] font-helvca mt-8 ml-2 text-[#333]">{{ $t('24b2720c.7d1eb0') }}</div>
    </div>

    <div class="mt-8 ml-2">
      <LoginForm ref="formRef" />
    </div>

    <div class="mt-8 text-right">
      <el-button
        round
        class="h-[50px] !bg-black !text-white"
        :loading="loading"
        @click="handleLogin"
      >
        {{ $t('24b2720c.402d19') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { useForm } from '@/composables'
import Config from '@/config'
import { getSystemTitle } from '@/utils'
import { i18n } from '@/i18n'

const [Form, FormApi] = useForm({
  formItems: [
    {
      label: i18n.t('24b2720c.819767'),
      component: 'Input',
      componentProps: {
        placeholder: i18n.t('24b2720c.08b1fa')
      },
      fieldName: 'account',
      rules: [{ required: true, message: i18n.t('24b2720c.08b1fa') }]
    },
    {
      label: i18n.t('24b2720c.a81052'),
      component: 'Input',
      componentProps: {
        type: 'password',
        placeholder: i18n.t('24b2720c.a81052')
      },
      fieldName: 'pwd',
      rules: [{ required: true, message: i18n.t('24b2720c.e39ffe') }]
    },
    {
      label: i18n.t('24b2720c.464f3d'),
      component: 'Select',
      componentProps: {
        placeholder: i18n.t('24b2720c.08b1fa'),
        options: [
          {
            label: i18n.t('24b2720c.b1dae9'),
            value: 'admin'
          },
          {
            label: i18n.t('24b2720c.2ed392'),
            value: 'staff'
          }
        ]
      },
      fieldName: 'loginType',
      value: 'admin'
    }
  ],
  hideFieldRequiredMark: true,
  showDefaultActions: false,
  labelInline: true
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
      await this.formApi.validate()
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
          this.$message.success(this.$t('24b2720c.71fa3b'))
          const accessMenus = await this.$store.dispatch('user/fetchAccessMenus')
          console.log('accessMenus', accessMenus)
          await this.$store.dispatch('user/fetchAccountInfo')
          // this.$router.push('/')
          setTimeout(() => {
            if (accessMenus.length == 1 && accessMenus[0].url == '/activelicense') {
              window.location.href = '/activelicense'
            } else if (accessMenus.length == 1 && accessMenus[0].url == '/login') {
              window.location.href = '/login'
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
      this.$message.error(this.$t('24b2720c.653132'))
    },
    handleReset() {
      this.$message.info(this.$t('24b2720c.a865cc'))
    }
  }
}
</script>

<style lang="scss" scoped>
.page-login {
  ::v-deep .el-button {
    padding-left: 30px;
    padding-right: 30px;
    border-radius: 50px;
    font-size: 18px;
  }
  ::v-deep .el-input {
    border-radius: 0;
    border: 1px solid #333;
    input {
      border: none;
      border-radius: none;
    }
  }
  .font-helvca {
    font-family: helvitca;
  }
}
</style>
