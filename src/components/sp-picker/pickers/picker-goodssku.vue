<style lang="scss">
.picker-goods-sku {
  .item-name {
    margin: 10px 16px 0px;
  }
}
</style>
<template>
  <div class="picker-goods-sku">
    <div class="item-name">
      <div>商品名称：{{ value.itemName }}</div>
      <div>商品编码：{{ value.itemBn }}</div>
    </div>
    <SpFinder
      ref="finder"
      :setting="setting"
      :row-actions-align="'left'"
      :hooks="{
        beforeSearch: beforeSearch,
        afterSearch: afterSearch
      }"
      url="/goods/items"
      @selection-change="onSelectionChange"
    />
  </div>
</template>

<script>
import { SALES_STATUS } from '@/consts'
import BasePicker from './base'
import PageMixin from '../mixins/page'
import { createSetting } from '@shopex/finder'
export default {
  name: 'PickerGoods',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择规格'
  },
  props: ['value'],
  data() {
    return {
      setting: createSetting({
        columns: [
          { name: '规格', key: 'item_spec_desc' },
          { name: '库存', key: 'store' },
          {
            name: '价格（¥）',
            key: 'price',
            formatter: (value, row, col) => {
              return value / 100
            }
          },
          {
            name: '商品状态',
            key: 'approve_status',
            formatter: (value, row, col) => {
              return SALES_STATUS.find(item => item.value == value).title
            }
          }
        ]
      })
    }
  },
  created() {},
  mounted() {},
  methods: {
    beforeSearch(params) {
      return {
        ...params,
        item_type: 'normal',
        is_sku: true,
        item_id: this.value.itemId
      }
    },
    afterSearch(response) {
      const { list } = response.data.data
      const { data = [] } = this.value
      const selectRow = list.filter(item => data.includes(item.item_id))
      const finderTable = this.$refs['finder'].$refs.finderTable.$refs.finderTable

      setTimeout(() => {
        finderTable.setSelection(selectRow)
      })
    },
    onSelectionChange(selection) {
      this.updateVal(selection)
    }
  }
}
</script>
