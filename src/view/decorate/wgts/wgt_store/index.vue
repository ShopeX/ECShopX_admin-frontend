<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss" src="./index.scss"></style>
<template>
  <div
    :class="{
      'wgt-store': true,
      padded: value.padded
    }"
    :style="outerStyle"
  >
    <div v-if="value.title || value.subtitle" class="wgt-hd">
      <span class="title">{{ value.title }}</span>
      <span class="sub-title">{{ value.subtitle }}</span>
    </div>
    <div class="wgt-bd">
      <div class="wgt-block" :style="blockStyle">
        <div class="store-info">
          <SpImage
            :src="value.distributor.logo || defaultShopLogo"
            :width="40"
            :height="40"
            :circle="6"
          />
          <div>
            <div class="name">{{ value.distributor.name || i18n.t('a7cc304b.0d4934') }}</div>
            <div class="tags">
              <div v-for="(item, index) in value.tags" :key="`tag__${index}`" class="tag">
                {{ item.tag_name }}
              </div>
            </div>
          </div>
        </div>
        <div class="activity-goods">
          <div v-if="value.imgUrl" class="activity-img">
            <SpImage :circle="6" :src="value.imgUrl" />
          </div>
          <div class="goods-list">
            <div
              v-for="(item, index) in value.items"
              :key="`goods-item__${index}`"
              class="goods-item"
            >
              <SpImage :circle="6" :src="item.imgUrl" :width="80" :height="80" />
              <SpPrice :value="item.price / 100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { i18n } from '@/i18n'
import config from './config'
import { i18n } from '@/i18n'
import { getOuterStyle } from '../../comps/style-utils'
const defaultShopLogo = require('@/assets/imgs/decorate/default-shop-logo.png')
export default {
  name: 'Store',
  wgtName: i18n.t('a7cc304b.089a3d'),
  wgtDesc: '',
  wgtIcon: 'wgt-store',
  config: config,
  props: {
    value: [Object, Array]
  },
  data() {
    return {i18n,
      currentIndex: 1,
      defaultShopLogo
    }
  },
  computed: {
    outerStyle() {
      return getOuterStyle(this.value)
    },
    blockStyle() {
      const { backgroundColor = '' } = this.value
      return {
        backgroundColor
      }
    }
  },
  created() {},
  methods: {}
}
</script>
