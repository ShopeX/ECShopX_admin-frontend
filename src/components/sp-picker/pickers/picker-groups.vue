<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.picker-groups {
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
  <div class="picker-groups">
    <SpFilterForm :model="formData" size="small" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="keywords">
        <el-input v-model="formData.keywords" :placeholder="$t('39c20259.7528b3')" />
      </SpFilterFormItem>
    </SpFilterForm>
    <SpFinder
      ref="finder"
      :other-config="{
        'max-height': 460,
        'header-cell-class-name': cellClass
      }"
      url="/promotions/groups"
      :fixed-row-action="true"
      :setting="groupsSetting"
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
  name: 'PickerGroups',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择拼团活动'
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
      multiple: this.value?.multiple ?? true
    }
  },
  computed: {
    groupsSetting() {
      const t = this.$t.bind(this)
      const statusMap = {
        0: t('39c20259.dd4e55'),
        1: t('39c20259.fb852f'),
        2: t('39c20259.047fab')
      }
      return {
        columns: [
          { name: t('39c20259.be3322'), key: 'groups_activity_id', width: '80' },
          { name: t('39c20259.39834b'), key: 'act_name' },
          {
            name: t('39c20259.c799f5'),
            key: 'begin_time',
            formatter: (value, row, col) => {
              return `${row.begin_time} ~ ${row.end_time}`
            }
          },
          {
            name: t('39c20259.1181a5'),
            key: 'status',
            width: '160',
            formatter: (value, row, col) => {
              return statusMap[value] || t('39c20259.1622dc')
            }
          }
        ]
      }
    }
  },
  created() {
    this.$options.config.title = this.$t('39c20259.fde84d')
  },
  methods: {
    beforeSearch(params) {
      params = {
        ...params,
        ...this.formData
      }
      // 添加 regionauth_id 和 distributor_id
      if (this.value.regionauth_id) {
        params.regionauth_id = this.value.regionauth_id
      }
      if (this.value.distributor_id) {
        params.distributor_id = this.value.distributor_id
      }
      return params
    },
    afterSearch(response) {
      const { list } = response.data.data
      if (this.value.data && this.value.data.length > 0) {
        // 处理传入的数据格式，可能是对象数组或ID数组
        const selectedIds = this.value.data.map((item) => {
          return typeof item === 'object' ? item.groups_activity_id : item
        })
        const selectRows = list.filter((item) => selectedIds.includes(item.groups_activity_id))
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
        groups_activity_id: row.groups_activity_id,
        act_name: row.act_name,
        collection_id: row.collection_id || row.groups_activity_id,
        collection_name: row.collection_name || row.act_name,
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
