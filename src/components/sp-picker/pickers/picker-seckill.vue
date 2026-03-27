<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.picker-seckill {
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
  <div class="picker-seckill">
    <SpFilterForm :model="formData" size="small" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="keywords">
        <el-input v-model="formData.keywords" :placeholder="$t('e8cd9812.7528b3')" />
      </SpFilterFormItem>
    </SpFilterForm>
    <SpFinder
      ref="finder"
      :other-config="{
        'max-height': 460,
        'header-cell-class-name': cellClass
      }"
      url="/promotions/seckillactivity/getlist"
      :fixed-row-action="true"
      :setting="seckillSetting"
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
import { SECKILL_ACTIVITY_STATUS } from '@/consts'
import BasePicker from './base'
import PageMixin from '../mixins/page'
export default {
  name: 'PickerPages',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择秒杀'
  },
  props: ['value'],
  computed: {
    seckillSetting() {
      const t = this.$t.bind(this)
      return {
        columns: [
          { name: t('e8cd9812.be3322'), key: 'seckill_id', width: '80' },
          { name: t('e8cd9812.39834b'), key: 'activity_name' },
          {
            name: t('e8cd9812.c799f5'),
            key: 'activity_start_date',
            formatter: (value, row, col) => {
              return `${row.activity_start_date} ~ ${row.activity_end_date}`
            }
          },
          {
            name: t('e8cd9812.1181a5'),
            key: 'status',
            width: '160',
            formatter: (value, row, col) => {
              return this.statusList[value]
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
      multiple: this.value?.multiple ?? true,
      statusList: SECKILL_ACTIVITY_STATUS
    }
  },
  created() {
    this.$options.config.title = this.$t('e8cd9812.235258')
  },
  methods: {
    beforeSearch(params) {
      params = {
        ...params,
        seckill_type: 'limited_time_sale',
        ...this.formData
        // status: 'valid'
      }
      return params
    },
    afterSearch(response) {
      const { list } = response.data.data
      if (this.value.data) {
        const selectRows = list.filter((item) => this.value.data.includes(item.seckill_id))
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
