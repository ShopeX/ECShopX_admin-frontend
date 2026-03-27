<template>
  <div class="column-goods" :style="customStyle">
    <!-- 标题区域 -->
    <div v-if="showColumnHeader" class="column-goods-header">
      <div class="header-title">
        <img
          v-if="value.titleText && value.titleText.type === 'image' && value.titleText.image"
          :src="value.titleText.image"
          class="header-image"
          alt=""
        >
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
        {{ $t('16c372fc.90ef7c') }}<el-icon class="el-icon-arrow-right" />
      </div>
    </div>

    <!-- 瀑布流布局：左右两列 -->
    <div class="waterfall-container">
      <!-- 左列 -->
      <div class="waterfall-column left-column">
        <div
          v-for="(item, index) in leftColumnItems"
          :key="item.item_id || item.itemId || `left-${index}`"
          class="column-goods-item"
        >
          <!-- 商品图片 -->
          <div class="goods-img-wrapper">
            <img :src="getItemImg(item)" class="goods-image" alt="">
            <!-- 已售罄标签 -->
            <div v-if="isSoldOut(item)" class="sold-out-mask">
              <span class="sold-out-text">{{ $t('16c372fc.b12876') }}</span>
            </div>
          </div>

          <!-- 商品信息 -->
          <div class="goods-info">
            <!-- 商品名称 -->
            <div class="goods-name">
              {{ item.item_name || item.itemName || '' }}
            </div>

            <!-- 标签区域 -->
            <div class="goods-tags" v-if="getTags(item).length > 0">
              <span
                v-for="(tag, tagIndex) in getTags(item)"
                :key="tagIndex"
                class="goods-tag"
                :style="getTagStyle(tag.type)"
              >
                {{ tag.name }}
              </span>
            </div>

            <!-- 价格区域 -->
            <div class="goods-price-wrapper">
              <div class="current-price" v-if="value.dataType === 'pointsmall_items'">
                <span class="price-value">{{ formatPointPrice(item) }}</span>
              </div>
              <template v-else>
                <div class="current-price">
                  <span class="price-symbol">¥</span>
                  <span class="price-value">{{ formatPrice(item.price) }}</span>
                </div>
                <div
                  class="original-price"
                  v-if="item.market_price && item.market_price > item.price"
                >
                  {{ formatPrice(item.market_price) }}
                </div>
                <div class="discount-tag" v-if="getDiscount(item)">
                  {{ getDiscount(item) }}
                  <span class="discount-tag-text">{{ $t('16c372fc.96c015') }}</span>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- 右列 -->
      <div class="waterfall-column right-column">
        <div
          v-for="(item, index) in rightColumnItems"
          :key="item.item_id || item.itemId || `right-${index}`"
          class="column-goods-item"
        >
          <!-- 商品图片 -->
          <div class="goods-img-wrapper">
            <img :src="getItemImg(item)" class="goods-image" alt="">
            <!-- 已售罄标签 -->
            <div v-if="isSoldOut(item)" class="sold-out-mask">
              <span class="sold-out-text">{{ $t('16c372fc.b12876') }}</span>
            </div>
          </div>

          <!-- 商品信息 -->
          <div class="goods-info">
            <!-- 商品名称 -->
            <div class="goods-name">
              {{ item.item_name || item.itemName || '' }}
            </div>

            <!-- 标签区域 -->
            <div class="goods-tags" v-if="getTags(item).length > 0">
              <span
                v-for="(tag, tagIndex) in getTags(item)"
                :key="tagIndex"
                class="goods-tag"
                :style="getTagStyle(tag.type)"
              >
                {{ tag.name }}
              </span>
            </div>

            <!-- 价格区域 -->
            <div class="goods-price-wrapper">
              <div class="current-price" v-if="value.dataType === 'pointsmall_items'">
                <span class="price-value">{{ formatPointPrice(item) }}</span>
              </div>
              <template v-else>
                <div class="current-price">
                  <span class="price-symbol">¥</span>
                  <span class="price-value">{{ formatPrice(item.price) }}</span>
                </div>
                <div
                  class="original-price"
                  v-if="item.market_price && item.market_price > item.price"
                >
                  {{ formatPrice(item.market_price) }}
                </div>
                <div class="discount-tag" v-if="getDiscount(item)">
                  {{ getDiscount(item) }}
                  <span class="discount-tag-text">{{ $t('16c372fc.96c015') }}</span>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ColumnGoods',
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
  computed: {
    // 左列商品（奇数索引：0, 2, 4...）
    leftColumnItems() {
      return this.goodsList.filter((_, index) => index % 2 === 0)
    },
    // 右列商品（偶数索引：1, 3, 5...）
    rightColumnItems() {
      return this.goodsList.filter((_, index) => index % 2 === 1)
    },
    showColumnHeader() {
      console.log(this.value.titleText, this.value.moreBtn, 'columngoods titleText, moreBtn')
      return (
        (this.value.titleText && (this.value.titleText.text || this.value.titleText.image)) ||
        (this.value.moreBtn && this.value.moreBtn.show)
      )
    }
  },
  methods: {
    getItemImg(item) {
      if (item.main_img) return item.main_img
      const first = item.pics && item.pics[0]
      return first ? (typeof first === 'string' ? first : first.url || '') : ''
    },
    formatPointPrice(item) {
      const point = item.point != null ? item.point : 0
      const pointStr = point + this.$t('5c0a1eb5.9f68a8')
      const price = item.price != null && item.price !== '' ? Number(item.price) : 0
      if (!price || price === 0) return pointStr
      return pointStr + '+' + this.formatPrice(price) + '元'
    },
    // 格式化价格（除以100）
    formatPrice(price) {
      if (!price) return '0.00'
      const numPrice = typeof price === 'string' ? parseFloat(price) : price
      return (numPrice / 100).toFixed(2)
    },
    // 判断是否已售罄
    isSoldOut(item) {
      return item.item_total_store === 0 || item.store === 0 || item.is_stock === 0
    },
    // 获取标签列表
    getTags(item) {
      const tags = []

      // 从 promotion_activity 获取标签
      if (item.promotion_activity && Array.isArray(item.promotion_activity)) {
        item.promotion_activity.forEach((act) => {
          if (act.tag_name) {
            tags.push({
              name: act.tag_name,
              type: act.tag_type || 'default'
            })
          }
        })
      }

      // 从 tags 字段获取
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach((tag) => {
          if (tag.tag_name || tag.name) {
            tags.push({
              name: tag.tag_name || tag.name,
              type: tag.tag_type || 'default'
            })
          }
        })
      }

      return tags.slice(0, 2) // 最多显示2个标签
    },

    // 获取标签样式
    getTagStyle(tag) {
      const colorMap = {
        'marketing': {
          color: 'var(--primary)',
          borderColor: 'rgba(212,0,59,0.15)',
          background: 'rgba(212,0,59,0.1)'
        },
        'single_group': {
          color: 'var(--primary)',
          borderColor: 'rgba(212,0,59,0.15)',
          background: 'rgba(212,0,59,0.1)'
        },
        'coupon': {
          color: '#CB9800',
          borderColor: 'rgba(203,152,0,0.15)',
          background: 'rgba(203,152,0,0.1)'
        },
        'promotion': {
          color: '#FF6505',
          borderColor: 'rgba(255,101,5,0.15)',
          background: 'rgba(255,101,5,0.1)'
        },
        'default': {
          color: '#FF6505',
          borderColor: 'rgba(255,101,5,0.15)',
          background: 'rgba(255,101,5,0.1)'
        }
      }
      return colorMap[tag] || colorMap['default']
    },
    // 计算折扣
    getDiscount(item) {
      if (!item.market_price || !item.price) return ''
      const marketPrice =
        typeof item.market_price === 'string' ? parseFloat(item.market_price) : item.market_price
      const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price
      if (marketPrice <= 0 || price >= marketPrice) return ''
      const discount = ((price / marketPrice) * 10).toFixed(1)
      return `${discount}`
    }
  }
}
</script>

<style lang="scss" scoped>
.column-goods {
  width: 100%;
  box-sizing: border-box;
  border-radius: 8px;

  .column-goods-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 9px;

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

  .waterfall-container {
    display: flex;
    gap: 9px;
    align-items: flex-start;
  }

  .waterfall-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 9px;
  }

  .column-goods-item {
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border-radius: 6px;
    overflow: hidden;
    box-sizing: border-box;

    .goods-img-wrapper {
      width: 100%;
      aspect-ratio: 1;
      position: relative;
      overflow: hidden;
      background: #bfbfbf;

      .goods-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .sold-out-mask {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;

        .sold-out-text {
          color: #ffffff;
          font-size: 14px;
          font-weight: 500;
        }
      }
    }

    .goods-info {
      padding: 6px 8px 12px;
      display: flex;
      flex-direction: column;
      min-width: 0;
      box-sizing: border-box;

      .goods-name {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 13px;
        color: #1a1a1a;
        line-height: 18px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 36px;
      }

      .goods-tags {
        display: flex;
        flex-wrap: nowrap;
        overflow: hidden;
        gap: 4px;
        margin-top: 4px;

        .goods-tag {
          display: inline-block;
          padding: 0 4px;
          line-height: 13px;
          font-size: 9px;
          border: 1px solid;
          border-radius: 3px;
          white-space: nowrap;
        }
      }

      .goods-price-wrapper {
        display: flex;
        align-items: baseline;
        gap: 4px;
        margin-top: 8px;
        height: 17px;
        .current-price {
          display: flex;
          align-items: baseline;
          color: #1a1a1a;

          .price-symbol {
            font-family: D-DIN-PRO, D-DIN-PRO;
            font-weight: 500;
            font-size: 13px;
            line-height: 1;
          }

          .price-value {
            font-family: D-DIN-PRO, D-DIN-PRO;
            font-weight: 600;
            font-size: 17px;
            line-height: 1;
          }
        }

        .original-price {
          font-family: D-DIN-PRO, D-DIN-PRO;
          font-weight: 400;
          font-size: 12px;
          color: #bfbfbf;
          text-decoration: line-through;
        }

        .discount-tag {
          display: flex;
          align-items: center;
          font-family: D-DIN-PRO, D-DIN-PRO;
          font-weight: 500;
          font-size: 12px;
          color: var(--primary);

          .discount-tag-text {
            font-size: 9px;
            color: var(--primary);
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
          }
        }
      }
    }
  }
}
</style>
