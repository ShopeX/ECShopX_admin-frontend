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
  <CustomCard title="优惠明细">
    <table
      width="60%"
      cellspacing="0"
      cellpadding="0"
      class="customTable"
      border-collapse="collapse"
    >
      <tr>
        <th v-for="(header, index) in columns" :key="index">
          <div class="customHeader">
            {{ header.name }}
          </div>
        </th>
      </tr>
      <template v-if="dataSource && dataSource.length">
        <tr
          v-for="(data, index) in dataSource.filter(el => Number(el.discount_fee) !== 0)"
          :key="index"
        >
          <td v-for="(row, index) in columns" :key="index">
            <div class="customDataSource">
              {{
                row.field === 'discount_fee'
                  ? Number(data[row.field] / 100).toFixed(2)
                  : data[row.field]
              }}
            </div>
          </td>
        </tr>
        <tr>
          <td />
          <td />
          <td>
            <div class="customDataSource tr-font-wight">
              总计优惠：{{ this.orderInfo.fee_symbol
              }}{{ (this.orderInfo.discount_fee / 100).toFixed(2) }}
            </div>
          </td>
        </tr>
      </template>
      <template v-if="!dataSource || !dataSource.length">
        <tr>
          <td :colspan="columns.length">
            <div class="customEmpty">暂无内容</div>
          </td>
        </tr>
      </template>
    </table>
  </CustomCard>
</template>

<script>
import CustomCard from './CustomCard'
export default {
  components: {
    CustomCard
  },
  props: ['tradeInfo', 'orderInfo', 'deliveryData'],
  data() {
    return {
      columns: [
        { name: '优惠名称', field: 'info' },
        { name: '优惠金额', field: 'discount_fee' },
        { name: '优惠说明', field: 'rule' }
      ],
      dataSource: this.orderInfo.discount_info
    }
  },
  watch: {
    orderInfo: {
      handler(val) {
        this.dataSource =
          val && val.discount_info.filter(el => el.discount_fee !== 0 && el.discount_fee !== '0')
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.customTable {
  border: 1px solid #ebeef5;
  border-collapse: collapse;

  .customHeader {
    padding: 5px;
    text-align: center;
    font-size: 14px;
    color: #666;
    font-weight: 400;
  }

  .customDataSource {
    padding: 5px;
    text-align: center;
    font-size: 14px;
    color: #666;
    font-weight: 400;
  }

  .tr-font-wight {
    font-weight: bold;
    text-align: center;
  }

  .customEmpty {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    padding: 20px 0;
  }
  tr {
    &:not(:nth-last-child(1)) {
      border-bottom: 1px solid #ebeef5;
    }
  }
}
</style>
