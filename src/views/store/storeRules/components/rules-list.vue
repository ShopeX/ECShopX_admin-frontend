<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-alert
      class="leading-normal !mb-[10px]"
      :title="$t('c94cb914.caa479')"
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
              <div>{{ $t('c94cb914.bb6d98') }}</div>
              <div class="text-sm text-[#999] mt-2">
                <p>{{ $t('c94cb914.e45ade') }}</p>
                <p>{{ $t('c94cb914.777f40') }}</p>
              </div>
            </div>
          </div>
        </template>
        <template v-if="item.key === 'shop_assistant'">
          <div class="flex leading-normal p-3">
            <el-switch v-model="item.status" />
            <div class="ml-4">
              <div>{{ $t('c94cb914.c2cb2d') }}</div>
              <div class="text-sm text-[#999] mt-2">
                <p>{{ $t('c94cb914.e2f3b5') }}</p>
                <p>{{ $t('c94cb914.2bb3ec') }}</p>
              </div>
              <div class="flex items-center text-md flex-nowrap mt-2.5">
                {{ $t('c94cb914.d9e091') }}
                <el-input-number
                  size="small"
                  v-model="item.express_time"
                  controls-position="right"
                  :min="0"
                  style="width: 100px; margin: 0 8px"
                />
                {{ $t('c94cb914.dabef3') }}
              </div>
            </div>
          </div>
        </template>
        <template v-if="item.key === 'shop_white'">
          <div class="flex leading-normal p-3">
            <el-switch v-model="item.status" />
            <div class="ml-4">
              <div>{{ $t('c94cb914.aecdc5') }}</div>
              <div class="text-sm text-[#999] mt-2">
                <p>{{ $t('c94cb914.f2c894') }}</p>
              </div>
            </div>
          </div>
        </template>
        <template v-if="item.key === 'shop_assistant_pro'">
          <div class="flex leading-normal p-3">
            <el-switch v-model="item.status" />
            <div class="ml-4">
              <div>{{ $t('c94cb914.d98812') }}</div>
              <div class="text-sm text-[#999] mt-2">
                <p>{{ $t('c94cb914.74ee6d') }}</p>
              </div>
            </div>
          </div>
        </template>
      </div>
    </draggable>
    <div class="rule-item">
      <div class="holder" />
      <div class="flex leading-normal p-3">
        <el-switch v-model="shop_lbs" />
        <div class="ml-4">
          <div>{{ $t('c94cb914.f4fbfc') }}</div>
          <div class="text-sm text-[#999] mt-2">
            <p>{{ $t('c94cb914.5f7c1e') }}</p>
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
      deep: true
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
