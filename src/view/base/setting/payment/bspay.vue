<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <div>
    <SpForm v-model="form" label-width="220px" :form-list="formList" @onSubmit="onSaveConfig" />
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
      formList: [
        {
          label: '基础配置',
          type: 'group'
        },
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
        // {
        //   label: '商户的汇付ID',
        //   key: 'upper_huifu_id',
        //   type: 'input',
        //   required: true,
        //   inline: true,
        //   width: '960px'
        // },
        {
          label: '商户私钥',
          key: 'rsa_merch_private_key',
          required: true,
          type: 'textarea',
          inline: true,
          width: '960px'
        },
        {
          label: '汇付公钥',
          key: 'rsa_huifu_public_key',
          required: true,
          type: 'textarea',
          inline: true,
          width: '960px'
        },
        {
          label: '绑卡序列号',
          key: 'admin_token_no',
          type: 'input',
          inline: true,
          width: '480px',
          placeholder: '请输入绑卡序列号'
        },
        {
          label: '支付渠道设置',
          type: 'group'
        },
        {
          label: '支付渠道',
          key: 'pay_channel',
          type: 'checkbox',
          options: BSPAY_PAYMENT_CHANNELS
        },
        {
          label: '费率设置',
          type: 'group'
        },
        {
          label: '微信渠道费率类型',
          key: 'wxpay_fee_type',
          type: 'radio',
          options: [
            { name: '标准费率线上', label: 'online' }
          ]
        },
        {
          label: '微信小程序支付费率',
          key: 'wx_lite_online',
          type: 'input',
          inline: true,
          width: '480px',
          placeholder: '请输入费率，如：0.26'
        },
        {
          label: '微信公众号支付费率',
          key: 'wx_pub_online',
          type: 'input',
          inline: true,
          width: '480px',
          placeholder: '请输入费率，如：0.26'
        },
        {
          label: '微信扫码支付费率',
          key: 'wx_qr_online',
          type: 'input',
          inline: true,
          width: '480px',
          placeholder: '请输入费率，如：0.26'
        },
        // {
        //   label: '微信小程序支付（线下）',
        //   key: 'wx_lite_offline',
        //   type: 'input',
        //   inline: true,
        //   width: '480px'
        // },
        // {
        //   label: '微信扫码支付（被扫-线下）',
        //   key: 'wx_scan',
        //   type: 'input',
        //   inline: true,
        //   width: '960px'
        // },
        {
          label: '支付宝渠道费率类型',
          key: 'alipay_fee_type',
          type: 'radio',
          options: [
            { name: '标准费率线上', label: 'online' }
          ]
        },
        {
          label: '支付宝支付费率',
          key: 'alipay_call',
          type: 'input',
          inline: true,
          width: '480px',
          placeholder: '请输入费率，如：0.26'
        },
        {
          label: '支付宝扫码支付费率',
          key: 'alipay_qr_online',
          type: 'input',
          inline: true,
          width: '480px',
          placeholder: '请输入费率，如：0.26'
        },
        {
          label: '是否启用',
          key: 'is_open',
          type: 'switch'
        }
      ],
      publicKeyDialog: false,
      publicKeyDialogForm: {
        rsa_public_key: ''
      },
      publicKeyDialogFormList: [
        {
          label: 'RSA公钥',
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
      const { status } = await this.$api.trade.setPaymentSetting({
        ...this.form,
        pay_type: 'bspay'
      })
      if (status) {
        this.$message.success('保存成功')
      } else {
        this.$message.error('保存失败')
      }
    },
    async onSubmit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const { status } = await this.$api.trade.setPaymentSetting({
            ...this.form,
            pay_type: 'bspay'
          })
          if (status) {
            this.$message.success('保存成功')
            this.getConfig()
          } else {
            this.$message.error('保存失败')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async getConfig() {
      const res = await this.$api.trade.getPaymentSetting({ pay_type: 'bspay' })
      Object.keys(res).forEach(key => {
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
