<template>
  <div>
    <SpForm v-model="form" label-width="220px" :form-list="formList" @onSubmit="onSaveConfig" />
  </div>
</template>
<script>
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
        // wx_pub_online: '',
        // wx_pub_offline: '',
        wx_lite_online: '',
        wx_lite_offline: '',
        // wx_scan: '',
        alipay_fee_type: 'online',
        // alipay_qr_online: '',
        // alipay_qr_offline: '',
        // alipay_scan: '',
        // alipay_lite_online: '',
        // alipay_lite_offline: '',
        alipay_call: '',
        // ali_pub_off_b2b: '',
        // ali_pub_online_b2b: '',
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
        {
          label: '商户的汇付ID',
          key: 'upper_huifu_id',
          type: 'input',
          required: true,
          inline: true,
          width: '960px'
        },
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
          label: '支付渠道设置',
          type: 'group'
        },
        {
          label: '支付渠道',
          key: 'pay_channel',
          type: 'checkbox',
          options: [
            { name: '微信小程序支付', label: 'wx_lite' },
            // { name: '微信公众号支付', label: 'wx_pub' },
            { name: '支付宝H5支付', label: 'alipay_wap' },
            // { name: '支付宝app支付', label: 'alipay' },
            // { name: '支付宝扫码', label: 'alipay_qr' }
          ]
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
            { name: '标准费率线上', label: 'online' },
            { name: '标准费率线下', label: 'offline' }
          ]
        },
        // {
        //   label: '微信公众号支付（线上）',
        //   key: 'wx_pub_online',
        //   type: 'input',
        //   inline: true,
        //   width: '480px'
        // },
        // {
        //   label: '微信公众号支付（线下）',
        //   key: 'wx_pub_offline',
        //   type: 'input',
        //   inline: true,
        //   width: '480px'
        // },
        {
          label: '微信小程序支付（线上）',
          key: 'wx_lite_online',
          type: 'input',
          inline: true,
          width: '480px'
        },
        {
          label: '微信小程序支付（线下）',
          key: 'wx_lite_offline',
          type: 'input',
          inline: true,
          width: '480px'
        },
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
            { name: '标准费率线上', label: 'online' },
            { name: '标准费率线下', label: 'offline' }
          ]
        },
        // {
        //   label: '支付宝扫码支付（主扫-线上）',
        //   key: 'alipay_qr_online',
        //   type: 'input',
        //   inline: true,
        //   width: '480px'
        // },
        // {
        //   label: '支付宝扫码支付（主扫-线下）',
        //   key: 'alipay_qr_offline',
        //   type: 'input',
        //   inline: true,
        //   width: '480px'
        // },
        // {
        //   label: '支付宝扫码支付（被扫-线下）',
        //   key: 'alipay_scan',
        //   type: 'input',
        //   inline: true,
        //   width: '480px'
        // },
        // {
        //   label: '支付宝小程序支付（线上）',
        //   key: 'alipay_lite_online',
        //   type: 'input',
        //   inline: true,
        //   width: '480px'
        // },
        // {
        //   label: '支付宝小程序支付（线下）',
        //   key: 'alipay_lite_offline',
        //   type: 'input',
        //   inline: true,
        //   width: '480px'
        // },
        {
          label: '支付宝唤起支付（线上）',
          key: 'alipay_call',
          type: 'input',
          inline: true,
          width: '480px'
        },
        // {
        //   label: '支付宝生活号（线下）',
        //   key: 'ali_pub_off_b2b',
        //   type: 'input',
        //   inline: true,
        //   width: '480px'
        // },
        // {
        //   label: '支付宝生活号（线上）',
        //   key: 'ali_pub_online_b2b',
        //   type: 'input',
        //   inline: true,
        //   width: '480px'
        // },
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
      this.$refs[formName].validate(async (valid) => {
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
