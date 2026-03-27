<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.picker-regactivity {
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
  <div class="picker-regactivity">
    <!-- <SpFilterForm :model="formData" size="small" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="keywords">
        <el-input v-model="formData.keywords" placeholder="请输入活动名称" />
      </SpFilterFormItem>
    </SpFilterForm> -->
    <SpFinder
      ref="finder"
      :class="['shop-finder', { 'no-multiple': !multiple }]"
      :other-config="{
        'max-height': 460
      }"
      url="/employeepurchase/activities"
      :fixed-row-action="true"
      :setting="purchaseActivitySetting"
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
import moment from 'moment'
export default {
  name: 'PickerPages',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择内购活动'
  },
  props: ['value'],
  data() {
    return {
      formData: {
        keywords: ''
      },
      multiple: this.value?.multiple ?? true
    }
  },
  computed: {
    purchaseActivitySetting() {
      const t = this.$t.bind(this)
      const momentFunc = this.momentFunc
      return {
        columns: [
          { name: 'ID', key: 'id', width: 80 },
          { name: t('ad117ebf.5da03b'), key: 'name' },
          { name: t('ad117ebf.53cc55'), key: 'distributor_name' },
          {
            name: t('ad117ebf.059c1e'),
            key: 'employee_end_time',
            formatter: (value, { employee_end_time, employee_begin_time }, col) => {
              return `${momentFunc(employee_begin_time)} ~ ${momentFunc(employee_end_time)}`
            }
          },
          { name: t('ad117ebf.3fea7c'), key: 'status_desc' }
        ]
      }
    }
  },
  created() {
    this.$options.config.title = this.$t('ad117ebf.b2e230')
  },
  methods: {
    beforeSearch(params) {
      params = {
        ...params
      }
      return params
    },
    afterSearch(response) {
      const { list } = response.data.data
      if (this.value.data) {
        const valueData = this.multiple ? valueData : this.value.data + ''
        const selectRows = list.filter((item) => valueData.includes(item.id))
        const { finderTable } = this.$refs.finder.$refs
        setTimeout(() => {
          finderTable.$refs.finderTable.setSelection(selectRows)
        })
      }
    },
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    momentFunc(val) {
      return moment(val * 1000).format('YYYY-MM-DD HH:mm:ss')
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
