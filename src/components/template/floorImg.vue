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
<template>
  <div class="component-wrap" :class="{ 'component-padded': base.padded, active: active }">
    <div class="current-active" />

    <!-- <div class="floorImg-title">{{base.title}}</div> -->

    <div class="floorImg">
      <div v-if="base.openBackImg" class="floorImg_img_list">
        <img :src="wximageurl + base.backgroundImg" class="floorImg-imgs">
        <div v-for="(item, index) in data" :key="index" class="floorImg_img_li1">
          <img class="floorImg_img" :src="wximageurl + item.imgUrl">
          <div class="imgs_title" :style="'color:' + base.WordColor">
            {{ item.ImgTitle }}
          </div>
        </div>
      </div>

      <div v-else class="floorImg_img_list">
        <div v-for="(item, index) in data" :key="index" class="floorImg_img_li2">
          <img class="floorImg_img" :src="wximageurl + item.imgUrl">
          <div class="imgs_title" :style="'color:' + base.WordColor">
            {{ item.ImgTitle }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    res: {
      type: Object,
      default: {}
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      name: '',
      base: {},
      data: []
    }
  },
  watch: {
    res(value) {
      if (value) {
        this.setData(value)
      }
    }
  },
  mounted() {
    this.setData(this.res)
  },
  methods: {
    setData(val) {
      this.name = val.name
      this.base = val.base
      this.data = val.data
    }
  }
}
</script>

<style scoped lang="scss">
.floorImg-title {
  font-size: 20px;
  color: #00081c;
  text-align: center;
  padding: 20px 0;
}
.floorImg {
  // height: 225px;
  display: flex;
  align-items: center;
  overflow-x: scroll;
  white-space: nowrap;
  position: relative;
  // background: #0ff;

  .floorImg-imgs {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
.floorImg_img_list {
  // margin: 0 20px;
  padding: 0 10px 0 20px;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 10;
  height: 225px;
  .floorImg_img_li1 {
    width: 160px;
    height: 160px;
    margin-right: 10px;
    z-index: 15;
    flex-shrink: 0;
    position: relative;
    background: #f5f5f5;
    .floorImg_img {
      width: 100%;
      height: 100%;
    }
    .imgs_title {
      width: 100%;
      text-align: center;
      position: absolute;
      bottom: 14px;
    }
  }

  .floorImg_img_li2 {
    width: 160px;
    height: 230px;
    margin-right: 10px;
    z-index: 15;
    flex-shrink: 0;
    position: relative;
    background: #f5f5f5;
    .floorImg_img {
      width: 100%;
      height: 100%;
    }
    .imgs_title {
      text-align: center;
      position: absolute;
      bottom: 10px;
      left: 10px;
    }
  }
}
</style>
