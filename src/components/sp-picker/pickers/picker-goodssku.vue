<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

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
      <div>{{ $t('c10dd593.90f08f') }}{{ value.itemName }}</div>
      <div>{{ $t('c10dd593.0d803a') }}{{ value.itemBn }}</div>
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
import { createSetting } from '@shopex-ui/finder'
export default {
  name: 'PickerGoods',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择规格'
  },
  props: ['value'],
  data() {
    return {}
  },
  computed: {
    setting() {
      const t = this.$t.bind(this)
      return createSetting({
        columns: [
          { name: t('c10dd593.ea887b'), key: 'item_spec_desc' },
          { name: t('c10dd593.0eac88'), key: 'store' },
          {
            name: t('c10dd593.30be8c'),
            key: 'price',
            formatter: (value, row, col) => {
              return value / 100
            }
          },
          {
            name: t('c10dd593.ce0008'),
            key: 'approve_status',
            formatter: (value, row, col) => {
              const item = SALES_STATUS.find((i) => i.value == value)
              return item ? t(item.title) : value
            }
          }
        ]
      })
    }
  },
  created() {
    this.$options.config.title = this.$t('c10dd593.a0f99d')
  },
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
      const selectRow = list.filter((item) => data.includes(item.item_id))
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
