<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.picker-pages {
  .sp-filter-form {
    padding: 8px 8px 0px 8px;
  }
  .sp-finder-hd {
    display: none;
  }
  .sp-finder {
    &.no-multiple {
      .sp-finder-bd {
        .el-table__fixed-header-wrapper {
          table thead {
            tr {
              th {
                &:nth-child(1) {
                  .el-checkbox {
                    display: none;
                  }
                }
              }
            }
          }
        }
      }
      .el-table__fixed-body-wrapper {
        top: 38px !important;
      }
    }
  }
  .el-pagination {
    margin: 0;
    padding: 10px;
  }
}
</style>
<template>
  <div class="picker-pages">
    <SpFilterForm :model="formData" size="small" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="keywords">
        <el-input v-model="formData.keywords" :placeholder="$t('ba37de2c.7d5cc3')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="is_open">
        <el-select v-model="formData.is_open" clearable :placeholder="$t('ba37de2c.53c3dd')">
          <el-option value="1" :label="$t('ba37de2c.0a60ac')" />
          <el-option value="0" :label="$t('ba37de2c.c9744f')" />
        </el-select>
      </SpFilterFormItem>
    </SpFilterForm>
    <SpFinder
      ref="finder"
      :class="['shop-finder', { 'no-multiple': !multiple }]"
      :other-config="{
        'max-height': 460
      }"
      url="/wxa/customizepage/list"
      :fixed-row-action="true"
      :setting="{
        columns: [
          { name: 'ID', key: 'id', width: 80 },
          { name: $t('ba37de2c.b78454'), key: 'page_name' },
          { name: $t('ba37de2c.abf8f4'), key: 'page_description' }
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
  name: 'PickerPages',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择自定义页面'
  },
  props: ['value'],
  created() {
    this.$options.config.title = this.$t('ba37de2c.2f227a')
  },
  data() {
    return {
      formData: {
        keywords: '',
        is_open: ''
      },
      multiple: this.value?.multiple ?? true
    }
  },
  methods: {
    beforeSearch(params) {
      params = {
        ...params,
        template_name: 'yykweishop'
      }
      const { keywords } = this.formData
      if (keywords) {
        params = {
          ...params,
          page_name: keywords
        }
      }
      if (this.formData.is_open) {
        params = {
          ...params,
          is_open: this.formData.is_open
        }
      }
      return params
    },
    afterSearch(response) {
      const { list } = response.data.data
      const raw = this.value?.data
      if (raw == null || raw === '') return
      const selectedIds = Array.isArray(raw) ? raw : [raw]
      const selectRows = list.filter((item) => selectedIds.map(String).includes(String(item.id)))
      if (!selectRows.length) return
      const finderTable = this.$refs.finder?.$refs?.finderTable
      if (!finderTable?.$refs?.finderTable) return
      setTimeout(() => {
        finderTable.$refs.finderTable.setSelection(selectRows)
      })
    },
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    onSelect(selection, row) {
      if (this.multiple) {
        // this.updateVal(selection)
      } else {
        const { finderTable } = this.$refs.finder.$refs
        console.log('finderTable:', finderTable)
        finderTable.clearSelection()
        setTimeout(() => {
          finderTable.$refs.finderTable.setSelection([row])
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
