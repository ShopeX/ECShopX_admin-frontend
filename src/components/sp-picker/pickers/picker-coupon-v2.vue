<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
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
      :setting="{
        search: [
          { key: 'title', name: '', placeholder: '优惠券名称' },
          { key: 'card_id', name: '', placeholder: '优惠券模板ID' }
        ],
        columns: [
          {
            name: '优惠券模板ID',
            key: 'card_id'
          },
          { name: '优惠券名称', key: 'title' },
          {
            name: '券类型',
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
          {
            name: '卡券规则',
            key: 'rule_text'
          },
          {
            name: '卡券有效期',
            formatter: (value, { takeEffect, begin_time, end_time }, col) => {
              if (takeEffect) {
                return takeEffect
              } else {
                return getCardValidate(begin_time, end_time)
              }
            }
          }
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
import district from '@/common/district.json'
import { CARD_TYPE } from '@/consts'
import moment from 'moment'
import BasePicker from './base'
import PageMixin from '../mixins/page'
export default {
  name: 'PickerCoupon',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择优惠券'
  },
  props: ['value'],
  data() {
    return {
      formData: {
        region: [],
        keywords: ''
      },
      district,
      regionArea: [],
      loading: false,
      multiple: this.value?.multiple ?? true
    }
  },
  created() {
    // this.fetch()
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
        const selectRows = list.filter(item => this.value?.data.includes(item.card_id))
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
