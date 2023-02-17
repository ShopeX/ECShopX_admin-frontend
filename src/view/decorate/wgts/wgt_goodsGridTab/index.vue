<style lang="scss">
.wgt-goods-grid-tab {
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

  .wgt-goods-grid-tabs-header {
    display: flex;
    padding: 10px 0;
    overflow-x: auto;

    .wgt-goods-grid-tabs-header-item {
      position: relative;
      z-index: 100;
      padding: 0 10px;
      white-space: nowrap;
      font-size: 14px;
      color: #222;
      line-height: 12px;
      letter-spacing: 1px;
      border-left: 1px solid #ddd;
      cursor: pointer;
    }

    .checked {
      font-weight: 700;
      font-size: 18px;
    }
  }

  .wgt-goods-grid-tabs-pane {
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    justify-content: space-between;
    padding: 0 10px;

    .wgt-goods-grid-tabs-pane-item {
      width: calc(50% - 5px);
      min-width: calc(50% - 5px);
      max-width: calc(50% - 5px);
      margin-top: 10px;
      border-radius: 5px;
      overflow: hidden;
      border: 1px solid #ddd;
      background: #ffffff;

      .wgt-goods-grid-tabs-item-img {
        position: relative;

        &::after {
          display: flex;
          padding-top: 100%;
          content: '';
        }

        .goods-img {
          display: block;
          position: absolute;
          width: 100%;
          height: 100%;
        }
      }

      .wgt-goods-grid-tabs-item-info {
        position: relative;
        padding: 0 10px 10px 10px;

        .goods-brand {
          display: block;
          width: 60px;
          height: 60px;
          margin-left: auto;
          margin-right: auto;
          margin-top: -25px;
          margin-bottom: 5px;
          border-radius: 50%;
        }

        .goods-title {
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          margin-top: 5px;
          line-height: 1.4;
          font-size: 12px;
        }

        .price {
          color: #00081c;
        }

        .cur {
          font-size: 10px;
        }

      }

      .activity-label {
        display: flex;
        flex-wrap: wrap;

        p {
          border-radius: 4px;
          padding: 0px 4px;
          font-size: 10px;
          line-height: 16px;
          margin: 0px 2px 2px 0px;
        }
      }
    }
  }

  .goods-more {
    display: flex;
    justify-content: center;
    margin-top: 40px;

    .more-btn {
      text-align: center;
      font-size: 14px;
      line-height: 34px;
      font-weight: 500;
      color: #00081c;
      letter-spacing: 2px;
      width: 140px;
      height: 34px;
      border-radius: 2px;
      border: 1px solid #00081c;
    }
  }

  // .wgt-goods-grid-tab-item {
  //   float: left;
  //   background-size: cover;
  //   background-position: center;
  // }
}
</style>
<template>
  <div :class="{
    'wgt-goods-grid-tab': true,
    'padded': data.padded
  }">
    <div v-if="data.title || data.subtitle" class="wgt-hd">
      <span class="title">{{ data.title }}</span>
      <span class="sub-title">{{ data.subtitle }}</span>
    </div>
    <div class="wgt-goods-grid-tabs-header">
      <div v-for="(item, index) in data.list" :key="index" class="wgt-goods-grid-tabs-header-item"
        :style="checkde == index ? `color: ${colorPrimary}` : ''" :class="checkde == index ? 'checked' : ''"
        @click="handleClick(index)">
        {{ item.tabTitle }}
      </div>
    </div>
    <div v-if="data.list && data.list[checkde] && data.list[checkde].goodsList.length > 0"
      class="wgt-goods-grid-tabs-pane">
      <div v-for="(item, index) in data.list[checkde].goodsList.slice(0, 50)" :key="index"
        class="wgt-goods-grid-tabs-pane-item">
        <div class="wgt-goods-grid-tabs-item-img">
          <SpImage class="goods-img" :src="item.imgUrl ? wximageurl + item.imgUrl : ''" />
        </div>
        <div class="wgt-goods-grid-tabs-item-info">
          <SpImage v-if="data.brand && data.style !== 'grids'" class="goods-brand" :src="
            item.brand
              ? wximageurl + item.brand
              : 'https://fakeimg.pl/60x60/EFEFEF/CCC/?text=brand&font=lobster'
          " />
          <div class="goods-title">
            {{ item.title }}
          </div>
          <div class="goods-title">
            {{ item.itemEnName }}
          </div>
          <div v-if="data.showPrice" class="price">
            <span class="cur">¥</span>{{ item.price / 100 }}
          </div>
          <div class="activity-label">
            <p v-for="(s, i) in item.promotionActivity" :key="i"
              :style="`color: ${colorPrimary};border: 1px solid ${colorPrimary}`">
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
    <div v-else class="wgt-goods-grid-tabs-pane">
      <div v-for="(item) in 4" :key="item" class="wgt-goods-grid-tabs-pane-item">
        <div class="wgt-goods-grid-tabs-item-img">
          <SpImage class="goods-img" src="" />
        </div>
        <div class="wgt-goods-grid-tabs-item-info">
          <SpImage v-if="data.brand && data.style !== 'grids'" class="goods-brand"
            src="https://fakeimg.pl/60x60/EFEFEF/CCC/?text=brand&font=lobster" />
          <div class="goods-title">
            商品名称
          </div>
          <div class="goods-title">
            商品副标题
          </div>
          <div v-if="data.showPrice" class="price">
            <span class="cur">¥</span>0.00
          </div>
        </div>
      </div>
    </div>
    <div class="goods-more">
      <p class="more-btn">
        查看更多
      </p>
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
      checkde: 0,
      goodsGridTabDeep: {},
      colorPrimary: '',
      data: null
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
        this.data = data;
      },
      immediate:true,
      deep:true
    }
  },
  mounted() {
    this.colorPrimary = this.$store.getters.color_theme.primary
  },
  methods: {
    handleClick(i) {
      this.checkde = i
    }
  }
}
</script>
