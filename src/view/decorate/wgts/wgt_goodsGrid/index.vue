<style lang="scss" src="./index.scss"></style>
<template>
  <div
    :class="{
      'wgt-goods-grid': true,
      'padded': value.padded
    }"
  >
    <div v-if="value.title || value.subtitle" class="wgt-hd">
      <div>
        <span class="title">{{ value.title }}</span>
        <span class="sub-title">{{ value.subtitle }}</span>
      </div>
      <div class="wgt-more" />
    </div>
    <div class="wgt-bd">
      <!-- 挂件自定义部分 -->
      <div v-if="value.style === 'grid'" class="list-grid">
        <div class="lf-box">
          <div v-for="(item, index) in leftGoodsList" :key="`left-item__${index}`" class="item-box">
            <SpImage :src="item.imgUrl" />
            <div class="item-info" :style="{ 'padding-top': value.brand ? '30px' : '4px' }">
              <div v-if="value.brand" class="brand-logo">
                <SpImage :src="item.brand" :width="60" :height="60" circle />
              </div>
              <div class="name">
                <el-tag
                  v-if="item.medicine_data?.is_prescription == 1"
                  type="primary"
                  size="mini"
                  style="background-color: #fff"
                  >处方药</el-tag
                >
                {{ item.title }}
              </div>
              <div v-if="value.showPrice" class="price">
                <template v-if="item.point">  
                  <span class="item-price">{{ item.point }}积分</span>
                </template>
                <template>
                  <SpPrice class="item-price" :value="item.price / 100" :size="15" />
                </template>
                <SpPrice
                  class="line-price"
                  :value="item.market_price / 100"
                  :size="13"
                  line-through
                />
              </div>
            </div>
          </div>
        </div>
        <div class="rg-box">
          <div
            v-for="(item, index) in rightGoodsList"
            :key="`right-item__${index}`"
            class="item-box"
          >
            <SpImage :src="item.imgUrl" />
            <div class="item-info" :style="{ 'padding-top': value.brand ? '30px' : '4px' }">
              <div v-if="value.brand" class="brand-logo">
                <SpImage :src="item.brand" :width="60" :height="60" circle />
              </div>
              <div class="name">
                <el-tag
                  v-if="item.medicine_data?.is_prescription == 1"
                  type="primary"
                  size="mini"
                  style="background-color: #fff"
                  >处方药</el-tag
                >
                {{ item.title }}
              </div>
              <div v-if="value.showPrice" class="price">
                <template v-if="item.point">
                  <span class="item-price">{{ item.point }}积分</span>
                </template>
                <template>
                  <SpPrice class="item-price" :value="item.price / 100" :size="15" />
                </template>
                <SpPrice
                  class="line-price"
                  :value="item.market_price / 100"
                  :size="13"
                  line-through
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="list-grids">
        <div v-for="(item, index) in goodsList" :key="`grids-item__${index}`" class="item-box">
          <SpImage :src="item.imgUrl" />
          <div class="item-info" :style="{ 'padding-top': value.brand ? '30px' : '4px' }">
            <div v-if="value.brand" class="brand-logo">
              <SpImage :src="item.brand" :width="60" :height="60" circle />
            </div>
            <div class="name">
              <el-tag
                v-if="item.medicine_data?.is_prescription == 1"
                type="primary"
                size="mini"
                style="background-color: #fff"
                >处方药</el-tag
              >
              {{ item.title }}
            </div>
            <div v-if="value.showPrice" class="price">
              <template v-if="item.point">
                <span class="item-price">{{ item.point }}积分</span>
              </template>
              <template>
                <SpPrice class="item-price" :value="item.price / 100" :size="15" />
              </template>
              <SpPrice
                class="line-price"
                :value="item.market_price / 100"
                :size="13"
                line-through
              />
            </div>
          </div>
        </div>
      </div>
      <!-- <div
        :class="{
          'wgt-goods-grid-goods': true,
          'wgt-goods-grid-goods-three-inrow': value.style === 'grids'
        }"
      >
        <div v-for="(item, index) in value.data" :key="index" class="wgt-goods-grid-goods-item">
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
      </div> -->
      <!-- 挂件自定义部分 -->
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
      leftGoodsList: [],
      rightGoodsList: [],
      goodsList: []
    }
  },
  // computed: {
  //   leftGoodsList() {
  //     console.log('leftGoodsList computed 执行')
  //     const { goodsSetting = {} } = this.localValue || {}
  //     const { type, data = [], pointGoods = [] } = goodsSetting
  //     const list = type === 'point' ? pointGoods : data
  //     const result = list.filter((_, index) => index % 2 === 0)
  //     console.log('leftGoodsList result:', result)
  //     return result
  //   },
  //   rightGoodsList() {
  //     console.log('rightGoodsList computed 执行')
  //     const { goodsSetting = {} } = this.localValue || {}
  //     const { type, data = [], pointGoods = [] } = goodsSetting
  //     const list = type === 'point' ? pointGoods : data
  //     const result = list.filter((_, index) => index % 2 === 1)
  //     console.log('rightGoodsList result:', result)
  //     return result
  //   }
  // },
  watch: {
    value: {
      handler(newVal) {
        console.log(newVal, 'newVal')
        const { goodsSetting = {} } = newVal || {}
        const { type, data = [], pointGoods = [] } = goodsSetting
        const list = type === 'point' ? pointGoods : data
        if(newVal.style === 'grid'){
          this.leftGoodsList = list.filter((_, index) => index % 2 === 0)
          this.rightGoodsList = list.filter((_, index) => index % 2 === 1)
        }else{
          this.goodsList = list
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
  },
  mounted() {
    console.log(this.value, 'value-grid')
  },
  methods: {}
}
</script>
