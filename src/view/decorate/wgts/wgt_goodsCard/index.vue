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
.wgt-goods-card {
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
    padding: 0 10px;
    .goods-card {
      background-color: #fff;
      border-radius: 8px;
      &:not(:last-child) {
        margin-bottom: 10px;
      }
      &__header {
        padding: 10px;
        display: flex;
        align-items: center;
      }
      &__info {
        padding-left: 10px;
        height: 80px;
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
      padded: value.padded
    }"
  >
    <div v-if="value.title || value.subtitle" class="wgt-hd">
      <span class="title">{{ value.title }}</span>
      <span class="sub-title">{{ value.subtitle }}</span>
    </div>
    <div class="wgt-bd">
      <!-- 挂件自定义部分 -->
      <div v-for="(item, index) in value.data" :key="`goods-card__${index}`" class="goods-card">
        <div class="goods-card__header">
          <SpImage :src="item.img_url" width="80" height="80" />
          <div class="goods-card__info">
            <div class="goods-card__info-title">{{ item.item_name }}</div>
            <div class="goods-card__info-price">
              <SpPrice :value="item.price / 100" />
            </div>
            <div v-if="item.sales > 0" class="goods-card__info-sales">销量：{{ item.sales }}</div>
          </div>
        </div>
        <div class="goods-card__footer">
          <el-button type="text-default"> 加入心愿 </el-button>
          <div class="gap-line" />
          <el-button type="text-default"> 加入购买 </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from './config'
export default {
  name: 'Goods',
  wgtName: '商品卡片',
  wgtDesc: '',
  wgtIcon: 'wgt-goods-card',
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
    sourceUrl() {
      const { data } = this.value
      return data?.url || ''
    }
  },
  created() {},
  methods: {}
}
</script>
