<style lang="scss" src="./index.scss"></style>
<template>
  <div
    :class="{
      'wgt-nearby-shop': true,
      'padded': value.padded
    }"
  >
    <div v-if="value.title || value.subtitle" class="wgt-hd">
      <span class="title">{{ value.title }}</span>
      <span class="sub-title">{{ value.subtitle }}</span>
    </div>
    <div class="wgt-bd">
      <!-- 自定义部分 -->
      <div class="nearby-box">
        <div class="tag-list">
          <span
            v-for="(item, index) in value.seletedTags"
            :key="item.tag_id"
            :class="[
              'tag-item',
              {
                'active': index == activeIndex
              }
            ]"
            @click="handleClickTag(item, index)"
            >{{ item.tag_name }}</span
          >
        </div>

        <div class="shop-list">
          <!-- shopList: {{ shopList }} -->
          <div v-if="shopList.length <= 0" class="default-shop">
            <SpImage :src="defaultShopImg" :width="160" />
            <div>更多商家接入中，敬请期待</div>
          </div>
          <div v-else class="shop-content">
            <div v-for="item in shopList" :key="item.distributor_id" class="shop-item">
              <div
                class="shop-banner"
                :style="{
                  backgroundImage: `url(${item.banner || defaultShopBanner})`
                }"
              >
                <div class="logo-wrap">
                  <SpImage
                    class="shop-logo"
                    :circle="23"
                    :src="item.logo || defaultShopLogo"
                    :width="46"
                    :height="46"
                  />
                </div>
              </div>

              <div class="shop-name">
                {{ item.name }}
              </div>
              <div v-if="value.show_coupon" class="coupon-list">
                <div
                  v-for="(coupon, index) in item.discountCardList"
                  :key="`coupon-item__${index}`"
                  class="coupon-item"
                >
                  {{ coupon.title }}
                </div>
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
const defaultShopImg = require('@/assets/imgs/decorate/default-shop.png')
const defaultShopBanner = require('@/assets/imgs/decorate/default-shop-banner.png')
const defaultShopLogo = require('@/assets/imgs/decorate/default-shop-logo.png')

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
      defaultShopImg,
      defaultShopBanner,
      defaultShopLogo,
      shopList: [],
      activeIndex: 0
    }
  },
  watch: {
    'value.seletedTags': {
      handler: function (nVal, oVal) {
        if (nVal.length > 0) {
          const [{ tag_id }] = nVal
          this.activeIndex = 0
          this.getShopByTag(tag_id)
        } else {
          this.shopList = []
        }
      },
      immediate: true
    }
  },
  created() {},
  methods: {
    async getShopByTag(tag_id) {
      const { list } = await this.$api.marketing.queryTagShop({ tag_id })
      this.shopList = list
    },
    handleClickTag({ tag_id }, index) {
      this.activeIndex = index
      this.getShopByTag(tag_id)
    }
  }
}
</script>
