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
    <el-form
      ref="dataForm"
      v-loading="formLoad"
      :model="ruleForm"
      :rules="rules"
      class="point-form"
      label-width="180px"
    >
      <el-row>
        <el-col :span="5">
          <div class="p-title">商品起订量设置</div>
        </el-col>
      </el-row>

      <el-card shadow="never">
        <el-row>
          <el-col>
            <el-form-item label="总部商品起订量设置" prop="enable" class="last-ipt">
              <el-switch v-model="ruleForm.enable" active-color="#13ce66" />
              <div class="tips unit">开启，允许总部自营商品设置起订量。</div>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="供应商商品起订量设置" prop="enable" class="last-ipt">
              <el-switch v-model="ruleForm.enables" active-color="#13ce66" />
              <div class="tips unit">开启，允许供应商商品设置起订量。</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import { getUGCSetting, setUGCSetting } from '@/api/ugc'

export default {
  data() {
    return {
      ruleForm: {
        enable: false,
        enables: false
      }
    }
  },
  mounted() {
    this.getFetch()
  },
  methods: {
    getFetch() {}
  }
}
</script>
<style scoped lang="css">
.point-form {
  width: 700px;
}
.p-title {
  line-height: 20px;
  font-size: 14px;
  font-weight: bold;
  color: #000;
}
.unit {
  margin-left: 10px;
}
.tips {
  display: inline-block;
  vertical-align: middle;
  line-height: 1.5;
  color: #999;
  font-size: 12px;
}
.el-form-item {
  margin-bottom: 10px;
}
.btn-bar {
  margin-top: 20px;
}
.point-form /deep/ .el-form-item__error {
  padding-top: 0;
}

/deep/ .el-card {
  border: none;
}
</style>
