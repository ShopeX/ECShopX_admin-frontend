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
  <el-table ref="Table" :data="seletedCoupon" tooltip-effect="dark" style="width: 100%" border>
    <el-table-column label="卡劵类型" width="120">
      <template slot-scope="scope">
        <template v-if="scope.row.card_type == 'new_gift'"> 兑换券 </template>
        <!-- <template v-if="scope.row.card_type == 'gift'">
          兑换券
        </template> -->
        <template v-if="scope.row.card_type == 'discount'"> 折扣卷 </template>
        <template v-if="scope.row.card_type == 'cash'"> 满减券 </template>
      </template>
    </el-table-column>
    <el-table-column prop="title" label="卡劵名称" width="120" />
    <el-table-column prop="description" label="卡劵说明" show-overflow-tooltip />
    <el-table-column prop="fixed_term" label="卡劵有效期">
      <template slot-scope="scope">
        <template
          v-if="
            scope.row.date_type == 'DATE_TYPE_FIX_TIME_RANGE' ||
            scope.row.date_type == 'DATE_TYPE_SHORT'
          "
        >
          {{ scope.row.begin_time | formatTimestamp }} -
          {{ scope.row.end_time | formatTimestamp }}
        </template>
        <template
          v-else-if="
            scope.row.date_type == 'DATE_TYPE_FIX_TERM' || scope.row.date_type == 'DATE_TYPE_LONG'
          "
        >
          {{ scope.row.takeEffect }}
        </template>
      </template>
    </el-table-column>
    <el-table-column label="可领取库存" show-overflow-tooltip width="100">
      <template slot-scope="scope">
        {{ scope.row.quantity - scope.row.get_num }}
      </template>
    </el-table-column>
    <el-table-column prop="give_num" label="发送数量" width="100" show-overflow-tooltip />
    <el-table-column v-if="type != 'edit'" fixed="right" label="操作" width="100">
      <template slot-scope="scope">
        <el-button
          style="color: #409eff"
          type="text"
          size="small"
          @click.native.prevent="deleteRow(scope.$index, seletedCoupon)"
        >
          移除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: ['seletedCoupon', 'type'],
  methods: {
    deleteRow(index, rows) {
      this.$emit('deleteRowHandle', index)
    }
  }
}
</script>

<style></style>
