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
  </div>
</template>
<script>
import { BSPAY_PAYMENT_CHANNELS } from '@/consts/bspay'

export default {
  data() {
    return {
      form: {
        sys_id: '',
        product_id: '',
        upper_huifu_id: '',
        rsa_merch_private_key: '',
        rsa_huifu_public_key: '',
        pay_channel: [],
        wxpay_fee_type: 'online',
        wx_pub_online: '',
        // wx_pub_offline: '',
        wx_lite_online: '',
        wx_lite_offline: '',
        wx_qr_online: '',
        // wx_scan: '',
        alipay_fee_type: 'online',
        alipay_qr_online: '',
        // alipay_qr_offline: '',
        // alipay_scan: '',
        // alipay_lite_online: '',
        // alipay_lite_offline: '',
        alipay_call: '',
        // ali_pub_off_b2b: '',
        // ali_pub_online_b2b: '',
        admin_token_no: '',
        is_open: false
      },
      formList: [],
      publicKeyDialog: false,
      publicKeyDialogForm: {
        rsa_public_key: ''
      },
      publicKeyDialogFormList: []
    }
  },
  computed: {
    payChannelOptions() {
      const t = this.$t
      const keys = {
        wx_lite: '3c22fe4e.bffe28',
        wx_pub: '3c22fe4e.f661cb',
        wx_qr: '3c22fe4e.777d5d',
        alipay_wap: '3c22fe4e.e3b206',
        alipay_qr: '3c22fe4e.bd7030'
      }
      return BSPAY_PAYMENT_CHANNELS.map((c) => ({ name: t(keys[c.label]), label: c.label }))
    },
    formListComputed() {
      const t = this.$t
      return [
        { label: t('3c22fe4e.b6453a'), type: 'group' },
        {
          label: 'sys_id',
          key: 'sys_id',
          type: 'input',
          required: true,
          inline: true,
          width: '960px'
        },
        {
          label: 'product_id',
          key: 'product_id',
          type: 'input',
          required: true,
          inline: true,
          width: '960px'
        },
        {
          label: t('3c22fe4e.00096b'),
          key: 'rsa_merch_private_key',
          required: true,
          type: 'textarea',
          inline: true,
          width: '960px'
        },
        {
          label: t('3c22fe4e.895807'),
          key: 'rsa_huifu_public_key',
          required: true,
          type: 'textarea',
          inline: true,
          width: '960px'
        },
        {
          label: t('3c22fe4e.3a4fb2'),
          key: 'admin_token_no',
          type: 'input',
          inline: true,
          width: '480px',
          placeholder: t('3c22fe4e.5d72c5')
        },
        { label: t('3c22fe4e.f302e6'), type: 'group' },
        {
          label: t('3c22fe4e.13022b'),
          key: 'pay_channel',
          type: 'checkbox',
          options: this.payChannelOptions
        },
        { label: t('3c22fe4e.49df01'), type: 'group' },
        {
          label: t('3c22fe4e.9a02d9'),
          key: 'wxpay_fee_type',
          type: 'radio',
          options: [{ name: t('3c22fe4e.d47e15'), label: 'online' }]
        },
        {
          label: t('3c22fe4e.bec272'),
          key: 'wx_lite_online',
          type: 'input',
          inline: true,
          width: '480px',
          placeholder: t('3c22fe4e.6cd5f1')
        },
        {
          label: t('3c22fe4e.15dd13'),
          key: 'wx_pub_online',
          type: 'input',
          inline: true,
          width: '480px',
          placeholder: t('3c22fe4e.6cd5f1')
        },
        {
          label: t('3c22fe4e.a77c98'),
          key: 'wx_qr_online',
          type: 'input',
          inline: true,
          width: '480px',
          placeholder: t('3c22fe4e.6cd5f1')
        },
        {
          label: t('3c22fe4e.ede962'),
          key: 'alipay_fee_type',
          type: 'radio',
          options: [{ name: t('3c22fe4e.d47e15'), label: 'online' }]
        },
        {
          label: t('3c22fe4e.c433c1'),
          key: 'alipay_call',
          type: 'input',
          inline: true,
          width: '480px',
          placeholder: t('3c22fe4e.6cd5f1')
        },
        {
          label: t('3c22fe4e.bb71ae'),
          key: 'alipay_qr_online',
          type: 'input',
          inline: true,
          width: '480px',
          placeholder: t('3c22fe4e.6cd5f1')
        },
        { label: t('3c22fe4e.53c3dd'), key: 'is_open', type: 'switch' }
      ]
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    async onSaveConfig() {
      const { status } = await this.$api.trade.setPaymentSetting({
        ...this.form,
        pay_type: 'bspay'
      })
      if (status) {
        this.$message.success(this.$t('3c22fe4e.3b1083'))
      } else {
        this.$message.error(this.$t('3c22fe4e.6de920'))
      }
    },
    async onSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { status } = await this.$api.trade.setPaymentSetting({
            ...this.form,
            pay_type: 'bspay'
          })
          if (status) {
            this.$message.success(this.$t('3c22fe4e.3b1083'))
            this.getConfig()
          } else {
            this.$message.error(this.$t('3c22fe4e.6de920'))
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async getConfig() {
      const res = await this.$api.trade.getPaymentSetting({ pay_type: 'bspay' })
      Object.keys(res).forEach((key) => {
        if (typeof this.form[key]) {
          this.form[key] = res[key]
        }
      })
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
