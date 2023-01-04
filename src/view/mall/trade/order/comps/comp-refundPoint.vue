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
    <div class="refund-amount-tip">实际可退积分：{{ getTotalFee() }}</div>
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
      const { items = [] } = this.value || {}
      const leftPoint = items.reduce((total, current) => total + current.remain_point, 0)
      return leftPoint
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
