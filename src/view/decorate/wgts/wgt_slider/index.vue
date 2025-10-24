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
      'wgt-slider': true,
      padded: value.padded
    }"
  >
    <div v-if="value.title || value.subtitle" class="wgt-hd">
      <span class="title">{{ value.title }}</span>
      <span class="sub-title">{{ value.subtitle }}</span>
    </div>
    <div
      class="wgt-bd"
      :class="{
        spaced: value.spaced,
        padded: value.itemPadded
      }"
    >
      <!-- 挂件自定义部分 -->
      <SpImage
        class="placeholder-item"
        :src="value.data.length > 0 ? value.data[0].imgUrl : null"
        fit="contain"
      />
      <!-- <img class="placeholder-item" style="display: block;" :src="value.data.length > 0 ? value.data[0].imgUrl : null" width="100%" /> -->
      <el-carousel
        class="slider-container"
        arrow="never"
        indicator-position="none"
        :interval="value.interval"
        @change="
          e => {
            this.currentIndex = e
          }
        "
      >
        <el-carousel-item
          v-for="(item, index) in value.data"
          :key="index"
          class="slider-item"
          :class="{
            rounded: value.rounded,
            padded: value.itemPadded
          }"
        >
          <!-- <SpImage
            :class="{
              'rounded': value.rounded
            }"
            :src="item.imgUrl"
          /> -->
          <!-- <img :src="item.imgUrl" style="display: block" width="100%" /> -->
          <SpImage :src="item.imgUrl" fit="contain" />
        </el-carousel-item>
      </el-carousel>
      <div
        :class="[
          'slider-pagination',
          value.dotLocation,
          value.shape,
          value.dotColor,
          {
            cover: value.dotCover,
            'cover-padded': value.itemPadded
          }
        ]"
      >
        <template v-if="value.dot">
          <div
            v-for="(item, index) in value.data.length > 0 ? value.data : [1]"
            :key="`dot-item__${index}`"
            :class="['dot-item', { active: currentIndex == index }]"
          />
        </template>
        <template v-else>
          <div class="pagination-count">
            {{ `${currentIndex + 1}/${value.data.length > 0 ? value.data.length : 1}` }}
          </div>
        </template>
      </div>
      <!-- 挂件自定义部分 -->
    </div>
  </div>
</template>

<script>
import config from './config'
export default {
  name: 'Slider',
  wgtName: '轮播',
  wgtDesc: '',
  wgtIcon: 'wgt-slider',
  config: config,
  props: {
    value: [Object, Array]
  },
  data() {
    return {
      currentIndex: 1
    }
  },
  computed: {
    sliderHeight() {}
  },
  created() {},
  methods: {}
}
</script>
