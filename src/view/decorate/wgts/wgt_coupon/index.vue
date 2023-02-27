<style lang="scss">
.wgt-coupon {
  &.padded {
    padding: 10px 0;
  }
  .wgt-hd {
    padding: 10px;
    .title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    .sub-title {
      color: #666;
      margin-left: 4px;
    }
  }
  .wgt-bd {
    padding: 0 10px;
    @include clearfix();
  }
  .coupon-style-1 {
    .wgt-coupon-item {
      height: 100px;
      width: 100%;
      &:not(:last-child) {
        margin-bottom: 10px;
      }
    }
  }
  .coupon-style-2 {
    .wgt-coupon-item:nth-child(1) {
      height: 90px;
      width: calc(50% - 5px);
      margin: 0 10px 10px 0;
    }
    .wgt-coupon-item:nth-child(2) {
      height: 90px;
      width: calc(50% - 5px);
      margin: 0 0 10px 0;
    }
    .wgt-coupon-item:nth-child(3) {
      height: 100px;
      width: 100%;
    }
  }
  .coupon-style-3 {
    .wgt-coupon-item:nth-child(1) {
      height: 100px;
      width: 100%;
    }
    .wgt-coupon-item:nth-child(2) {
      height: 90px;
      width: calc(50% - 5px);
      margin: 10px 10px 0 0;
    }
    .wgt-coupon-item:nth-child(3) {
      height: 90px;
      width: calc(50% - 5px);
      margin: 10px 0 0 0;
    }
  }
  .coupon-style-4 {
    .wgt-coupon-item {
      height: 132px;
      width: 111px;
      &:not(:last-child) {
        margin-right: 10px;
      }
    }
    .coupon-hd {
      text-align: center;
      margin-top: 30px;
      height: 40px;
      .symbol {
        color: #724120;
        display: inline-block;
        margin: 0 2px;
        position: relative;
        top: -1px;
      }
      .value {
        color: #724120;
        font-size: 26px;
        font-weight: 500;
      }
    }
    .coupon-ft {
      text-align: center;
      margin-top: 16px;
      .name {
        color: #fff;
        font-size: 12px;
      }
      .btn {
        margin-top: 6px;
        background: #fff;
        font-size: 11px;
        height: 16px;
        line-height: 16px;
        border-radius: 4px;
        width: 40px;
        text-align: center;
        margin: 0 auto;
      }
    }
  }
  .wgt-coupon-item {
    float: left;
    background-size: cover;
    background-position: center;
  }
}
</style>
<template>
  <div
    :class="{
      'wgt-coupon': true,
      'padded': value.padded
    }"
  >
    <div v-if="value.title || value.subtitle" class="wgt-hd">
      <span class="title">{{ value.title }}</span>
      <span class="sub-title">{{ value.subtitle }}</span>
    </div>
    <div :class="['wgt-bd', `coupon-style-${value.style}`]">
      <!-- 挂件自定义部分 -->
      <div
        v-for="(item, index) in value.data"
        :key="`wgt-coupon-item__${index}`"
        :class="['wgt-coupon-item']"
        :style="getCouponStyle(item, index)"
      >
        <!-- 样式4 -->
        <template v-if="!item.imgUrl">
          <div class="coupon-hd">
            <div v-if="item.type == 'cash'" class="amount">
              <span class="symbol">¥</span>
              <span class="value">{{ item.amount }}</span>
            </div>
            <div v-if="item.type == 'discount'" class="amount">
              <span class="value">{{ item.amount }}</span>
              <span class="symbol">折</span>
            </div>
          </div>
          <div class="coupon-ft">
            <div class="name">{{ item.title }}</div>
            <div class="btn">领取</div>
          </div>
        </template>
      </div>
      <!-- 挂件自定义部分 -->
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import config from './config'
export default {
  name: 'Coupon',
  wgtName: '优惠券',
  wgtDesc: '',
  wgtIcon: 'wgt-coupon',
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
  // computed: {
  //   maxDeepLength() {
  //     const { couponDeep } = this
  //     let max = 0
  //     Object.keys(couponDeep).forEach((key) => {
  //       if (max <= couponDeep[key]) {
  //         max = couponDeep[key]
  //       }
  //     })
  //     return max
  //   }
  // },
  created() {},
  methods: {
    getCouponStyle(item, index) {
      if (item.imgUrl) {
        return {
          'background-image': `url(${item.imgUrl})`
        }
      } else {
        let bgk
        if (this.value.style == '1') {
          bgk = require('./img/coupon_one.png')
        } else if (this.value.style == '2') {
          bgk = index == 2 ? require('./img/coupon_one.png') : require('./img/coupon_two.png')
        } else if (this.value.style == '3') {
          bgk = index == 0 ? require('./img/coupon_one.png') : require('./img/coupon_two.png')
        } else if (this.value.style == '4') {
          bgk = require('./img/coupon_three.png')
        }
        return {
          'background-image': `url(${bgk})`
        }
      }
    }
    // getCouponClass(item, index) {
    //   const { data } = this.value
    //   let deepLength = 0
    //   if (index > 0 && this.couponDeep[index - 1]) {
    //     if (!item.imgUrl) {
    //       deepLength = this.couponDeep[index - 1]
    //     } else {
    //       deepLength = 0
    //     }
    //   } else {
    //     for (let i = index; i < data.length; i++) {
    //       if (!data[i].imgUrl) {
    //         deepLength += 1
    //       } else {
    //         i = data.length
    //       }
    //     }
    //   }
    //   console.log('deepLength:', deepLength)
    //   Vue.set(this.couponDeep, index, deepLength)
    //   return `coupon-col${deepLength}`
    // }
  }
}
</script>
