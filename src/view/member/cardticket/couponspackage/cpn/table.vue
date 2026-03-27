<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-table ref="Table" :data="seletedCoupon" tooltip-effect="dark" style="width: 100%" border>
    <el-table-column :label="$t('2f3b0c72.041148')" width="120">
      <template slot-scope="scope">
        <template v-if="scope.row.card_type == 'new_gift'"> {{ $t('2f3b0c72.8bc752') }} </template>
        <!-- <template v-if="scope.row.card_type == 'gift'">
          兑换券
        </template> -->
        <template v-if="scope.row.card_type == 'discount'"> {{ $t('2f3b0c72.c23d22') }} </template>
        <template v-if="scope.row.card_type == 'cash'"> {{ $t('2f3b0c72.f23195') }} </template>
      </template>
    </el-table-column>
    <el-table-column prop="title" :label="$t('2f3b0c72.439249')" width="120" />
    <el-table-column prop="description" :label="$t('2f3b0c72.8c8ca4')" show-overflow-tooltip />
    <el-table-column prop="fixed_term" :label="$t('2f3b0c72.ee9534')">
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
    <el-table-column :label="$t('2f3b0c72.4b06cf')" show-overflow-tooltip width="100">
      <template slot-scope="scope">
        {{ scope.row.quantity - scope.row.get_num }}
      </template>
    </el-table-column>
    <el-table-column
      prop="give_num"
      :label="$t('2f3b0c72.95eb49')"
      width="100"
      show-overflow-tooltip
    />
    <el-table-column v-if="type != 'edit'" fixed="left" :label="$t('2f3b0c72.2b6bc0')" width="100">
      <template slot-scope="scope">
        <el-button
          style="color: #409eff"
          type="text"
          size="small"
          @click.native.prevent="deleteRow(scope.$index, seletedCoupon)"
        >
          {{ $t('2f3b0c72.86048b') }}
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
