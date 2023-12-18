<template>
  <div>
    <SpForm v-model="form" label-width="220px" :form-list="formList" @onSubmit="onSaveConfig" />
    <!-- <el-form ref="form" :model="form" label-width="150px" :rules="rules">
      <el-form-item label="App_ID" prop="app_id">
        <el-input v-model="form.app_id" style="width: 500px" />
      </el-form-item>
      <el-form-item label="mock模式API_KEY" prop="test_api_key">
        <el-input v-model="form.test_api_key" style="width: 500px" />
      </el-form-item>
      <el-form-item label="prod模式API_KEY" prop="live_api_key">
        <el-input v-model="form.live_api_key" style="width: 500px" />
      </el-form-item>
      <el-form-item label="商户RSA私钥" prop="rsa_private_key">
        <el-input v-model="form.rsa_private_key" style="width: 880px" type="textarea" :rows="5" />
      </el-form-item>
      <el-form-item label="是否启用" prop="is_open">
        <el-switch
          v-model="form.is_open"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="true"
          :inactive-value="false"
        />
      </el-form-item>
      <div class="section-footer with-border content-center">
        <el-button v-loading="loading" type="primary" @click="onSubmit('form')"> 保存 </el-button>
      </div>
    </el-form> -->
  </div>
</template>
<script>
import { refundResubmit } from '../../../../api/trade'

export default {
  data() {
    return {
      form: {
        app_id: '',
        test_api_key: '',
        live_api_key: '',
        rsa_private_key: '',
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
      formList: [
        {
          label: '基础配置',
          type: 'group'
        },
        {
          label: 'App_ID',
          key: 'app_id',
          type: 'input',
          required: true,
          inline: true,
          width: '960px'
        },
        {
          label: 'mock模式API_KEY',
          key: 'test_api_key',
          type: 'input',
          required: true,
          inline: true,
          width: '960px'
        },
        {
          label: 'prod模式API_KEY',
          key: 'live_api_key',
          type: 'input',
          required: true,
          inline: true,
          width: '960px'
        },
        {
          label: '商户RSA私钥',
          key: 'rsa_private_key',
          type: 'textarea',
          required: true,
          inline: true,
          width: '960px'
        },
        {
          label: '支付渠道设置',
          type: 'group'
        },
        {
          label: '微信渠道费率类型',
          key: 'pay_channel',
          type: 'checkbox',
          options: [
            { name: '微信小程序支付', label: 'wx_lite' },
            { name: '微信公众号支付', label: 'wx_pub' },
            { name: '微信公众号支付', label: 'wx_pub' },
            { name: '支付宝H5支付', label: 'alipay_wap' },
            { name: '支付宝app支付', label: 'alipay' },
            { name: '支付宝扫码', label: 'alipay_qr' }
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
        {
          label: '微信公众号支付（线上）',
          key: 'wx_pub_online',
          type: 'input',
          inline: true,
          width: '480px'
        },
        {
          label: '微信公众号支付（线下）',
          key: 'wx_pub_offline',
          type: 'input',
          inline: true,
          width: '480px'
        },
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
        {
          label: '微信扫码支付（被扫-线下）',
          key: 'wx_scan',
          type: 'input',
          inline: true,
          width: '960px'
        },
        {
          label: '支付宝渠道费率类型',
          key: 'alipay_fee_type',
          type: 'radio',
          options: [
            { name: '标准费率线上', label: 'online' },
            { name: '标准费率线下', label: 'offline' }
          ]
        },
        {
          label: '支付宝扫码支付（主扫-线上）',
          key: 'alipay_qr_online',
          type: 'input',
          inline: true,
          width: '480px'
        },
        {
          label: '支付宝扫码支付（主扫-线下）',
          key: 'alipay_qr_offline',
          type: 'input',
          inline: true,
          width: '480px'
        },
        {
          label: '支付宝扫码支付（被扫-线下）',
          key: 'alipay_scan',
          type: 'input',
          inline: true,
          width: '480px'
        },
        {
          label: '支付宝小程序支付（线上）',
          key: 'alipay_lite_online',
          type: 'input',
          inline: true,
          width: '480px'
        },
        {
          label: '支付宝小程序支付（线下）',
          key: 'alipay_lite_offline',
          type: 'input',
          inline: true,
          width: '480px'
        },
        {
          label: '支付宝唤起支付（线上）',
          key: 'alipay_call',
          type: 'input',
          inline: true,
          width: '480px'
        },
        {
          label: '支付宝生活号（线下）',
          key: 'ali_pub_off_b2b',
          type: 'input',
          inline: true,
          width: '480px'
        },
        {
          label: '支付宝生活号（线上）',
          key: 'ali_pub_online_b2b',
          type: 'input',
          inline: true,
          width: '480px'
        },
        {
          label: '是否启用',
          key: 'is_open',
          type: 'switch'
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
        this.$message.success('保存成功')
      } else {
        this.$message.error('保存失败')
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
      const res = await this.$api.trade.getPaymentSetting({ pay_type: 'adapay' })
      Object.keys(res).forEach((key) => {
        if (typeof this.form[key]) {
          this.form[key] = res[key]
        }
      })

      console.log(this.form)
      // this.from.app_id = typeof res.app_id
      // this.from.test_api_key = res.test_api_key
      // this.from.live_api_key = res.live_api_key
      // this.from.rsa_private_key = res.rsa_private_key
      // this.from.wxpay_fee_type = res.wxpay_fee_type
      // this.from.wx_pub_online = res.wx_pub_online
      // this.from.wx_pub_offline = res.wx_pub_offline
      // this.from.wx_lite_online = res.wx_lite_online
      // this.from.wx_lite_offline = res.wx_lite_offline
      // this.from.wx_scan = res.wx_scan
      // this.from.alipay_fee_type = res.alipay_fee_type
      // this.from.alipay_qr_online = res.alipay_qr_online
      // this.from.alipay_qr_offline = res.alipay_qr_offline
      // this.from.alipay_scan = res.alipay_scan
      // this.from.alipay_lite_online = res.alipay_lite_online
      // this.from.alipay_lite_offline = res.alipay_lite_offline
      // this.from.alipay_call = res.alipay_call
      // this.from.ali_pub_off_b2b = res.ali_pub_off_b2b
      // this.from.ali_pub_online_b2b = res.ali_pub_online_b2b
      // this.from.is_open = res.is_open
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
