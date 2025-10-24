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
<style lang="scss">
.wgt-floor-img {
  &.padded {
    padding: 10px 0;
  }
  // .bgc-content {
  //   padding: 0 10px 0 10px;
  // }

  .wgt-hd {
    padding: 10px;
    .title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    .sub-title {
      color: #666;
      margin-left: 4px;
    }
  }
  .wgt-bd {
    position: relative;
    display: flex;
    width: auto;
    overflow-x: auto;
    box-sizing: border-box;
    padding: 0 8px;
    &::-webkit-scrollbar {
      display: none;
    }
    .img-item {
      margin-right: 8px;
      text-align: center;
      .img-title {
        margin-top: 4px;
        font-size: 13px;
      }
    }
  }
}
</style>
<template>
  <div
    :class="{
      'wgt-floor-img': true,
      padded: value.padded
    }"
    :style="{ backgroundImage: `url(${value.openBackImg && value.backgroundImg})` }"
  >
    <div v-if="value.title || value.subtitle" class="wgt-hd">
      <span class="title">{{ value.title }}</span>
      <span class="sub-title">{{ value.subtitle }}</span>
    </div>
    <div class="wgt-bd">
      <!-- 挂件自定义部分 -->
      <div
        v-for="(item, index) in value.data"
        :key="index"
        class="img-item"
        :style="{ color: `${value.WordColor}` }"
      >
        <sp-image :src="item.imgUrl" :circle="8" :width="128" />
        <div class="img-title">{{ item.ImgTitle }}</div>
      </div>
      <!-- 挂件自定义部分 -->
    </div>
  </div>
</template>

<script>
import config from './config'
export default {
  name: 'FloorImg',
  wgtName: '楼层图片',
  wgtDesc: '',
  wgtIcon: 'wgt-floorImg',
  config: config,
  props: {
    value: [Object, Array]
  },
  data() {
    return {}
  },
  computed: {
    // sliderHeight() {}
  },
  created() {},
  methods: {}
}
</script>
