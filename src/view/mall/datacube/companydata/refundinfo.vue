<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-card v-if="data.length > 0" class="refund_info_card">
    <h3>{{ $t('1cfdb98c.f179f2') }}</h3>
    <el-table
      :data="data"
      border
      :span-method="objectSpanMethod"
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column prop="refund_bn" :label="$t('1cfdb98c.b0612b')" />
      <el-table-column prop="refund_id" :label="$t('1cfdb98c.a10084')" />
      <el-table-column prop="distributor_name" :label="$t('1cfdb98c.226a62')" />

      <el-table-column prop="refund_fee" :label="$t('1cfdb98c.a0cd4c')">
        <template slot-scope="scope"> ￥{{ (scope.row.refund_fee / 100).toFixed(2) }} </template>
      </el-table-column>
      <el-table-column prop="refund_status" :label="$t('1cfdb98c.db7c80')">
        <template slot-scope="scope">
          {{
            (scope.row.refund_status === 'READY' && $t('1cfdb98c.97a81d')) ||
            (scope.row.refund_status === 'SUCCESS' && $t('1cfdb98c.0943d2')) ||
            (scope.row.refund_status === 'CANCEL' && $t('1cfdb98c.0a7dff')) ||
            (scope.row.refund_status === 'CHANGE' && $t('1cfdb98c.c59ead')) ||
            (scope.row.refund_status === 'REFUNDCLOSE' && $t('1cfdb98c.1d83a4')) ||
            (scope.row.refund_status === 'PROCESSING' && $t('1cfdb98c.73ce8f')) ||
            (scope.row.refund_status === 'AUDIT_SUCCESS' && $t('1cfdb98c.07e608')) ||
            (scope.row.refund_status === 'REFUSE' && $t('1cfdb98c.7c2544'))
          }}
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
export default {
  props: ['data', 'arr'],
  data() {
    return {}
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.arr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.refund_info_card {
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
