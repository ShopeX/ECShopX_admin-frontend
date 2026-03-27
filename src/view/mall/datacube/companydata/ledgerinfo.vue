<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-card v-if="data.length > 0" class="ledger_info_card">
    <h3>{{ $t('cac34ab4.adb36c') }}</h3>
    <el-table :data="data" style="width: 100%">
      <el-table-column prop="created_at" :label="$t('cac34ab4.059526')" />
      <el-table-column prop="distributor_name" :label="$t('cac34ab4.a21ebe')" />
      <el-table-column prop="total_fee" :label="$t('cac34ab4.1e61f1')">
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
