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
    <div v-if="base.title" class="component-header">
      <div class="component-title">
        <div>{{ base.title }}</div>
        <div class="subtitle">
          {{ base.subtitle }}
        </div>
      </div>
      <div class="component-more">
        <div class="goods-more">全部商品</div>
      </div>
    </div>
    <div class="component-body with-padding">
      <div v-for="(item, index) in data" :key="index" class="coupon-component">
        <!--<template v-if="item.imgUrl">-->
        <!--<img class="coupon-img" :src="item.imgUrl"/>-->
        <!--</template>-->
        <template>
          <div
            class="content-bg"
            :style="{
              background:
                'linear-gradient(' +
                '169deg, ' +
                item.backgroundOne +
                ' 0, ' +
                item.backgroundTwo +
                ' 54%, ' +
                item.backgroundThree +
                ' 100%)'
            }"
          >
            <div class="coupon-amount">
              {{ item.amount }}
              <div v-if="item.type === 'cash'" class="amount-cur">¥</div>
              <div v-if="item.type === 'discount'" class="amount-cur">折</div>
            </div>
            <!--<div class="coupon-brand">
              <img class="brand-img" :src="wximageurl + item.imgUrl"/>
            </div>-->
            <div class="coupon-caption">
              <div class="coupon-content">
                <div class="brand-name">
                  {{ item.title }}
                </div>
                <div class="brand-name">
                  {{ item.startTime }}
                </div>
                <div class="brand-name">
                  {{ item.endTime }}
                </div>
                <!--<div class="coupon-desc">{{item.desc}}</div>-->
              </div>
            </div>
          </div>
        </template>
        <el-button size="mini" class="coupon-getted-btn"> 领取 </el-button>
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
      base: {},
      data: []
    }
  },
  watch: {
    res: {
      deep: true,
      handler(value) {
        if (value) {
          this.setData(value)
        }
      }
    }
  },
  mounted() {
    this.setData(this.res)
  },
  methods: {
    setData(val) {
      this.base = val.base
      val.data.map(item => {
        item.background =
          'linear-gradient(169deg' + item.backgroundOne + '0%,' + item.backgroundTwo + '100%'
      })
      this.data = val.data
    }
  }
}
</script>

<style scoped lang="scss">
.goods-more {
  width: 200px;
  font-size: 12px;
}
.component-body {
  display: flex;
  justify-content: flex-start;
}
.content-bg {
  border-radius: 20px;
  padding: 8px;
}
.coupon-component {
  min-height: 76px;
  position: relative;
  width: 32%;
  margin-right: 2%;
  justify-content: space-between;
  &:last-child {
    margin-right: 0;
  }
  /* &::before {
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 50%;
      height: 100%;
      background: radial-gradient(circle at left, transparent 5px, #f0f2f5 5px);
      background-size: 100% 15px;
      content: "";
      z-index: -1;
    }
    &::after {
      display: block;
      position: absolute;
      right: 0;
      top: 0;
      width: 50%;
      height: 100%;
      background: radial-gradient(circle at right, transparent 5px, #f0f2f5 5px);
      background-size: 100% 15px;
      content: "";
      z-index: -1;
    }
    &.with-img {
      padding: 0;
      &::before, &::after {
        content: none;
      }
    }*/
  .coupon-img {
    width: 100%;
    height: auto;
  }
  .coupon-amount {
    display: inline-block;
    position: relative;
    font-size: 24px;
    color: #ffffff;
    line-height: 0.8;
    /*padding: 0 20px 0 10px;*/
    .amount-cur {
      font-size: 12px;
      position: absolute;
      top: -5px;
      right: -8px;
      line-height: 1;
    }
  }
  .coupon-caption {
    flex: 1;
    color: #ffffff;
    .coupon-content {
      padding-top: 5px;
      width: 100%;
      .brand-name {
        width: 100%;
        font-size: 10px;
        line-height: 1.5;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .coupon-desc {
        font-size: 12px;
        color: #999;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .coupon-getted-btn {
    position: absolute;
    bottom: 2px;
    right: 4px;
    padding: 0;
    width: 36px;
    height: 16px;
    transform: translateY(-50%);
    font-size: 12px;
    background: #ffffff;
    border-radius: 8px;
  }
}
</style>
