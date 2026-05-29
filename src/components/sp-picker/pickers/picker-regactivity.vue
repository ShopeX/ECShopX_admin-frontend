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
      url="/selfhelp/registrationActivity/list"
      :fixed-row-action="true"
      :setting="regactivitySetting"
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
  name: 'PickerRegactivity',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: 'ffeca7a9.4bc060'
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
    regactivitySetting() {
      const t = this.$t.bind(this)
      return {
        columns: [
          { name: 'ID', key: 'activity_id', width: 80 },
          { name: t('ffeca7a9.39834b'), key: 'activity_name' },
          // { name: t('ffeca7a9.a5d1c5'), key: 'tem_name' },
          { name: t('ffeca7a9.1181a5'), key: 'status_name', width: 100 },
          {
            name: t('ffeca7a9.295713'),
            key: 'distributor_name',
            render: (h, { row }) => h('span', {}, this.getCycle([row.distributor_name]))
          }
        ]
      }
    }
  },
  created() {
    this.$options.config.title = this.$t(this.$options.config.title)
  },
  methods: {
    beforeSearch(params) {
      const urlParams = new URLSearchParams(window.location.search)
      const distributor_id = urlParams.get('distributor_id')
      params = {
        ...params
        // is_valid: true
      }
      if (distributor_id) {
        params['distributor_id'] = distributor_id
      }
      return params
    },
    afterSearch(response) {
      const { list } = response.data.data
      const raw = this.value?.data
      if (raw == null || raw === '') return
      const selectedIds = Array.isArray(raw) ? raw : [raw]
      const selectRows = list.filter((item) =>
        selectedIds.map(String).includes(String(item.activity_id))
      )
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
    },
    getCycle(distributor_name) {
      const name = distributor_name ? distributor_name.join(',') : ''
      return name
    }
  }
}
</script>
