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
      let leftPoint = 0
      items.forEach(item => {
        if (item.checked) {
          item.refundNum === item.left_aftersales_num
            ? (leftPoint = item.remain_point / 100)
            : (leftPoint = parseInt(
                (item.remain_point / 100 / item.left_aftersales_num) * item.refundNum
              ))
        }
      })
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
