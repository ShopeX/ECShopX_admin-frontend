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
<style scoped lang="scss">
.addCartas-view {
  width: 375px;
  height: 667px;
  padding: 10px 0 0 0;
  margin-left: 100px;
  overflow: hidden;
  background-color: #f5f5f5;

  .template {
    margin-right: -15px;
    height: 100%;
    overflow-y: overlay;
  }

  .search-box {
    display: flex;
    align-items: center;
    height: 30px;
    background: #ffffff;
    border-radius: 30px;
    margin: 0 12px;
    padding: 0 12px;
    border: 1px solid var(--primary);

    .search-input {
      color: #999999;
      margin-left: 8px;
      font-size: 12px;
      line-height: 12px;
    }

    img {
      width: 14px;
      height: 14px;
    }
  }

  .one-level {
    position: relative;
    display: flex;
    align-items: center;
    height: 82px;
    margin: 0 12px;
    font-size: 10px;
    overflow: hidden;

    img {
      width: 38px;
      height: 38px;
      border-radius: 50%;
    }

    &-item {
      height: 82px;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      margin-right: 18px;
      text-align: center;

      &-img {
        border: 2px solid var(--primary);
      }

      &-imgs {
        width: 40px !important;
        height: 40px !important;
      }

      &-imgs-span {
        width: 40px !important;
        height: 40px !important;
        border-radius: 50%;
        overflow: hidden;
        line-height: 40px !important;
        background-color: #fff;
      }

      &-img-span {
        margin-top: 2px;
        width: 40px !important;
        height: 40px !important;
        border-radius: 50%;
        overflow: hidden;
        line-height: 40px !important;
        background-color: #fff;
        border: 2px solid var(--primary);
      }

      &-titles {
        margin-top: 5px;
        width: 50px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &-title {
        margin-top: 4px;
        width: 50px;
        height: 16px;
        background: var(--primary);
        border-radius: 14px;
        text-align: center;
        color: #ffffff;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
      }
    }

    .all {
      position: absolute;
      right: 0;
      z-index: 99;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 11px;
      color: #000000;
      line-height: 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 30px;
      background-color: #f5f5f5;
      height: 100%;
      padding: 20px 0;

      img {
        margin-top: 2px;
        width: 9px;
        height: 9px;
        border-radius: inherit;
      }
    }
  }

  .level-box {
    display: flex;
    height: 546px;

    &-left {
      height: 500px;
      width: 100px;

      .two-levels {
        background-color: #ffffff;
      }

      .two-level {
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: flex-start;
        line-height: 36px;

        .lone {
          width: 5px;
          height: 12px;
          background: var(--primary);
        }

        &-item-title {
          width: 90px;
          height: 36px;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding-left: 10px;
        }
      }
    }

    &-right {
      background-color: #fff;
      flex: 1;
    }

    .three-level-list {
      margin-top: 10px;
      height: 22px;
      overflow: hidden;

      &-title {
        height: 40px;
        border-radius: 28px;
        padding: 4px 10px;
        font-size: 11px;
        margin-left: 8px;
      }

      &-titles {
        background: #ffeeed;
      }
    }

    .three-level-item {
      flex: 1;
      background: #ffffff;
      padding: 0 10px;

      .three-list {
        display: flex;
        width: 100%;
        height: 70px;
        margin-top: 12px;

        &-img {
          width: 70px;
          height: 70px;
          border-radius: 4px;
          margin-right: 8px;
        }

        &-title {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;

          .name {
            font-family: PingFangSC, PingFang SC;
            font-weight: 600;
            font-size: 12px;
            color: #222222;
            line-height: 18px;
          }

          .price {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 14px;

            .price1 {
              font-family: PingFangSC, PingFang SC;
              font-weight: 600;
              font-size: 16px;
              color: var(--primary);
              line-height: 45px;

              .price2 {
                font-size: 12px;
              }
            }

            .price3 {
              font-family: PingFangSC, PingFang SC;
              font-weight: 400;
              font-size: 11px;
              color: #bbbbbb;
              line-height: 30px;
              text-decoration-line: line-through;
              margin-left: 6px;
            }

            .cart {
              width: 20px;
              height: 20px;
            }
          }
        }
      }
    }

    .three-level-item-title {
      margin-top: 20px;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
  }
}
</style>

<template>
  <div class="addCartas-view">
    <!-- 搜索框 -->
    <div class="search-box">
      <img src="@/assets/imgs/search-for.png" alt="">
      <div class="search-input">|</div>
      <span class="search-input">搜索</span>
    </div>
    <div>
      <!-- 一级分类 -->
      <div v-if="oneList.length > 0" class="one-level">
        <div
          v-for="(item, index) in oneList"
          :key="index"
          class="one-level-item"
          @click="oneCli(index)"
        >
          <span
            v-if="!item.image_url"
            :class="{
              'one-level-item-imgs-span': index != oneIndex,
              'one-level-item-img-span': index == oneIndex
            }"
            >{{ item.category_name }}</span
          >
          <img
            v-if="item.image_url"
            :class="{
              'one-level-item-imgs': index != oneIndex,
              'one-level-item-img': index == oneIndex
            }"
            :src="item.image_url"
            alt=""
          >
          <span
            :class="{
              'one-level-item-titles': index != oneIndex,
              'one-level-item-title': index == oneIndex
            }"
            >{{ item.category_name }}</span
          >
        </div>
        <div class="all">
          <span>全</span><span>部</span> <img src="@/assets/imgs/classification.png" alt="">
        </div>
      </div>

      <div v-if="oneList.length > 0" class="level-box">
        <!-- 二级分类 -->
        <div class="level-box-left">
          <div
            v-for="(item, index) in oneList?.[oneIndex]?.children"
            :key="index"
            :class="{ 'two-level': true, 'two-levels': twoIndex == index }"
            @click="twoCli(index)"
          >
            <div v-if="twoIndex == index" class="lone" />
            <div class="two-level-item-title">{{ item?.category_name || '' }}</div>
          </div>
        </div>
        <!-- 三级分类 -->
        <div class="level-box-right">
          <!-- 三级分类列表 -->
          <div
            v-if="oneList?.[oneIndex]?.children?.[twoIndex]?.children?.length > 0"
            class="three-level-list"
          >
            <span
              v-for="(item, index) in oneList?.[oneIndex]?.children?.[twoIndex]?.children"
              :key="index"
              :class="{
                'three-level-list-title': true,
                'three-level-list-titles': index == threeIndex
              }"
              @click="threeCli(index)"
              >{{ item?.category_name || '' }}</span
            >
          </div>
          <!-- 三级分类商品 -->
          <div class="three-level-item">
            <div v-for="(item, index) in goodsIndex" :key="index" class="three-list">
              <img class="three-list-img" :src="item.pics[0]" alt="">
              <div class="three-list-title">
                <span class="name">{{ item.itemName }}</span>
                <div class="price">
                  <div>
                    <span class="price1"
                      >{{ item.cost_price / 100 }}.<span class="price2">96</span></span
                    >
                    <span class="price3">{{ item.cost_price / 100 }}</span>
                  </div>
                  <img class="cart" src="@/assets/imgs/shopping-cart.png" alt="">
                </div>
              </div>
            </div>
            <div v-if="goodsIndex.length == 0" class="three-level-item-title">暂无数据哟～</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { IS_ADMIN, IS_SUPPLIER, IS_DISTRIBUTOR } from '@/utils'

export default {
  data() {
    return {
      oneList: [],
      oneIndex: 0,
      twoIndex: 0,
      threeIndex: 0,
      goodsIndex: [],
      main_cat_id: []
    }
  },
  mounted() {
    this.feath()
  },
  methods: {
    async feath() {
      //获取ecshopx取平台配置，管理分类
      //获取云店/内购/官网取平台配置，销售分类分类
      const res = await this.$api.goods.getCategory(
        this.VERSION_PLATFORM() ? { is_main_category: true } : {}
      )
      res.forEach(element => {
        if (element?.children?.length > 0) {
          element?.children?.unshift({
            category_id: '',
            category_name: '全部'
          })
          element?.children?.forEach(element1 => {
            if (element1?.children?.length > 0) {
              element1?.children?.unshift({
                category_id: '',
                category_name: '全部'
              })
            }
          })
        }
      })
      this.oneList = res
      this.oneCli(0)
    },
    oneCli(index) {
      this.oneIndex = index
      this.twoIndex = 0
      this.threeIndex = 0
      this.main_cat_id = [this.oneList[this.oneIndex].category_id]
      this.getItemsListAll()
    },
    twoCli(index) {
      this.twoIndex = index
      this.threeIndex = 0
      if (!this.oneList[this.oneIndex].children[this.twoIndex].category_id) {
        this.main_cat_id = [this.oneList[this.oneIndex].category_id]
      } else {
        this.main_cat_id = [
          this.oneList[this.oneIndex].category_id,
          this.oneList[this.oneIndex].children[this.twoIndex].category_id
        ]
      }
      this.getItemsListAll()
    },
    threeCli(index) {
      this.threeIndex = index
      if (
        !this.oneList[this.oneIndex].children[this.twoIndex].children[this.threeIndex].category_id
      ) {
        this.main_cat_id = [
          this.oneList[this.oneIndex].category_id,
          this.oneList[this.oneIndex].children[this.twoIndex].category_id
        ]
      } else {
        this.main_cat_id = [
          this.oneList[this.oneIndex].category_id,
          this.oneList[this.oneIndex].children[this.twoIndex].category_id,
          this.oneList[this.oneIndex].children[this.twoIndex].children[this.threeIndex].category_id
        ]
      }
      this.getItemsListAll()
    },
    async getItemsListAll() {
      let params = {
        page: 1,
        pageSize: 10,
        item_type: 'normal',
        operate_source: IS_SUPPLIER() ? 'supplier' : 'platform',
        item_source: 'platform'
      }
      if (this.VERSION_PLATFORM()) {
        params.main_cat_id = this.main_cat_id
      } else {
        params.category = this.main_cat_id[this.main_cat_id.length - 1]
        params.distributor_id = 0
      }
      const res = await this.$api.goods.getItemsListAll(params)
      this.goodsIndex = res.list
    }
  }
}
</script>
