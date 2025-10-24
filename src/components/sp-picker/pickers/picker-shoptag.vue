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
.picker-shop-tag {
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
  <div class="picker-shop-tag">
    <SpFilterForm :model="formData" size="small" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="keywords">
        <el-input v-model="formData.keywords" placeholder="请输入标签名称" />
      </SpFilterFormItem>
    </SpFilterForm>
    <SpFinder
      ref="finder"
      :other-config="{
        'max-height': 460,
        'header-cell-class-name': cellClass
      }"
      row-key="tag_id"
      reserve-selection
      url="/distributor/tag"
      :fixed-row-action="true"
      :setting="{
        columns: [
          { name: 'ID', key: 'tag_id', width: 80 },
          { name: '标签名称', key: 'tag_name' },
          { name: '描述', key: 'description' }
        ]
      }"
      :hooks="{
        beforeSearch: beforeSearch,
        afterSearch: afterSearch
      }"
      @select="onSelect"
      @selection-change="onSelectionChange"
    />
  </div>
</template>

<script>
import BasePicker from './base'
import PageMixin from '../mixins/page'
export default {
  name: 'PickerTag',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择店铺标签'
  },
  props: ['value'],
  data() {
    return {
      formData: {
        keywords: ''
      },
      multiple: this.value?.multiple ?? true,
      localSelection: []
    }
  },
  created() {
    this.localSelection = this.value.data || []
  },
  methods: {
    beforeSearch(params) {
      const { keywords } = this.formData
      if (keywords) {
        params = {
          ...params,
          tag_name: keywords
        }
      }
      if (this.value.params) {
        params = {
          ...params,
          ...this.value.params
        }
      }
      return params
    },
    afterSearch(response) {
      const { list } = response.data.data
      if (this.localSelection.length > 0) {
        const selectRows = list.filter(item => this.localSelection.includes(item.tag_id))
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
      if (!this.multiple) {
        const { finderTable } = this.$refs.finder.$refs
        console.log('finderTable:', finderTable)
        finderTable.clearSelection()
        setTimeout(() => {
          finderTable.$refs.finderTable.setSelection(selection.length > 0 ? [row] : [])
        })
      }
    },
    onSelectionChange(selection) {
      this.updateVal(selection)
    }
  }
}
</script>
