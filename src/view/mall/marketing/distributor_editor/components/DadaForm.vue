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
.data-form {
  .el-form-item__content {
    width: auto !important;
  }
  .form-item-tip {
    font-size: 13px;
    color: #999;
    line-height: initial;
  }
  .business-select {
    width: 220px !important;
  }
}
</style>

<template>
  <el-card v-if="show" class="el-card--normal">
    <div slot="header">
      <div>
        同城配<span class="frm-tips"
          >（需先选择店铺地理位置，系统根据店铺位置判断该地区是否支持同城配）</span
        >
      </div>
    </div>
    <el-form
      ref="form"
      class="data-form"
      label-width="120px"
      :model="content.baseForm"
      :rules="rules"
    >
      <el-form-item label="达达同城配">
        <el-switch v-model="content.baseForm.is_dada" />
        <div class="form-item-tip">
          开启后有店铺订单时需要该店铺人员手动接单，接单后系统会自动在达达平台下单
        </div>
      </el-form-item>

      <el-form-item v-if="content.baseForm.is_dada" prop="business" label="业务类型">
        <el-select v-model="content.baseForm.business" class="business-select" placeholder="请选择">
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  inject: ['content'],
  data() {
    return {
      typeList: [],
      show: false,
      rules: {
        business: [{ message: '达达业务类型必填', required: true }]
      }
    }
  },
  mounted() {
    this.getDataInfo()
  },
  methods: {
    async getDataInfo() {
      const { business_list, is_open } = await this.$api.dada.getDadaInfo()
      this.typeList = Object.keys(business_list).reduce((total, current, index) => {
        return total.concat({
          value: Number(current),
          label: business_list[current]
        })
      }, [])
      console.log('typeList', this.typeList)
      this.show = is_open === '1'
      this.$emit('onChange', this.show)
    },
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
