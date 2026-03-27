<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="section section-white">
    <el-form ref="form" :model="form" label-position="left" label-width="150px">
      <div class="section-body">
        <template>
          <el-form-item :label="$t('90fcc9b4.6756df')">
            {{ $t('d41d8cd9.ww3xx4') }}
            <el-input
              v-model="form.order_cancel_time"
              type="number"
              required
              min="1"
              placeholder=""
              style="width: 100px"
            />{{ $t('d41d8cd9.yy5zz6') }}
          </el-form-item>
          <el-form-item :label="$t('90fcc9b4.2cd5c0')">
            {{ $t('d41d8cd9.aaa7bb') }}
            <el-input
              v-model="form.order_finish_time"
              type="number"
              required
              min="0"
              placeholder=""
              style="width: 100px"
            />
            {{ $t('d41d8cd9.ccc9dd') }}
          </el-form-item>
          <el-form-item :label="$t('90fcc9b4.f14600')">
            {{ $t('d41d8cd9.eee1ff') }}
            <el-input
              v-model="form.latest_aftersale_time"
              type="number"
              required
              min="0"
              placeholder=""
              style="width: 100px"
            />
            {{ $t('d41d8cd9.ggg3hh') }}
          </el-form-item>
          <el-form-item :label="$t('90fcc9b4.828c80')">
            {{ $t('d41d8cd9.iii5jj') }}
            <el-input
              v-model="form.auto_refuse_time"
              type="number"
              required
              min="0"
              placeholder=""
              style="width: 100px"
            />
            {{ $t('d41d8cd9.kkk7ll') }}
          </el-form-item>
        </template>
      </div>
      <div class="section-footer with-border content-center">
        <el-button type="primary" @click="save"> {{ $t('d41d8cd9.mmm9nn') }} </el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { getOrderSetting, setOrderSetting } from '@/api/trade'
export default {
  data() {
    return {
      form: {
        order_cancel_time: 15,
        order_finish_time: 7,
        latest_aftersale_time: 0,
        auto_refuse_time: 0
      }
    }
  },
  mounted() {
    getOrderSetting().then((res) => {
      let setting = res.data.data
      if (setting.order_cancel_time) {
        this.form.order_cancel_time = setting.order_cancel_time
      }
      if (setting.order_finish_time) {
        this.form.order_finish_time = setting.order_finish_time
      }
      if (setting.latest_aftersale_time) {
        this.form.latest_aftersale_time = setting.latest_aftersale_time
      }
      if (setting.auto_refuse_time) {
        this.form.auto_refuse_time = setting.auto_refuse_time
      }
    })
  },
  methods: {
    save() {
      console.log(this.form)
      setOrderSetting(this.form).then((res) => {
        this.$message({ message: this.$t('90fcc9b4.3b1083'), type: 'success' })
      })
    }
  }
}
</script>
<style scoped lang="scss"></style>
