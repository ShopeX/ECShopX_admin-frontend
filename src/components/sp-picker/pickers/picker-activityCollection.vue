<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.picker-activity-collection {
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
  <div class="picker-activity-collection">
    <SpFilterForm :model="formData" size="small" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="keywords">
        <el-input v-model="formData.keywords" :placeholder="$t('021a5ddf.55f14c')" />
      </SpFilterFormItem>
    </SpFilterForm>
    <SpFinder
      ref="finder"
      :other-config="{
        'max-height': 460,
        'header-cell-class-name': cellClass
      }"
      url="/promotions/collection/list"
      :fixed-row-action="true"
      :setting="activityCollectionSetting"
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
  name: 'PickerActivityCollection',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择活动集合'
  },
  props: ['value'],
  computed: {
    activityCollectionSetting() {
      const t = this.$t.bind(this)
      return {
        columns: [
          { name: t('021a5ddf.26cf62'), key: 'collection_id', width: '80' },
          { name: t('021a5ddf.fd4fcb'), key: 'collection_name' },
          {
            name: t('021a5ddf.3bdd08'),
            key: 'description',
            formatter: (value, row, col) => {
              return value || '-'
            }
          },
          {
            name: t('021a5ddf.3fea7c'),
            key: 'is_open',
            width: '100',
            formatter: (value, row, col) => {
              return value == 1 ? t('021a5ddf.7854b5') : t('021a5ddf.710ad0')
            }
          }
        ]
      }
    }
  },
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
  created() {
    this.$options.config.title = this.$t('021a5ddf.85d516')
  },
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
      return params
    },
    afterSearch(response) {
      const { list } = response.data.data
      if (this.value.data) {
        // 处理传入的数据格式，可能是ID或对象
        const selectedIds = Array.isArray(this.value.data)
          ? this.value.data.map((item) => (typeof item === 'object' ? item.collection_id : item))
          : [typeof this.value.data === 'object' ? this.value.data.collection_id : this.value.data]
        const selectRows = list.filter((item) => selectedIds.includes(item.collection_id))
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
        collection_id: row.collection_id,
        collection_name: row.collection_name,
        description: row.description,
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
