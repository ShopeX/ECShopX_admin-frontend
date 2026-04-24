<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.wgt-goods-card {
  .wgt-bd {
    .goods-card {
      &:not(:last-child) {
        margin-bottom: 10px;
      }
      &__header {
        display: flex;
        align-items: center;
        padding-bottom: 10px;
      }
      &__info {
        padding-left: 10px;
        height: 80px;
        display: flex;
        flex-direction: column;
      }
      &__info-title {
        font-size: 14px;
        font-weight: 500;
        color: #333;
      }
      &__info-sales {
        font-size: 12px;
        color: #666;
        margin-top: 4px;
      }
      &__footer {
        height: 40px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .gap-line {
          width: 1px;
          height: 20px;
          background-color: #e5e5e5;
        }
      }
    }
  }
}
</style>
<template>
  <div
    :class="{
      'wgt-goods-card': true,
    }"
    :style="outerStyle"
  >
    <div class="wgt-bd">
      <!-- 挂件自定义部分 -->
      <div
        v-for="(item, index) in value.data"
        :key="`goods-card__${index}`"
        class="goods-card"
        :style="goodsCardInnerStyle"
      >
        <div class="goods-card__header">
          <SpImage :src="item.img_url" width="80" height="80" />
          <div class="goods-card__info">
            <div class="goods-card__info-title">{{ item.item_name }}</div>
            <div class="goods-card__info-price">
              <SpPrice :value="item.price / 100" />
            </div>
            <div v-if="item.sales > 0" class="goods-card__info-sales">
              {{ i18n.t('1ab937c7.44e7eb') }}：{{ item.sales }}
            </div>
          </div>
        </div>
        <div class="goods-card__footer">
          <el-button type="text-default">{{ i18n.t('1ab937c7.56d0b8') }}</el-button>
          <div class="gap-line" />
          <el-button type="text-default">{{ i18n.t('1ab937c7.2971f7') }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { i18n } from '@/i18n'
import config from './config'
import { getOuterStyle, getInnerStyle } from '../../comps/style-utils'
export default {
  // 与 config.name 一致（落库 goodsCard）；与商城 Goods 区分
  // eslint-disable-next-line vue/component-definition-name-casing -- 要求小驼峰 goodsCard
  name: 'goodsCard',
  wgtName: '商品卡片',
  wgtDesc: '',
  wgtIcon: 'wgt-goods-card',
  config: config,
  props: {
    value: [Object, Array]
  },
  data() {
    return {
      i18n,
      currentIndex: 1
    }
  },
  computed: {
    /** 商品卡片块背景：走全局 innerPadding/内层背景配置（与 goods 等挂件一致），未配置时默认白底 */
    goodsCardInnerStyle() {
      const s = { ...getInnerStyle(this.value), borderRadius: '8px' }
      if (!s.backgroundColor && !s.backgroundImage) {
        s.backgroundColor = '#fff'
      }
      return s
    },
    outerStyle() {
      return getOuterStyle(this.value)
    },
    sourceUrl() {
      const { data } = this.value
      return data?.url || ''
    }
  },
  created() {},
  methods: {}
}
</script>
