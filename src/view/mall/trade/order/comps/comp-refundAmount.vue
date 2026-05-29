<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.comp-refund-amount {
  .refund-amount-tip {
    line-height: 24px;
  }
}
</style>
<template>
  <div class="comp-refund-amount">
    <el-input v-model="fee" type="text" disabled @change="onChangeFee" />
    <div class="refund-amount-tip">{{ $t('8a5fac4d.eea9ab') }}{{ refundFee }}</div>
  </div>
</template>

<script>
export default {
  name: 'CompRefundAmount',
  props: ['value'],
  data() {
    return {
      fee: 0,
      refundFee: 0
    }
  },
  created() {},
  methods: {
    getTotalFee() {
      const { items = [] } = this.value || {}

      const leftFee = items
        .filter((item) => item.checked)
        .reduce(
          (total, current) => total + (current.total_fee / current.num) * current.refundNum,
          0
        )
      this.refundFee = (leftFee / 100).toFixed(2)
      this.fee = this.refundFee
      this.$emit('onChangeFee', this.refundFee)
    },
    onChangeFee() {
      this.$emit('onChangeFee', this.fee)
    }
  }
}
</script>
