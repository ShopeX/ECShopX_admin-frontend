<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <section v-if="name === 'coupon'" class="section">
    <div class="section-header with-border">{{ $t('64cb1465.e366cc') }}</div>
    <div class="section-body">
      <el-form label-width="100px">
        <el-form-item :label="$t('64cb1465.32c65d')">
          <el-input v-model="base.title" type="text" />
        </el-form-item>
        <el-form-item :label="$t('64cb1465.72cf37')">
          <el-input v-model="base.subtitle" />
        </el-form-item>
        <el-form-item :label="$t('64cb1465.4707ba')">
          <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item :label="$t('64cb1465.45bcee')">
          <div v-for="(item, index) in data" :key="index" class="setting-item item-selected">
            <div class="old-styles">
              {{ item.title }}
              <span v-if="item.type === 'cash'" class="amount-cur"
                >{{ item.amount }}{{ $t('64cb1465.eeeebc') }}</span
              >
              <span v-if="item.type === 'discount'" class="amount-cur"
                >{{ item.amount }}{{ $t('64cb1465.656b64') }}</span
              >

              <div class="setting-remove" @click="removeItem(index)">
                <i class="el-icon-delete" />
              </div>
            </div>
            <div class="background-color">
              {{ $t('64cb1465.751081') }}
              <el-color-picker v-model="item.backgroundOne" />
              <el-color-picker v-model="item.backgroundTwo" />
              <el-color-picker v-model="item.backgroundThree" />

              {{ $t('64cb1465.76c59e') }}<el-color-picker v-model="item.btnColor" />
            </div>
            <div class="background-color">
              {{ $t('64cb1465.61e84e') }}<el-input v-model="item.startTime" type="text" />
            </div>
            <div class="background-color">
              {{ $t('64cb1465.590dbb') }}<el-input v-model="item.endTime" type="text" />
            </div>
          </div>
          <div class="frm-tips">{{ $t('64cb1465.d5a0d5') }}</div>
          <el-button
            type="default"
            class="iconfont icon-cog banner-button-uploader"
            @click="setCoupons"
          >
            {{ $t('64cb1465.8436e0') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    res: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      name: '',
      padded: false,
      config: {},
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
      this.name = val.name
      this.base = val.base
      this.config = val.config
      this.data = val.data
    },
    removeItem(index) {
      this.data.splice(index, 1)
    },
    setCoupons() {
      this.$emit('bindCoupons')
    },
    handleImgChange(index) {
      this.$emit('bindImgs', index)
    }
  }
}
</script>

<style scoped lang="scss">
.setting-item {
  display: block;
}
.old-styles {
  display: flex;
}
.background-color {
  margin-top: 10px;
  line-height: 40px;
}
</style>
