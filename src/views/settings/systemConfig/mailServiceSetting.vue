<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->
<template>
  <SpPage>
    <div v-loading="pageLoading">
      <SpFormPlus
        ref="form"
        v-model="form"
        :form-items="formItems"
        form-type="form"
        label-width="180px"
        :show-default-actions="false"
      />
      <div class="section-footer with-border content-center">
        <el-button v-loading="saving" type="primary" @click="onSubmit">
          {{ $t('0677a420.be5fbb') }}
        </el-button>
      </div>
    </div>
  </SpPage>
</template>

<script>
import { getMailSetting, saveMailSetting } from '@/api/mail'
import { validEmail } from '@/utils/validate'

/** 与 API-会员注册登录-邮箱通道.md §5.3 / §5.4 字段一致 */
const emptyForm = () => ({
  EMAIL_SMTP_PORT: '',
  EMAIL_RELAY_HOST: '',
  EMAIL_SENDER: '',
  EMAIL_USER: '',
  EMAIL_PASSWORD: '',
  EMAIL_ACTIVATION_H5_DOMAIN: '',
  EMAIL_ACTIVATION_PC_DOMAIN: ''
})

const ACTIVATION_DOMAIN_MAX = 512

export default {
  name: 'MailServiceSetting',
  data() {
    return {
      pageLoading: false,
      saving: false,
      form: emptyForm()
    }
  },
  computed: {
    formItems() {
      const vm = this

      const validateSenderFormat = (rule, value, callback) => {
        if (value && !validEmail(String(value).trim())) {
          callback(new Error(vm.$t('0677a420.f02628')))
        } else {
          callback()
        }
      }

      const domainInputProps = (placeholderKey) => ({
        placeholder: vm.$t(placeholderKey),
        clearable: true,
        maxlength: ACTIVATION_DOMAIN_MAX,
        'show-word-limit': true,
        style: { width: '420px' }
      })

      return [
        {
          fieldName: 'EMAIL_SMTP_PORT',
          label: vm.$t('0677a420.fdcadf'),
          component: 'input',
          componentProps: {
            placeholder: vm.$t('0677a420.6076bf'),
            clearable: true,
            style: { width: '420px' }
          },
          rules: [{ required: true, message: vm.$t('0677a420.6076bf'), trigger: 'blur' }]
        },
        {
          fieldName: 'EMAIL_RELAY_HOST',
          label: vm.$t('0677a420.114c66'),
          component: 'input',
          componentProps: {
            placeholder: vm.$t('0677a420.13e53b'),
            clearable: true,
            style: { width: '420px' }
          },
          rules: [{ required: true, message: vm.$t('0677a420.13e53b'), trigger: 'blur' }]
        },
        {
          fieldName: 'EMAIL_SENDER',
          label: vm.$t('0677a420.b9d830'),
          component: 'input',
          componentProps: {
            placeholder: vm.$t('0677a420.6eb7a0'),
            clearable: true,
            style: { width: '420px' }
          },
          rules: [
            { required: true, message: vm.$t('0677a420.6eb7a0'), trigger: 'blur' },
            { validator: validateSenderFormat, trigger: 'blur' }
          ]
        },
        {
          fieldName: 'EMAIL_USER',
          label: vm.$t('0677a420.e2df57'),
          component: 'input',
          componentProps: {
            placeholder: vm.$t('0677a420.999f45'),
            clearable: true,
            style: { width: '420px' }
          },
          rules: [{ required: true, message: vm.$t('0677a420.999f45'), trigger: 'blur' }]
        },
        {
          fieldName: 'EMAIL_PASSWORD',
          label: vm.$t('0677a420.42c048'),
          component: 'input',
          componentProps: {
            type: 'password',
            'show-password': true,
            autocomplete: 'new-password',
            placeholder: vm.$t('0677a420.82b7ed'),
            clearable: true,
            style: { width: '420px' }
          }
        },
        {
          fieldName: 'EMAIL_ACTIVATION_H5_DOMAIN',
          label: vm.$t('0677a420.a4e76a'),
          component: 'input',
          componentProps: domainInputProps('0677a420.cbd9b8')
        }
        /* PC 邮箱激活根地址（暂不开放编辑，恢复时取消注释并恢复 mailSettingPayload 内同字段提交）
        ,
        {
          fieldName: 'EMAIL_ACTIVATION_PC_DOMAIN',
          label: vm.$t('0677a420.41d4a7'),
          component: 'input',
          componentProps: domainInputProps('0677a420.b5c545')
        }
        */
      ]
    }
  },
  mounted() {
    this.loadConfig()
  },
  methods: {
    strField(d, key, legacyKey) {
      let v = d[key]
      if ((v == null || v === '') && legacyKey && d[legacyKey] != null) {
        v = d[legacyKey]
      }
      return v != null ? String(v) : ''
    },
    normalizePayload(raw) {
      const d = raw && typeof raw === 'object' ? raw : {}
      return {
        EMAIL_SMTP_PORT: this.strField(d, 'EMAIL_SMTP_PORT'),
        EMAIL_RELAY_HOST: this.strField(d, 'EMAIL_RELAY_HOST'),
        EMAIL_SENDER: this.strField(d, 'EMAIL_SENDER'),
        EMAIL_USER: this.strField(d, 'EMAIL_USER'),
        EMAIL_PASSWORD: this.strField(d, 'EMAIL_PASSWORD'),
        EMAIL_ACTIVATION_H5_DOMAIN: this.strField(
          d,
          'EMAIL_ACTIVATION_H5_DOMAIN',
          'EMAIL_H5_ACTIVATE_DOMAIN'
        ),
        EMAIL_ACTIVATION_PC_DOMAIN: this.strField(d, 'EMAIL_ACTIVATION_PC_DOMAIN')
      }
    },
    mailSettingPayload() {
      const f = this.form
      return {
        EMAIL_SMTP_PORT: f.EMAIL_SMTP_PORT,
        EMAIL_RELAY_HOST: f.EMAIL_RELAY_HOST,
        EMAIL_SENDER: f.EMAIL_SENDER,
        EMAIL_USER: f.EMAIL_USER,
        EMAIL_PASSWORD: f.EMAIL_PASSWORD != null ? String(f.EMAIL_PASSWORD) : '',
        EMAIL_ACTIVATION_H5_DOMAIN:
          f.EMAIL_ACTIVATION_H5_DOMAIN != null ? String(f.EMAIL_ACTIVATION_H5_DOMAIN) : ''
        // EMAIL_ACTIVATION_PC_DOMAIN：输入框已注释，不传以保留 Redis 原值（见接口文档选填规则）
      }
    },
    loadConfig() {
      this.pageLoading = true
      getMailSetting()
        .then((res) => {
          const inner = res?.data?.data != null ? res.data.data : res?.data
          this.form = this.normalizePayload(inner)
        })
        .catch(() => {})
        .finally(() => {
          this.pageLoading = false
        })
    },
    async onSubmit() {
      try {
        await this.$refs.form.validate()
        this.saving = true
        await saveMailSetting(this.mailSettingPayload())
        this.$message.success(this.$t('0677a420.3b1083'))
        this.loadConfig()
      } catch (error) {
        // 校验失败或接口错误（接口错误由 request 拦截器提示）
      } finally {
        this.saving = false
      }
    }
  }
}
</script>
