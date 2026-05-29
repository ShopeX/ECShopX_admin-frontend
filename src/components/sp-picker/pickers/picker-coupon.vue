<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.picker-coupon {
  .sp-filter-form {
    margin-bottom: 0;
    .filter-form__bd {
      margin-left: 16px;
    }
  }
  .filter-tools {
    padding: 0 16px 12px;
    .el-tabs__header {
      margin-bottom: 0;
    }
    .el-tabs__item {
      font-size: 14px;
    }
    .el-tabs__nav-wrap::after {
      display: none;
    }
    .el-cascader,
    .el-input {
      width: 196px;
      margin-right: 8px;
    }
  }
  .sp-finder-hd {
    display: none;
  }
  .disableheadselection {
    > .cell .el-checkbox__inner {
      display: none;
    }
  }
}
</style>
<template>
  <div class="picker-coupon">
    <div class="filter-tools">
      <el-tabs v-model="statusFilter" @tab-click="onStatusFilterChange">
        <el-tab-pane :label="$t('7039e9c5.30ce10')" name="2" />
        <el-tab-pane :label="$t('7039e9c5.996aab')" name="1" />
        <el-tab-pane :label="$t('7039e9c5.4d5ccd')" name="3" />
      </el-tabs>
    </div>
    <SpFinder
      ref="finder"
      :other-config="{
        'max-height': 460,
        'header-cell-class-name': cellClass
      }"
      url="/discountcard/list"
      :fixed-row-action="true"
      :setting="finderSetting"
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
import district from '@/common/district.json'
import { CARD_TYPE } from '@/consts'
import moment from 'moment'
import { i18n } from '@/i18n'
import BasePicker from './base'
import PageMixin from '../mixins/page'
export default {
  name: 'PickerCoupon',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: i18n.t('7039e9c5.45bcee')
  },
  props: ['value'],
  created() {
    this.$options.config.title = this.$t('7039e9c5.45bcee')
  },
  data() {
    return {
      formData: {
        region: [],
        keywords: ''
      },
      district,
      regionArea: [],
      loading: false,
      multiple: this.value?.multiple ?? true,
      statusFilter: '2'
    }
  },
  computed: {
    finderSetting() {
      const t = this.$t.bind(this)
      return {
        columns: [
          {
            name: t('7039e9c5.f47182'),
            key: 'card_type',
            width: '100px',
            render: (h, { row }) =>
              h(
                'el-tag',
                {
                  props: {
                    size: 'mini'
                  }
                },
                this.cardTypeFormatter(row)
              )
          },
          { name: t('7039e9c5.b7fef7'), key: 'title' },

          {
            name: t('7039e9c5.36166e'),
            key: '_coupon_status',
            width: '100px',
            formatter: (value, row) => this.getCouponStatus(row)
          },
          {
            name: t('7039e9c5.d48a7a'),
            formatter: (value, { takeEffect, begin_time, end_time }, col) => {
              if (takeEffect) {
                return takeEffect
              } else {
                return this.getCardValidate(begin_time, end_time)
              }
            }
          },
          {
            name: t('7039e9c5.4b06cf'),
            formatter: (value, { quantity, get_num }, col) => {
              if (quantity > get_num) {
                return quantity - get_num
              } else {
                return 0
              }
            },
            width: '100px'
          },
          { name: t('7039e9c5.5d5aac'), key: 'get_num', width: '80px' },
          { name: t('7039e9c5.ce2ed8'), key: 'use_num', width: '80px' },
          {
            name: t('9cc0c982.fea789'),
            width: '120px',
            formatter: (value, row) => {
              const id = parseInt(row.source_id)
              const name = row.source_name || row.store_name || row.shop_name
              if (id <= 0 || !name) return t('9cc0c982.498128')
              return name
            }
          },
          {
            name: t('9cc0c982.eb4307'),
            width: '120px',
            formatter: (value, row) => {
              return row.use_all_shops == 1 ? t('9cc0c982.77678b') : t('9cc0c982.fcf7d8')
            }
          }
        ]
      }
    }
  },
  methods: {
    // date_status: 1=待生效 2=已生效 3=已失效
    getCouponStatus(row) {
      const t = this.$t.bind(this)
      const statusMap = {
        1: t('7039e9c5.996aab'),
        2: t('7039e9c5.30ce10'),
        3: t('7039e9c5.4d5ccd')
      }
      const s = row?.date_status
      return s != null ? statusMap[s] || '-' : '-'
    },
    onStatusFilterChange() {
      this.$refs.finder && this.$refs.finder.refresh()
    },
    beforeSearch(params) {
      params = {
        page_no: params.page,
        page_size: params.pageSize,
        end_date: 1,
        // from: 'btn',
        date_status: this.statusFilter,
        is_guide: 0
      }
      return params
    },
    afterSearch(response) {
      const { list } = response.data.data
      const raw = this.value?.data
      if (raw == null || raw === '') return
      const selectedIds = Array.isArray(raw) ? raw : [raw]
      const selectRows = list.filter((item) =>
        selectedIds.map(String).includes(String(item.card_id))
      )
      if (!selectRows.length) return
      const finderTable = this.$refs.finder?.$refs?.finderTable
      if (!finderTable?.$refs?.finderTable) return
      setTimeout(() => {
        finderTable.$refs.finderTable.setSelection(selectRows)
      })
    },
    onSearch() {
      this.$refs.finder.refresh()
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
      // if (this.multiple) {
      //   const { num } = this.value
      //   if (num) {
      //     if (selection.length > num) {
      //       this.$message.error(`最多选择${num}张优惠券`)
      //       return
      //     }
      //   }
      // }
      this.updateVal(selection)
    },
    cardTypeFormatter({ card_type }) {
      return CARD_TYPE[card_type]
    },
    getCardValidate(beginDate, endDate) {
      return `${moment(beginDate * 1000).format('YYYY-MM-DD HH:mm:ss')} ~ ${moment(
        endDate * 1000
      ).format('YYYY-MM-DD HH:mm:ss')}`
    }
  }
}
</script>
