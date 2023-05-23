<style lang="scss" src="./index.scss" />
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
    <div
      :class="[
        'wgt-bd',
        `coupon-style-${
          value.data.length + value.voucher_package.length <= 2
            ? value.data.length + value.voucher_package.length
            : 3
        }`
      ]"
    >
      <!-- 挂件自定义部分 -->
      <div
        v-for="(item, index) in value.data"
        :key="`wgt-coupon-item__${index}`"
        :class="[
          'wgt-coupon-item',
          {
            'has-img': item.imgUrl
          }
        ]"
        :style="getCouponStyle(item)"
      >
        <template v-if="!item.imgUrl">
          <div class="coupon-bd">
            <div v-if="item.type == 'cash'" class="coupon-amount">
              <span class="symbol">¥</span>
              <span class="value">{{ item.amount / 100 }}</span>
            </div>
            <div v-if="item.type == 'discount'" class="coupon-amount">
              <span class="value">{{ item.amount }}</span>
              <span class="symbol">折</span>
            </div>
            <div v-if="item.type == 'new_gift'" class="coupon-amount">
              <span class="value">{{ item.amount / 100 }}</span>
              <span class="symbol">元</span>
            </div>
            <div class="coupon-desc">
              <div class="name">{{ item.title }}</div>
              <div class="desc">{{ item.desc }}</div>
            </div>
          </div>
          <div class="coupon-ft">
            <div class="btn">领取</div>
          </div>
        </template>
      </div>

      <div
        v-for="(item, index) in value.voucher_package"
        :key="`wgt-coupon-package-item__${index}`"
        :class="['wgt-coupon-item']"
        :style="getCouponStyle(item)"
      >
        <template v-if="!item.imgUrl">
          <div class="coupon-bd">
            <div class="coupon-amount">
              <span class="package-value">券包</span>
            </div>
            <div class="coupon-desc">
              <div class="name">{{ item.title }}</div>
              <div class="desc">{{ item.desc }}</div>
            </div>
          </div>
          <div class="coupon-ft">
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
  created() {},
  methods: {
    getCouponStyle(item, index) {
      if (item.imgUrl) {
        return {
          'background-image': `url(${item.imgUrl})`,
          'background-size': 'cover',
          'background-position': 'center'
        }
      }
    }
  }
}
</script>
