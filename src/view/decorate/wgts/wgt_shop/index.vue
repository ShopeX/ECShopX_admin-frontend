<style lang="scss" src="./index.scss"></style>
<template>
  <div class="wgt-shop" :style="outerStyle">
    <div :class="['wgt-shop-container-list', { 'wgt-shop-container-list-single': value.data.length == 1 }]">
      <div
        v-for="(item, index) in value.data"
        :key="index"
        class="wgt-shop-item"
        :style="innerStyle"
      >
        <div class="shop-header">
          <div class="shop-info">
            <div class="shop-logo">
              <img :src="value.distributor?.logo || defaultShopLogo" alt="店铺logo">
            </div>
            <div class="shop-name">{{ item?.name || 'ADIDAS' }}</div>
          </div>
          <div class="shop-actions">
            <div class="favorite-btn">
              <i class="el-icon-star-off" />
            </div>
            <div class="enter-shop-btn">进店逛逛</div>
          </div>
        </div>
        <div class="shop-products">
          <div v-for="(item, index) in distributorData" :key="index" class="product-item">
            <div class="product-image">
              <el-image
                :src="item?.pics && item?.pics.length > 0 ? item?.pics[0] : ''"
                alt="商品图片"
              >
                <div slot="error" class="image-slot" />
              </el-image>
            </div>
            <div class="product-title">{{ item?.item_name || '商品名称' }}</div>
            <div class="product-tags">
              <span
                v-for="(tag, tagIndex) in item?.tags || ['4折', '活动标']"
                :key="tagIndex"
                class="tag"
                :class="'tag-' + tagIndex"
                >{{ tag }}</span
              >
            </div>
            <div class="product-price">
              <span class="current-price-symbol">¥</span>
              <span class="current-price">{{ item?.price / 100 }}</span>
              <span class="original-price">{{ item?.market_price / 100 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from './config'
import { getOuterStyle, getInnerStyle } from '../../comps/style-utils'
const defaultShopLogo = require('@/assets/imgs/decorate/default-shop-logo.png')
export default {
  name: 'Shop',
  wgtName: '店铺',
  wgtDesc: '',
  wgtIcon: 'application',
  wgtType: 2,
  config: config,
  props: {
    value: [Object, Array]
  },
  data() {
    return {
      currentIndex: 1,
      defaultShopLogo,
      distributorData: null
    }
  },
  computed: {
    outerStyle() {
      return getOuterStyle(this.value)
    },
    innerStyle() {
      return getInnerStyle(this.value)
    },
  },
  watch: {
    value:{
      handler(newVal) {
      },
    immediate: true,
    deep: true
    },
    'value.data': {
      handler(newVal) {
      
        if (newVal.length > 0) {
          this.getList()
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {},
  methods: {
    async getList() {
      const query = {
        data_type: 'distributor',
        data_value: this.value?.data[0]?.distributor_id
      }
      console.log(this.value?.data, 'getSeckdistributorilldata')
      const res = await this.$api.template.getShelvesGoods(query)
      console.log(res, 'getSeckdistributorilldata')
      this.distributorData = res
    }
  }
}
</script>
