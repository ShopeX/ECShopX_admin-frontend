<style scoped lang="scss">
.vshop-index {
  background: #f2f2f2;
}
.this_labels {
  text-align: center;
}
.all-title {
  font-size: 18px;
  font-weight: 700;
  padding: 10px;
}
.listkeybtn {
  display: inline-block;
  background: transparent;
  padding: 5px 20px;
  border: 1px solid #cccccc;
  border-radius: 10px;
  margin: 0 10px;
}
.listkeybtn_active {
  border: 1px solid blue;
  color: blue;
}
.allbtn {
  white-space: nowrap;
  width: 94%;
  margin: 0 auto;
  overflow-x: scroll;
}
.single_content {
  margin-top: 20px;
  background: #fff;
}
.span_left {
  float: left;
  width: 20%;
}
.span_right {
  float: left;
  width: 80%;
}
.clearfloat {
  width: 94%;
  height: 40px;
  line-height: 40px;
  margin: 0 auto;
  border-bottom: 1px solid #cccccc;
}
.clearfloat:after {
  clear: both;
}
.canvas-div {
  width: 47%;
  display: inline-block;
  background: #fff;
  margin-left: 2%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
}
.top-header {
  margin-left: 2%;
  padding-top: 30px;
}
.top-select {
  display: inline-block;
}
.select-style {
  min-width: 100px;
}
</style>
<template>
  <div class="vshop-index">
    <div class="top-header">
      <!-- <button class='listkeybtn' @click="goBack">返回</button> -->
      <div class="top-select">
        时间筛选：
        <select
          v-model="timeChoosed.time"
          class="select-style"
          @change="timeSelected"
        >
          <option
            v-for="(item, index) in timeList"
            :key="index"
            :value="item.record_date"
          >
            {{ item.record_date_str }}
          </option>
        </select>
      </div>
    </div>
    <div class="all-title">
      关键指标
    </div>
    <div
      v-for="(item, index) in labels_num"
      :key="index"
      class="canvas-div"
    >
      <div class="this_labels">
        {{ item.thisweek }}
      </div>
      <canvas :id="item.fieldkey" />
    </div>
    <div>
      <div class="all-title">
        全部指标
      </div>
      <div class="allbtn">
        <button
          v-for="(item, index) in listKeyData"
          :key="index"
          class="listkeybtn"
          :class="item.fieldkey == click_color ? 'listkeybtn_active' : ''"
          @click="showCharts(item, index)"
        >
          {{ item.fieldname }}
        </button>
      </div>
      <div class="single_content">
        <div class="clearfloat">
          <span class="span_left">本周</span>
          <span class="span_right">{{ thisweek }}</span>
        </div>
        <div class="clearfloat">
          <span class="span_left">上周</span>
          <span class="span_right">{{ lastweek }}</span>
        </div>
        <div class="clearfloat">
          <span class="span_left">5周趋势</span>
          <canvas :id="canvas_fieldkey" />
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript" src="https://res.wx.qq.com/open/js/jweixin-1.3.2.js"></script>
<script>
import axios from 'axios'
import { Message } from 'element-ui'
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
      },
      listKeyData: [],
      listValueData: [],
      canvas_fieldkey: '',
      click_color: '',
      lastweek: '',
      thisweek: ''
    }
  },
  methods: {
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
                display: false,
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
    // goBack () {
    //     const { user_id, session, type } = this.$route.query
    //     if(type == 'hexiao') {
    //         wx.miniProgram.navigateTo({
    //             url: '/pages/member/index'
    //         })
    //     } else {
    //         wx.miniProgram.navigateTo({
    //             url: '/pages/member'
    //         })
    //     }

    // },
    timeSelected() {
      this.listKeyData = []
      this.listValueData = []
      this.keyIndexData = []
      this.labels_num = []
      this.keyIndex = []
      this.list = []
      this.listData = []
      this.getDataList(this.timeChoosed.time)
    },
    timeListData() {
      const { user_id, session, type } = this.$route.query
      let get_url = ''
      if (type == 'hexiao') {
        get_url = `${process.env.VUE_APP_BASE_API}/admin/wxapp/selfform/physical/datelist?user_id=${user_id}`
      } else {
        get_url = `${process.env.VUE_APP_BASE_API}/wxapp/selfform/physical/datelist`
      }
      axios
        .get(get_url, {
          headers: {
            'x-wxapp-session': session
          }
        })
        .then((response) => {
          this.timeList = response.data.data.list
          this.total_count = response.data.data.total_count
          console.log(response, 220)
        })
    },
    getDataList(time) {
      //user_id=175&session=02833b448755974fc51092ba9f88cae247ca7b90
      const { user_id, session, type } = this.$route.query
      let get_url = ''
      if (type == 'hexiao') {
        get_url = `${process.env.VUE_APP_BASE_API}/admin/wxapp/selfform/statisticalAnalysis?user_id=${user_id}&timeChoosed=${time}`
      } else {
        get_url = `${process.env.VUE_APP_BASE_API}/wxapp/selfform/statisticalAnalysis?timeChoosed=${time}`
      }
      axios
        .get(get_url, {
          headers: {
            'x-wxapp-session': session
          }
        })
        .then((response) => {
          // 表格
          this.list = response.data.data.list
          response.data.data.list.map((item) => {
            this.listKeyData.push({
              fieldkey: item.fieldkey,
              fieldname: item.fieldname
            })
            this.listValueData.push({
              label: item.fieldname,
              data: Array.reverse(item.fieldvalue),
              lastweek: item.lastweek,
              thisweek: item.thisweek
            })
          })
          console.log(this.listKeyData, this.listValueData, 160)

          // 动态生成图表的数量
          response.data.data.keyindex.map((item) => {
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
            this.showCharts(this.listKeyData[0], 0)
            this.lastweek = this.listKeyData[0].lastweek
            this.thisweek = this.listKeyData[0].thisweek
          })
        })
    },
    showCharts(data, idx) {
      console.log(data, idx)
      this.click_color = data.fieldkey
      this.canvas_fieldkey = data.fieldkey + 'list'
      this.listValueData.map((item, index) => {
        if (data.fieldname === item.label) {
          this.$nextTick(() => {
            this.chartInit(
              this.listValueData[index],
              this.canvas_fieldkey,
              this.listValueData[index].data.length
            )
            this.lastweek = this.listValueData[index].lastweek
            this.thisweek = this.listValueData[index].thisweek
          })
        }
      })
    }
  },
  mounted() {
    this.getDataList()
    this.timeListData()
  },
  watch: {}
}
</script>
