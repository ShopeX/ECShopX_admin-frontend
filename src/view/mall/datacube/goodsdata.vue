<template>
  <SpPage>
    <SpFilterForm :model="queryForm" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="datetime" label="查询日期:">
        <el-date-picker
          v-model="queryForm.datetime"
          type="daterange"
          format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="defaultTime"
          :picker-options="pickerOptions"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="activity_id" label="内购活动:">
        <el-select
          v-model="queryForm.activity_id"
          v-scroll="() => pagesQuery.nextPage()"
          multiple
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in purchaseActivityList"
            :key="`activity-item__${index}`"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </SpFilterFormItem>
    </SpFilterForm>

    <div class="action-container">
      <el-button v-loading="exportloading" type="primary" @click="exportData"> 导出 </el-button>
      <el-popover
        placement="top-start"
        width="200"
        trigger="hover"
        content="导出任务会以队列执行，点击导出后，请至'设置-导出列表'页面中查看及下载数据"
      >
        <i slot="reference" class="el-icon-question" />
      </el-popover>
    </div>
    <SpFinder
      ref="finder"
      no-selection
      :show-pager="false"
      :setting="setting"
      :row-actions-align="'left'"
      :data="tableData"
    />
  </SpPage>
</template>
<script>
import json2csv from 'json2csv'
import { PICKER_DATE_OPTIONS } from '@/consts'
// import { getGoodsData } from '../../../api/datacube'
import { createSetting } from '@shopex/finder'
import moment from 'moment'
import Pages from '@/utils/pages'
import { VERSION_IN_PURCHASE } from '@/utils'

export default {
  data() {
    const defaultStartDate = moment().subtract(7, 'day')
    const defaultEndDate = moment().subtract(1, 'day')
    return {
      loading: true,
      exportloading: false,
      activeName: 'goods_count',
      queryForm: {
        datetime: [defaultStartDate, defaultEndDate],
        activity_id: ''
      },
      defaultTime: ['00:00:00', '23:59:59'],
      tableData: [],
      pickerOptions: PICKER_DATE_OPTIONS,
      allListData: [],
      setting: createSetting({
        columns: [
          { name: 'No', key: 'no' },
          {
            name: '商品编号',
            key: 'sap_code'
          },
          {
            name: '分类',
            key: 'top_level'
          },
          {
            name: '商品名称',
            key: 'product'
          },
          {
            name: '销量',
            key: 'quantity'
          },
          {
            name: '销售额',
            key: 'fix_price'
          },
          {
            name: '实付额',
            key: 'settle_price'
          }
        ]
      }),
      purchaseActivityList: []
    }
  },
  created() {
    this.pagesQuery = new Pages({
      fetch: this.getPurchaseActivity
    }).nextPage()
  },
  mounted() {
    this.fetch()
  },
  methods: {
    async fetch() {
      const {
        datetime: [display_time_begin, display_time_end],
        activity_id
      } = this.queryForm
      const { list } = await this.$api.datacube.getGoodsData({
        start: moment(display_time_begin).format('YYYY-MM-DD'),
        end: moment(display_time_end).format('YYYY-MM-DD'),
        order_class: activity_id.length > 0 ? 'employee_purchase' : '',
        act_id: activity_id.length > 0 ? activity_id.toString() : ''
      })
      this.tableData = list
      this.$nextTick(() => {
        this.$refs.finder.refresh()
      })
    },
    onSearch() {
      this.fetch()
    },
    async exportData() {
      this.exportloading = true
      const {
        datetime: [display_time_begin, display_time_end],
        activity_id
      } = this.queryForm
      const { status, url } = await this.$api.datacube.getGoodsData({
        start: moment(display_time_begin).format('YYYY-MM-DD'),
        end: moment(display_time_end).format('YYYY-MM-DD'),
        order_class: VERSION_IN_PURCHASE() ? 'employee_purchase' : undefined,
        act_id: activity_id.toString(),
        export: 1
      })
      this.exportloading = false
      if (status) {
        this.$message.success('已加入执行队列，请在设置-导出列表中下载')
        this.$export_open('goods_data')
      } else {
        this.$message.error('无内容可导出 或 执行失败，请检查重试')
      }
    },
    async getPurchaseActivity({ page, pageSize }) {
      const { list, total_count } = await this.$api.marketing.getPurchaseActivity({
        page,
        pageSize
      })
      this.pagesQuery.setTotal(total_count)
      this.purchaseActivityList = this.purchaseActivityList.concat(list)
    }
  }
}
</script>
