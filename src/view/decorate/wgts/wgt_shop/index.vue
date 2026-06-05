<style lang="scss" src="./index.scss"></style>
<template>
  <div class="wgt-shop" :style="outerStyle">
    <div
      :class="[
        'wgt-shop-container-list',
        { 'wgt-shop-container-list-single': displayShops.length == 1 }
      ]"
    >
      <div
        v-for="(shop, index) in displayShops"
        :key="shopRowKey(shop, index)"
        class="wgt-shop-item"
        :style="innerStyle"
      >
        <div class="shop-header">
          <div class="shop-info">
            <div class="shop-logo">
              <img :src="shopLogo(shop)" alt="店铺logo" />
            </div>
            <div class="shop-name">{{ shopName(shop) }}</div>
          </div>
          <div class="shop-actions">
            <div class="favorite-btn">
              <i class="el-icon-star-off" />
            </div>
            <div class="enter-shop-btn">{{ i18n.t('1d819fcf.0f2d3a') }}</div>
          </div>
        </div>
        <div class="shop-products">
          <div
            v-for="(product, pIndex) in productsForShop(shop)"
            :key="`${index}-${pIndex}`"
            class="product-item"
          >
            <div class="product-image">
              <el-image
                :src="productImage(product)"
                alt="商品图片"
              >
                <div slot="error" class="image-slot" />
              </el-image>
            </div>
            <div class="product-title">{{ product?.item_name || i18n.t('1d819fcf.1fd1d5') }}</div>
            <div class="product-tags">
              <span
                v-for="(tag, tagIndex) in productTags(product)"
                :key="tagIndex"
                class="tag"
                :class="'tag-' + tagIndex"
                >{{ tag }}</span
              >
            </div>
            <div class="product-price">
              <span class="current-price-symbol">¥</span>
              <span class="current-price">{{ (product?.price || 0) / 100 }}</span>
              <span class="original-price">{{ (product?.market_price || 0) / 100 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { i18n } from '@/i18n'
import config from './config'
import { getOuterStyle, getInnerStyle } from '../../comps/style-utils'

const defaultShopLogo = require('@/assets/imgs/decorate/default-shop-logo.png')

const NEARBY_PLACEHOLDER_PRODUCT = {
  item_name: '',
  price: 19900,
  market_price: 29900,
  pics: [],
  tags: ['4折', '活动标']
}

function clampCount(n, fallback = 4, max = 100) {
  const num = Number(n)
  if (!Number.isFinite(num) || num < 1) return fallback
  return Math.min(Math.floor(num), max)
}

export default {
  name: 'Shop',
  wgtName: i18n.t('1d819fcf.295713'),
  wgtDesc: '',
  wgtIcon: 'application',
  wgtType: 2,
  config: config,
  props: {
    value: [Object, Array]
  },
  data() {
    return {
      i18n,
      defaultShopLogo,
      distributorData: []
    }
  },
  computed: {
    isNearbyType() {
      return this.value?.dataType === 'nearby'
    },
    nearbyMerchantsCount() {
      return clampCount(this.value?.merchantsNumber)
    },
    nearbyProductsCount() {
      return clampCount(this.value?.quantityNumber)
    },
    displayShops() {
      if (this.isNearbyType) {
        return Array.from({ length: this.nearbyMerchantsCount }, (_, index) => ({
          _placeholder: true,
          distributor_id: `nearby-placeholder-${index}`,
          name: i18n.t('5e1ae7f2.0c0d95')
        }))
      }
      return this.value?.data || []
    },
    outerStyle() {
      return getOuterStyle(this.value)
    },
    innerStyle() {
      return getInnerStyle(this.value)
    }
  },
  watch: {
    'value.data': {
      handler(newVal) {
        if (!this.isNearbyType && newVal && newVal.length > 0) {
          this.loadSpecifyGoods()
        } else if (!this.isNearbyType) {
          this.distributorData = []
        }
      },
      immediate: true,
      deep: true
    },
    'value.dataType'() {
      if (!this.isNearbyType) {
        this.loadSpecifyGoods()
      } else {
        this.distributorData = []
      }
    }
  },
  methods: {
    shopRowKey(shop, index) {
      return shop.distributor_id || shop.id || `shop-${index}`
    },
    shopLogo(shop) {
      return shop.logo || this.defaultShopLogo
    },
    shopName(shop) {
      return shop.name || shop.distributor_name || 'ADIDAS'
    },
    productsForShop(shop) {
      if (this.isNearbyType) {
        return Array.from({ length: this.nearbyProductsCount }, () => ({
          ...NEARBY_PLACEHOLDER_PRODUCT,
          item_name: i18n.t('1d819fcf.1fd1d5')
        }))
      }
      return this.distributorData || []
    },
    productImage(product) {
      return product?.pics && product.pics.length > 0 ? product.pics[0] : ''
    },
    productTags(product) {
      return product?.tags || ['4折', '活动标']
    },
    async loadSpecifyGoods() {
      const first = this.value?.data?.[0]
      if (!first?.distributor_id) {
        this.distributorData = []
        return
      }
      const res = await this.$api.template.getShelvesGoods({
        data_type: 'distributor',
        data_value: first.distributor_id
      })
      this.distributorData = res || []
    }
  }
}
</script>
