<style lang="scss" src="./index.scss"></style>
<template>
  <div :class="{ 'wgt-goods-scroll': true, 'padded': value.padded }">
    <!-- moreLink: {{ value.goodsSetting }} -->
    <div v-if="value.title || value.subtitle" class="wgt-hd">
      <span class="title">{{ value.title }}</span>
      <SpCountDown
        v-show="value.goodsSetting.type == 'seckill'"
        :time="value.goodsSetting.secKillLastSeconds"
        :describe="getStatusText(value.goodsSetting.secKillStatus)"
      />
      <SpCountDown
        v-show="value.goodsSetting.type == 'limitTimeSale'"
        :time="value.goodsSetting.limitTimeSaleLastSeconds"
        :describe="getStatusText(value.goodsSetting.limitTimeSaleLastStatus)"
      />
      <span v-show="value.goodsSetting.type == 'goods'" class="sub-title">{{
        value.subtitle
      }}</span>
    </div>
    <div class="wgt-bd" :class="{ 'spaced': value.spaced }">
      <!-- 挂件自定义部分 -->
      <div class="scroll-goods">
        <div v-for="(item, index) in goodsList" :key="`scroll-item__${index}`" class="scroll-item">
          <div
            v-if="value.leaderboard && value.goodsSetting.type == 'goods'"
            class="goods-leaderboard"
          >
            <div class="goods-leaderboard-text">NO.{{ index + 1 }}</div>
            <SpImage :src="subscriptImg" :width="40" :height="40" />
          </div>
          <div class="goods-imgs">
            <SpImage :src="item.imgUrl" :width="130" :height="130" />
          </div>
          <div class="goods-title">
            <el-tag v-if="item.isPrescription" type="primary" size="mini" style="background-color: #fff;">处方药</el-tag>
            {{ item.title }}</div>
          <div v-if="value.showPrice" class="goods-caption">
            <template v-if="value.goodsSetting.type == 'goods'">
              <SpPrice class="item-price" :size="15" :value="item.price / 100" />
              <SpPrice :size="13" line-through :value="item.market_price / 100" />
            </template>
            <template v-else>
              <SpPrice :size="15" :value="item.price / 100" />
            </template>
          </div>
          <!-- <div class="activity-label">
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
            </p>
          </div> -->
        </div>
        <div class="scroll-item">
          <div v-if="value.backgroundImg" class="goods-more">
            <SpImage :src="value.backgroundImg" :width="130" :height="200" />
          </div>
          <div
            v-if="
              !value.backgroundImg &&
              value.moreLink &&
              (value.moreLink.linkUrl || value.moreLink.linkPage)
            "
            class="goods-more"
          >
            查看更多
          </div>
        </div>
      </div>
      <!-- 挂件自定义部分 -->
    </div>
  </div>
</template>

<script>
import config from './config'
const subscript = require('@/assets/img/subscript.png')

export default {
  name: 'GoodsScroll',
  wgtName: '商品滚动',
  wgtDesc: '',
  wgtIcon: 'wgt-goods-scroll',
  config: config,
  props: {
    value: [Object, Array]
  },
  data() {
    return {
      subscriptImg: subscript,
      goodsList: []
    }
  },
  watch: {
    'value': {
      handler(newVal) {
        console.log(newVal,'llllkkkkkkk');

        const { type, data, secKillGoods, limitTimeSaleGoods } = newVal.goodsSetting
        if (type == 'goods') {
          this.goodsList = data
        } else if (type == 'limitTimeSale') {
          this.goodsList = limitTimeSaleGoods
        } else {
          this.goodsList = secKillGoods
        }
      },
      deep: true,
      immediate: true
    }
  },
  // computed: {
  //   goodsList() {
  //     const { type, data, secKillGoods, limitTimeSaleGoods } = this.value.goodsSetting
  //     if (type == 'goods') {
  //       return data
  //     } else if (type == 'limitTimeSale') {
  //       return limitTimeSaleGoods
  //     } else {
  //       return secKillGoods
  //     }
  //   }
  // },
  methods: {
    getStatusText(status) {
      if (status == 'in_sale') {
        return '后结束'
      } else if (status == 'in_the_notice') {
        return '后开始'
      } else {
        return '活动已结束'
      }
    }
  }
}
</script>
