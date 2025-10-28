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
<!-- * @description 分账统计详情-退款信息 -->
<template>
  <el-card v-if="data.length > 0" class="refund_info_card">
    <h3>退款信息</h3>
    <el-table
      :data="data"
      border
      :span-method="objectSpanMethod"
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column prop="refund_bn" label="退款单号" />
      <el-table-column prop="refund_id" label="汇付退款单号" />
      <el-table-column prop="distributor_name" label="退款客户名称" />

      <el-table-column prop="refund_fee" label="退款金额">
        <template slot-scope="scope"> ￥{{ (scope.row.refund_fee / 100).toFixed(2) }} </template>
      </el-table-column>
      <el-table-column prop="refund_status" label="退款状态">
        <template slot-scope="scope">
          {{
            (scope.row.refund_status === 'READY' && '未审核') ||
            (scope.row.refund_status === 'SUCCESS' && '退款成功  ') ||
            (scope.row.refund_status === 'CANCEL' && '撤销退款') ||
            (scope.row.refund_status === 'CHANGE' && '退款异常') ||
            (scope.row.refund_status === 'REFUNDCLOSE' && '退款关闭') ||
            (scope.row.refund_status === 'PROCESSING' && '退款处理中') ||
            (scope.row.refund_status === 'AUDIT_SUCCESS' && '退款中') ||
            (scope.row.refund_status === 'REFUSE' && '退款失败')
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
