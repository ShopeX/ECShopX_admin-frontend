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
        label="会员数"
        name="member"
      >
        <section>
          <canvas
            id="canvas_member"
            height="120"
          />
        </section>
      </el-tab-pane>
      <el-tab-pane
        label="售后单数"
        name="aftersales"
      >
        <section>
          <canvas
            id="canvas_aftersales"
            height="120"
          />
        </section>
      </el-tab-pane>
      <el-tab-pane
        label="退款额"
        name="refunded"
      >
        <section>
          <canvas
            id="canvas_refunded"
            height="120"
          />
        </section>
      </el-tab-pane>
      <el-tab-pane
        label="交易额"
        name="amountPayed"
      >
        <section>
          <canvas
            id="canvas_amountPayed"
            height="120"
          />
        </section>
      </el-tab-pane>
      <el-tab-pane
        label="交易额(积分)"
        name="amountPointPayed"
      >
        <section>
          <canvas
            id="canvas_amountPointPayed"
            height="120"
          />
        </section>
      </el-tab-pane>
      <el-tab-pane
        label="订单数"
        name="order"
      >
        <section>
          <canvas
            id="canvas_order"
            height="120"
          />
        </section>
      </el-tab-pane>
      <el-tab-pane
        label="订单数(积分)"
        name="orderPoint"
      >
        <section>
          <canvas
            id="canvas_orderPoint"
            height="120"
          />
        </section>
      </el-tab-pane>
      <el-tab-pane
        label="付款订单数"
        name="orderPayed"
      >
        <section>
          <canvas
            id="canvas_orderPayed"
            height="120"
          />
        </section>
      </el-tab-pane>
      <el-tab-pane
        label="付款订单数(积分)"
        name="orderPointPayed"
      >
        <section>
          <canvas
            id="canvas_orderPointPayed"
            height="120"
          />
        </section>
      </el-tab-pane>
      <el-tab-pane
        label="GMV"
        name="gmv"
      >
        <section>
          <canvas
            id="canvas_gmv"
            height="120"
          />
        </section>
      </el-tab-pane>
      <el-tab-pane
        label="GMV(积分)"
        name="gmvPoint"
      >
        <section>
          <canvas
            id="canvas_gmvPoint"
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
          prop="member_count"
          label="会员数"
        />
        <el-table-column
          prop="aftersales_count"
          label="售后单数"
        />
        <el-table-column label="退款额">
          <template slot-scope="scope">
            ￥{{ scope.row.refunded_count / 100 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="amount_payed_count"
          label="交易额"
        >
          <template slot-scope="scope">
            ￥{{ scope.row.amount_payed_count / 100 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="amount_point_payed_count"
          label="交易额(积分)"
        />
        <el-table-column
          prop="order_count"
          label="订单数"
        />
        <el-table-column
          prop="order_point_count"
          label="订单数(积分)"
        />
        <el-table-column
          prop="order_payed_count"
          label="付款订单数"
        />
        <el-table-column
          prop="order_point_payed_count"
          label="付款订单数(积分)"
        />
        <el-table-column
          prop="gmv_count"
          label="GMV"
        >
          <template slot-scope="scope">
            ￥{{ scope.row.gmv_count / 100 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="gmv_point_count"
          label="GMV(积分)"
        />
      </el-table>
    </template>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import chart from 'chart.js'
import { getCompanyData } from '../../../api/datacube'
export default {
  data () {
    return {
      vdate: '',
      loading: true,
      activeName: 'member',
      params: {
        start: '',
        end: ''
      },
      allListData: [],
      userTimeArr: [],
      list: {
        memberData: [],
        aftersalesData: [],
        refundedData: [],
        amountPayedData: [],
        amountPointPayedData: [],
        orderData: [],
        orderPointData: [],
        orderPayedData: [],
        orderPointPayedData: [],
        gmvData: [],
        gmvPointData: []
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
    this.getCompanyDataList(true)
  },
  methods: {
    handleClick (tab, event) {
      let params = {
        id: 'canvas_' + tab.name,
        label: tab.label,
        dataName: this.list[tab.name + 'Data']
      }
      this.chartInit(params)
    },
    dateChange (val) {
      this.params.start = val[0]
      this.params.end = val[1]
      this.getCompanyDataList(true)
    },
    getCompanyDataList (isfirst) {
      this.userTimeArr = []
      this.list.memberData = []
      this.list.aftersalesData = []
      this.list.refundedData = []
      this.list.amountPayedData = []
      this.list.orderData = []
      this.list.orderPayedData = []
      this.list.gmvData = []
      let params = { start: this.params.start, end: this.params.end }
      getCompanyData(params)
        .then((res) => {
          this.allListData = res.data.data.list
          let companyDataList = res.data.data.list
          for (var key in companyDataList) {
            this.userTimeArr.push(companyDataList[key].count_date)
            this.list.memberData.push(companyDataList[key].member_count)
            this.list.aftersalesData.push(companyDataList[key].aftersales_count)
            this.list.refundedData.push(companyDataList[key].refunded_count)
            this.list.amountPayedData.push(companyDataList[key].amount_payed_count)
            this.list.amountPointPayedData.push(companyDataList[key].amount_point_payed_count)
            this.list.orderData.push(companyDataList[key].order_count)
            this.list.orderPointData.push(companyDataList[key].order_point_count)
            this.list.orderPayedData.push(companyDataList[key].order_payed_count)
            this.list.orderPointPayedData.push(companyDataList[key].order_point_payed_count)
            this.list.gmvData.push(companyDataList[key].gmv_count / 100)
            this.list.gmvPointData.push(companyDataList[key].gmv_point_count / 100)
          }
          this.loading = false
          if (isfirst) {
            // 首次加载
            this.$nextTick(() => {
              let firstparams = {
                id: 'canvas_member',
                label: '新增会员数',
                dataName: this.list['memberData']
              }
              this.chartInit(firstparams)
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
    chartInit (params) {
      var config = {
        type: 'line',
        data: {
          labels: this.userTimeArr,
          datasets: [
            {
              label: params.label,
              backgroundColor: this.chartColors.grey,
              borderColor: this.chartColors.red,
              data: params.dataName,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          // title:{
          //   display:true,
          //   text:'用户趋势'
          // },
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
      var ctx = document.getElementById(params.id).getContext('2d')
      window.myLine = new Chart(ctx, config)
    }
  }
}
</script>
