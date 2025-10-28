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
  <el-card v-if="isOpen">
    <div slot="header">
      <div>分账</div>
    </div>
    <el-row>
      <el-col :span="8">
        <el-form-item label="是否分账">
          <el-switch v-model="form.is_open" active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="平台服务费">
          <el-input v-model="form.rate" />
        </el-form-item>
      </el-col>
      <el-col :span="16" class="flex">
        <div>% 平台向商户收取的服务费率(0.00 ~ 30.00)</div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { getSetting } from '@/api/fenzhang'
export default {
  props: ['externalForm'],
  data() {
    return {
      form: {
        rate: '0.00',
        is_open: false
      },
      isOpen: false
    }
  },
  watch: {
    externalForm: {
      handler(val) {
        if (val.is_open) {
          this.form.is_open = val.is_open == 'true' ? true : false
        }
        if (val.rate) {
          this.form.rate = val.rate
        }
      },
      deep: true
    }
  },
  mounted() {
    getSetting().then(res => {
      let data = res.data.data
      this.isOpen = data.is_open == 'true'
    })
  }
}
</script>

<style scoped lang="scss">
.flex {
  div {
    display: flex;
    align-items: center;
    height: 40px;
    margin-left: 10px;
  }
}
</style>
