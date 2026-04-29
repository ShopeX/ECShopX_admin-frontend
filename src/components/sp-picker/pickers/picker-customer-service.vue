<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.picker-customer-service {
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
  <div class="picker-customer-service">
    <SpFinder
      ref="finder"
      :show-pager="false"
      :class="['shop-finder', { 'no-multiple': !multiple }]"
      :other-config="{
        'max-height': '580px'
      }"
      :data="list"
      :fixed-row-action="true"
      :setting="{
        columns: [
          { name: 'ID', key: 'id' },
          { name: $t('cc5110aa.d7ec2d'), key: 'title' }
        ]
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
  name: 'PickerCustomerService',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: i18n.t('cc5110aa.5466f6')
  },
  props: ['value'],
  data() {
    return {
      list: [
        { id: 'customerService', title: this.$t('cc5110aa.107a88') },
        { id: 'guide_service', title: this.$t('cc5110aa.6f33a3') },
        { id: 'officialProfile', title: this.$t('cc5110aa.a90321') },
        { id: 'officialChat', title: this.$t('cc5110aa.b70432') },
        { id: 'official', title: this.$t('cc5110aa.c40543') }
      ],
      multiple: this.value?.multiple ?? true
    }
  },
  mounted() {
    const data = this.value?.data
    const ids = Array.isArray(data) ? data : data != null ? [data] : []
    if (ids.length) {
      const selectRows = this.list.filter((item) => ids.includes(item.id))
      const { finderTable } = this.$refs.finder?.$refs
      if (finderTable?.$refs?.finderTable) {
        setTimeout(() => {
          finderTable.$refs.finderTable.setSelection(selectRows)
        })
      }
    }
  },
  methods: {
    onSelect(selection, row) {
      if (this.multiple) {
        // 多选由 onSelectionChange 处理
      } else {
        const { finderTable } = this.$refs.finder.$refs
        if (finderTable) {
          finderTable.clearSelection()
          setTimeout(() => {
            finderTable.$refs.finderTable.setSelection(selection.length > 0 ? [row] : [])
          })
        }
      }
    },
    onSelectionChange(selection) {
      this.updateVal(selection)
    }
  }
}
</script>
