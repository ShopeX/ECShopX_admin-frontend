<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-table ref="Table" :data="seletedBusiness" tooltip-effect="dark" style="width: 100%" border>
    <el-table-column prop="user_name" :label="$t('ae5eae00.e6f169')" width="220" />
    <el-table-column prop="location" :label="$t('ae5eae00.765048')" />
    <el-table-column :label="$t('ae5eae00.3b757d')">
      <template slot-scope="scope">
        <el-input style="width: 200px" type="number" min="1" v-model.number="scope.row.draw_limit">
          <template slot="append">{{ $t('ae5eae00.c16655') }}</template>
        </el-input>
      </template>
    </el-table-column>
    <el-table-column fixed="left" :label="$t('ae5eae00.2b6bc0')" width="100">
      <template slot-scope="scope">
        <el-button
          style="color: #409eff"
          @click.native.prevent="deleteRow(scope.$index)"
          type="text"
          size="small"
        >
          {{ $t('ae5eae00.86048b') }}
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
