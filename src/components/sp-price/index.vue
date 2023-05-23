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
    <span class="decimal-value" :style="{ 'font-size': `${size - 2}px` }">{{
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
  // watch: {
  //   value: function (val) {

  //   }
  // },
  created() {
    const priceVal = isNumber(this.value) ? this.value.toFixed(2) : this.value
    const [int, decimal = '00'] = (priceVal || '').split('.')
    this.intValue = int
    this.decimalValue = decimal
  },
  methods: {}
}
</script>
