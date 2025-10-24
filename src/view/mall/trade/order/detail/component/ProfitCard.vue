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
  <CustomCard title="分润信息">
    <el-row v-for="(row, index) in baseInfo" :key="index">
      <el-col v-for="(col, colIndex) in row" :key="colIndex" :span="6">
        <div class="flex">
          <div class="left">{{ col.name }}：</div>
          <div class="right">
            {{ col.filter ? col.filter(profit[col.field]) : profit[col.field] }}
          </div>
        </div>
      </el-col>
    </el-row>
  </CustomCard>
</template>

<script>
import CustomCard from './CustomCard'
export default {
  components: {
    CustomCard
  },
  props: ['orderInfo', 'memberInfo', 'profit'],
  data() {
    const self = this
    return {
      baseInfo: [
        [
          {
            name: '分润门店类型',
            field: 'profit_type',
            filter: self.typeFilter
          },
          { name: '分润总金额', field: '', filter: self.totalFilter }
        ]
      ]
    }
  },
  methods: {
    totalFilter: function () {
      let count = 0
      if (this.profit.total_fee) {
        count = this.orderInfo.fee_symbol + (this.profit.total_fee / 100).toFixed(2)
      }
      return count
    },
    typeFilter: function (item) {
      let returnValue = ''
      if (this.profit.profit_type == 1) {
        returnValue = '总部分润'
      } else if (this.profit.profit_type == 2) {
        returnValue = '自营门店分润'
      } else if (this.profit.profit_type == 3) {
        returnValue = '加盟门店分润'
      }
      return returnValue
    }
  }
}
</script>

<style></style>
