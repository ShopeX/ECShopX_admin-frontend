<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpFilterForm :model="params" @onSearch="getDistributorDataList(true)" @onReset="onReset">
      <SpFilterFormItem prop="vdate" :label="$t('5d9377e9.8d3bf9')">
        <el-date-picker
          v-model="params.vdate"
          type="daterange"
          alue-format="yyyy-MM-dd"
          align="right"
          unlink-panels
          :range-separator="$t('5d9377e9.981cbe')"
          :start-placeholder="$t('5d9377e9.b44c0f')"
          :end-placeholder="$t('5d9377e9.1d468b')"
          style="width: 100%"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          @change="dateChange"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="distributor" :label="$t('5d9377e9.a7caad')">
        <el-select
          v-model="params.distributor"
          :placeholder="$t('5d9377e9.ca95a5')"
          @change="DistributorChange"
        >
          <el-option
            v-if="$store.getters.login_type == 'merchant'"
            key="2"
            :label="$t('5d9377e9.a8b0c2')"
            value="all"
          >
            {{ $t('5d9377e9.a8b0c2') }}
          </el-option>
          <el-option
            v-if="$store.getters.login_type != 'merchant'"
            key="0"
            :label="$t('5d9377e9.0d7757')"
            value="0"
          >
            {{ $t('5d9377e9.0d7757') }}
          </el-option>

          <el-option
            v-for="item in distributorOption"
            :key="item.distributor_id"
            :label="item.name"
            size="mini"
            :value="item.distributor_id"
          />
        </el-select>
      </SpFilterFormItem>
    </SpFilterForm>
    <el-tabs
      v-if="$route.path.indexOf('editor') === -1"
      v-model="activeName"
      type="border-card"
      @tab-click="handleClick"
    >
      <template v-if="$store.getters.login_type == 'merchant'">
        <el-tab-pane :label="$t('5d9377e9.fbb493')" name="order">
          <section>
            <canvas id="canvas_order" height="120" />
          </section>
        </el-tab-pane>
        <el-tab-pane :label="$t('5d9377e9.f55538')" name="aftersales">
          <section>
            <canvas id="canvas_aftersales" height="120" />
          </section>
        </el-tab-pane>
        <el-tab-pane :label="$t('5d9377e9.d7cebd')" name="refunded">
          <section>
            <canvas id="canvas_refunded" height="120" />
          </section>
        </el-tab-pane>
        <el-tab-pane :label="$t('5d9377e9.78aff0')" name="amountPayed">
          <section>
            <canvas id="canvas_amountPayed" height="120" />
          </section>
        </el-tab-pane>
        <el-tab-pane :label="$t('5d9377e9.7c922f')" name="orderPayed">
          <section>
            <canvas id="canvas_orderPayed" height="120" />
          </section>
        </el-tab-pane>
        <el-tab-pane :label="$t('5d9377e9.9ca9e4')" name="gmv">
          <section>
            <canvas id="canvas_gmv" height="120" />
          </section>
        </el-tab-pane>
      </template>
      <template v-else>
        <el-tab-pane :label="$t('5d9377e9.e3c2e0')" name="member">
          <section>
            <canvas id="canvas_member" height="120" />
          </section>
        </el-tab-pane>
        <el-tab-pane :label="$t('5d9377e9.f55538')" name="aftersales">
          <section>
            <canvas id="canvas_aftersales" height="120" />
          </section>
        </el-tab-pane>
        <el-tab-pane :label="$t('5d9377e9.d7cebd')" name="refunded">
          <section>
            <canvas id="canvas_refunded" height="120" />
          </section>
        </el-tab-pane>
        <el-tab-pane :label="$t('5d9377e9.78aff0')" name="amountPayed">
          <section>
            <canvas id="canvas_amountPayed" height="120" />
          </section>
        </el-tab-pane>
        <el-tab-pane :label="$t('5d9377e9.67e7ac')" name="amountPointPayed">
          <section>
            <canvas id="canvas_amountPointPayed" height="120" />
          </section>
        </el-tab-pane>
        <el-tab-pane :label="$t('5d9377e9.fbb493')" name="order">
          <section>
            <canvas id="canvas_order" height="120" />
          </section>
        </el-tab-pane>
        <el-tab-pane :label="$t('5d9377e9.998062')" name="orderPoint">
          <section>
            <canvas id="canvas_orderPoint" height="120" />
          </section>
        </el-tab-pane>
        <el-tab-pane :label="$t('5d9377e9.7c922f')" name="orderPayed">
          <section>
            <canvas id="canvas_orderPayed" height="120" />
          </section>
        </el-tab-pane>
        <el-tab-pane :label="$t('5d9377e9.fe3103')" name="orderPointPayed">
          <section>
            <canvas id="canvas_orderPointPayed" height="120" />
          </section>
        </el-tab-pane>
        <el-tab-pane :label="$t('5d9377e9.9ca9e4')" name="gmv">
          <section>
            <canvas id="canvas_gmv" height="120" />
          </section>
        </el-tab-pane>
        <el-tab-pane :label="$t('5d9377e9.5c8aea')" name="gmvPoint">
          <section>
            <canvas id="canvas_gmvPoint" height="120" />
          </section>
        </el-tab-pane>
      </template>
    </el-tabs>
    <template>
      <el-table :data="allListData" stripe border style="width: 100%">
        <template v-if="$store.getters.login_type == 'merchant'">
          <el-table-column prop="count_date" :label="$t('5d9377e9.4ff1e7')" fixed />
          <el-table-column prop="order_count" :label="$t('5d9377e9.fbb493')" />
          <el-table-column prop="aftersales_count" :label="$t('5d9377e9.f55538')" />
          <el-table-column :label="$t('5d9377e9.d7cebd')">
            <template slot-scope="scope"> ￥{{ scope.row.refunded_count / 100 }} </template>
          </el-table-column>
          <el-table-column prop="amount_payed_count" :label="$t('5d9377e9.78aff0')">
            <template slot-scope="scope"> ￥{{ scope.row.amount_payed_count / 100 }} </template>
          </el-table-column>
          <el-table-column prop="order_payed_count" :label="$t('5d9377e9.7c922f')" />
          <el-table-column prop="gmv_count" :label="$t('5d9377e9.9ca9e4')">
            <template slot-scope="scope"> ￥{{ scope.row.gmv_count / 100 }} </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column prop="count_date" :label="$t('5d9377e9.4ff1e7')" fixed />
          <el-table-column prop="member_count" :label="$t('5d9377e9.e3c2e0')" />
          <el-table-column prop="aftersales_count" :label="$t('5d9377e9.f55538')" />
          <el-table-column :label="$t('5d9377e9.d7cebd')">
            <template slot-scope="scope"> ￥{{ scope.row.refunded_count / 100 }} </template>
          </el-table-column>
          <el-table-column prop="amount_payed_count" :label="$t('5d9377e9.78aff0')">
            <template slot-scope="scope"> ￥{{ scope.row.amount_payed_count / 100 }} </template>
          </el-table-column>
          <el-table-column prop="amount_point_payed_count" :label="$t('5d9377e9.67e7ac')" />
          <el-table-column prop="order_count" :label="$t('5d9377e9.fbb493')" />
          <el-table-column prop="order_point_count" :label="$t('5d9377e9.998062')" />
          <el-table-column prop="order_payed_count" :label="$t('5d9377e9.7c922f')" />
          <el-table-column prop="order_point_payed_count" :label="$t('5d9377e9.fe3103')" />
          <el-table-column prop="gmv_count" :label="$t('5d9377e9.9ca9e4')">
            <template slot-scope="scope"> ￥{{ scope.row.gmv_count / 100 }} </template>
          </el-table-column>
          <el-table-column prop="gmv_point_count" :label="$t('5d9377e9.5c8aea')" />
        </template>
      </el-table>
    </template>
  </SpPage>
</template>
<script>
import store from '@/store'
import { mapGetters } from 'vuex'
import chart from 'chart.js'
import { getDistributorData } from '../../../api/datacube'
import { getDistributorList } from '../../../api/marketing'
import templateCpn from '../../wxapp/template.vue'
import { i18n } from '@/i18n'
export default {
  components: { templateCpn },
  data() {
    return {
      vdate: '',
      loading: true,
      activeName: this.$store.getters.login_type !== 'merchant' ? 'member' : 'order',
      // activeName: '',
      params: {
        start: '',
        end: '',
        distributor: '',
        vdate: ''
      },
      is_distributor: false,
      distributorOption: [],
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
      tab: {
        name: this.$store.getters.login_type !== 'merchant' ? 'member' : 'order',
        label:
          this.$store.getters.login_type !== 'merchant'
            ? this.$t('5d9377e9.cfe830')
            : this.$t('5d9377e9.fbb493')
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
            text: i18n.t('5d9377e9.56ee10'),
            onClick(picker) {
              const start = new Date()
              const end = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
              const format = (d) =>
                `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d
                  .getDate()
                  .toString()
                  .padStart(2, '0')}`
              picker.$emit('pick', [format(start), format(end)])
            }
          },
          {
            text: i18n.t('5d9377e9.335dfc'),
            onClick(picker) {
              const start = new Date()
              const end = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
              const format = (d) =>
                `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d
                  .getDate()
                  .toString()
                  .padStart(2, '0')}`
              picker.$emit('pick', [format(start), format(end)])
            }
          },
          {
            text: i18n.t('5d9377e9.d96eb4'),
            onClick(picker) {
              const start = new Date()
              const end = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
              const format = (d) =>
                `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d
                  .getDate()
                  .toString()
                  .padStart(2, '0')}`
              picker.$emit('pick', [format(start), format(end)])
            }
          }
        ]
      }
    }
  },
  mounted() {
    if (store.getters.login_type === 'distributor') {
      this.is_distributor = true
    }
    if (this.is_distributor === false) {
      this.$nextTick(() => {
        this.getDistributorData()
      })
    }
    this.onReset()
  },
  methods: {
    onReset() {
      var start = new Date()
      var end = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
      const format = (d) =>
        `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d
          .getDate()
          .toString()
          .padStart(2, '0')}`
      this.params.vdate = [format(start), format(end)]
      this.params.start = this.params.vdate[0]
      this.params.end = this.params.vdate[1]
      // this.allListDataallListData = []
      ;(this.activeName = this.$store.getters.login_type !== 'merchant' ? 'member' : 'order'),
        (this.allListData = []),
        (this.list = {
          memberData: [],
          aftersalesData: [],
          refundedData: [],
          amountPayedData: [],
          orderData: [],
          orderPayedData: [],
          gmvData: []
        })
    },
    handleClick(tab, event) {
      let params = {
        id: 'canvas_' + tab.name,
        label: tab.label,
        dataName: this.list[tab.name + 'Data']
      }
      this.chartInit(params)
      this.tab = {
        name: tab.name,
        label: tab.label
      }
    },
    dateChange(val) {
      this.params.start = val[0]
      this.params.end = val[1]
    },
    DistributorChange(val) {
      this.params.distributor = val
    },
    getDistributorData() {
      getDistributorList({ is_valid: true }).then((res) => {
        this.distributorOption = res.data.data.list
      })
    },
    getDistributorDataList() {
      this.userTimeArr = []
      this.list.memberData = []
      this.list.aftersalesData = []
      this.list.refundedData = []
      this.list.amountPayedData = []
      this.list.orderData = []
      this.list.orderPayedData = []
      this.list.gmvData = []
      if (this.is_distributor === false && this.params.distributor === '') {
        this.$message({
          type: 'error',
          message: this.$t('5d9377e9.0d3b95')
        })
        return false
      }
      let params = {
        start: this.params.start,
        end: this.params.end,
        distributor_id: this.params.distributor
      }
      getDistributorData(params)
        .then((res) => {
          this.allListData = res.data.data.list
          let companyDataList = res.data.data.list
          console.log(companyDataList)
          for (var key in companyDataList) {
            this.userTimeArr.push(companyDataList[key].count_date)
            this.list.memberData.push(companyDataList[key].member_count)
            this.list.aftersalesData.push(companyDataList[key].aftersales_count)
            this.list.refundedData.push(companyDataList[key].refunded_count / 100)
            this.list.amountPayedData.push(companyDataList[key].amount_payed_count / 100)
            this.list.orderData.push(companyDataList[key].order_count)
            this.list.orderPayedData.push(companyDataList[key].order_payed_count)
            this.list.gmvData.push(companyDataList[key].gmv_count / 100)
          }
          this.loading = false
          const name = this.tab.name
          this.$nextTick(() => {
            let params = {
              id: 'canvas_' + name,
              label: this.tab.label,
              dataName: this.list[name + 'Data']
            }
            console.log(params)
            this.chartInit(params)
          })
        })
        .catch((error) => {
          this.$message({
            type: 'error',
            message: this.$t('5d9377e9.5b0398')
          })
        })
    },
    chartInit(params) {
      console.log(params)
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
