<style lang="scss">
.comp-refund-amount {
  .refund-amount-tip {
    line-height: 24px;
    display: flex;
  }
}
</style>
<template>
  <div class="comp-refund-amount">
    <el-input v-model="fee" type="text" @change="onChangeFee" />
    <div class="refund-amount-tip">
      <div>实际可退运费：{{ getTotalFee() }}</div>
      <el-button type="text" @click="refundAll">全部退款</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompRefundPoint',
  props: ['value'],
  data() {
    return {
      fee: 0
    }
  },
  created() {},
  methods: {
    getTotalFee() {
      return (this.value?.refund_freight_amount  || 0)/100
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
