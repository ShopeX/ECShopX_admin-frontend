<style lang="scss" src="./index.scss"></style>
<template>
  <div
    :class="{
      'wgt-goods-grid-tab': true,
      'padded': data.padded
    }"
  >
    <div v-if="data.title || data.subtitle" class="wgt-hd">
      <span class="title">{{ data.title }}</span>
      <span class="sub-title">{{ data.subtitle }}</span>
    </div>
    <div class="wgt-bd">
      <!-- 挂件自定义部分 -->
      <div class="tabs-header">
        <div
          v-for="(item, index) in data.list"
          :key="index"
          class="tab-item"
          :class="[
            'tab-item',
            {
              'checked': checked == index
            }
          ]"
          @click="handleClick(index)"
        >
          {{ item.tabTitle }}
        </div>
      </div>

      <div class="tab-content">
        <div class="lf-box">
          <div v-for="(item, index) in leftGoodsList" :key="`left-item__${index}`" class="item-box">
            <SpImage :src="item.imgUrl" />
            <div class="item-info" :style="{ 'padding-top': value.brand ? '30px' : '4px' }">
              <div v-if="value.brand" class="brand-logo">
                <SpImage :src="item.brand" :width="60" :height="60" circle />
              </div>
              <div class="name">
                <el-tag v-if="item.medicine_data?.is_prescription == 1" type="primary" size="mini" style="background-color: #fff;">处方药</el-tag>
                {{ item.title }}
              </div>
              <div v-if="value.showPrice" class="price">
                <SpPrice class="item-price" :value="item.price / 100" :size="15" />
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
                <el-tag v-if="item.medicine_data?.is_prescription == 1" type="primary" size="mini" style="background-color: #fff;">处方药</el-tag>
                {{ item.title }}
              </div>
              <div v-if="value.showPrice" class="price">
                <SpPrice class="item-price" :value="item.price / 100" :size="15" />
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

      <div class="goods-more">
        <p class="more-btn">查看更多</p>
      </div>

      <!-- 挂件自定义部分 -->
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import config from './config'
export default {
  name: 'GoodsGridTab',
  wgtName: '商品Tab',
  wgtDesc: '',
  wgtIcon: 'wgt-goods-grid-tab',
  config: config,
  props: {
    value: [Object, Array]
  },
  data() {
    return {
      currentIndex: 1,
      checked: 0,
      goodsGridTabDeep: {},
      data: null
    }
  },
  computed: {
    leftGoodsList() {
      const { goodsList } = this.value.list[this.checked]
      const leftFilterGoods = goodsList.filter((item, index) => {
        if (index % 2 == 0) {
          return item
        }
      })
      return leftFilterGoods
    },
    rightGoodsList() {
      const { goodsList } = this.value.list[this.checked]
      const rightFilterGoods = goodsList.filter((item, index) => {
        if (index % 2 == 1) {
          return item
        }
      })
      return rightFilterGoods
    }
  },
  watch: {
    value: {
      handler(val) {
        let data = val
        const { list } = data
        if (!list || list.length === 0) {
          data.list = [{ tabTitle: 'newTable', goodsList: [] }]
        }
        this.data = data
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {},
  methods: {
    handleClick(i) {
      this.checked = i
    }
  }
}
</script>
