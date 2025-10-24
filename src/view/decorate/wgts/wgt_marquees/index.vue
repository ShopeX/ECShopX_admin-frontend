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
.wgt-marquees {
  &.padded {
    padding: 10px 0;
  }

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
  }

  .medium {
    padding: 0 16px;
    line-height: 32px;
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
<template>
  <div
    :class="{
      'wgt-marquees': true,
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
        spaced: value.spaced
      }"
      :style="{
        background: value.bgcolor
      }"
    >
      <!-- 挂件自定义部分 -->
      <template v-if="value.direction == 'vertical'">
        <el-carousel height="30px" direction="vertical" :autoplay="true" indicator-position="none">
          <el-carousel-item v-for="(item, index) in value.dataContent" :key="index">
            <div
              :style="{
                color: value.fontcolor
              }"
              class="medium"
            >
              {{ item.title }}
            </div>
          </el-carousel-item>
        </el-carousel>
      </template>

      <template v-else>
        <marquee style="margin: 4px 0; display: block" scrolldelay="200">
          <span
            v-for="(item, index) in value.dataText"
            :key="index"
            :style="{
              color: value.fontcolor
            }"
            >{{ item.title }}</span
          >
        </marquee>
      </template>

      <!-- 挂件自定义部分 -->
    </div>
  </div>
</template>

<script>
import config from './config'
export default {
  name: 'Marquees',
  wgtName: '文字轮播',
  wgtDesc: '',
  wgtIcon: 'wgt-marquees',
  config: config,
  props: {
    value: [Object, Array]
  },
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>
