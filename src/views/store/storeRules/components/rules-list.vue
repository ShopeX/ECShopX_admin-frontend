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
    <el-alert
      class="leading-normal !mb-[10px]"
      title="从上到下权重由大到小，拖拽可进行优先级排序"
      type="warning"
      show-icon
      :closable="false"
    />
    <draggable :list="list" group="easyview" class="rules-list">
      <div v-for="(item, index) in list" :key="`wgt-render-item__${index}`" class="rule-item">
        <div class="h-full bg-primary-foreground flex items-center justify-center w-[24px]">
          <SpIcon class="cursor-pointer" name="align-text-both" :size="14" />
        </div>

        <template v-if="item.key === 'distributor_code'">
          <div class="flex leading-normal p-3">
            <el-switch v-model="item.status" />
            <div class="ml-4">
              <div>店铺码进店</div>
              <div class="text-sm text-[#999] mt-2">
                <p>通过带门店参小程序码扫码进入对应店铺</p>
                <p>通过分享小程序卡片进入对应店铺</p>
              </div>
            </div>
          </div>
        </template>
        <template v-if="item.key === 'shop_assistant'">
          <div class="flex leading-normal p-3">
            <el-switch v-model="item.status" />
            <div class="ml-4">
              <div>导购物料进店（需开通导购应用）</div>
              <div class="text-sm text-[#999] mt-2">
                <p>通过扫企微码添加导购加好友的欢迎语推送的小程序卡片进店</p>
                <p>通过导购商城分享的小程序海报、小程序卡片进店</p>
              </div>
              <div class="flex items-center text-md flex-nowrap mt-2.5">
                导购参数保留时长
                <el-input-number
                  size="small"
                  v-model="item.express_time"
                  controls-position="right"
                  :min="0"
                  style="width: 100px; margin: 0 8px"
                />
                ×24小时
              </div>
            </div>
          </div>
        </template>
        <template v-if="item.key === 'shop_white'">
          <div class="flex leading-normal p-3">
            <el-switch v-model="item.status" />
            <div class="ml-4">
              <div>进入白名单店铺（需开启店铺白名单）</div>
              <div class="text-sm text-[#999] mt-2">
                <p>进入用户绑定白名单的店铺</p>
              </div>
            </div>
          </div>
        </template>
        <template v-if="item.key === 'shop_assistant_pro'">
          <div class="flex leading-normal p-3">
            <el-switch v-model="item.status" />
            <div class="ml-4">
              <div>进入专属导购所属店（需开通导购应用）</div>
              <div class="text-sm text-[#999] mt-2">
                <p>进入用户专属导购的归属店铺</p>
              </div>
            </div>
          </div>
        </template>
      </div>
    </draggable>
    <div class="rule-item">
      <div class="holder"></div>
      <div class="flex leading-normal p-3">
        <el-switch v-model="shop_lbs" />
        <div class="ml-4">
          <div>LBS就近进店</div>
          <div class="text-sm text-[#999] mt-2">
            <p>根据用户LBS定位，进入附近店铺</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  components: {
    draggable
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      list: this.value.list,
      shop_lbs: this.value.shop_lbs
    }
  },
  watch: {
    list: {
      handler(newVal) {
        this.$emit('change', {
          list: newVal,
          shop_lbs: this.shop_lbs
        })
      },
      deep: true
    },
    shop_lbs: {
      handler(newVal) {
        this.$emit('change', {
          list: this.list,
          shop_lbs: newVal
        })
      }
    },
    value: {
      handler(newVal) {
        this.list = newVal.list
        this.shop_lbs = newVal.shop_lbs
      },
      deep: true,
    }
  }
}
</script>

<style lang="scss" scoped>
.rule-item {
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  margin-bottom: 10px;
  min-height: 84px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 24px 1fr;
}
</style>
