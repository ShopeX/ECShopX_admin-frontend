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
      <!-- <div class="component-more">
        <div class="three-dot"></div>
      </div> -->
    </div>
    <div class="component-body with-padding">
      <div
        v-for="(item, index) in data"
        :key="index"
        class="coupon-component"
        :class="{ 'with-img': item.imgUrl }"
      >
        <template v-if="item.imgUrl">
          <img class="coupon-img" :src="item.imgUrl">
        </template>
        <template v-else>
          <div class="coupon-amount">
            <div>{{ item.amount }}</div>
            <div v-if="item.type === 'cash'" class="amount-cur">RMB</div>
            <div v-if="item.type === 'discount'" class="amount-cur">折</div>
          </div>
          <div class="coupon-brand">
            <img class="brand-img" :src="wximageurl + item.imgUrl">
          </div>
          <div class="coupon-caption">
            <div class="coupon-content">
              <div class="brand-name">
                {{ item.title }}
              </div>
              <div class="coupon-desc">
                {{ item.desc }}
              </div>
            </div>
          </div>
        </template>
        <el-button size="mini" class="coupon-getted-btn"> 领取 </el-button>
      </div>
    </div>
    <div class="component-body with-padding">
      <div
        v-for="(item, index) in voucher_package"
        :key="index"
        class="coupon-component"
        :class="{ 'with-img': item.imgUrl }"
      >
        <template v-if="item.imgUrl">
          <img class="coupon-img" :src="item.imgUrl">
        </template>
        <template v-else>
          <div class="coupon-brand">
            <img class="brand-img" :src="wximageurl + item.imgUrl">
          </div>
          <div class="coupon-caption">
            <div class="coupon-content">
              <div class="brand-name">
                {{ item.title }}
              </div>
              <div class="coupon-desc">
                {{ item.package_describe }}
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
      data: [],
      voucher_package: []
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
      this.data = val.data
      this.voucher_package = val.voucher_package
    }
  }
}
</script>

<style scoped lang="scss">
.coupon-component {
  position: relative;
  display: flex;
  align-items: center;
  position: relative;
  padding: 12.5px 17.5px;
  margin-bottom: 5px;
  z-index: 0;
  &:last-child {
    margin-bottom: 0;
  }
  &::before {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 50%;
    height: 100%;
    background: radial-gradient(circle at left, transparent 5px, #f0f2f5 5px);
    background-size: 100% 15px;
    content: '';
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
    content: '';
    z-index: -1;
  }
  &.with-img {
    padding: 0;
    &::before,
    &::after {
      content: none;
    }
  }
  .coupon-img {
    width: 100%;
    height: auto;
  }
  .coupon-amount {
    display: flex;
    align-items: flex-end;
    font-size: 36px;
    line-height: 0.8;
    padding: 0 20px 0 10px;
    .amount-cur {
      padding-left: 2px;
      font-size: 12px;
      color: #999;
      line-height: 1;
    }
  }
  .coupon-caption {
    flex: 1;
    padding-right: 60px;
    .coupon-content {
      padding-top: 5px;
      .brand-name {
        font-size: 14px;
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
    top: 50%;
    right: 15px;
    transform: translateY(-50%);
    font-size: 13px;
    background: #fff;
  }
}
</style>
