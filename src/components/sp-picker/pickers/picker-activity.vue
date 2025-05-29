<style lang="scss">
.picker-activity {
  .sp-filter-form {
    padding: 8px 8px 0 8px;
  }
  .sp-finder-hd {
    display: none;
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
}
</style>
<template>
  <div class="picker-activity">
    <SpFilterForm :model="formData" @onSearch="onSearch" @onReset="onReset">
      <SpFilterFormItem prop="marketing_name">
        <el-input v-model="formData.marketing_name" clearable placeholder="活动名称" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="distributor_id">
        <SpSelectShop v-model="formData.distributor_id" clearable placeholder="请选择店铺" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="activity_time" label="活动时间:">
        <el-date-picker
          v-model="formData.activity_time"
          type="daterange"
          value-format="yyyy/MM/dd"
          start-placeholder="开始日期"
          ange-separator="至"
          end-placeholder="结束日期"
          style="width: 100%"
        />
      </SpFilterFormItem>
    </SpFilterForm>
    <SpFinder
      ref="finder"
      reserve-selection
      row-key="seckill_id"
      :class="['shop-finder', { 'no-multiple': !multiple }]"
      :other-config="{
        'max-height': 416,
        'header-cell-class-name': cellClass
      }"
      url="/promotions/seckillactivity/getlist"
      :fixed-row-action="true"
      :setting="setting"
      :hooks="{
        beforeSearch: beforeSearch,
        afterSearch: afterSearch
      }"
      @select="onSelect"
      @select-all="handleSelectAll"
    />
  </div>
</template>

<script>
import { SALES_STATUS, GOOD_CATEGORY, GOOD_CATEGORY_MAP } from '@/consts'
import { createSetting } from '@shopex/finder'
import { cloneDeep } from 'lodash'
import BasePicker from './base'
import PageMixin from '../mixins/page'
import { getRegionauthId } from '@/utils'
export default {
  name: 'PickerActivity',
  extends: BasePicker,
  mixins: [PageMixin],
  config: {
    title: '选择关联活动'
  },
  props: ['value'],
  data() {
    const { queryParams } = this.value
    const defaultParams = {
      marketing_name: '',
      distributor_id: '',
      seckill_type: 'limited_time_sale',
      approve_status: 'on',
      activity_time: []
    }
    const formData = Object.assign(defaultParams, queryParams)
    return {
      formData,
      list: [],
      multipleSelection: [],
      multiple: this.value?.multiple ?? true,
      localSelection: [],
      setting: createSetting({
        columns: [
          { name: 'ID', key: 'seckill_id', width: 80 },
          { name: '活动名称', key: 'activity_name' },
          {
            name: '活动时间',
            key: 'activity_start_date',
            formatter: (value, row, col) => {
              return `${row.activity_start_date} ~ ${row.activity_end_date}`
            }
          },
          {
            name: '状态',
            key: 'marketing_name',
            render(_, { row }) {
              return (
                <div>
                {row.audit_status == 'processing' && row.approve_status == '' && <span>待审核</span>}
                {row.audit_status == 'rejected' && row.approve_status == '' && <span>审核拒绝</span>}
                {row.audit_status == 'approved' && row.approve_status == '' && <span>审核通过</span>}
                {row.audit_status == 'approved' && row.approve_status == 'down' && <span>已下架</span>}
                {row.audit_status == 'approved' && row.approve_status == 'on' && <span>已上架</span>}
                </div>
              )
            }
          },
          { name: '店铺', key: 'source_name' },
          {
            name: '活动类型',
            render(_, { row }) {
              return '限时特惠'
            }
          },
          { name: '区域', key: 'regionauth_name' },
          { name: '创建时间', key: 'created_date' }
        ]
      })
    }
  },
  computed: {},
  created() {
    this.localSelection = cloneDeep(this.value.data) || []
    console.log('????',this.localSelection)
    this.rowKey = this.value?.rowKey || 'seckill_id'
  },
  mounted() {
  },
  methods: {
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    beforeSearch(params) {
      const time = {}
      const activity_time = this.formData.activity_time
      if (activity_time && activity_time.length > 0) {
        time.start_time = this.dateStrToTimeStamp(activity_time[0] + ' 00:00:00')
        time.end_time = this.dateStrToTimeStamp(activity_time[1] + ' 23:59:59')
      }

      params = {
        ...params,
        ...this.formData,
        activity_time: [],
        ...time,
         regionauth_id: getRegionauthId()
      }

      if(this.value.regionauth_id){
        params.regionauth_id = this.value.regionauth_id
      }
        
      return params
    },
    afterSearch(response) {
      const { list } = response.data.data
      if (this.localSelection.length > 0) {
        const { finderTable } = this.$refs.finder.$refs
        const ids = this.localSelection.map((m) => m[this.rowKey])
        const selectRows = list.filter((item) => ids.includes(item[this.rowKey]))
        setTimeout(() => {
          finderTable.$refs.finderTable.setSelection(selectRows)
        })
      }
    },
    onReset() {
      this.$refs.finder.refresh(true)
    },
    onSearch() {
      this.$refs.finder.initData(true)
    },
    onSelect(selection, row) {
      if (!this.multiple) {
        const { finderTable } = this.$refs.finder.$refs
        finderTable.clearSelection()
        this.localSelection = [row]
        this.$nextTick(() => {
          finderTable.$refs.finderTable.setSelection(selection.length > 0 ? [row] : [])
        })
      } else {
        const isAdd = selection.includes(row)
        const idx = this.localSelection.findIndex((f) => f[this.rowKey] === row[this.rowKey])

        if (isAdd && idx === -1) {
          this.localSelection.push(row)
        } else if (!isAdd && idx !== -1) {
          this.localSelection.splice(idx, 1)
        }
      }
      this.localSelection = this.localSelection.filter((item) => item[this.rowKey])
      this.updateVal(this.localSelection)
    },
    /**
     * @description 全选只针对当前页 那么在状态改变的时候 应该不考虑未来的选中数据
     * @description 循环调用 onSelect 方法保存或删除当前页选中数据
     * @param list 当前页勾选数据 如果localSelection存在未来页数据 那么页码切换的时候 list中也会有
     */
    async handleSelectAll(list) {
      const { finderTable } = this.$refs.finder.$refs
      const currentPageData = finderTable.$refs.finderTable.list
      const currentPageDataIds = currentPageData.map((m) => m[this.rowKey])

      // 获取当前页面已选中的数据
      const currentPageSelectList = list.filter((item) =>
        currentPageDataIds.includes(item[this.rowKey])
      )

      // 先移除当前页的所有选中项
      this.localSelection = this.localSelection.filter(
        (item) => !currentPageDataIds.includes(item[this.rowKey])
      )

      // 如果有选中项，则添加到 localSelection
      if (currentPageSelectList.length > 0) {
        this.localSelection.push(...currentPageData)
      }

      this.updateVal(this.localSelection)

      // 更新表格选中状态
      this.$nextTick(() => {
        if (currentPageSelectList.length > 0) {
          finderTable.$refs.finderTable.setSelection(currentPageData)
        } else {
          finderTable.$refs.finderTable.clearSelection()
        }
      })
    }
  }
}
</script>
