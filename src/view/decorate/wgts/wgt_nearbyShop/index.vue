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
              <!-- 店铺图片 -->
              <div class="store-map">
                <div>
                  <SpImage
                    :circle="8"
                    :src="item.logo || defaultShopLogo"
                    :width="50"
                    :height="50"
                  />
                </div>
              </div>
              <!-- 店铺详情数据 -->
              <div class="store-details">
                <div class="name">
                  <span>{{ item.name }}</span>
                  <span v-if="item.is_self_delivery && item.selfDeliveryRule.is_open == 'true'"
                    >商家自配送</span
                  >
                </div>
                <div
                  v-if="item.is_self_delivery && item.selfDeliveryRule.is_open == 'true'"
                  class="free-shipping"
                >
                  <span
                    >起送¥{{ item.selfDeliveryRule.min_amount }} ｜
                    {{
                      item.selfDeliveryRule.rule[0].selected == 'true'
                        ? item.selfDeliveryRule.rule[0].freight_fee == '0'
                          ? `满¥${item.selfDeliveryRule.rule[0].full}元免运费`
                          : `满¥${item.selfDeliveryRule.rule[0].full}元运费${item.selfDeliveryRule.rule[0].freight_fee}元`
                        : item.selfDeliveryRule.rule[1].freight_fee == '0'
                        ? `满¥${item.selfDeliveryRule.rule[1].full}元免运费`
                        : `满¥${item.selfDeliveryRule.rule[1].full}元运费${item.selfDeliveryRule.rule[1].freight_fee}元`
                    }}</span
                  >
                  <span class="free-shipping-money">¥{{ item.selfDeliveryRule.freight_fee }}</span>
                </div>
                <!-- 商品数据 -->
                <div v-if="item.itemList" class="product-details">
                  <div
                    v-for="(items, index) in item.itemList"
                    :key="index"
                    class="product-details-list"
                  >
                    <SpImage
                      :circle="8"
                      :src="items.pics[0] || defaultShopLogo"
                      :width="50"
                      :height="50"
                    />
                    <div class="name">{{ items.item_name }}</div>
                    <SpPrice class="item-price" :value="items.price / 100" :size="15" />
                    <div
                      v-if="items.market_price > 0 && items.price > items.market_price"
                      class="underlined-price"
                    >
                      ¥{{ items.market_price }}
                    </div>
                  </div>
                </div>
                <!-- 优惠券 -->
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

        <div class="goods-more">
          <p class="more-btn">查看更多</p>
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
          let item_tag_id = this.value.productLabel.map((item) => item.tag_id)
          this.activeIndex = 0
          let params = {
            tag_id: tag_id,
            item_tag_id,
            show_items: 1
          }
          this.getShopByTag(params)
        } else {
          this.shopList = []
        }
      },
      immediate: true
    },
    'value.productLabel': {
      handler: function (nVal, oVal) {
        if (this.value.seletedTags.length > 0) {
          let item_tag_id = nVal.map((item) => item.tag_id)
          let params = {
            tag_id: this.value.seletedTags[this.activeIndex].tag_id,
            item_tag_id,
            show_items: 1
          }
          this.getShopByTag(params)
        }
      },
      deep: true
    }
  },
  created() {},
  methods: {
    async getShopByTag(params) {
      const { list } = await this.$api.marketing.queryTagShop(params)
      this.shopList = list.slice(0, 2)
    },
    handleClickTag(item, index) {
      let item_tag_id = this.value.productLabel.map((item) => item.tag_id)
      let params = {
        tag_id: item.tag_id,
        item_tag_id,
        show_items: 1
      }
      this.activeIndex = index
      this.getShopByTag(params)
    }
  }
}
</script>
