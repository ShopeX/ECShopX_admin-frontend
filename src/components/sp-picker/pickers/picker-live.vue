<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.picker-live {
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
  <div class="picker-live">
    <!-- <SpFilterForm :model="formData" size="small" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="keywords">
        <el-input v-model="formData.keywords" placeholder="请输入页面名称" />
      </SpFilterFormItem>
    </SpFilterForm> -->
    <SpFinder
      ref="finder"
      :class="['shop-finder', { 'no-multiple': !multiple }]"
      :other-config="{
        'max-height': 460
      }"
      url="/promotions/liverooms"
      :fixed-row-action="true"
      :setting="liveSetting"
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
import { i18n } from '@/i18n'
import BasePicker from './base'
import PageMixin from '../mixins/page'
export default {
  name: 'PickerPages',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: i18n.t('7f395b54.6e102c')
  },
  props: ['value'],
  computed: {
    liveSetting() {
      const t = this.$t.bind(this)
      return {
        columns: [
          { name: t('7f395b54.e3778c'), key: 'roomid', width: 80 },
          { name: t('7f395b54.abf66f'), key: 'name' }
        ]
      }
    }
  },
  data() {
    return {
      formData: {
        keywords: ''
      },
      multiple: this.value?.multiple ?? true
    }
  },
  created() {
    this.$options.config.title = this.$t('7f395b54.6e102c')
  },
  methods: {
    beforeSearch(params) {
      params = {
        ...params,
        template_name: 'yykweishop'
      }
      return params
    },
    afterSearch(response) {
      const { list } = response.data.data
      if (this.value.data && Array.isArray(this.value.data) && this.value.data.length > 0) {
        const selectRows = list.filter(item => this.value.data.includes(item.roomid))
        const { finderTable } = this.$refs.finder.$refs
        // 只有当找到匹配的项时才设置选中状态，避免清空其他选中项
        if (selectRows.length > 0) {
          setTimeout(() => {
            finderTable.$refs.finderTable.setSelection(selectRows)
          })
        }
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
