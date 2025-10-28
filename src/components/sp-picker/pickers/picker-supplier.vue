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
<style lang="scss">
.picker-table {
  .sp-filter-form {
    padding: 8px 8px 0px 8px;
  }
  .sp-finder-hd {
    display: none;
  }
  .disableheadselection {
    > .cell .el-checkbox__inner {
      display: none;
    }
  }
  .el-pagination {
    margin: 0;
    padding: 10px;
  }
}
</style>
<template>
  <div class="picker-table">
    <SpFilterForm :model="formData" size="small" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="supplier_name">
        <el-input v-model="formData.supplier_name" placeholder="请输入供应商名称" />
      </SpFilterFormItem>
    </SpFilterForm>
    <SpFinder
      ref="finder"
      :class="['shop-finder', { 'no-multiple': !multiple }]"
      :other-config="{
        'max-height': 460,
        'header-cell-class-name': cellClass
      }"
      url="/supplier/get_supplier_list"
      :fixed-row-action="true"
      :setting="setting"
      :hooks="{
        afterSearch: afterSearch
      }"
      @select="onSelect"
      @selection-change="onSelectionChange"
    />
  </div>
</template>

<script>
import { createSetting } from '@shopex/finder'
import BasePicker from './base'
import PageMixin from '../mixins/page'
export default {
  name: 'PickerSupplier',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择供应商'
  },
  props: ['value'],
  data() {
    return {
      formData: {
        supplier_name: ''
      },
      loading: false,
      multiple: this.value?.multiple ?? true
    }
  },
  computed: {
    setting() {
      const columns = [
        { name: '供应商名称', key: 'supplier_name' },
        { name: '联系人', key: 'contact' }
      ]
      return createSetting({
        columns: columns.filter(({ visible }) => visible !== false)
      })
    }
  },
  created() {
    // this.fetch()
  },
  methods: {    
    afterSearch(response) {
      const { list } = response.data.data
      if (this.value.data) {
        const selectRows = list.filter((item) => this.value.data.includes(item.id))
        const { finderTable } = this.$refs.finder.$refs
        setTimeout(() => {
          finderTable.$refs.finderTable.setSelection(selectRows)
        })
      }
    },
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    onSelect(selection, row) {
      if (this.multiple) {
        // this.updateVal(selection)
      } else {
        const { finderTable } = this.$refs.finder.$refs
        // console.log('finderTable:', finderTable)
        finderTable.clearSelection()
        setTimeout(() => {
          finderTable.$refs.finderTable.setSelection(selection.length > 0 ? [row] : [])
          // this.updateVal([row])
        })
      }
    },
    onSelectionChange(selection) {
      this.updateVal(selection)
    }
  }
}
</script>
