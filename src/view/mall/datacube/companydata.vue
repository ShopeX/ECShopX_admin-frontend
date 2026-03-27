<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-form label-width="100px">
      <el-form-item :label="$t('a82e152a.786622')">
        <el-col :span="12">
          <el-date-picker
            v-model="vdate"
            type="daterange"
            alue-format="yyyy-MM-dd"
            align="right"
            unlink-panels
            :range-separator="$t('a82e152a.981cbe')"
            :start-placeholder="$t('a82e152a.b44c0f')"
            :end-placeholder="$t('a82e152a.1d468b')"
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
      <el-tab-pane :label="$t('a82e152a.e3c2e0')" name="member">
        <section>
          <canvas id="canvas_member" height="120" />
        </section>
      </el-tab-pane>
      <el-tab-pane :label="$t('a82e152a.f55538')" name="aftersales">
        <section>
          <canvas id="canvas_aftersales" height="120" />
        </section>
      </el-tab-pane>
      <el-tab-pane :label="$t('a82e152a.d7cebd')" name="refunded">
        <section>
          <canvas id="canvas_refunded" height="120" />
        </section>
      </el-tab-pane>
      <el-tab-pane :label="$t('a82e152a.78aff0')" name="amountPayed">
        <section>
          <canvas id="canvas_amountPayed" height="120" />
        </section>
      </el-tab-pane>
      <el-tab-pane :label="$t('a82e152a.fbb493')" name="order">
        <section>
          <canvas id="canvas_order" height="120" />
        </section>
      </el-tab-pane>
      <el-tab-pane :label="$t('a82e152a.7c922f')" name="orderPayed">
        <section>
          <canvas id="canvas_orderPayed" height="120" />
        </section>
      </el-tab-pane>
      <el-tab-pane :label="$t('a82e152a.9ca9e4')" name="gmv">
        <section>
          <canvas id="canvas_gmv" height="120" />
        </section>
      </el-tab-pane>
    </el-tabs>
    <template>
      <el-table :data="allListData" stripe border style="width: 100%">
        <el-table-column prop="count_date" :label="$t('a82e152a.4ff1e7')" fixed />
        <el-table-column prop="member_count" :label="$t('a82e152a.e3c2e0')" />
        <el-table-column prop="aftersales_count" :label="$t('a82e152a.f55538')" />
        <el-table-column :label="$t('a82e152a.d7cebd')">
          <template slot-scope="scope"> ￥{{ scope.row.refunded_count / 100 }} </template>
        </el-table-column>
        <el-table-column prop="amount_payed_count" :label="$t('a82e152a.78aff0')">
          <template slot-scope="scope"> ￥{{ scope.row.amount_payed_count / 100 }} </template>
        </el-table-column>
        <el-table-column prop="order_count" :label="$t('a82e152a.fbb493')" />
        <el-table-column prop="order_payed_count" :label="$t('a82e152a.7c922f')" />
        <el-table-column prop="gmv_count" :label="$t('a82e152a.9ca9e4')">
          <template slot-scope="scope"> ￥{{ scope.row.gmv_count / 100 }} </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import chart from 'chart.js'
import { getCompanyData } from '../../../api/datacube'
import { i18n } from '@/i18n'
export default {
  data() {
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
        orderData: [],
        orderPayedData: [],
        gmvData: []
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
            text: i18n.t('a82e152a.56ee10'),
            onClick(picker) {
              const start = new Date()
              const end = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: i18n.t('a82e152a.335dfc'),
            onClick(picker) {
              const start = new Date()
              const end = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: i18n.t('a82e152a.d96eb4'),
            onClick(picker) {
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
  mounted() {
    var start = new Date()
    var end = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
    end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
    this.vdate = [start, end]
    this.getCompanyDataList(true)
  },
  methods: {
    handleClick(tab, event) {
      let params = {
        id: 'canvas_' + tab.name,
        label: tab.label,
        dataName: this.list[tab.name + 'Data']
      }
      this.chartInit(params)
    },
    dateChange(val) {
      this.params.start = val[0]
      this.params.end = val[1]
      this.getCompanyDataList(true)
    },
    getCompanyDataList(isfirst) {
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
            this.list.orderData.push(companyDataList[key].order_count)
            this.list.orderPayedData.push(companyDataList[key].order_payed_count)
            this.list.gmvData.push(companyDataList[key].gmv_count / 100)
          }
          this.loading = false
          if (isfirst) {
            // 首次加载
            this.$nextTick(() => {
              let firstparams = {
                id: 'canvas_member',
                label: this.$t('a82e152a.cfe830'),
                dataName: this.list['memberData']
              }
              this.chartInit(firstparams)
            })
          }
        })
        .catch((error) => {
          this.$message({
            type: 'error',
            message: this.$t('a82e152a.5b0398')
          })
        })
    },
    chartInit(params) {
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
