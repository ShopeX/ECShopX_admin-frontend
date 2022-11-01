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
        name="member_count"
      >
        <section>
          <canvas
            id="member_count"
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
      activeName: 'member_count',
      params: {
        start: '',
        end: ''
      },
      allListData: [],
      dataTimeArr: [],
      dataInfo: {
        member_count: {
          label: '会员数',
          data_list: [],
          total_num: 0
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
      this.dataInfo.member_count.data_list = []
      this.dataInfo.member_count.total_num = 0
      let params = { start: this.params.start, end: this.params.end }
      getCompanyData(params)
        .then((res) => {
          this.allListData = res.data.data.list
          let companyDataList = res.data.data.list
          for (var key in companyDataList) {
            this.dataTimeArr.push(companyDataList[key].count_date)
            this.dataInfo.member_count.data_list.push(companyDataList[key].member_count)
            this.dataInfo.member_count.total_num += Number(companyDataList[key].member_count)
          }
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
            text: '合计(' + this.dataInfo[pane_name].total_num + ')'
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
