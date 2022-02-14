<template>
  <div class="component-wrap" :class="{ 'component-padded': base.padded, 'active': active }">
    <div class="current-active"></div>
    <div v-if="base.title" class="component-header">
      <div class="component-title">
        <div>{{ base.title }}</div>
        <div class="subtitle">{{ base.subtitle }}</div>
      </div>
      <div class="component-more">
        <div class="three-dot"></div>
      </div>
    </div>
    <div class="component-body with-padding">
      <div
        v-if="data.length > 0"
        class="grid-goods out-padding"
        :class="config.style === 'grids' ? 'three-inrow' : 'two-inrow'"
      >
        <div v-for="(item, index) in data.slice(0,50)" :key="index" class="grid-item">
          <div class="goods-wrap">
            <div class="thumbnail">
              <img class="goods-img" :src="wximageurl + item.imgUrl" />
            </div>
            <div class="caption">
              <img
                class="goods-brand"
                v-if="config.brand && config.style !== 'grids'"
                :src="
                  item.brand
                    ? wximageurl + item.brand
                    : 'https://fakeimg.pl/60x60/EFEFEF/CCC/?text=brand&font=lobster'"
              />
              <div class="goods-title">{{ item.title }}</div>
              <div class="goods-title">{{ item.itemEnName }}</div>
              <div v-if="config.showPrice" class="price">
                <span class="cur">¥</span>{{ item.price / 100 }}
              </div>
              <div class="activity-label">
                <p v-for="(s,i) in item.promotionActivity" :key="i" :style="`color: ${colorPrimary};border: 1px solid ${colorPrimary}`">
                  {{s.tag_type=='single_group'?'团购':''}}
                  {{s.tag_type=='full_minus'?'满减':''}}
                  {{s.tag_type=='full_discount'?'满折':''}}
                  {{s.tag_type=='full_gift'?'满赠':''}}
                  {{s.tag_type=='normal'?'秒杀':''}}
                  {{s.tag_type=='limited_time_sale'?'限时特惠':''}}
                  {{s.tag_type == 'plus_price_buy' ? '换购' : ''}}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="goods-more">
      <p class="more-btn">查看更多</p>
    </div> -->
  </div>
</template>

<script>
export default {
  props: {
    res: {
      type: Object,
      default: {}
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    res: {
      deep: true,
      handler(value) {
        if (value) {
          this.setData(value)
        }
      }
    }
  },
  data() {
    return {
      base: {},
      config: {},
      data: [],
      list: [],
      checkde: 0,
      colorPrimary: ''
    }
  },
  methods: {
    setData(val) {
      this.base = val.base
      this.config = val.config
      this.data = val.data
    },
    handleClick(i) {
      this.checkde = i
    }
  },
  mounted() {
    this.setData(this.res)
    this.colorPrimary = this.$store.getters.color_theme.primary
  }
}
</script>

<style scoped lang="scss">
.grid-goods {
  display: flex;
  flex-wrap: wrap;
  &.out-padding {
    margin: 0 -3px;
  }
  &.two-inrow .grid-item {
    width: 50%;
  }
  &.three-inrow .grid-item {
    width: 33.33333%;
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
  .grid-item {
    padding: 3px;
    .goods-wrap {
      border-radius: 6px;
      border: 1px solid #f5f5f5;
      .thumbnail {
        background: #f4f4f4;
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
      .caption {
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
          height: 30px;
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
.tabLlst {
  display: flex;
  padding: 10px 0;
  .tab-l {
    padding: 0 10px;
    font-size: 12px;
    font-weight: 500;
    color: #c7c7c7;
    line-height: 12px;
    letter-spacing: 1px;
    border-left: 1px solid #c7c7c7;
  }
  .checked {
    color: #00081c;
  }
  .tab-l:nth-of-type(1) {
    border-left: none;
  }
}
</style>
