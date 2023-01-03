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
    {{ queryForm }}
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
          v-model="queryForm.enterprise_id"
          v-scroll="getActivityList"
          multiple
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in activityList"
            :key="`activity-item__${index}`"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </SpFilterFormItem>
    </SpFilterForm>

    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-row class="total-display" :gutter="20">
        <el-col v-for="(item, index) in tabList" :key="`tab-col__${index}`" :span="4">
          <div>
            <el-statistic
              :value="item.total"
              :title="`${item.label}${item.unit ? '（' + item.unit + '）' : ''}`"
            />
          </div>
        </el-col>
      </el-row>

      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="`tab-pane__${index}`"
        :label="item.label"
        :name="item.key"
      >
        <section>
          <canvas :id="item.key" height="120" />
        </section>
      </el-tab-pane>
    </el-tabs>

    <el-table :data="allListData" stripe border style="width: 100%">
      <el-table-column prop="count_date" label="日期" fixed />
      <el-table-column prop="order_count" label="订单数" />
      <el-table-column prop="order_payed_count" label="付款订单数" />
      <el-table-column prop="amount_payed_count" label="交易额">
        <template slot-scope="scope"> ￥{{ scope.row.amount_payed_count / 100 }} </template>
      </el-table-column>
      <el-table-column prop="gmv_count" label="GMV">
        <template slot-scope="scope"> ￥{{ scope.row.gmv_count / 100 }} </template>
      </el-table-column>
      <el-table-column prop="aftersales_count" label="售后单数" />
      <el-table-column label="退款额">
        <template slot-scope="scope"> ￥{{ scope.row.refunded_count / 100 }} </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import chart from 'chart.js'
import { PICKER_DATE_OPTIONS } from '@/consts'
import Pages from '@/utils/pages'
import moment from 'moment'
import { getCompanyData } from '../../../../api/datacube'
export default {
  data() {
    const start = moment().subtract('7', 'day')
    const end = moment().subtract('1', 'day')
    return {
      queryForm: {
        datetime: [start, end]
      },
      activityList: [],
      vdate: '',
      loading: true,
      activeName: 'order_count',
      params: {
        start: '',
        end: ''
      },
      allListData: [],
      dataTimeArr: [],
      tabList: [
        { key: 'order_count', label: '订单', total: 0, unit: '' },
        { key: 'order_payed_count', label: '付款订单数', total: 0, unit: '' },
        { key: 'amount_payed_count', label: '交易额', total: 0, unit: '元' },
        { key: 'gmv_count', label: 'GMV', total: 0, unit: '元' },
        { key: 'aftersales_count', label: '售后单数', total: 0, unit: '' },
        { key: 'refunded_count', label: '退款额', total: 0, unit: '元' }
      ],
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
    this.pagesQuery = new Pages()
    this.getActivityList()
  },
  mounted() {
    var start = new Date()
    var end = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
    end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
    this.vdate = [start, end]
    this.getCompanyDataList(this.activeName)
  },
  methods: {
    onSearch() {},
    handleClick(tab, event) {
      this.chartInit(tab.name)
    },
    getCompanyDataList(pane_name) {
      this.dataTimeArr = []
      this.dataInfo.order_count.data_list = []
      this.dataInfo.amount_payed_count.data_list = []
      this.dataInfo.order_payed_count.data_list = []
      this.dataInfo.gmv_count.data_list = []
      this.dataInfo.aftersales_count.data_list = []
      this.dataInfo.refunded_count.data_list = []

      let params = { start: this.params.start, end: this.params.end }
      getCompanyData(params)
        .then((res) => {
          this.allListData = res.data.data.list
          let companyDataList = res.data.data.list
          let order_count_total_num = 0
          let amount_payed_count_total_num = 0
          let order_payed_count_total_num = 0
          let gmv_count_total_num = 0
          let aftersales_count_total_num = 0
          let refunded_count_total_num = 0
          for (var key in companyDataList) {
            this.dataTimeArr.push(companyDataList[key].count_date)

            this.dataInfo.order_count.data_list.push(companyDataList[key].order_count)
            order_count_total_num += Number(companyDataList[key].order_count)

            this.dataInfo.amount_payed_count.data_list.push(
              companyDataList[key].amount_payed_count / 100
            )
            amount_payed_count_total_num += Number(companyDataList[key].amount_payed_count)

            this.dataInfo.order_payed_count.data_list.push(companyDataList[key].order_payed_count)
            order_payed_count_total_num += Number(companyDataList[key].order_payed_count)

            this.dataInfo.gmv_count.data_list.push(companyDataList[key].gmv_count / 100)
            gmv_count_total_num += Number(companyDataList[key].gmv_count)

            this.dataInfo.aftersales_count.data_list.push(companyDataList[key].aftersales_count)
            aftersales_count_total_num += Number(companyDataList[key].aftersales_count)

            this.dataInfo.refunded_count.data_list.push(companyDataList[key].refunded_count / 100)
            refunded_count_total_num += Number(companyDataList[key].refunded_count)
          }
          this.dataInfo.order_count.total_num = order_count_total_num
          this.dataInfo.amount_payed_count.total_num = amount_payed_count_total_num / 100
          this.dataInfo.order_payed_count.total_num = order_payed_count_total_num
          this.dataInfo.gmv_count.total_num = gmv_count_total_num / 100
          this.dataInfo.aftersales_count.total_num = aftersales_count_total_num
          this.dataInfo.refunded_count.total_num = refunded_count_total_num / 100
          this.loading = false
          if (pane_name) {
            // 首次加载
            this.$nextTick(() => {
              this.chartInit(pane_name)
            })
          }
        })
        .catch((error) => {
          this.$message({
            type: 'error',
            message: '获取统计信息出错'
          })
        })
    },

    chartInit(pane_name) {
      var config = {
        type: 'line',
        data: {
          labels: this.dataTimeArr,
          datasets: [
            {
              label: this.dataInfo[pane_name].label,
              backgroundColor: this.chartColors.grey,
              borderColor: this.chartColors.red,
              data: this.dataInfo[pane_name].data_list,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          title: {
            display: true,
            text: '合计(' + this.dataInfo[pane_name].total_num + this.dataInfo[pane_name].unit + ')'
          },
          tooltips: {
            mode: 'index',
            intersect: true
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          scales: {
            xAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: ''
                }
              }
            ],
            yAxes: [
              {
                display: true,
                scaleLabel: {
                  display: false
                }
              }
            ]
          }
        }
      }
      var ctx = document.getElementById(pane_name).getContext('2d')
      window.myLine = new Chart(ctx, config)
    },

    async getActivityList() {
      const { page, pageSize, nextPage } = this.pagesQuery.options
      if (nextPage) {
        const { list, total_count } = await this.$api.marketing.getPurchaseActivity({
          page,
          pageSize
        })
        this.pagesQuery.setTotal(total_count)
        this.activityList = this.activityList.concat(list)
      }
    }
  }
}
</script>
