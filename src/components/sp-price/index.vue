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
.sp-price {
  display: inline-block;
  &.line-through {
    color: #999;
    text-decoration: line-through;
  }
}
</style>
<template>
  <div
    :class="[
      'sp-price',
      {
        'line-through': lineThrough
      }
    ]"
  >
    <span class="symbol" :style="{ 'font-size': `${size}px` }">{{ symbol }}</span>
    <span class="int-value" :style="{ 'font-size': `${size}px` }">{{ intValue }}</span>
    <span class="decimal-value" :style="{ 'font-size': `${size}px` }">{{
      `.${decimalValue}`
    }}</span>
  </div>
</template>

<script>
import { isNumber } from '@/utils'
export default {
  name: 'SpPrice',
  props: {
    lineThrough: {
      type: Boolean,
      default: false
    },
    symbol: {
      type: String,
      default: '¥'
    },
    value: {
      type: Number,
      default: 0
    },
    size: {
      type: Number,
      default: 14
    }
  },
  data() {
    return {
      intValue: 0,
      decimalValue: 0
    }
  },
  watch: {
    value: {
      handler(val, old) {
        const priceVal = isNumber(val) ? val.toFixed(2) : val
        const [int, decimal = '00'] = (priceVal || '').split('.')
        this.intValue = int
        this.decimalValue = decimal
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    // const priceVal = isNumber(this.value) ? this.value.toFixed(2) : this.value
    // const [int, decimal = '00'] = (priceVal || '').split('.')
    // this.intValue = int
    // this.decimalValue = decimal
  },
  methods: {}
}
</script>
