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
.shop-baseinfo-form {
  .el-form-item__content {
    width: 220px;
  }
  .start-time,
  .end-time {
    width: 100px;
  }
  .separator {
    margin: 0 5px;
  }
  .form-item-tip {
    font-size: 13px;
    color: #999;
    line-height: initial;
  }
}
</style>
<template>
  <el-card class="el-card--normal" header="基础信息">
    <el-form
      ref="form"
      class="shop-baseinfo-form"
      label-width="120px"
      :inline="true"
      :model="content.baseForm"
      :rules="rules"
    >
      <el-form-item label="店铺号" prop="shop_code">
        <el-input v-model="content.baseForm.shop_code" placeholder="请输入店铺号" :maxlength="10" />
      </el-form-item>

      <el-form-item label="店铺名称" prop="name">
        <el-input v-model="content.baseForm.name" placeholder="请输入店铺名称" />
      </el-form-item>

      <el-form-item label="联系人姓名" prop="contact">
        <el-input
          v-model="content.baseForm.contact"
          placeholder="请输入联系人姓名"
          :disabled="content.baseForm.datapass_block == 1 && distributor_id > 0"
        />
      </el-form-item>

      <el-form-item label="联系方式" prop="mobile">
        <el-input
          v-model="content.baseForm.mobile"
          placeholder="请输入联系人手机号"
          :disabled="content.baseForm.datapass_block == 1 && distributor_id > 0"
        />
      </el-form-item>

      <el-form-item label="固定座机">
        <el-input v-model="content.baseForm.contract_phone" placeholder="请输入联系人座机号" />
      </el-form-item>

      <el-form-item label="经营时间">
        <el-time-select
          v-model="content.baseForm.startTime"
          class="start-time"
          placeholder="起始时间"
          :picker-options="{
            start: '00:00',
            step: '00:30',
            end: '23:59'
          }"
        />
        <span class="separator">~</span>
        <el-time-select
          v-model="content.baseForm.endTime"
          class="end-time"
          placeholder="结束时间"
          :picker-options="{
            start: '00:00',
            step: '00:30',
            end: '23:59',
            minTime: content.baseForm.startTime
          }"
        />
      </el-form-item>

      <el-form-item label="是否快递">
        <el-switch v-model="content.baseForm.is_delivery" />
      </el-form-item>

      <el-form-item
        v-if="content.baseForm.distribution_type != '1' && !VERSION_STANDARD()"
        label="审核商品"
      >
        <el-switch v-model="content.baseForm.is_audit_goods" />
        <div class="form-item-tip">开启后，店铺添加的自有商品，需要平台审核通过后才可以上架</div>
      </el-form-item>

      <el-form-item
        v-if="
          VERSION_STANDARD() &&
          $store.getters.login_type != 'distributor' &&
          !content.baseForm.distributor_self
        "
        label="同步商品"
      >
        <el-switch v-model="content.baseForm.auto_sync_goods" />
        <div class="form-item-tip">自动同步商品至店铺</div>
      </el-form-item>
      <el-form-item v-if="!content.baseForm.distributor_self" label="街道居委">
        <el-switch v-model="content.baseForm.is_require_subdistrict" />
        <div class="form-item-tip">下单是否需要选择街道居委</div>
      </el-form-item>
      <el-form-item v-if="!content.baseForm.distributor_self" label="楼号房号">
        <el-switch v-model="content.baseForm.is_require_building" />
        <div class="form-item-tip">下单是否需要填写楼号房号</div>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  inject: ['content'],
  data() {
    return {
      rules: {
        shop_code: [
          {
            pattern: /^[A-Za-z0-9\-]+$/,
            message: '请输入正确格式的店铺号',
            required: true
          }
        ],
        name: [{ message: '店铺名称必填', required: true }],
        contact: [{ message: '联系人必填', required: true }],
        mobile: [{ message: '手机必填', required: true }]
      },
      startTime: '08:00',
      endTime: '21:00',
      distributor_id: null
    }
  },
  mounted() {
    this.distributor_id = this.$route.query.distributor_id
  },
  methods: {
    validate() {
      return new Promise((resolve, reject) => {
        return this.$refs.form.validate(valid => {
          if (valid) {
            resolve()
          } else {
            reject()
          }
        })
      })
    }
  }
}
</script>
