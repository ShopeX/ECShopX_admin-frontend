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
        appid: '',
        mer_id: '',
        decive_info: '',
        public_key: '',
        private_key: '',
        is_open: false
      },
      formList: [
        {
          label: '收钱吧轻POS',
          type: 'group'
        },
        {
          label: '应用授权号',
          key: 'appid',
          type: 'input',
          required: true,
          inline: true,
          width: '960px'
        },
        {
          label: '商户编号',
          key: 'mer_id',
          type: 'input',
          required: true,
          inline: true,
          width: '960px'
        },
        {
          label: '设备号',
          key: 'decive_info',
          type: 'input',
          required: true,
          inline: true,
          width: '960px'
        },
        {
          label: '密钥设置',
          type: 'group'
        },
        {
          label: '公钥',
          key: 'public_key',
          type: 'textarea',
          required: true,
        },
        {
          label: '私钥',
          key: 'private_key',
          type: 'textarea',
          required: true,
        },
        {
          label: '是否启用',
          key: 'is_open',
          type: 'switch'
        }
      ],
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    async onSaveConfig() {
      const { status } = await this.$api.trade.setPaymentSetting({
        ...this.form,
        pay_type: 'icbcpay'
      })
      if (status) {
        this.$message.success('保存成功')
      } else {
        this.$message.error('保存失败')
      }
    },
    async getConfig() {
      const res = await this.$api.trade.getPaymentSetting({ pay_type: 'icbcpay' })
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
