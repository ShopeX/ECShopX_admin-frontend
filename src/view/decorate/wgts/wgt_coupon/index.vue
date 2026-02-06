<style lang="scss" src="./index.scss" />
<template>
  <div class="wgt-couponcard" :style="outerStyle">
    <div class="wgt-couponcard-inner" :style="innerStyle" :class="{
      'wgt-couponcard-one': value.data.length == 1,
      'wgt-couponcard-two': value.data.length == 2,
      'wgt-couponcard-three': value.data.length == 3,
      'wgt-couponcard-more': value.data.length >= 4
    }">
      <div v-for="(item, index) in value.data" :key="index" class="wgt-couponcard-item">
        <div class="wgt-couponcard-item-body">
          <div class="wgt-couponcard-item-header">
            <div v-if="item.type !== 'discount'" class="coupon-unit" :style="{ color: value.amountColor }">
              ¥
            </div>
            <div class="coupon-title" :style="{ color: value.amountColor }">{{ item.amount }}</div>
            <div v-if="item.type == 'discount'" class="coupon-unit" :style="{ color: value.amountColor }">
              折
            </div>
          </div>
          <div v-if="value.data.length == 1" class="wgt-couponcard-item-info">
            <p class="use-title">{{ item?.title }}</p>
    
            <p  class="use-desc" v-html="item.description" />
            <p class="use-time">
              有效期至 {{ item.end_date }}
            </p>
            <p  class="use-time">{{ item?.valid_date }}</p>
          </div>
          <div v-else class="wgt-couponcard-item-info">
            <p class="use-title">{{ item?.title }}</p>
            <p class="use-desc">{{ item.desc }}</p>
          </div>
        </div>
        <!-- dayStockNum: 'stockNum',//日剩余库存
  stockNum:'realStockNum', //总剩余库存
  remainingNum:({get_num,quantity})=> quantity - get_num -->
   
        <div 
          :class="['wgt-couponcard-item-btn', { 'disabled': item.quantity - item.get_num <= 0 }]"
          :style="receiveBtnStyle">
          {{
            item.quantity - item.get_num <= 0 ? '已领完' : '立即领取' }} </div>
        </div>
      </div>
    </div>
</template>

<script>
import config from './config'
import { getOuterStyle, getInnerStyle } from '../../comps/style-utils'
export default {
  name: 'CouponCard',
  wgtName: '优惠券',
  wgtDesc: '',
  wgtIcon: 'ticket',
  wgtType: 2,
  config: config,
  props: {
    value: [Object, Array]
  },
  data() {
    return {
      currentIndex: 1,
      couponDeep: {}
    }
  },
  computed: {
    outerStyle() {
      return getOuterStyle(this.value)
    },
    innerStyle() {
      return getInnerStyle(this.value)
    },
    receiveBtnStyle() {
      const { color, textColor } = this.value.receiveBtn
      return {
        backgroundColor: color,
        color: textColor
      }
    }
  },
  created() { },
  methods: {
    AIOFormatter(item) {
      if (item.stockNum > 0 && item.realStockNum > 0) {
        return '立即领取'
      } else {
        return item.realStockNum <= 0 ? '已领完' : '今日已领完'
      }
      // return {
      //   dayStockNum: 'stockNum',//日剩余库存
      //   stockNum:'realStockNum', //总剩余库存
      //   remainingNum:({get_num,quantity})=> quantity - get_num
      // }
    }
  }
}
</script>
