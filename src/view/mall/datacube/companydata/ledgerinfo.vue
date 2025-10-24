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
<!-- * @description 分账统计详情-分账信息 -->
<template>
  <el-card v-if="data.length > 0" class="ledger_info_card">
    <h3>分账信息</h3>
    <el-table :data="data" style="width: 100%">
      <el-table-column prop="created_at" label="分账客户号" />
      <el-table-column prop="distributor_name" label="分账客户名称" />
      <el-table-column prop="total_fee" label="分账金额">
        <template slot-scope="scope"> ￥{{ (scope.row.total_fee / 100).toFixed(2) }} </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
export default {
  props: ['data'],
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.ledger_info_card {
  .el-col {
    margin-top: 15px;
  }
  h3 {
    font-size: 16px;
    font-weight: bold;
    color: #000;
  }
  .order_info_label {
  }
  .order_info_value {
    margin-left: 5px;
  }
}
</style>
