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
    display: flex;
    align-items: center;
    padding: 8px;
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
    <SpFinder
      ref="finder"
      :other-config="{
        'max-height': 460,
        'header-cell-class-name': cellClass
      }"
      url="/discountcard/list"
      :fixed-row-action="true"
      :setting="couponV2Setting"
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
import districtOptions from '@/mixins/districtOptions'
import { CARD_TYPE } from '@/consts'
import moment from 'moment'
import BasePicker from './base'
import PageMixin from '../mixins/page'
export default {
  name: 'PickerCoupon',
  extends: BasePicker,
  mixins: [PageMixin, districtOptions],
  config: {
    title: '选择优惠券'
  },
  props: ['value'],
  computed: {
    couponV2Setting() {
      const t = this.$t.bind(this)
      const cardTypeFormatter = this.cardTypeFormatter
      const getCardValidate = this.getCardValidate
      return {
        search: [
          { key: 'title', name: '', placeholder: t('f6fbe152.fbaebb') },
          { key: 'card_id', name: '', placeholder: t('f6fbe152.c1cad9') }
        ],
        columns: [
          { name: t('f6fbe152.c1cad9'), key: 'card_id' },
          { name: t('f6fbe152.fbaebb'), key: 'title' },
          {
            name: t('f6fbe152.63629e'),
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
                cardTypeFormatter(row)
              )
          },
          { name: t('f6fbe152.3f0045'), key: 'rule_text' },
          {
            name: t('f6fbe152.d48a7a'),
            formatter: (value, { takeEffect, begin_time, end_time }, col) => {
              if (takeEffect) {
                return takeEffect
              } else {
                return getCardValidate(begin_time, end_time)
              }
            }
          }
        ]
      }
    }
  },
  data() {
    return {
      formData: {
        region: [],
        keywords: ''
      },
      district: [],
      regionArea: [],
      loading: false,
      multiple: this.value?.multiple ?? true
    }
  },
  created() {
    this.$options.config.title = this.$t('f6fbe152.45bcee')
  },
  methods: {
    beforeSearch(params) {
      params = {
        ...params,
        page_no: params.page,
        page_size: params.pageSize,
        ...(this.value?.params || {})
      }
      return params
    },
    afterSearch(response) {
      const { list } = response.data.data
      if (this.value.data) {
        const selectRows = list.filter((item) => this.value?.data.includes(item.card_id))
        const { finderTable } = this.$refs.finder.$refs
        setTimeout(() => {
          finderTable.$refs.finderTable.setSelection(selectRows)
        })
      }
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
