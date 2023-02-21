<style lang="scss" src="./index.scss"></style>
<template>
  <div
    :class="{
      'wgt-slider': true,
      'padded': value.padded
    }"
  >
    <div v-if="value.title || value.subtitle" class="wgt-hd">
      <span class="title">{{ value.title }}</span>
      <span class="sub-title">{{ value.subtitle }}</span>
    </div>
    <div class="wgt-bd">
      <!-- 自定义部分 -->
      <div class="nearbyBox">
        <div class="tags">
          <span v-for="item in value.shopClass.tagList" :key="item.tag_id">{{
            item.tag_name
          }}</span>
        </div>
        <div class="shopList">
          <div v-if="value.shopClass.shopList.length <= 0" class="noShop">
            <img :src="img.noShopImg" alt="">
            <p>更多商家接入中，敬请期待</p>
          </div>
          <div v-else class="content">
            <div v-for="item in value.shopClass.shopList" :key="item.distributor_id" class="shop">
              <div
                class="bg"
                :style="{
                  backgroundImage: 'url(' + `${item.banner || img.bgImg}` + ')',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }"
              >
                <img class="logo" :src="item.logo || img.logoImg" alt="">
              </div>
              <!-- <img class="bg" :src="img.bgImg" alt="" /> -->

              <div class="title">
                {{ item.name }}
              </div>
              <div v-if="value.showCoupon && item.discountCardList.length > 0" class="coupon">
                {{ item.discountCardList[0].title }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from './config'
const noShopImg = require('@/assets/img/platform/noShop.png')
const logoImg = require('@/assets/img/platform/shop_default_logo.png')
const bgImg = require('@/assets/img/platform/shop_default_bg.png')

export default {
  name: 'NearbyShop',
  wgtName: '附近商家',
  wgtDesc: '',
  wgtIcon: 'wgt-nearby-shop',
  config: config,
  props: {
    value: [Object, Array]
  },
  data() {
    return {
      img: {
        noShopImg,
        logoImg,
        bgImg
      },
      colorPrimary: ''
    }
  },
  computed: {},
  created() {
    console.log(this.value)
  },
  mounted() {
    this.colorPrimary = this.$store.getters.color_theme.primary
  },
  methods: {}
}
</script>
