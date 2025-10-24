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
  <div>
    <slot />
    <div class="gray-box">
      <div class="title">
        <h2>{{ t_data.base.title }}</h2>
        <h5>{{ t_data.base.subtitle }}</h5>
      </div>
      <div class="floors">
        <div v-for="(item, j) in t_data.data" class="good-item">
          <div style="">
            <div class="good-img">
              <!-- <a @click="openProduct(item.item_id)"> -->
              <img :src="item.imgUrl">
              <!-- </a> -->
            </div>
            <h6 class="good-title" v-html="item.title">
              {{ item.title }}
            </h6>
            <h3 class="sub-title ellipsis">
              {{ item.title }}
            </h3>
            <div class="good-price pr">
              <div :class="[this.usage === 'store' ? 'ds' : 'ds-n', 'pa']">
                <!-- <a @click="openProduct(item.item_id)"> -->
                <y-button text="查看详情" style="margin: 0 5px" />
                <!-- </a> -->
                <y-button text="加入购物车" style="margin: 0 5px" class-style="main-btn" />
              </div>
              <p>¥ {{ (Number(item.price) / 100).toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import YButton from '../../common/YButton'
export default {
  name: 'GoodsGrid',
  components: {
    YButton
  },
  props: {
    data: {
      type: Object
    },
    usage: {
      type: String
    }
  },
  data() {
    return {
      t_data: this.data
    }
  }
}
</script>
<style lang="scss" scoped>
@mixin wh($w, $h: $w) {
  width: $w;
  height: $h;
}
%block-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.activity-panel {
  // width: 1220px;
  width: 100%;
  margin: 0 auto;
  .box {
    overflow: hidden;
    position: relative;
    z-index: 0;
    margin-top: 25px;
    box-sizing: border-box;
    border: 1px solid rgba(0, 0, 0, 0.14);
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 3px 8px -6px rgba(0, 0, 0, 0.1);
  }
  .content {
    float: left;
    position: relative;
    box-sizing: border-box;
    width: 25%;
    height: 200px;
    text-align: center;
  }
  .content ::before {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    box-sizing: border-box;
    border-left: 1px solid #f2f2f2;
    border-left: 1px solid rgba(0, 0, 0, 0.1);
    width: 100%;
    height: 100%;
    content: '';
    pointer-events: none;
  }
  .i {
    // width: 305px;
    width: 100%;
    height: 200px;
  }
  .cover-link {
    cursor: pointer;
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 4;
    background: url(data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEHAAEALAAAAAABAAEAAAICTAEAOw==)
      repeat;
  }
  a {
    color: #5079d9;
    cursor: pointer;
    transition: all 0.15s ease-out;
    text-decoration: none;
  }
  a:hover {
    box-shadow: inset 0 0 38px rgba(0, 0, 0, 0.08);
    transition: all 0.15s ease;
  }
}
.gray-box {
  position: relative;
  margin-bottom: 30px;
  overflow: hidden;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #dcdcdc;
  border-color: rgba(0, 0, 0, 0.14);
  box-shadow: 0 3px 8px -6px rgba(0, 0, 0, 0.1);
  .title {
    padding-left: 30px;
    position: relative;
    z-index: 10;
    height: 60px;
    padding: 0 10px 0 24px;
    border-bottom: 1px solid #d4d4d4;
    border-radius: 8px 8px 0 0;
    box-shadow: rgba(0, 0, 0, 0.06) 0 1px 7px;
    background: #f3f3f3;
    background: -webkit-linear-gradient(#fbfbfb, #ececec);
    background: linear-gradient(#fbfbfb, #ececec);
    line-height: 60px;
    font-size: 18px;
    color: #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h2 {
      font-size: 18px;
      font-weight: 400;
      color: #626262;
      display: inline-block;
    }
  }
}
.floors {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  .imgbanner {
    width: 50%;
    height: 430px;
    .cover-link {
      cursor: pointer;
      display: block;
      position: absolute;
      top: 60px;
      left: 0;
      width: 50%;
      height: 430px;
      z-index: 4;
      background: url(data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEHAAEALAAAAAABAAEAAAICTAEAOw==)
        repeat;
    }
    .cover-link:hover {
      box-shadow: inset 0 0 38px rgba(0, 0, 0, 0.08);
      transition: all 0.15s ease;
    }
  }
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
}
.good-item {
  background: #fff;
  width: 25%;
  transition: all 0.5s;
  height: 430px;
  .ds,
  .ds-n {
    @extend %block-center;
    width: 100%;
    display: none;
  }

  .good-img {
    @include wh(206px);
    margin: 50px auto 10px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .good-price {
    margin: 15px 0;
    height: 30px;
    text-align: center;
    line-height: 30px;
    color: #d44d44;
    font-family: Arial;
    font-size: 18px;
    font-weight: 700;
  }
  .good-title {
    line-height: 1.2;
    font-size: 16px;
    color: #424242;
    margin: 0 auto;
    padding: 0 14px;
    text-align: center;
    overflow: hidden;
  }
  h3 {
    text-align: center;
    line-height: 1.2;
    font-size: 12px;
    color: #d0d0d0;
    padding: 10px;
  }
}
</style>
