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
    <div class="refund-amount-tip">{{ $t('2a4a2da7.a81a1b') }}{{ refundPoint }}</div>
  </div>
</template>

<script>
export default {
  name: 'CompRefundPoint',
  props: ['value'],
  data() {
    return {
      fee: 0,
      refundPoint: 0
    }
  },
  created() {},
  methods: {
    getTotalFee() {
      const { items = [] } = this.value || {}
      let leftPoint = 0
      items.forEach((item) => {
        if (item.checked) {
          // 部分发货+仅退款时 refundableNum 为 left_refund_only_num，left_aftersales_num 可能为 0
          const refundableNum = item.refundableNum || item.left_aftersales_num
          if (!refundableNum) return
          leftPoint +=
            item.refundNum === refundableNum
              ? item.remain_point / 100
              : parseInt((item.remain_point / 100 / refundableNum) * item.refundNum)
        }
      })
      this.refundPoint = leftPoint
      this.fee = leftPoint
      this.$emit('onChange', leftPoint)
      return leftPoint
    },
    onChangeFee() {
      this.$emit('onChange', this.fee)
    }
  }
}
</script>
