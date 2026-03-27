<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <SpForm
      v-model="form"
      label-width="220px"
      :form-list="formListComputed"
      @onSubmit="onSaveConfig"
    />

    <!-- 公钥查看 -->
    <SpDialog
      ref="publicKeyDialogRef"
      v-model="publicKeyDialog"
      :title="$t('08a0fd68.103592')"
      :modal="false"
      :form="publicKeyDialogForm"
      :form-list="publicKeyDialogFormListComputed"
      @onSubmit="onClose"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        app_id: '',
        test_api_key: '',
        live_api_key: '',
        rsa_private_key: '',
        pay_channel: [],
        wxpay_fee_type: 'online',
        wx_pub_online: '',
        wx_pub_offline: '',
        wx_lite_online: '',
        wx_lite_offline: '',
        wx_scan: '',
        alipay_fee_type: 'online',
        alipay_qr_online: '',
        alipay_qr_offline: '',
        alipay_scan: '',
        alipay_lite_online: '',
        alipay_lite_offline: '',
        alipay_call: '',
        ali_pub_off_b2b: '',
        ali_pub_online_b2b: '',
        is_open: false
      },
      publicKeyDialog: false,
      publicKeyDialogForm: {
        rsa_public_key: ''
      }
    }
  },
  computed: {
    formListComputed() {
      const t = this.$t
      return [
        { label: t('08a0fd68.b6453a'), type: 'group' },
        {
          label: 'App_ID',
          key: 'app_id',
          type: 'input',
          required: true,
          inline: true,
          width: '960px'
        },
        {
          label: t('08a0fd68.8c46a6'),
          key: 'test_api_key',
          type: 'input',
          required: true,
          inline: true,
          width: '960px'
        },
        {
          label: t('08a0fd68.291949'),
          key: 'live_api_key',
          type: 'input',
          required: true,
          inline: true,
          width: '960px'
        },
        {
          label: t('08a0fd68.d906ef'),
          key: 'rsa_private_key',
          component: ({ key }, value) => {
            return (
              <div>
                <el-input
                  type='textarea'
                  v-model={value[key]}
                  placeholder={this.$t('08a0fd68.a744fe')}
                  rows={4}
                />
                <el-button type='text' onClick={this.createKey}>
                  {this.$t('08a0fd68.89c478')}
                </el-button>
              </div>
            )
          },
          required: true,
          inline: true,
          width: '960px'
        },
        { label: t('08a0fd68.f302e6'), type: 'group' },
        {
          label: t('08a0fd68.13022b'),
          key: 'pay_channel',
          type: 'checkbox',
          options: [
            { name: t('08a0fd68.18796a'), label: 'wx_lite' },
            { name: t('08a0fd68.f661cb'), label: 'wx_pub' },
            { name: t('08a0fd68.5a3c52'), label: 'alipay_wap' },
            { name: t('08a0fd68.2da70b'), label: 'alipay' },
            { name: t('08a0fd68.6c03fb'), label: 'alipay_qr' }
          ]
        },
        { label: t('08a0fd68.49df01'), type: 'group' },
        {
          label: t('08a0fd68.9a02d9'),
          key: 'wxpay_fee_type',
          type: 'radio',
          options: [
            { name: t('08a0fd68.d47e15'), label: 'online' },
            { name: t('08a0fd68.257a74'), label: 'offline' }
          ]
        },
        {
          label: t('08a0fd68.50783c'),
          key: 'wx_pub_online',
          type: 'input',
          inline: true,
          width: '480px'
        },
        {
          label: t('08a0fd68.54e00e'),
          key: 'wx_pub_offline',
          type: 'input',
          inline: true,
          width: '480px'
        },
        {
          label: t('08a0fd68.6b4222'),
          key: 'wx_lite_online',
          type: 'input',
          inline: true,
          width: '480px'
        },
        {
          label: t('08a0fd68.c76587'),
          key: 'wx_lite_offline',
          type: 'input',
          inline: true,
          width: '480px'
        },
        {
          label: t('08a0fd68.1aa184'),
          key: 'wx_scan',
          type: 'input',
          inline: true,
          width: '960px'
        },
        {
          label: t('08a0fd68.ede962'),
          key: 'alipay_fee_type',
          type: 'radio',
          options: [
            { name: t('08a0fd68.d47e15'), label: 'online' },
            { name: t('08a0fd68.257a74'), label: 'offline' }
          ]
        },
        {
          label: t('08a0fd68.7f3db6'),
          key: 'alipay_qr_online',
          type: 'input',
          inline: true,
          width: '480px'
        },
        {
          label: t('08a0fd68.8c38f8'),
          key: 'alipay_qr_offline',
          type: 'input',
          inline: true,
          width: '480px'
        },
        {
          label: t('08a0fd68.5a60d4'),
          key: 'alipay_scan',
          type: 'input',
          inline: true,
          width: '480px'
        },
        {
          label: t('08a0fd68.09e8e3'),
          key: 'alipay_lite_online',
          type: 'input',
          inline: true,
          width: '480px'
        },
        {
          label: t('08a0fd68.f03d0d'),
          key: 'alipay_lite_offline',
          type: 'input',
          inline: true,
          width: '480px'
        },
        {
          label: t('08a0fd68.fd795e'),
          key: 'alipay_call',
          type: 'input',
          inline: true,
          width: '480px'
        },
        {
          label: t('08a0fd68.477b40'),
          key: 'ali_pub_off_b2b',
          type: 'input',
          inline: true,
          width: '480px'
        },
        {
          label: t('08a0fd68.777246'),
          key: 'ali_pub_online_b2b',
          type: 'input',
          inline: true,
          width: '480px'
        },
        { label: t('08a0fd68.53c3dd'), key: 'is_open', type: 'switch' }
      ]
    },
    publicKeyDialogFormListComputed() {
      return [
        {
          label: this.$t('08a0fd68.103592'),
          key: 'rsa_public_key',
          type: 'textarea',
          width: '480px'
        }
      ]
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    async onSaveConfig() {
      const { status } = await this.$api.adapay.postAdapayPaySetting({
        ...this.form,
        pay_type: 'adapay'
      })
      if (status) {
        this.$message.success(this.$t('08a0fd68.3b1083'))
      } else {
        this.$message.error(this.$t('08a0fd68.6de920'))
      }
    },
    async onSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { status } = await this.$api.adapay.postAdapayPaySetting({
            ...this.form,
            pay_type: 'adapay'
          })
          if (status) {
            this.$message.success(this.$t('08a0fd68.3b1083'))
            this.getConfig()
          } else {
            this.$message.error(this.$t('08a0fd68.6de920'))
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async getConfig() {
      const res = await this.$api.trade.getPaymentSetting({ pay_type: 'adapay' })
      Object.keys(res).forEach((key) => {
        if (typeof this.form[key]) {
          this.form[key] = res[key]
        }
      })
    },
    async createKey() {
      const { rsa_private_key, rsa_public_key } = await this.$api.adapay.createAdapayKey()
      this.form.rsa_private_key = rsa_private_key
      this.publicKeyDialogForm.rsa_public_key = rsa_public_key
      this.publicKeyDialog = true
    },
    onClose() {
      this.publicKeyDialog = false
    }
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 10px;
  .frm-tips {
    color: #ff0000;
  }
}
</style>
