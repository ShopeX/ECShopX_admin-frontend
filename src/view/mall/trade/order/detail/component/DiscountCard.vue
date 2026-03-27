<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <CustomCard :title="$t('19fd6e52.954493')">
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
          v-for="(data, index) in dataSource.filter((el) => Number(el.discount_fee) !== 0)"
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
              {{ $t('19fd6e52.16a386') }}{{ this.orderInfo.fee_symbol
              }}{{ (this.orderInfo.discount_fee / 100).toFixed(2) }}
            </div>
          </td>
        </tr>
      </template>
      <template v-if="!dataSource || !dataSource.length">
        <tr>
          <td :colspan="columns.length">
            <div class="customEmpty">{{ $t('19fd6e52.4726ff') }}</div>
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
        { name: this.$t('19fd6e52.72606e'), field: 'info' },
        { name: this.$t('19fd6e52.5b921a'), field: 'discount_fee' },
        { name: this.$t('19fd6e52.028f5b'), field: 'rule' }
      ],
      dataSource: this.orderInfo.discount_info
    }
  },
  watch: {
    orderInfo: {
      handler(val) {
        this.dataSource =
          val && val.discount_info.filter((el) => el.discount_fee !== 0 && el.discount_fee !== '0')
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
