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
.introduce-form {
  .el-form-item__content {
    width: auto !important;
  }
}
</style>

<template>
  <el-card class="el-card--normal" header="店铺介绍">
    <el-form class="introduce-form" label-width="120px">
      <el-form-item label="店铺介绍">
        <el-input
          v-model="content.baseForm.introduce"
          style="width: 100%"
          type="textarea"
          :rows="8"
          placeholder="请输入内容"
          maxlength="1000"
          show-word-limit
        />
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  inject: ['content'],
  data() {
    return {}
  }
}
</script>
