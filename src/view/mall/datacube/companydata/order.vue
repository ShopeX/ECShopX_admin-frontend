<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss" scoped>
.sp-filter-form {
  margin-bottom: 16px;
}
.total-display {
  margin: 10px 0 0;
}
</style>
<template>
  <SpPage>
    <SpFilterForm :model="queryForm" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="datetime" :label="$t('8e2ca557.b18226')">
        <el-date-picker
          v-model="queryForm.datetime"
          type="daterange"
          align="right"
          format="yyyy-MM-dd"
          :range-separator="$t('8e2ca557.981cbe')"
          :start-placeholder="$t('8e2ca557.b44c0f')"
          :end-placeholder="$t('8e2ca557.1d468b')"
          :clearable="false"
          :picker-options="pickerOptions"
        />
      </SpFilterFormItem>
      <!-- <SpFilterFormItem prop="activity_id" label="内购活动:">
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
      </SpFilterFormItem> -->
    </SpFilterForm>

    <div v-loading="loading">
      <el-row :gutter="20">
        <el-col :span="4"
          >
<el-statistic :value="total.order_count" :title="$t('8e2ca557.4c117f')"
        />
</el-col>
        <el-col :span="4">
          <el-statistic :value="total.order_payed_count" :title="$t('8e2ca557.7c922f')" />
        </el-col>
        <el-col :span="4"
          >
<el-statistic :value="total.aftersales_count" :title="$t('8e2ca557.f55538')"
        />
</el-col>
        <el-col :span="4"
          >
<el-statistic :value="total.gmv_count / 100" :title="$t('8e2ca557.3e8e62')"
        />
</el-col>
        <el-col :span="4">
          <el-statistic :value="total.amount_payed_count / 100" :title="$t('8e2ca557.efac17')" />
        </el-col>
        <el-col :span="4">
          <el-statistic :value="total.refunded_count / 100" :title="$t('8e2ca557.2eff07')" />
        </el-col>
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
  </SpPage>
</template>
<script>
import Pages from '@/utils/pages'
import moment from 'moment'
import { createSetting } from '@shopex-ui/finder'
import { DualAxes } from '@antv/g2plot'
import { i18n } from '@/i18n'
export default {
  data() {
    const start = moment().subtract('8', 'day')
    const end = moment().subtract('1', 'day')
    return {
      queryForm: {
        datetime: [start, end],
        activity_id: ''
      },
      setting: createSetting({
        columns: [
          {
            name: i18n.t('8e2ca557.4ff1e7'),
            key: 'count_date'
          },
          {
            name: i18n.t('8e2ca557.fbb493'),
            key: 'order_count'
          },
          {
            name: i18n.t('8e2ca557.7c922f'),
            key: 'order_payed_count'
          },
          {
            name: i18n.t('8e2ca557.f55538'),
            key: 'aftersales_count'
          },
          {
            name: i18n.t('8e2ca557.78aff0'),
            key: 'amount_payed_count',
            formatter: (value, row, col) => {
              return value / 100
            }
          },
          {
            name: i18n.t('8e2ca557.9ca9e4'),
            key: 'gmv_count',
            formatter: (value, row, col) => {
              return value / 100
            }
          },
          {
            name: i18n.t('8e2ca557.d7cebd'),
            key: 'refunded_count',
            formatter: (value, row, col) => {
              return value / 100
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
      pickerOptions: {
        shortcuts: [
          {
            text: i18n.t('8e2ca557.56ee10'),
            onClick(picker) {
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 8)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: i18n.t('8e2ca557.335dfc'),
            onClick(picker) {
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 31)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: i18n.t('8e2ca557.d96eb4'),
            onClick(picker) {
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 91)
              picker.$emit('pick', [start, end])
            }
          }
        ],
        disabledDate: (time) => {
          return time.getTime() > end
        }
      },
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
        act_id: activity_id.length > 0 ? activity_id.toString() : ''
      }
      if (params.act_id) {
        params.order_class = 'employee_purchase'
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
        orderData.push({
          time: item.count_date,
          name: this.$t('8e2ca557.4c117f'),
          value: parseInt(item.order_count)
        })
        orderData.push({
          time: item.count_date,
          name: this.$t('8e2ca557.7c922f'),
          value: parseInt(item.order_payed_count)
        })
        orderData.push({
          time: item.count_date,
          name: this.$t('8e2ca557.f55538'),
          value: parseInt(item.aftersales_count)
        })
        amountData.push({
          time: item.count_date,
          name: this.$t('8e2ca557.9ca9e4'),
          value: parseInt(item.gmv_count)
        })
        amountData.push({
          time: item.count_date,
          name: this.$t('8e2ca557.78aff0'),
          value: parseInt(item.amount_payed_count)
        })
        amountData.push({
          time: item.count_date,
          name: this.$t('8e2ca557.d7cebd'),
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
