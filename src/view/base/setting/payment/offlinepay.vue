<style lang="scss"></style>
<template>
  <SpForm v-model="form" :form-list="formList" @onSubmit="onSaveConfig" />
</template>

<script>
export default {
  name: '',
  data() {
    return {
      form: {
        pay_type:'offline_pay',
        pay_name: '',
        auto_cancel_time: 0,
        is_need_finance_audit:'1',
        pay_tips: '',
        pay_desc:'',
        is_open: false,
      },
      formList: [
        {
          label: '支付方式名称',
          key: 'pay_name',
          type: 'input',
          required: true,
          message: '不能为空'
        },
        {
          label: '收款说明',
          key: 'pay_tips',
          type: 'textarea',
          width: '600px'
        },
        {
          label: '付款说明',
          key: 'pay_desc',
          type: 'textarea',
          width: '600px'
        },
        {
          label: '订单自动取消',
          key: 'auto_cancel_time',
          component: ({ key }, value) => {
            return (
              <div>
                未付款订单，将在
                <el-input
                  type='number'
                  min='0'
                  style='width: 100px;margin-left: 10px;'
                  v-model={value[key]}
                />
                （小时）之后取消
              </div>
            )
          },
          required: true,
          message: '不能为空'
        },
        {
          label: '是否需要财务审核',
          key: 'is_need_finance_audit',
          type: 'radio',
          options: [
            {
              label: 'true',
              name: '是'
            },
            {
              label: 'false',
              name: '否'
            }
          ],
          required: true,
          message: '不能为空'
        },

        {
          label: '是否开启',
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
    async getConfig() {
      const res = await this.$api.trade.getPaymentSetting({ pay_type: 'offline_pay' })
      this.form.pay_name = res.pay_name
      this.form.auto_cancel_time = res.auto_cancel_time
      this.form.pay_tips = res.pay_tips
      this.form.pay_desc = res.pay_desc
      this.form.is_open = res.is_open == 'true'
      this.form.is_need_finance_audit = res.is_need_finance_audit

    },
    async onSaveConfig() {
      const params = {
        ...this.form,
        is_open: this.form.is_open ? 'true' : 'false'
      }
      await this.$api.trade.setPaymentSetting(params)
      this.$message.success('保存成功')
    }
  }
}
</script>
