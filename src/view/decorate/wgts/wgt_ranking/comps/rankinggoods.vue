<template>
  <div class="ranking-goods" :style="customStyle">
    <!-- 头部区域 -->
    <div class="ranking-header">
      <div class="ranking-header-left">
        <div class="header-title">
          <img
            v-if="value.titleText && value.titleText.type === 'image' && value.titleText.image"
            :src="value.titleText.image"
            class="header-image"
            alt=""
          />
          <span
            v-if="value.titleText && value.titleText.type === 'text' && value.titleText.text"
            class="header-text"
            :style="{ color: value.titleColor }"
          >
            {{ value.titleText?.text ? i18n.t(value.titleText.text) : '' }}
          </span>
        </div>
      </div>
      <!-- 查看更多 -->
      <div
        v-if="value.moreBtn && value.moreBtn.show"
        class="header-more"
        :style="{ color: value.moreBtn.color }"
      >
        {{ i18n.t('47f355d9.44a1f0') }}
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="ranking-goods-list" ref="goodsListRef">
      <div
        v-for="(item, index) in goodsList"
        :key="item.item_id || item.itemId || index"
        class="ranking-goods-item"
      >
        <!-- 排名标签 -->
        <div class="ranking-badge" :class="index < 3 ? `top-badge-${index + 1}` : 'number-badge'">
          <span v-if="index < 3">TOP.{{ index + 1 }}</span>
          <span v-else>{{ index + 1 }}</span>
        </div>

        <!-- 商品图片 -->
        <div class="goods-img-wrapper">
          <img :src="item.main_img || item.pics?.[0] || ''" class="goods-image" alt="" />
          <!-- 销量 -->
          <div class="goods-sales" v-if="item.score">
            <el-image :src="fireIcon" class="fire-icon" alt="" />
            <span class="sales-number">{{ item.score }}</span>
          </div>
        </div>

        <!-- 商品信息 -->
        <div class="goods-info">
          <div class="goods-name-wrapper">
            <!-- 标签 -->

            <!-- 商品名称 -->
            <div class="goods-name">
              <el-image
                v-if="item?.member_preference?.marketing_id"
                :src="memberPreferenceIcon"
                class="goods-tag-icon"
                alt=""
              />
              <el-image
                v-if="item?.promotion_activity?.find((ele) => ele.tag_type == 'limited_time_sale')"
                :src="activitySeckill"
                class="goods-tag-limit-icon"
                alt=""
              />
              {{ item.item_name || item.itemNam }}
            </div>
          </div>

          <!-- 价格 -->
          <div class="goods-price">
            <span class="price-symbol">¥</span>
            <span class="price-value">{{ formatPrice(item.price) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { i18n } from '@/i18n'
import fireIcon from '@/assets/imgs/wgt/fire.png'
import activitySeckill from '@/assets/imgs/wgt/activity_seckill.png'
import memberPreferenceIcon from '@/assets/imgs/wgt/member_preference.png'
export default {
  name: 'RankingGoods',
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    goodsList: {
      type: Array,
      default: () => []
    },
    customStyle: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return { i18n, fireIcon: fireIcon, activitySeckill, memberPreferenceIcon }
  },
  methods: {
    // 格式化价格
    formatPrice(price) {
      if (!price) return '0.00'
      const numPrice = typeof price === 'string' ? parseFloat(price) : price
      // 价格通常以分为单位，需要除以100
      return (numPrice / 100).toFixed(2)
    }
  }
}
</script>

<style lang="scss" scoped>
.ranking-goods {
  width: 100%;
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 12px;
  overflow: hidden;
  position: relative;

  // 背景模糊效果
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: inherit;
    background-size: cover;
    background-position: center;
    filter: blur(10px);
    z-index: 0;
    opacity: 0.3;
    pointer-events: none;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  .ranking-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    color: #ffffff;
    height: 21px;

    .ranking-header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .header-title {
      display: flex;
      align-items: center;
      font-weight: 600;
      font-size: 18px;

      .header-image {
        height: 18px;
        margin-right: 4px;
      }

      .header-text {
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 15px;
      }
    }

    .header-more {
      font-size: 13px;
      cursor: pointer;
      font-weight: 500;
      white-space: nowrap;
    }
  }

  .ranking-goods-list {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE and Edge */

    &::-webkit-scrollbar {
      display: none;
      /* Chrome, Safari, Opera */
    }
  }

  .ranking-goods-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 97px;
    width: 97px;
    flex-shrink: 0;
    border-radius: 6px;
    overflow: hidden;
    background-color: #fff;
    position: relative;

    .ranking-badge {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
      font-family: D-DIN-PRO, D-DIN-PRO;
      font-weight: 800;
      text-align: center;

      &.top-badge-1 {
        height: 14px;
        background: linear-gradient(180deg, #ffebaf 0%, #f0c33b 17%, #654b00 100%);
        border-radius: 6px 0px 6px 0px;
        line-height: 14px;
        padding: 0 4px;
        font-family: D-DIN-PRO, D-DIN-PRO;
        font-weight: 800;
        font-size: 12px;
        color: #ffffff;
        text-shadow: 0px 1px 0px #6b5001;
      }

      &.top-badge-2 {
        height: 14px;
        background: linear-gradient(180deg, #dbe7ff 0%, #97a9ce 17%, #1b222f 100%);
        border-radius: 6px 0px 6px 0px;
        line-height: 14px;
        padding: 0 4px;
        font-family: D-DIN-PRO, D-DIN-PRO;
        font-weight: 800;
        font-size: 12px;
        color: #ffffff;
        text-shadow: 0px 1px 0px #1e2533;
      }

      &.top-badge-3 {
        height: 14px;
        background: linear-gradient(180deg, #ffe2d1 0%, #dc9064 17%, #784427 100%);
        border-radius: 6px 0px 6px 0px;
        line-height: 14px;
        padding: 0 4px;
        font-family: D-DIN-PRO, D-DIN-PRO;
        font-weight: 800;
        font-size: 12px;
        color: #ffffff;
        text-shadow: 0px 1px 0px #7e4829;
      }

      &.number-badge {
        height: 14px;
        background: linear-gradient(180deg, #e3e3e3 0%, #bababa 16%, #444444 100%);
        border-radius: 6px 0px 6px 0px;
        line-height: 14px;
        padding: 0 4px;
        font-family: D-DIN-PRO, D-DIN-PRO;
        font-weight: 800;
        font-size: 12px;
        color: #ffffff;
        text-shadow: 0px 1px 0px #363636;
      }
    }

    .goods-img-wrapper {
      width: 100%;
      height: 99px;
      position: relative;
      border-radius: 6px;
      margin-bottom: 6px;
      overflow: hidden;
      background: #f5f5f5;
      border: 1px solid rgba(203, 152, 0, 0.25);
      box-sizing: border-box;

      .goods-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .goods-sales {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 2;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 50%);
        display: flex;
        align-items: center;
        justify-content: center;

        .fire-icon {
          width: 12px;
          height: 12px;
          object-fit: cover;
        }

        .sales-number {
          font-family: D-DIN-PRO, D-DIN-PRO;
          font-weight: 500;
          font-size: 12px;
          color: #ff9500;
        }
      }
    }

    .goods-info {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 0 6px;

      .goods-name-wrapper {
        width: 100%;
        margin-bottom: 4px;
        display: flex;
        align-items: start;

        .goods-tag-icon {
          width: 31px;
          height: 13px;
          object-fit: cover;
          vertical-align: middle;
        }

        .goods-tag-limit-icon {
          width: 23px;
          height: 13px;
          object-fit: cover;
          vertical-align: middle;
        }

        .goods-name {
          width: 100%;
          line-height: 15px;
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          height: 30px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          font-size: 11px;
          color: #404040;
        }
      }

      .goods-price {
        display: flex;
        align-items: baseline;

        .price-symbol {
          font-family: D-DIN-PRO, D-DIN-PRO;
          font-weight: 500;
          font-size: 11px;
          color: #1a1a1a;
          line-height: 1;
          text-transform: none;
        }

        .price-value {
          height: 14px;
          font-family: D-DIN-PRO, D-DIN-PRO;
          font-weight: 600;
          font-size: 14px;
          color: #1a1a1a;
          line-height: 14px;
          text-transform: none;
        }
      }
    }
  }
}
</style>
