<style lang="scss">
.page-order-order-setting {
  .el-form-item__error--inline {
    margin-left: 0;
  }
}
</style>
<template>
  <SpPage title="订单设置" class="page-order-order-setting">
    <SpForm
      ref="form"
      v-model="form"
      :form-list="formList"
      :submit="false"
      @onSubmit="onSaveConfig"
    />
    <div slot="page-footer" class="text-center">
      <el-button
        type="primary"
        @click="
          () => {
            $refs['form'].handleSubmit()
          }
        "
      >
        保存
      </el-button>
    </div>
  </SpPage>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      form: {
        order_cancel_time: 15,
        order_finish_time: 7,
        latest_aftersale_time: 0,
        auto_refuse_time: 0,
        auto_aftersales: false,
        offline_aftersales: false,
        is_refund_freight: false
      },
      formList: [
        {
          label: '订单自动取消',
          key: 'order_cancel_time',
          component: () => (
            <SpInput
              prefix="未付款订单，将在"
              suffix="（分钟）之后取消"
              width="100px"
              v-model={this.form.order_cancel_time}
            />
          ),
          validator: (rule, value, callback) => {
            const { order_cancel_time } = this.form
            if (order_cancel_time < 5) {
              callback(new Error('订单自动取消时间需大于等于5分钟'))
            } else {
              callback()
            }
          }
        },
        {
          label: '订单自动确认',
          key: 'order_finish_time',
          component: () => (
            <SpInput
              prefix="已发货订单，将在"
              suffix="（天）后自动完成"
              width="100px"
              v-model={this.form.order_finish_time}
            />
          )
        },
        {
          label: '订单售后时效',
          key: 'latest_aftersale_time',
          component: () => (
            <SpInput
              prefix="已确认收货订单，将在"
              suffix="（天）后不可申请售后"
              width="100px"
              v-model={this.form.latest_aftersale_time}
            />
          ),
          isShow: () => !this.VERSION_IN_PURCHASE()
        },
        {
          label: '售后自动驳回时效',
          key: 'auto_refuse_time',
          component: () => (
            <SpInput
              prefix="退货退款同意后未退回商品，将在"
              suffix="（天）后驳回售后"
              width="100px"
              v-model={this.form.auto_refuse_time}
            />
          ),
          isShow: () => !this.VERSION_IN_PURCHASE()
        },
        {
          label: '自动审批同意',
          key: 'auto_aftersales',
          type: 'switch',
          isShow: () => !this.VERSION_IN_PURCHASE(),
          tip: '未发货订单申请退款是否自动审批同意'
        },
        {
          label: '到店退货',
          key: 'offline_aftersales',
          type: 'radio',
          options: [
            { label: true, name: '启用' },
            { label: false, name: '不启用' }
          ],
          isShow: () => this.VERSION_STANDARD(),
          tip: '启用后，请前往店铺管理中设置到店退货信息，消费者申请退货退款时可选择到店退货。'
        },
        {
          label: '退货退款时可退运费',
          key: 'is_refund_freight',
          type: 'radio',
          options: [
            { label: true, name: '启用' },
            { label: false, name: '不启用' }
          ],
          // isShow: () => this.VERSION_STANDARD(),
          tip: '启用后，请前往店铺管理中设置退货退款时消费者可退运费。'
        }
      ]
    }
  },
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      const res = await this.$api.trade.getOrderSetting()
      this.form = {
        order_cancel_time: res.order_cancel_time,
        order_finish_time: res.order_finish_time,
        latest_aftersale_time: res.latest_aftersale_time,
        auto_refuse_time: res.auto_refuse_time,
        auto_aftersales: res.auto_aftersales,
        offline_aftersales: res.offline_aftersales,
        is_refund_freight: res.is_refund_freight == 1
      }
    },
    async onSaveConfig() {
      const params = this.form
      await this.$api.trade.setOrderSetting({
        ...params,
        is_refund_freight: params.is_refund_freight ? 1 : 0,
        auto_aftersales: params.auto_aftersales ? 1 : 0
      })
      this.$message.success('保存成功')
    }
  }
}
</script>
