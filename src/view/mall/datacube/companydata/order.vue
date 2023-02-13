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

    <el-row :gutter="20">
      <el-col :span="4"><el-statistic :value="total.order_count" title="订单" /></el-col>
      <el-col :span="4">
        <el-statistic :value="total.order_payed_count" title="付款订单数" />
      </el-col>
      <el-col :span="4"><el-statistic :value="total.aftersales_count" title="售后单数" /></el-col>
      <el-col :span="4"><el-statistic :value="total.gmv_count" title="GMV(元)" /></el-col>
      <el-col :span="4">
        <el-statistic :value="total.amount_payed_count" title="交易额(元)" />
      </el-col>
      <el-col :span="4"><el-statistic :value="total.refunded_count" title="退款额(元)" /></el-col>
    </el-row>

    <!-- <canvas :id="item.key" height="120" /> -->

    <SpFinder
      ref="finder"
      no-selection
      :show-pager="false"
      :setting="setting"
      :row-actions-align="'left'"
      :data="tableData"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import chart from 'chart.js'
import { PICKER_DATE_OPTIONS } from '@/consts'
import Pages from '@/utils/pages'
import moment from 'moment'
import { createSetting } from '@shopex/finder'
import { getCompanyData } from '../../../../api/datacube'
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
            key: 'amount_payed_count'
          },
          {
            name: 'GMV',
            key: 'gmv_count'
          },
          {
            name: '退款额',
            key: 'refunded_count'
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
      dataInfo: {
        order_count: {
          label: '订单',
          data_list: [],
          total_num: 0,
          unit: ''
        },
        order_payed_count: {
          label: '付款订单数',
          data_list: [],
          total_num: 0,
          unit: ''
        },
        amount_payed_count: {
          label: '交易额',
          data_list: [],
          total_num: 0,
          unit: '元'
        },
        gmv_count: {
          label: 'GMV',
          data_list: [],
          total_num: 0,
          unit: '元'
        },
        aftersales_count: {
          label: '售后单数',
          data_list: [],
          total_num: 0,
          unit: ''
        },
        refunded_count: {
          label: '退款额',
          data_list: [],
          total_num: 0,
          unit: '元'
        }
      },
      chartColors: {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
      },
      pickerOptions: PICKER_DATE_OPTIONS
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
        end: moment(end).format('YYYY-MM-DD')
        // order_class: 'employee_purchase',
        // act_id: activity_id.toString()
      }
      const { list } = await this.$api.datacube.getCompanyData(params)
      this.tableData = list
      ;(this.total = {
        order_count: list.reduce((prev, next) => prev + next.order_count, 0),
        order_payed_count: list.reduce((prev, next) => prev + next.order_payed_count, 0),
        aftersales_count: list.reduce((prev, next) => prev + next.aftersales_count, 0),
        gmv_count: list.reduce((prev, next) => prev + next.gmv_count, 0),
        amount_payed_count: list.reduce((prev, next) => prev + next.amount_payed_count, 0),
        refunded_count: list.reduce((prev, next) => prev + next.refunded_count, 0)
      }),
        this.$nextTick(() => {
          this.$refs.finder.refresh()
        })
    },

    // getCompanyDataList(pane_name) {
    //   this.dataTimeArr = []
    //   this.dataInfo.order_count.data_list = []
    //   this.dataInfo.amount_payed_count.data_list = []
    //   this.dataInfo.order_payed_count.data_list = []
    //   this.dataInfo.gmv_count.data_list = []
    //   this.dataInfo.aftersales_count.data_list = []
    //   this.dataInfo.refunded_count.data_list = []

    //   let params = { start: this.params.start, end: this.params.end }
    //   getCompanyData(params)
    //     .then((res) => {
    //       this.allListData = res.data.data.list
    //       let companyDataList = res.data.data.list
    //       let order_count_total_num = 0
    //       let amount_payed_count_total_num = 0
    //       let order_payed_count_total_num = 0
    //       let gmv_count_total_num = 0
    //       let aftersales_count_total_num = 0
    //       let refunded_count_total_num = 0
    //       for (var key in companyDataList) {
    //         this.dataTimeArr.push(companyDataList[key].count_date)

    //         this.dataInfo.order_count.data_list.push(companyDataList[key].order_count)
    //         order_count_total_num += Number(companyDataList[key].order_count)

    //         this.dataInfo.amount_payed_count.data_list.push(
    //           companyDataList[key].amount_payed_count / 100
    //         )
    //         amount_payed_count_total_num += Number(companyDataList[key].amount_payed_count)

    //         this.dataInfo.order_payed_count.data_list.push(companyDataList[key].order_payed_count)
    //         order_payed_count_total_num += Number(companyDataList[key].order_payed_count)

    //         this.dataInfo.gmv_count.data_list.push(companyDataList[key].gmv_count / 100)
    //         gmv_count_total_num += Number(companyDataList[key].gmv_count)

    //         this.dataInfo.aftersales_count.data_list.push(companyDataList[key].aftersales_count)
    //         aftersales_count_total_num += Number(companyDataList[key].aftersales_count)

    //         this.dataInfo.refunded_count.data_list.push(companyDataList[key].refunded_count / 100)
    //         refunded_count_total_num += Number(companyDataList[key].refunded_count)
    //       }
    //       this.dataInfo.order_count.total_num = order_count_total_num
    //       this.dataInfo.amount_payed_count.total_num = amount_payed_count_total_num / 100
    //       this.dataInfo.order_payed_count.total_num = order_payed_count_total_num
    //       this.dataInfo.gmv_count.total_num = gmv_count_total_num / 100
    //       this.dataInfo.aftersales_count.total_num = aftersales_count_total_num
    //       this.dataInfo.refunded_count.total_num = refunded_count_total_num / 100
    //       this.loading = false
    //       if (pane_name) {
    //         // 首次加载
    //         this.$nextTick(() => {
    //           this.chartInit(pane_name)
    //         })
    //       }
    //     })
    //     .catch((error) => {
    //       this.$message({
    //         type: 'error',
    //         message: '获取统计信息出错'
    //       })
    //     })
    // },

    // chartInit(pane_name) {
    //   var config = {
    //     type: 'line',
    //     data: {
    //       labels: this.dataTimeArr,
    //       datasets: [
    //         {
    //           label: this.dataInfo[pane_name].label,
    //           backgroundColor: this.chartColors.grey,
    //           borderColor: this.chartColors.red,
    //           data: this.dataInfo[pane_name].data_list,
    //           fill: false
    //         }
    //       ]
    //     },
    //     options: {
    //       responsive: true,
    //       title: {
    //         display: true,
    //         text: '合计(' + this.dataInfo[pane_name].total_num + this.dataInfo[pane_name].unit + ')'
    //       },
    //       tooltips: {
    //         mode: 'index',
    //         intersect: true
    //       },
    //       hover: {
    //         mode: 'nearest',
    //         intersect: true
    //       },
    //       scales: {
    //         xAxes: [
    //           {
    //             display: true,
    //             scaleLabel: {
    //               display: true,
    //               labelString: ''
    //             }
    //           }
    //         ],
    //         yAxes: [
    //           {
    //             display: true,
    //             scaleLabel: {
    //               display: false
    //             }
    //           }
    //         ]
    //       }
    //     }
    //   }
    //   var ctx = document.getElementById(pane_name).getContext('2d')
    //   window.myLine = new Chart(ctx, config)
    // },

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
