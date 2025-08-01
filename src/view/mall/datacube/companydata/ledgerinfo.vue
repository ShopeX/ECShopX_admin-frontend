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
