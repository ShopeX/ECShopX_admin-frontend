<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <CustomCard :title="$t('a29ce79c.ee6cce')">
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
            name: self.$t('a29ce79c.c60180'),
            field: 'profit_type',
            filter: self.typeFilter
          },
          { name: self.$t('a29ce79c.15ac30'), field: '', filter: self.totalFilter }
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
        returnValue = this.$t('a29ce79c.43d81b')
      } else if (this.profit.profit_type == 2) {
        returnValue = this.$t('a29ce79c.7635bc')
      } else if (this.profit.profit_type == 3) {
        returnValue = this.$t('a29ce79c.3c78d2')
      }
      return returnValue
    }
  }
}
</script>

<style></style>
