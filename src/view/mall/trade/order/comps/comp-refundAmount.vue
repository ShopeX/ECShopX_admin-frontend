<style lang="scss">
.comp-refund-amount {
  .refund-amount-tip {
    line-height: 24px;
  }
}
</style>
<template>
  <div class="comp-refund-amount">
    <el-input v-model="fee" type="text" @change="onChangeFee" />
    <div class="refund-amount-tip">
      实际可退金额：{{ getTotalFee() }}
      <el-button type="text" @click="refundAll">全部退款</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompRefundAmount',
  props: ['value'],
  data() {
    return {
      fee: ''
    }
  },
  created() {},
  methods: {
    getTotalFee() {
      const { total_fee = 0 } = this.value || {}
      return (total_fee / 100).toFixed(2)
    },
    onChangeFee() {
      this.$emit('onChange', this.fee)
    },
    refundAll() {
      const refundFee = this.getTotalFee()
      this.fee = refundFee
      this.$emit('onChange', refundFee)
    }
  }
}
</script>
