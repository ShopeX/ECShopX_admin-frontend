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
  <div class="section section-white">
    <el-form ref="form" :model="form" label-position="left" label-width="150px">
      <div class="section-body">
        <template>
          <el-form-item label="订单自动取消:">
            未付款订单，将在
            <el-input
              v-model="form.order_cancel_time"
              type="number"
              required
              min="1"
              placeholder=""
              style="width: 100px"
            />(分钟)之后取消
          </el-form-item>
          <el-form-item label="订单自动确认:">
            已发货订单，将在
            <el-input
              v-model="form.order_finish_time"
              type="number"
              required
              min="0"
              placeholder=""
              style="width: 100px"
            />
            (天)后自动完成
          </el-form-item>
          <el-form-item label="订单售后时效:">
            已确认收货订单，将在
            <el-input
              v-model="form.latest_aftersale_time"
              type="number"
              required
              min="0"
              placeholder=""
              style="width: 100px"
            />
            (天)后不可申请售后
          </el-form-item>
          <el-form-item label="售后自动驳回时效:">
            退货退款同意后未退回商品，将在
            <el-input
              v-model="form.auto_refuse_time"
              type="number"
              required
              min="0"
              placeholder=""
              style="width: 100px"
            />
            (天)后驳回售后
          </el-form-item>
        </template>
      </div>
      <div class="section-footer with-border content-center">
        <el-button type="primary" @click="save"> 保 存 </el-button>
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
    getOrderSetting().then(res => {
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
      setOrderSetting(this.form).then(res => {
        this.$message({ message: '保存成功', type: 'success' })
      })
    }
  }
}
</script>
<style scoped lang="scss"></style>
