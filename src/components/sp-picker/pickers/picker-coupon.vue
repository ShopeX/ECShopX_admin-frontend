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
    <!-- multiple：{{ multiple }}, {{ value }} -->
    <!-- <SpFilterForm :model="formData" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="region">
        <el-cascader
          ref="region"
          v-model="formData.region"
          filterable
          clearable
          placeholder="选择地区筛选店铺"
          :options="district"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="keywords">
        <el-input v-model="formData.keywords" placeholder="请输入店铺名称搜索" />
      </SpFilterFormItem>
    </SpFilterForm> -->

    <SpFinder
      ref="finder"
      :other-config="{
        'max-height': 460,
        'header-cell-class-name': cellClass
      }"
      url="/discountcard/list"
      :fixed-row-action="true"
      :setting="{
        columns: [
          {
            name: '卡券类型',
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
          { name: '卡券名称', key: 'title' },
          {
            name: '卡券有效期',
            formatter: (value, { takeEffect, begin_time, end_time }, col) => {
              if (takeEffect) {
                return takeEffect
              } else {
                return getCardValidate(begin_time, end_time)
              }
            }
          },
          {
            name: '可领取库存',
            formatter: (value, { quantity, get_num }, col) => {
              if (quantity > get_num) {
                return quantity - get_num
              } else {
                return 0
              }
            },
            width: '100px'
          },
          { name: '领取量', key: 'get_num', width: '80px' },
          { name: '使用量', key: 'use_num', width: '80px' }
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
        end_date: 1,
        from: 'btn'
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
