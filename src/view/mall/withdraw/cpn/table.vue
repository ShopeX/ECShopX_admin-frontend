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
  <el-table ref="Table" :data="seletedBusiness" tooltip-effect="dark" style="width: 100%" border>
    <el-table-column prop="user_name" label="商户名称" width="220" />
    <el-table-column prop="location" label="地址" />
    <el-table-column label="暂冻金额">
      <template slot-scope="scope">
        <el-input style="width: 200px" type="number" min="1" v-model.number="scope.row.draw_limit">
          <template slot="append">元</template>
        </el-input>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="100">
      <template slot-scope="scope">
        <el-button
          style="color: #409eff"
          @click.native.prevent="deleteRow(scope.$index)"
          type="text"
          size="small"
        >
          移除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: ['seletedBusiness'],
  methods: {
    deleteRow(index, rows) {
      this.$emit('deleteRowHandle', index)
    }
  }
}
</script>

<style></style>
