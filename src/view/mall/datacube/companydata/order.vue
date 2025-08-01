<style lang="scss" scoped>
.sp-filter-form {
  margin-bottom: 16px;
}
.total-display {
  margin: 10px 0 0;
}
</style>
<template>
  <div>
    <SpFilterForm :model="queryForm" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="datetime" label="查询日期:">
        <el-date-picker
          v-model="queryForm.datetime"
          clearable
          type="daterange"
          align="right"
          format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="enterprise_id" label="内购活动:" size="max">
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

    <div v-loading="loading">
      <el-row :gutter="20">
        <el-col :span="4"><el-statistic :value="total.order_count" title="订单" /></el-col>
        <el-col :span="4">
          <el-statistic :value="total.order_payed_count" title="付款订单数" />
        </el-col>
        <el-col :span="4"><el-statistic :value="total.aftersales_count" title="售后单数" /></el-col>
        <el-col :span="4"><el-statistic :value="total.gmv_count/100" title="GMV(元)" /></el-col>
        <el-col :span="4">
          <el-statistic :value="total.amount_payed_count/100" title="交易额(元)" />
        </el-col>
        <el-col :span="4"><el-statistic :value="total.refunded_count/100" title="退款额(元)" /></el-col>
      </el-row>

      <div v-if="tableData.length > 0" id="container" style="height: 400px; margin: 40px 0" />

      <SpFinder
        ref="finder"
        no-selection
        :show-pager="false"
        :setting="setting"
        :row-actions-align="'left'"
        :data="tableData"
      />
    </div>
  </div>
</template>
<script>
import { PICKER_DATE_OPTIONS } from '@/consts'
import Pages from '@/utils/pages'
import moment from 'moment'
import { createSetting } from '@shopex/finder'
import { DualAxes } from '@antv/g2plot'
export default {
  data() {
    const start = moment().subtract('7', 'day')
    const end = moment().subtract('1', 'day')
    return {
      queryForm: {
        datetime: [start, end],
        activity_id: ''
      },
      setting: createSetting({
        columns: [
          {
            name: '日期',
            key: 'count_date'
          },
          {
            name: '订单数',
            key: 'order_count'
          },
          {
            name: '付款订单数',
            key: 'order_payed_count'
          },
          {
            name: '售后单数',
            key: 'aftersales_count'
          },
          {
            name: '交易额',
            key: 'amount_payed_count',
            formatter: (value, row, col) => {
              return value /100
            }
          },
          {
            name: 'GMV',
            key: 'gmv_count',
            formatter: (value, row, col) => {
              return value /100
            }
          },
          {
            name: '退款额',
            key: 'refunded_count',
            formatter: (value, row, col) => {
              return value /100
            }
          }
        ]
      }),
      purchaseActivityList: [],
      tableData: [],
      loading: true,
      dataTimeArr: [],
      total: {
        order_count: 0,
        order_payed_count: 0,
        aftersales_count: 0,
        gmv_count: 0,
        amount_payed_count: 0,
        refunded_count: 0
      },
      pickerOptions: PICKER_DATE_OPTIONS,
      line: null
    }
  },
  created() {
    this.pagesQuery = new Pages({
      fetch: this.getPurchaseActivity
    }).nextPage()
  },
  mounted() {
    this.fetchStatisticData()
  },
  methods: {
    onSearch() {
      this.fetchStatisticData()
    },
    async fetchStatisticData() {
      const {
        datetime: [start, end],
        activity_id
      } = this.queryForm
      const params = {
        start: moment(start).format('YYYY-MM-DD'),
        end: moment(end).format('YYYY-MM-DD'),
        act_id: activity_id.toString()
      }
     if(params.act_id){
      params.order_class= 'employee_purchase'
     }
      this.loading = true
      const { list } = await this.$api.datacube.getCompanyData(params)
      this.loading = false
      this.tableData = list
      this.total = {
        order_count: list.reduce((prev, next) => prev + parseInt(next.order_count), 0),
        order_payed_count: list.reduce((prev, next) => prev + parseInt(next.order_payed_count), 0),
        aftersales_count: list.reduce((prev, next) => prev + parseInt(next.aftersales_count), 0),
        gmv_count: list.reduce((prev, next) => prev + parseInt(next.gmv_count), 0),
        amount_payed_count: list.reduce(
          (prev, next) => prev + parseInt(next.amount_payed_count),
          0
        ),
        refunded_count: list.reduce((prev, next) => prev + parseInt(next.refunded_count), 0)
      }
      if (list.length > 0) {
        this.$nextTick(() => {
          this.renderChart(list)
        })
      }
      this.$nextTick(() => {
        this.$refs.finder.refresh()
      })
    },
    renderChart(list) {
      let orderData = []
      let amountData = []
      list.forEach((item) => {
        orderData.push({ time: item.count_date, name: '订单', value: parseInt(item.order_count) })
        orderData.push({
          time: item.count_date,
          name: '付款订单数',
          value: parseInt(item.order_payed_count)
        })
        orderData.push({
          time: item.count_date,
          name: '售后单数',
          value: parseInt(item.aftersales_count)
        })
        amountData.push({ time: item.count_date, name: 'GMV', value: parseInt(item.gmv_count) })
        amountData.push({
          time: item.count_date,
          name: '交易额',
          value: parseInt(item.amount_payed_count)
        })
        amountData.push({
          time: item.count_date,
          name: '退款额',
          value: parseInt(item.refunded_count)
        })
      })

      if (this.line) {
        this.line.changeData([orderData, amountData])
      } else {
        this.line = new DualAxes('container', {
          data: [orderData, amountData],
          padding: 'auto',
          xField: 'time',
          yField: ['value', 'value'],
          geometryOptions: [
            {
              geometry: 'line',
              seriesField: 'name',
              smooth: true
            },
            {
              geometry: 'line',
              seriesField: 'name',
              smooth: true
            }
          ],
          // seriesField: seriesKey,
          appendPadding: [0, 8, 0, 0]
        })
        this.line.render()
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
