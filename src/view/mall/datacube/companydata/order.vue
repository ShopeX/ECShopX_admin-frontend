<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="选择日期范围">
        <el-col :span="12">
          <el-date-picker
            v-model="vdate"
            type="daterange"
            alue-format="yyyy-MM-dd"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 100%"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            @change="dateChange"
          />
        </el-col>
      </el-form-item>
    </el-form>
    <el-tabs
      v-if="$route.path.indexOf('editor') === -1"
      v-model="activeName"
      type="border-card"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="订单数"
        name="order_count"
      >
        <section>
          <canvas
            id="order_count"
            height="120"
          />
        </section>
      </el-tab-pane>
      <el-tab-pane
        label="付款订单数"
        name="order_payed_count"
      >
        <section>
          <canvas
            id="order_payed_count"
            height="120"
          />
        </section>
      </el-tab-pane>
      <el-tab-pane
        label="交易额"
        name="amount_payed_count"
      >
        <section>
          <canvas
            id="amount_payed_count"
            height="120"
          />
        </section>
      </el-tab-pane>
      <el-tab-pane
        label="GMV"
        name="gmv_count"
      >
        <section>
          <canvas
            id="gmv_count"
            height="120"
          />
        </section>
      </el-tab-pane>
      <el-tab-pane
        label="售后单数"
        name="aftersales_count"
      >
        <section>
          <canvas
            id="aftersales_count"
            height="120"
          />
        </section>
      </el-tab-pane>
      <el-tab-pane
        label="退款额"
        name="refunded_count"
      >
        <section>
          <canvas
            id="refunded_count"
            height="120"
          />
        </section>
      </el-tab-pane>
    </el-tabs>
    <template>
      <el-table
        :data="allListData"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column
          prop="count_date"
          label="日期"
          fixed
        />
        <el-table-column
          prop="order_count"
          label="订单数"
        />
        <el-table-column
          prop="order_payed_count"
          label="付款订单数"
        />
        <el-table-column
          prop="amount_payed_count"
          label="交易额"
        >
          <template slot-scope="scope">
            ￥{{ scope.row.amount_payed_count / 100 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="gmv_count"
          label="GMV"
        >
          <template slot-scope="scope">
            ￥{{ scope.row.gmv_count / 100 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="aftersales_count"
          label="售后单数"
        />
        <el-table-column label="退款额">
          <template slot-scope="scope">
            ￥{{ scope.row.refunded_count / 100 }}
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import chart from 'chart.js'
import { getCompanyData } from '../../../../api/datacube'
export default {
  data () {
    return {
      vdate: '',
      loading: true,
      activeName: 'order_count',
      params: {
        start: '',
        end: ''
      },
      allListData: [],
      dataTimeArr: [],
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
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const start = new Date()
              const end = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const start = new Date()
              const end = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const start = new Date()
              const end = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  mounted () {
    var start = new Date()
    var end = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
    end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
    this.vdate = [start, end]
    this.getCompanyDataList(this.activeName)
  },
  methods: {
    handleClick (tab, event) {
      this.chartInit(tab.name)
    },
    dateChange (val) {
      this.params.start = val[0]
      this.params.end = val[1]
      this.getCompanyDataList(this.activeName)
    },
    getCompanyDataList (pane_name) {
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
    chartInit (pane_name) {
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
    }
  }
}
</script>
