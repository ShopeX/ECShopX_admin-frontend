<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<style scoped lang="scss">
.this_labels {
  text-align: center;
}
.marginTop {
  margin-top: 20px;
}
</style>
<template>
  <div>
    <el-row>
      <el-col :span="4" :offset="20">
        <el-button size="medium" type="primary" @click="onShowTimeList"> 时间 </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col
        v-for="(item, index) in labels_num"
        :key="index"
        :span="4"
        style="position: relative; max-height: 150px"
      >
        <div :span="24" class="this_labels">
          {{ item.thisweek }}
        </div>
        <canvas :id="item.fieldkey" />
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="list" :height="wheight - 280">
      <el-table-column prop="fieldname" label="指标" />
      <el-table-column prop="thisweek" label="本周" />
      <el-table-column prop="lastweek" label="上周" />
      <!-- <el-table-column prop="username" label="变化百分比" width="120"></el-table-column> -->
      <el-table-column prop="fieldvalue" label="5周趋势" width="450">
        <template slot-scope="scope">
          <canvas :id="scope.row.fieldkey + 'list'" />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="时间列表" class="right-dialog" :visible.sync="timeVisible">
      <template>
        <el-form ref="formwork" :model="timeChoosed">
          <el-form-item>
            <el-radio-group v-model="timeChoosed.time">
              <el-radio v-for="(item, index) in timeList" :key="index" :label="item.record_date">
                {{ item.record_date_str }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="content-center content-top-padded">
            <el-pagination
              background
              layout="total, prev, pager, next"
              :current-page.sync="params.page"
              :total="total_count"
              @current-change="handleCurrentChange"
            />
          </div>
          <el-form-item class="content-center marginTop">
            <el-button type="primary" @click="onSubmitTimeChoosed"> 确定筛选 </el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { allUserData, timeData } from '../../../api/selfhelpform'
import chart from 'chart.js'
export default {
  data() {
    return {
      loading: false,
      labels_num: [],
      keyIndex: [],
      keyIndexData: [],
      list: [],
      listData: [],
      timeVisible: false,
      params: {
        page: 1,
        pageSize: 100,
        form_type: 'physical',
        user_id: ''
      },
      total_count: 0,
      timeList: [],
      timeChoosed: {
        time: ''
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {},
  mounted() {
    this.getDataList()
  },
  methods: {
    onShowTimeList() {
      this.timeVisible = true
      this.getTimeData()
    },
    // 时间列表
    getTimeData() {
      this.params.user_id = this.$route.query.user_id
      timeData(this.params).then(response => {
        this.timeList = response.data.data.list
        this.total_count = response.data.data.total_count
      })
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getTimeData()
    },
    // handleSizeChange(pageSize) {
    //   this.params.page = 1
    //   this.params.pageSize = pageSize
    //   this.getTimeData()
    // },
    // 提交筛选
    onSubmitTimeChoosed() {
      this.labels_num = []
      this.keyIndex = []
      this.keyIndexData = []
      this.list = []
      this.listData = []
      this.getDataList(this.timeChoosed.time)
      this.timeVisible = false
    },
    chartInit(datas, key, num, flag) {
      window.chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
      }
      var config = {
        type: 'line',
        data: {
          labels: Array(num),
          datasets: [
            {
              label: datas.label,
              backgroundColor: window.chartColors.green,
              borderColor: window.chartColors.purple,
              data: datas.data,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          legend: false,
          title: {
            display: true,
            text: datas.label
          },
          tooltips: {
            enabled: false,
            mode: 'index',
            intersect: false
          },
          hover: {
            mode: 'nearest',
            intersect: false
          },
          scales: {
            xAxes: [
              {
                gridLines: {
                  display: false
                },
                display: false,
                scaleLabel: {
                  display: false
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
      if (flag == 'list') {
        var ctx = document.getElementById(key + flag).getContext('2d')
        window.myLine = new Chart(ctx, config)
      } else {
        var ctx = document.getElementById(key).getContext('2d')
        window.myLine = new Chart(ctx, config)
      }
    },
    getDataList(time) {
      allUserData({
        timeChoosed: time ? time : '',
        user_id: this.$route.query.user_id,
        form_type: 'physical'
      }).then(response => {
        // 表格
        this.list = response.data.data.list
        response.data.data.list.map(item => {
          this.listData.push({
            label: item.fieldname,
            data: Array.reverse(item.fieldvalue)
          })
        })
        // 动态生成图表的数量
        response.data.data.keyindex.map(item => {
          this.keyIndexData.push({
            label: item.fieldname,
            data: Array.reverse(item.fieldvalue)
          })
          this.labels_num.push({
            fieldkey: item.fieldkey,
            thisweek: item.thisweek
          })
        })

        this.$nextTick(() => {
          for (let i = 0; i < this.labels_num.length; i++) {
            this.chartInit(
              this.keyIndexData[i],
              this.labels_num[i].fieldkey,
              this.labels_num.length
            )
          }
        })

        this.$nextTick(() => {
          for (let j = 0; j < this.list.length; j++) {
            this.chartInit(
              this.listData[j],
              this.list[j].fieldkey,
              this.list[j].fieldvalue.length,
              'list'
            )
          }
        })
      })
    }
  }
}
</script>
