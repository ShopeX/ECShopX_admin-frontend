<template>
  <div class="hotranking-goods" :style="customStyle">
    <!-- 标题区域 -->
    <div v-if="showHeader" class="hotranking-goods-header">
      <div class="header-title">
        <img
          v-if="value.titleText && value.titleText.type === 'image' && value.titleText.image"
          :src="value.titleText.image"
          class="header-image"
          alt=""
        />
        <span
          v-if="value.titleText && value.titleText.type === 'text' && value.titleText.text"
          :style="{ color: value.titleColor }"
          class="header-text"
        >
          {{ value.titleText?.text }}
        </span>
      </div>
      <div
        v-if="value.moreBtn && value.moreBtn.show"
        class="header-more"
        :style="{ color: value.moreBtn.color }"
      >
        {{ i18n.t('e968027c.90ef7c') }}<el-icon class="el-icon-arrow-right" />
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="hotranking-goods-list">
      <div
        v-for="(item, index) in topGoods"
        :key="`top-${index}`"
        :class="`hotranking-goods-item hotranking-goods-item-${index + 1}`"
      >
        <!-- TOP标签 -->
        <div class="top-badge">
          <span v-if="index < 3" class="top-badge-text">TOP.</span>
          <span class="top-badge-text">{{ index + 1 }}</span>
        </div>

        <!-- 商品图片 -->
        <div class="goods-img-wrapper">
          <img :src="item.main_img || item.pics?.[0] || ''" class="goods-image" alt="" />
          <!-- 满减标签 -->
          <div v-if="getPromotionText(item)" class="promotion-label">
            {{ getPromotionText(item) }}
          </div>
        </div>

        <!-- 商品信息 -->
        <div class="goods-info">
          <div class="goods-name">{{ item.item_name || '' }}</div>
          <div class="goods-price">
            <span class="price-unit">¥</span>
            <span class="price-text">{{ formatPrice(item.price) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { i18n } from '@/i18n'

export default {
  name: 'HotRankingGoods',
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
    return { i18n }
  },
  computed: {
    topGoods() {
      const list = this.goodsList

      if (!list || !Array.isArray(list)) {
        return []
      }
      return list
    },
    showHeader() {
      return (
        (this.value.titleText && (this.value.titleText.text || this.value.titleText.image)) ||
        (this.value.moreBtn && this.value.moreBtn.show)
      )
    }
  },
  methods: {
    // 格式化价格（除以100）
    formatPrice(price) {
      if (!price) return '0.00'
      const numPrice = typeof price === 'string' ? parseFloat(price) : price
      return (numPrice / 100).toFixed(2)
    },
    // 获取促销文本（满减信息）
    getPromotionText(item) {
      if (!item.promotion_activity || !Array.isArray(item.promotion_activity)) {
        return ''
      }
      console.log(item.promotion_activity)

      // 查找满减活动
      const fullMinus = item.promotion_activity.find((act) => act.tag_name)
      if (fullMinus) {
        return fullMinus.tag_name
      }

      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
.hotranking-goods {
  width: 100%;
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 8px;

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;

    .header-title {
      display: flex;
      align-items: center;
      font-weight: 600;
      font-size: 15px;

      .header-image {
        height: 18px;
      }

      .header-text {
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        font-size: 15px;
      }
    }

    .header-more {
      font-size: 13px;
      cursor: pointer;
    }
  }

  &-list {
    display: flex;
    gap: 5px;
    justify-content: flex-start;
    overflow: hidden;
  }

  &-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    min-width: 77px;
    width: 77px;
    flex-shrink: 0;
    max-width: 77px;
    border-radius: 6px;
    overflow: hidden;

    .top-badge {
      position: absolute;
      top: 0px;
      left: 0px;
      z-index: 2;
      padding: 0px 3px;
      border-radius: 4px 0px 4px 0px;
      border-width: 1px;
      border-style: solid;
      font-family: D-DIN-PRO, D-DIN-PRO;
      font-weight: 800;
      font-size: 9px;
      text-align: center;
      font-style: normal;
      text-transform: none;
      height: 14px;
      line-height: 14px;
      box-sizing: border-box;
    }

    &.hotranking-goods-item {
      .top-badge {
        background: #efefef;
        border: 1px solid hsla(0, 0%, 60%, 0.25);
        color: #999999;
      }
    }

    &.hotranking-goods-item-1 {
      .top-badge {
        background: #f6efd8;
        border: 1px solid rgba(203, 152, 0, 0.25);
        color: #cb9800;
      }
    }

    &.hotranking-goods-item-2 {
      .top-badge {
        background: #e6e9ef;
        border: 1px solid rgba(87, 107, 149, 0.25);
        color: #576b95;
      }
    }

    &.hotranking-goods-item-3 {
      .top-badge {
        background: #ffe5d7;
        border: 1px solid rgba(222, 127, 72, 0.25);
        color: #de7f48;
      }
    }

    .goods-img-wrapper {
      width: 100%;
      aspect-ratio: 1;
      position: relative;
      border-radius: 6px;
      overflow: hidden;
      background: #f5f5f5;
      margin-bottom: 4px;

      .goods-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .promotion-label {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 10px;
        color: #f57231;
        height: 20px;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 50%);
        border-radius: 0px 0px 4px 4px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .goods-info {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .goods-name {
        width: 100%;
        line-height: 15px;
        font-size: 11px;
        color: #404040;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        text-align: center;
        font-weight: 500;
      }

      .goods-price {
        display: flex;
        align-items: baseline;
        gap: 2px;
        color: #1a1a1a;

        .price-unit {
          font-family: D-DIN-PRO, D-DIN-PRO;
          font-weight: 500;
          font-size: 11px;
          line-height: 11px;
        }

        .price-text {
          font-family: D-DIN-PRO, D-DIN-PRO;
          font-weight: 600;
          font-size: 14px;
          line-height: 14px;
        }
      }
    }
  }
}
</style>
