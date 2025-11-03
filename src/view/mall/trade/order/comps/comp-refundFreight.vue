<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
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
