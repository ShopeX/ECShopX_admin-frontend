<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="bg-white relative flex flex-col justify-center">
    <div>
      <img :src="logoSrc" alt="logo" width="300" />
      <div class="text-[14px] mt-2 ml-2 text-[#BЗBЗB3]">{{ $t('65ffe27b.14f5bc') }}</div>
      <div class="text-[28px] font-helvca mt-8 ml-2 text-[#333]">{{ $t('24b2720c.7d1eb0') }}</div>
    </div>

    <div class="mt-8 ml-2">
      <LoginForm ref="formRef" />
    </div>

    <div class="mt-8 text-right">
      <el-button
        round
        class="h-[40px] rounded-[16px] !bg-black !text-white"
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
import { decodeJwtPayload, getSystemTitle, resolveAppPath, resolvePublicAsset } from '@/utils'

const [Form, FormApi] = useForm({
  formItems: [
    {
      label: '用户名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户名'
      },
      fieldName: 'account',
      rules: [{ required: true, message: '请输入用户名' }]
    },
    {
      label: '密码',
      component: 'Input',
      componentProps: {
        type: 'password',
        placeholder: '密码'
      },
      fieldName: 'pwd',
      rules: [{ required: true, message: '请输入密码' }]
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
      recoderNumber: Config.recoder_number,
      logoSrc: resolvePublicAsset('images/logo.png')
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
          logintype: 'supplier'
          // agreement_id
        })
        if (token) {
          const { menu_type } = decodeJwtPayload(token)
          this.$store.commit('system/setVersionMode', { versionMode: menu_type })
          this.$store.commit('user/setToken', { token })
          this.$store.commit('user/setLoginType', { login_type: 'supplier' })
          this.$message.success(this.$t('24b2720c.71fa3b'))
          await this.$store.dispatch('user/fetchAccessMenus')
          await this.$store.dispatch('user/fetchAccountInfo')
          setTimeout(() => {
            window.location.href = resolveAppPath('/supplier')
          }, 700)
        }
      } catch (error) {
        console.error('登录失败:', error)
        // this.$message.error(error.message || '登录失败')
      } finally {
        this.loading = false
      }
    },
    handleError(error) {
      this.$message.error(this.$t('24b2720c.653132'))
    },
    handleReset() {
      this.$message.info(this.$t('65ffe27b.a865cc'))
    }
  }
}
</script>

<style lang="scss" scoped></style>
