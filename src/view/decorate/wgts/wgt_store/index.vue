<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<style lang="scss" src="./index.scss"></style>
<template>
  <div
    :class="{
      'wgt-store': true,
      padded: value.padded
    }"
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
            <div class="name">{{ value.distributor.name || '店铺名称' }}</div>
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
import config from './config'
const defaultShopLogo = require('@/assets/imgs/decorate/default-shop-logo.png')
export default {
  name: 'Store',
  wgtName: '推荐店铺',
  wgtDesc: '',
  wgtIcon: 'wgt-store',
  config: config,
  props: {
    value: [Object, Array]
  },
  data() {
    return {
      currentIndex: 1,
      defaultShopLogo
    }
  },
  computed: {
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
