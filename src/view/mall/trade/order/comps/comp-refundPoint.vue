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
          leftPoint +=
            item.refundNum === item.left_aftersales_num
              ? item.remain_point / 100
              : parseInt((item.remain_point / 100 / item.left_aftersales_num) * item.refundNum)
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
