<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.picker-ranking {
  .sp-filter-form {
    padding: 8px 8px 0px 8px;
  }
  .sp-finder-hd {
    display: none;
  }
  .el-pagination {
    margin: 0;
    padding: 10px;
  }
}
</style>
<template>
  <div class="picker-ranking">
    <SpFilterForm :model="formData" size="small" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="keywords">
        <el-input v-model="formData.keywords" placeholder="请输入榜单名称" />
      </SpFilterFormItem>
    </SpFilterForm>
    <SpFinder
      ref="finder"
      :other-config="{
        'max-height': 460,
        'header-cell-class-name': cellClass
      }"
      url="/goods/ranking/list"
      :fixed-row-action="true"
      :setting="{
        columns: [
          { name: '榜单ID', key: 'id', width: '80' },
          { name: '榜单名称', key: 'name' },
          {
            name: '榜单类型',
            key: 'type',
            width: '120',
            formatter: (value, row, col) => {
              return this.typeList[value] || value
            }
          },
          {
            name: '状态',
            key: 'status',
            width: '100',
            formatter: (value, row, col) => {
              return value == 1 ? '启用' : '禁用'
            }
          }
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
  name: 'PickerRanking',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择榜单'
  },
  props: ['value'],
  data() {
    const { queryParams } = this.value
    const defaultParams = {
      keywords: ''
    }
    const formData = Object.assign(defaultParams, queryParams)
    return {
      formData,
      multiple: this.value?.multiple ?? true,
      typeList: {
        category_ranking: '品类榜单',
        platform_ranking: '平台榜单'
      }
    }
  },
  created() {},
  methods: {
    beforeSearch(params) {
      params = {
        ...params,
        ...this.formData
      }
      // 添加 regionauth_id
      if (this.value.regionauth_id) {
        params.regionauth_id = this.value.regionauth_id
      }
      // 添加榜单类型筛选
      if (this.value.type) {
        params.type = this.value.type
      }
      return params
    },
    afterSearch(response) {
      const { list } = response.data.data
      if (this.value.data && this.value.data.length > 0) {
        // 处理传入的数据格式，可能是ID或对象
        const selectedIds = Array.isArray(this.value.data)
          ? this.value.data.map((item) => (typeof item === 'object' ? item.id : item))
          : [typeof this.value.data === 'object' ? this.value.data.id : this.value.data]
        const selectRows = list.filter((item) => selectedIds.includes(item.id))
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
        // 多选模式，由 onSelectionChange 处理
      } else {
        const { finderTable } = this.$refs.finder.$refs
        finderTable.clearSelection()
        setTimeout(() => {
          finderTable.$refs.finderTable.setSelection([row])
        })
      }
    },
    onSelectionChange(selection) {
      // 转换数据格式，返回需要的字段
      const data = selection.map((row) => ({
        id: row.id,
        name: row.name,
        type: row.type,
        regionauth_id: row.regionauth_id || this.value.regionauth_id
      }))
      this.updateVal(data)
    },
    cellClass({ row, column, rowIndex, columnIndex }) {
      if (!this.multiple && columnIndex === 0) {
        return 'disableheadselection'
      }
      return ''
    }
  }
}
</script>
