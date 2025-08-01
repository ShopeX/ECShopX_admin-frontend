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
