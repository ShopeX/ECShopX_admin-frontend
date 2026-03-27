<template>
  <div class="seckill-goods" :style="customStyle">
    <!-- 头部区域 -->
    <div class="seckill-header">
      <div class="seckill-header-left">
        <div class="header-title">
          <img
            v-if="value.titleType === 'image' && value.titleImage"
            :src="value.titleImage"
            class="header-image"
            alt=""
          >
          <span
            v-if="value.titleType === 'text' && value.titleText"
            class="header-text"
            :style="{ color: value.titleColor }"
          >
            {{ value.titleText }}
          </span>
        </div>
        <!-- 倒计时器 -->
        <div class="countdown-wrapper" v-if="countdownInfo">
          <!-- 状态1: 已经开始，显示倒计时 -->
          <template v-if="countdownInfo.type === 'countdown'">
            <span class="countdown-item">
              <span class="countdown-number">{{ countdownInfo.days }}</span>
              <span class="countdown-unit">{{ i18n.t('12ac1b87.249aba') }}</span>
            </span>
            <span class="countdown-item">
              <span class="countdown-number">{{ countdownInfo.hours }}</span>
            </span>
            <span class="countdown-separator">:</span>
            <span class="countdown-item">
              <span class="countdown-number">{{ countdownInfo.minutes }}</span>
            </span>
            <span class="countdown-separator">:</span>
            <span class="countdown-item">
              <span class="countdown-number">{{ countdownInfo.seconds }}</span>
            </span>
          </template>
          <!-- 状态2: 今明开抢 -->
          <template v-else-if="countdownInfo.type === 'todayOrTomorrow'">
            <div class="start-time-box">
              {{ i18n.t(countdownInfo.text) }}
              <span class="start-time-text">{{ countdownInfo.time }}</span>
            </div>
          </template>
          <!-- 状态3: 显示具体日期时间 -->
          <template v-else-if="countdownInfo.type === 'dateTime'">
            <div class="start-time-box">
              {{ countdownInfo.text }}
              <span class="start-time-text">{{ countdownInfo.time }}</span>
            </div>
          </template>
        </div>
      </div>
      <!-- 查看更多 -->
      <div v-if="value.showMoreBtn" class="header-more" :style="{ color: value.moreBtnColor }">
        {{ i18n.t('12ac1b87.90ef7c') }}<el-icon class="el-icon-arrow-right" />
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="seckill-goods-list" ref="goodsListRef">
      <div
        v-for="(item, index) in goodsList"
        :key="item.item_id || index"
        class="seckill-goods-item"
      >
        <!-- 商品图片 -->
        <div class="goods-img-wrapper">
          <img :src="item.main_img || item.pics?.[0] || ''" class="goods-image" alt="">
          <!-- 补贴标签 -->
          <div v-if="getSubsidyAmount(item) > 0" class="subsidy-label">
            <el-image :src="seckillIcon" class="subsidy-icon" alt="" />
            <span
              >{{ i18n.t('12ac1b87.c2be5c') }}{{ getSubsidyAmount(item)
              }}{{ i18n.t('12ac1b87.c16655') }}</span
            >
          </div>
        </div>

        <!-- 商品信息 -->
        <div class="goods-info">
          <div class="goods-name">{{ item.item_name || i18n.t('12ac1b87.b20296') }}</div>
          <div class="goods-price">
            <span class="price-label">{{ i18n.t('12ac1b87.c0a30e') }}</span>
            <span class="price-symbol">¥</span>
            <span class="price-value">{{ formatPrice(item.activity_price || item.price) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { i18n } from '@/i18n'
import seckillIcon from '@/assets/imgs/wgt/seckill.png'

export default {
  name: 'SeckillGoods',
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
    return {i18n,
      countdownInfo: null,
      countdownTimer: null,
      seckillIcon: seckillIcon
    }
  },
  mounted() {
    this.initCountdown()
  },
  beforeDestroy() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
    }
  },
  watch: {
    goodsList: {
      handler() {
        this.initCountdown()
      },
      deep: true
    }
  },
  methods: {
    // 初始化倒计时
    initCountdown() {
      if (!this.goodsList || this.goodsList.length === 0) {
        this.countdownInfo = null
        return
      }

      // 使用第一个商品的活动时间
      const { promotion_activity } = this.goodsList[0]
      const { start_time, end_time } = promotion_activity?.[0] || {}

      if (!start_time || !end_time) {
        this.countdownInfo = null
        return
      }

      // 清除之前的定时器
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer)
      }

      // 计算并更新倒计时信息
      this.updateCountdownInfo(start_time, end_time)

      // 每秒更新一次
      this.countdownTimer = setInterval(() => {
        this.updateCountdownInfo(start_time, end_time)
      }, 1000)
    },
    // 更新倒计时信息
    updateCountdownInfo(startTime, endTime) {
      const now = Math.floor(Date.now() / 1000)
      const start = typeof startTime === 'string' ? parseInt(startTime) : startTime
      const end = typeof endTime === 'string' ? parseInt(endTime) : endTime

      // 如果活动已经开始，显示倒计时（到结束时间）
      if (now >= start) {
        const diff = end - now
        if (diff <= 0) {
          this.countdownInfo = {
            type: 'countdown',
            days: '00',
            hours: '00',
            minutes: '00',
            seconds: '00'
          }
          if (this.countdownTimer) {
            clearInterval(this.countdownTimer)
          }
          return
        }

        const days = Math.floor(diff / 86400)
        const hours = Math.floor((diff % 86400) / 3600)
        const minutes = Math.floor((diff % 3600) / 60)
        const seconds = diff % 60

        this.countdownInfo = {
          type: 'countdown',
          days: String(days).padStart(2, '0'),
          hours: String(hours).padStart(2, '0'),
          minutes: String(minutes).padStart(2, '0'),
          seconds: String(seconds).padStart(2, '0')
        }
        return
      }

      // 活动未开始，判断是今明开抢还是显示具体日期
      const startDate = new Date(start * 1000)
      const nowDate = new Date()

      // 获取今天的开始时间（00:00:00）
      const todayStart = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate())
      const tomorrowStart = new Date(todayStart)
      tomorrowStart.setDate(tomorrowStart.getDate() + 1)
      const dayAfterTomorrowStart = new Date(todayStart)
      dayAfterTomorrowStart.setDate(dayAfterTomorrowStart.getDate() + 2)

      const startDateOnly = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      )
      const timeStr = this.formatTime(startDate)

      // 判断是否是今天或明天
      if (startDateOnly.getTime() === todayStart.getTime()) {
        // 今天开抢
        this.countdownInfo = {
          type: 'todayOrTomorrow',
          text: '12ac1b87.4739d2',
          time: timeStr
        }
      } else if (startDateOnly.getTime() === tomorrowStart.getTime()) {
        // 明天开抢
        this.countdownInfo = {
          type: 'todayOrTomorrow',
          text: '12ac1b87.b151a1',
          time: timeStr
        }
      } else {
        // 显示具体日期时间
        this.countdownInfo = {
          type: 'dateTime',
          text: this.formatDateTime(startDate),
          time: timeStr
        }
      }
    },
    // 格式化时间（HH:mm）
    formatTime(date) {
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${hours}:${minutes}`
    },
    // 格式化日期时间（X月X日 HH:mm）
    formatDateTime(date) {
      const month = date.getMonth() + 1
      const day = date.getDate()
      const time = this.formatTime(date)
      return `${month}月${day}日`
    },
    // 计算补贴金额
    getSubsidyAmount(item) {
      if (!item.price || !item.activity_price) {
        return 0
      }
      const originalPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price
      const activityPrice =
        typeof item.activity_price === 'string'
          ? parseFloat(item.activity_price)
          : item.activity_price
      const subsidy = Math.floor((originalPrice - activityPrice) / 100)
      return subsidy > 0 ? subsidy : 0
    },
    // 格式化价格
    formatPrice(price) {
      if (!price) return '0.00'
      const numPrice = typeof price === 'string' ? parseFloat(price) : price
      // 价格通常以分为单位，需要除以100
      return (numPrice / 100).toFixed(0)
    }
  }
}
</script>

<style lang="scss" scoped>
.seckill-goods {
  width: 100%;
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 12px;
  overflow: hidden;

  .seckill-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    color: #ffffff;

    .seckill-header-left {
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
        font-weight: 600;
        font-size: 18px;
        color: #ffffff;
      }
    }

    .countdown-wrapper {
      display: flex;
      align-items: center;
      gap: 2px;

      .countdown-item {
        display: flex;
        align-items: center;
        gap: 2px;

        .countdown-number {
          display: inline-block;
          padding: 2px 3px;
          background-color: #ffffff;
          border-radius: 3px;
          text-align: center;
          font-family: D-DIN-PRO, D-DIN-PRO;
          font-weight: 600;
          font-size: 15px;
          color: var(--primary);
          line-height: 15px;
        }

        .countdown-unit {
          font-size: 12px;
          color: #ffffff;
          margin-left: 2px;
          font-weight: 500;
        }
      }

      .countdown-separator {
        color: #ffffff;
        font-size: 14px;
        font-weight: 600;
      }

      .start-time-box {
        background-color: #ffffff;
        border-radius: 3px;
        padding: 2px 6px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 12px;
        color: var(--primary);
        white-space: nowrap;
        height: 20px;
        display: flex;
        align-items: center;

        .start-time-text {
          font-size: 14px;
          color: var(--primary);
          font-weight: 500;
          padding-left: 3px;
        }
      }
    }

    .header-more {
      font-size: 13px;
      cursor: pointer;
      color: #ffffff;
      white-space: nowrap;
    }
  }

  .seckill-goods-list {
    display: flex;
    gap: 5px;
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

  .seckill-goods-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 99px;
    width: 99px;
    flex-shrink: 0;
    border-radius: 6px;
    overflow: hidden;
    background-color: #fff;
    padding-bottom: 8px;

    .goods-img-wrapper {
      width: 100%;
      height: 99px;
      position: relative;
      border-radius: 6px;
      margin-bottom: 4px;

      .goods-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .subsidy-label {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 16px;
        background: #ffad42;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 11px;
        color: #ffffff;

        .subsidy-icon {
          width: 13px;
          height: 22px;
          top: -2px;
          left: 0;
          position: absolute;
        }
      }
    }

    .goods-info {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .goods-name {
        width: 100%;
        line-height: 17px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        text-align: center;
        padding: 0px 6px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 12px;
        color: #1a1a1a;
      }

      .goods-price {
        display: flex;
        align-items: baseline;
        gap: 2px;
        color: var(--primary);

        .price-label {
          font-family: PingFang SC, PingFang SC;
          font-weight: 500;
          font-size: 10px;
          color: var(--primary);
        }

        .price-symbol {
          font-family: D-DIN-PRO, D-DIN-PRO;
          font-weight: 500;
          font-size: 11px;
          color: var(--primary);
          line-height: 1;
        }

        .price-value {
          font-family: D-DIN-PRO, D-DIN-PRO;
          font-weight: 600;
          font-size: 15px;
          color: var(--primary);
          line-height: 1;
        }
      }
    }
  }
}
</style>
