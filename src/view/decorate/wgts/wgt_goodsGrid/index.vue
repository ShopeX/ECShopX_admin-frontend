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
      <div
        :class="{
          'wgt-goods-grid-goods': true,
          'wgt-goods-grid-goods-three-inrow': value.style === 'grids'
        }"
      >
        <div
          v-for="(item, index) in value.data.slice(0, 50)"
          :key="index"
          class="wgt-goods-grid-goods-item"
        >
          <div class="wgt-goods-grid-goods-item-img">
            <SpImage class="goods-img" :src="wximageurl + item.imgUrl" />
          </div>
          <div class="wgt-goods-grid-goods-item-info">
            <SpImage
              v-if="value.brand && value.style !== 'grids'"
              class="goods-brand"
              :src="
                item.brand
                  ? wximageurl + item.brand
                  : 'https://fakeimg.pl/60x60/EFEFEF/CCC/?text=brand&font=lobster'
              "
            />
            <div class="goods-title">
              {{ item.title }}
            </div>
            <div class="goods-title">
              {{ item.itemEnName }}
            </div>
            <div v-if="value.showPrice" class="price">
              <span class="cur">¥</span>{{ item.price / 100 }}
            </div>
            <div class="activity-label">
              <p
                v-for="(s, i) in item.promotionActivity"
                :key="i"
                :style="`color: ${colorPrimary};border: 1px solid ${colorPrimary}`"
              >
                {{ s.tag_type == 'single_group' ? '团购' : '' }}
                {{ s.tag_type == 'full_minus' ? '满减' : '' }}
                {{ s.tag_type == 'full_discount' ? '满折' : '' }}
                {{ s.tag_type == 'full_gift' ? '满赠' : '' }}
                {{ s.tag_type == 'normal' ? '秒杀' : '' }}
                {{ s.tag_type == 'limited_time_sale' ? '限时特惠' : '' }}
                {{ s.tag_type == 'plus_price_buy' ? '换购' : '' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from './config'
export default {
  name: 'GoodsGrid',
  wgtName: '商品栅格',
  wgtDesc: '',
  wgtIcon: 'wgt-goodsgrid',
  config: config,
  props: {
    value: [Object, Array]
  },
  data() {
    return {
      colorPrimary: ''
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.colorPrimary = this.$store.getters.color_theme.primary
  },
  methods: {}
}
</script>
