<template>
  <div>
    <section class="section section-white app_detail_overview">
      <div class="section-header">
        <div class="section-title">
          昨日概况
        </div>
      </div>
      <div class="section-body">
        <div
          v-loading="surveyLoading"
          class="data_overview_list_wrp"
        >
          <div class="data_overview_list js_YO_dataBox">
            <div class="data_overview_item">
              <p class="data_overview_title">
                打开次数
              </p>
              <p class="data_overview_desc">
                {{ survey.session_cnt ? survey.session_cnt : '0' }}
              </p>
              <ul class="data_overview_percent">
                <li class="data_overview_percent_item">
                  <div class="data_overview_percent_item_inner">
                    <label>日</label>
                    <p class="tips_global">
                      <span class="mini_tips">{{
                        survey.session_cnt_dayRate ? survey.session_cnt_dayRate + '%' : '-'
                      }}</span>
                    </p>
                  </div>
                </li>
                <li class="data_overview_percent_item">
                  <div class="data_overview_percent_item_inner">
                    <label>周</label>
                    <p class="tips_global">
                      <span class="mini_tips">{{
                        survey.session_cnt_weekRate ? survey.session_cnt_weekRate + '%' : '-'
                      }}</span>
                    </p>
                  </div>
                </li>
                <li class="data_overview_percent_item">
                  <div class="data_overview_percent_item_inner">
                    <label>月</label>
                    <p class="tips_global">
                      <span class="mini_tips">{{
                        survey.session_cnt_monthRate ? survey.session_cnt_monthRate + '%' : '-'
                      }}</span>
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div class="data_overview_item">
              <p class="data_overview_title">
                访问次数 /人数
              </p>
              <p class="data_overview_desc">
                {{ survey.visit_pv ? survey.visit_pv : '0' }} /
                {{ survey.visit_uv ? survey.visit_uv : '0' }}
              </p>
              <ul class="data_overview_percent">
                <li class="data_overview_percent_item">
                  <div class="data_overview_percent_item_inner">
                    <label>日</label>
                    <p class="tips_global">
                      <span class="mini_tips">{{
                        survey.visit_pv_dayRate ? survey.visit_pv_dayRate + '%' : '-'
                      }}</span>
                      /
                      <span class="mini_tips">{{
                        survey.visit_uv_dayRate ? survey.visit_uv_dayRate + '%' : '-'
                      }}</span>
                    </p>
                  </div>
                </li>
                <li class="data_overview_percent_item">
                  <div class="data_overview_percent_item_inner">
                    <label>周</label>
                    <p class="tips_global">
                      <span class="mini_tips">{{
                        survey.visit_pv_weekRate ? survey.visit_pv_weekRate + '%' : '-'
                      }}</span>
                      /
                      <span class="mini_tips">{{
                        survey.visit_uv_weekRate ? survey.visit_uv_weekRate + '%' : '-'
                      }}</span>
                    </p>
                  </div>
                </li>
                <li class="data_overview_percent_item">
                  <div class="data_overview_percent_item_inner">
                    <label>月</label>
                    <p class="tips_global">
                      <span class="mini_tips">{{
                        survey.visit_pv_monthRate ? survey.visit_pv_monthRate + '%' : '-'
                      }}</span>
                      /
                      <span class="mini_tips">{{
                        survey.visit_uv_monthRate ? survey.visit_uv_monthRate + '%' : '-'
                      }}</span>
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div class="data_overview_item">
              <p class="data_overview_title">
                新访问用户数
              </p>
              <p class="data_overview_desc">
                {{ survey.visit_uv_new ? survey.visit_uv_new : '0' }}
              </p>
              <ul class="data_overview_percent">
                <li class="data_overview_percent_item">
                  <div class="data_overview_percent_item_inner">
                    <label>日</label>
                    <p class="tips_global">
                      <span class="mini_tips">{{
                        survey.visit_uv_new_dayRate ? survey.visit_uv_new_dayRate + '%' : '-'
                      }}</span>
                    </p>
                  </div>
                </li>
                <li class="data_overview_percent_item">
                  <div class="data_overview_percent_item_inner">
                    <label>周</label>
                    <p class="tips_global">
                      <span class="mini_tips">{{
                        survey.visit_uv_new_weekRate ? survey.visit_uv_new_weekRate + '%' : '-'
                      }}</span>
                    </p>
                  </div>
                </li>
                <li class="data_overview_percent_item">
                  <div class="data_overview_percent_item_inner">
                    <label>月</label>
                    <p class="tips_global">
                      <span class="mini_tips">{{
                        survey.visit_uv_new_monthRate ? survey.visit_uv_new_monthRate + '%' : '-'
                      }}</span>
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div class="data_overview_item">
              <p class="data_overview_title">
                分享次数 /人数
              </p>
              <p class="data_overview_desc">
                {{ share.share_pv ? share.share_pv : '0' }} /
                {{ share.share_uv ? share.share_uv : '0' }}
              </p>
              <ul class="data_overview_percent">
                <li class="data_overview_percent_item">
                  <div class="data_overview_percent_item_inner">
                    <label>日</label>
                    <p class="tips_global">
                      <span class="mini_tips">{{
                        survey.share_pv_dayRate ? survey.share_pv_dayRate + '%' : '-'
                      }}</span>
                      /
                      <span class="mini_tips">{{
                        survey.share_uv_dayRate ? survey.share_uv_dayRate + '%' : '-'
                      }}</span>
                    </p>
                  </div>
                </li>
                <li class="data_overview_percent_item">
                  <div class="data_overview_percent_item_inner">
                    <label>周</label>
                    <p class="tips_global">
                      <span class="mini_tips">{{
                        survey.share_pv_weekRate ? survey.share_pv_weekRate + '%' : '-'
                      }}</span>
                      /
                      <span class="mini_tips">{{
                        survey.share_uv_weekRate ? survey.share_uv_weekRate + '%' : '-'
                      }}</span>
                    </p>
                  </div>
                </li>
                <li class="data_overview_percent_item">
                  <div class="data_overview_percent_item_inner">
                    <label>月</label>
                    <p class="tips_global">
                      <span class="mini_tips">{{
                        survey.share_pv_monthRate ? survey.share_pv_monthRate + '%' : '-'
                      }}</span>
                      /
                      <span class="mini_tips">{{
                        survey.share_uv_monthRate ? survey.share_uv_monthRate + '%' : '-'
                      }}</span>
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section section-white">
      <div class="section-header">
        <div class="section-title">
          {{ chart.currentTabName }}
          <el-popover
            v-model="chart.tabPop"
            placement="bottom"
            trigger="click"
          >
            <ul class="tab-list">
              <li
                v-for="(item, index) in chart.tabCon"
                :key="index"
                @click="tabChartHandle(index)"
              >
                {{ item.label }}
              </li>
            </ul>
            <i
              slot="reference"
              class="iconfont icon-chevron-down tab-handle"
            />
          </el-popover>
        </div>
      </div>
      <div class="section-header">
        <el-select
          v-model="chart.date"
          placeholder="请选择"
          @change="chartHandle"
        >
          <el-option
            v-for="item in date"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div
        v-loading="chart.chartLoading"
        class="section-body"
      >
        <canvas
          id="canvas"
          height="100"
        />
      </div>
    </section>
    <section class="section section-white">
      <div class="section-header">
        <div class="section-title">
          {{ visitPage.currentTabName }}
          <el-popover
            v-model="visitPage.tabPop"
            placement="bottom"
            trigger="click"
          >
            <ul class="tab-list">
              <li
                v-for="(item, index) in visitPage.tabCon"
                :key="index"
                @click="tabVisitHandle(index)"
              >
                {{ item.label }}
              </li>
            </ul>
            <i
              slot="reference"
              class="iconfont icon-chevron-down tab-handle"
            />
          </el-popover>
        </div>
      </div>
      <div class="section-header">
        <el-select
          v-model="visitPage.date"
          placeholder="请选择"
          @change="visitPageHandle"
        >
          <el-option
            v-for="item in date"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="section-body">
        <el-table
          v-loading="visitPage.visitLoading"
          :data="visitPage.list"
        >
          <el-table-column
            prop="page_path"
            label="页面路径"
          />
          <el-table-column
            prop="pv_num"
            label="访问次数"
            width="180"
          />
          <el-table-column
            prop="percent"
            label="占比"
            width="180"
          />
        </el-table>
      </div>
    </section>
  </div>
</template>

<script>
import Chart from 'chart.js'
import {
  getVisitPage,
  getVisitTrend,
  getSummaryTrend,
  summarybydate
} from '../../../../api/wxastats'
import util from '../../../../common/js/util'
import NProgress from 'nprogress'

export default {
  props: {
    wxapp: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      wxAppId: '',
      value: '',
      chartObj: '',
      date: [
        {
          label: '昨天',
          value: 'yesterday'
        },
        {
          label: '最近7天',
          value: 'weekly'
        },
        {
          label: '最近30天',
          value: 'monthly'
        }
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick (picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      surveyLoading: false,
      survey: {},
      share: {},
      chart: {
        tabCon: [
          {
            label: '累计访问用户数',
            value: 'visit_total'
          },
          {
            label: '打开次数',
            value: 'session_cnt'
          },
          {
            label: '访问次数',
            value: 'visit_pv'
          },
          {
            label: '访问人数',
            value: 'visit_uv'
          },
          {
            label: '新访问用户数',
            value: 'visit_uv_new'
          },
          {
            label: '分享次数',
            value: 'share_pv'
          },
          {
            label: '分享人数',
            value: 'share_uv'
          },
          {
            label: '人均停留时长',
            value: 'stay_time_uv'
          },
          {
            label: '次均停留时长',
            value: 'stay_time_session'
          }
        ],
        currentTabName: '累计访问用户数',
        currentTab: 'visit_total',
        tabPop: false,
        chartLoading: false,
        date: 'weekly',
        ref_date: [],
        data: {
          visit_total: [],
          session_cnt: [],
          visit_pv: [],
          visit_uv: [],
          visit_uv_new: [],
          share_pv: [],
          share_uv: [],
          stay_time_uv: [],
          stay_time_session: []
        }
      },
      visitPage: {
        tabCon: [
          {
            label: 'TOP入口页',
            value: 'entrypage_pv'
          },
          {
            label: 'TOP受访页',
            value: 'page_visit_pv'
          }
        ],
        currentTabName: 'TOP受访页',
        currentTab: 'page_visit_pv',
        visitLoading: false,
        tabPop: false,
        date: 'weekly',
        data: {
          entrypage_pv: [],
          page_visit_pv: []
        },
        list: []
      }
    }
  },
  watch: {
    wxapp (value) {
      if (value) {
        this.setAppId(value)
        if (this.wxAppId) {
          this.updateSurvey()
          this.fetchChartData()
          this.updateVisitPage()
        }
      }
    }
  },
  mounted () {
    NProgress.start()
    this.setAppId(this.wxapp)
    if (this.wxAppId) {
      this.updateSurvey()
      this.fetchChartData()
      this.updateVisitPage()
      NProgress.done()
    }
  },
  methods: {
    chartInit () {
      var config = {
        type: 'line',
        data: {
          labels: this.chart.ref_date,
          datasets: [
            {
              label: this.chart.currentTabName,
              backgroundColor: this.chartColors.red,
              borderColor: this.chartColors.red,
              data: this.chart.data[this.chart.currentTab],
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          tooltips: {
            mode: 'index',
            intersect: true
          },
          hover: {
            mode: 'nearest',
            intersect: true
          }
        }
      }
      var ctx = document.getElementById('canvas').getContext('2d')
      this.chartObj = new Chart(ctx, config)
    },
    updateSurvey () {
      this.surveyLoading = true
      summarybydate({
        wxaAppId: this.wxAppId,
        date: '',
        queryType: ''
      }).then((res) => {
        this.survey = res.data.data
        this.surveyLoading = false
      })
    },
    chartHandle (val) {
      this.chart.date = val
      this.fetchChartData()
    },
    tabChartHandle (index) {
      this.chart.currentTabName = this.chart.tabCon[index].label
      this.chart.currentTab = this.chart.tabCon[index].value
      this.chart.tabPop = false
      this.updateChart()
    },
    tabVisitHandle (index) {
      this.visitPage.currentTabName = this.chart.tabCon[index].label
      this.visitPage.currentTab = this.chart.tabCon[index].value
      this.visitPage.tabPop = false
      this.updateChart()
    },
    updateChart () {
      this.chartObj.chart.data.labels = this.chart.ref_date
      this.chartObj.chart.data.datasets[0].data = this.chart.data[this.chart.currentTab]
      this.chartObj.chart.data.datasets[0].label = this.chart.currentTabName
      this.chartObj.update()
    },
    fetchChartData () {
      this.chart.chartLoading = true
      getSummaryTrend({
        wxaAppId: this.wxAppId,
        queryType: this.chart.date
      }).then((res) => {
        var visitTotal = [],
          sharePv = [],
          shareUv = [],
          date = []
        for (var i = 0; i < res.data.data.length; i++) {
          date.push(res.data.data[i].ref_date)
          visitTotal.push(res.data.data[i].visit_total)
          sharePv.push(res.data.data[i].share_pv)
          shareUv.push(res.data.data[i].share_uv)
        }
        this.chart.ref_date = date
        this.chart.data.visit_total = visitTotal
        this.chart.data.share_pv = sharePv
        this.chart.data.share_uv = shareUv
        if (this.chartObj) {
          this.updateChart()
        } else {
          this.chartInit()
        }
        this.chart.chartLoading = false
      })
      getVisitTrend({
        wxaAppId: this.wxAppId,
        queryType: this.chart.date
      }).then((res) => {
        var sessionCnt = [],
          visitPv = [],
          visitUv = [],
          visitUvNew = [],
          stayTimeUv = [],
          stayTimeSession = []
        for (var i = 0; i < res.data.data.length; i++) {
          sessionCnt.push(res.data.data[i].session_cnt)
          visitPv.push(res.data.data[i].visit_pv)
          visitUv.push(res.data.data[i].visit_uv)
          visitUvNew.push(res.data.data[i].visit_uv_new)
          stayTimeUv.push(res.data.data[i].stay_time_uv)
          stayTimeSession.push(res.data.data[i].stay_time_session)
        }
        this.chart.data.session_cnt = sessionCnt
        this.chart.data.visit_pv = visitPv
        this.chart.data.visit_uv = visitUv
        this.chart.data.visit_uv_new = visitUvNew
        this.chart.data.stay_time_uv = stayTimeUv
        this.chart.data.stay_time_session = stayTimeSession
        if (this.chartObj) {
          this.updateChart()
        } else {
          this.chartInit()
        }
        this.chart.chartLoading = false
      })
    },
    tabVisitHandle (index) {
      this.visitPage.currentTabName = this.visitPage.tabCon[index].label
      this.visitPage.currentTab = this.visitPage.tabCon[index].value
      this.visitPage.tabPop = false
      this.visitPage.list = this.visitPage.data[this.visitPage.currentTab]
    },
    visitPageHandle (val) {
      this.visitPage.date = val
      this.updateVisitPage()
    },
    updateVisitPage () {
      this.visitPage.visitLoading = true
      getVisitPage({
        wxaAppId: this.wxAppId,
        queryType: this.visitPage.date
      }).then((res) => {
        var pageVisitPv = [],
          entrypagePv = [],
          pageVisitTotal = res.data.data.total.page_visit_pv,
          entrypageTotal = res.data.data.total.entrypage_pv
        var list = res.data.data.list
        for (var i = 0; i < list.length; i++) {
          var pageVisitObj = {},
            entrypageObj = {}

          pageVisitObj.page_path = list[i].page_path
          pageVisitObj.pv_num = list[i].page_visit_pv
          pageVisitObj.percent =
            Math.floor((list[i].page_visit_pv / pageVisitTotal) * 100 * 100) / 100 + '%'
          pageVisitPv.push(pageVisitObj)

          entrypageObj.page_path = list[i].page_path
          entrypageObj.pv_num = list[i].entrypage_pv
          entrypageObj.percent =
            Math.floor((list[i].entrypage_pv / entrypageTotal) * 100 * 100) / 100 + '%'
          entrypagePv.push(entrypageObj)
        }
        this.visitPage.data.page_visit_pv = pageVisitPv.sort(compare('pv_num'))
        this.visitPage.data.entrypage_pv = entrypagePv.sort(compare('pv_num'))
        this.visitPage.list = this.visitPage.data[this.visitPage.currentTab]
        this.visitPage.visitLoading = false
      })
      var compare = function (prop) {
        return function (obj1, obj2) {
          var val1 = obj1[prop]
          var val2 = obj2[prop]
          if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1)
            val2 = Number(val2)
          }
          if (val1 > val2) {
            return -1
          } else if (val1 < val2) {
            return 1
          } else {
            return 0
          }
        }
      }
    },
    setAppId (val) {
      this.wxAppId = val
    }
  }
}
</script>

<style scoped lang="scss">
.tab-handle {
  cursor: pointer;
}
.tab-list {
  li {
    line-height: 30px;
    font-size: 14px;
    color: #222;
    white-space: nowrap;
    padding: 0 28px 0 10px;
    cursor: pointer;
    &:hover {
      background: #efefef;
    }
  }
}
.data_overview_list {
  padding: 40px 20px;
}

.data_overview_item {
  text-align: center;
}

.data_overview_item:first-child .data_overview_title {
  border-left-width: 0;
}

.data_overview_title {
  color: #9a9a9a;
  font-weight: 400;
  border-left: 1px solid #e7e7eb;
}

.data_overview_desc {
  padding-top: 5px;
  font-size: 24px;
}

.data_overview_desc a {
  color: #353535;
}

.data_overview_desc a:hover {
  text-decoration: none;
}

.col_main .main_bd {
  padding: 40px 0;
}

.mod_default_box {
  margin-bottom: 30px;
}

.top_sub_tab {
  background-color: #f4f5f7;
}

.top_sub_tab .links {
  font-size: 0;
}

.top_sub_tab .links_item {
  display: inline-block;
  font-size: 14px;
  color: #9a9a9a;
  border-left: 1px solid #e7e7eb;
}

.top_sub_tab .links_item:first-child {
  border-left-width: 0;
}

.top_sub_tab .links_item a {
  display: block;
  color: #9a9a9a;
  text-decoration: none;
}

.top_sub_tab .links_item a:hover {
  text-decoration: underline;
}

.top_sub_tab .links_item.selected a {
  color: #1aad19;
}

.top_sub_tab .links_item.selected a:hover {
  text-decoration: none;
}

.pagination {
  margin-top: 20px;
}

.section_tab {
  font-size: 0;
  margin-bottom: 20px;
}

.section_tab .tabs {
  display: inline-block;
  border-radius: 4px;
  font-size: 0;
  overflow: hidden;
}

.section_tab .tabs .tabs_item {
  display: inline-block;
  font-size: 14px;
  height: 32px;
  line-height: 32px;
  border: 1px solid #e7e7eb;
}

.section_tab .tabs .tabs_item:first-child {
  border-radius: 4px 0 0 4px;
}

.section_tab .tabs .tabs_item:last-child {
  border-radius: 0 4px 4px 0;
}

.section_tab .tabs .tabs_item a {
  display: block;
  color: #353535;
  padding: 0 14px;
  min-width: 70px;
  text-align: center;
}

.section_tab .tabs .tabs_item a:hover {
  text-decoration: none;
  background-color: #f6f8f9;
}

.section_tab .tabs .tabs_item.selected {
  border-color: #1aad19;
  background-color: #1aad19;
}

.section_tab .tabs .tabs_item.selected a {
  color: #fff;
}

.section_tab .tabs .tabs_item.selected a:hover {
  background-color: #1aad19;
}

.add_remove_opr {
  display: inline-block;
  width: 22px;
  height: 22px;
  cursor: pointer;
  margin-right: 5px;
}

.add_remove_opr.icon_add {
  background: url(/wxopenres/zh_CN/htmledition/comm_htmledition/style/page/data/index_z_@all36dfb6.png)
    0 0 no-repeat;
}

.add_remove_opr.icon_add:hover {
  background: url(/wxopenres/zh_CN/htmledition/comm_htmledition/style/page/data/index_z_@all36dfb6.png)
    0 -26px no-repeat;
}

.add_remove_opr.icon_add.without_hl:hover {
  background: url(/wxopenres/zh_CN/htmledition/comm_htmledition/style/page/data/index_z_@all36dfb6.png)
    0 -52px no-repeat;
}

.add_remove_opr.icon_remove {
  background: url(/wxopenres/zh_CN/htmledition/comm_htmledition/style/page/data/index_z_@all36dfb6.png)
    0 -78px no-repeat;
}

.add_remove_opr.icon_remove:hover {
  background: url(/wxopenres/zh_CN/htmledition/comm_htmledition/style/page/data/index_z_@all36dfb6.png)
    0 -104px no-repeat;
}

.add_config_opr_box {
  overflow: hidden;
  padding: 10px 30px;
  border-top: 1px dashed #e7e7eb;
}

.add_config_opr_box .add_config_opr {
  cursor: pointer;
}

.add_config_opr_box .add_config_opr .add_remove_opr {
  position: static;
  vertical-align: middle;
}

.add_config_opr_box .add_config_opr span {
  vertical-align: middle;
}

.add_config_opr_box .add_config_opr:hover {
  text-decoration: none;
}

.add_config_opr_box .add_config_opr:hover span {
  text-decoration: underline;
}

.user_list {
  overflow: hidden;
  margin-right: -20px;
}

.user_item {
  float: left;
  width: 33.33%;
}

.user_item .user_item_inner {
  background-color: #fafafb;
  border-radius: 5px;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  margin: 0 20px 20px 0;
  padding: 10px 14px;
  cursor: pointer;
  border: 1px solid #fafafb;
  box-sizing: border-box;
}

.user_item .user_info {
  padding-left: 86px;
  min-height: 70px;
  position: relative;
}

.user_item strong,
.user_item em {
  font-weight: 400;
  font-style: normal;
  display: block;
  width: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
}

.user_item .user_nickname {
  padding-top: 10px;
}

.user_item .user_avatar {
  width: 70px;
  height: 70px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  position: absolute;
  top: 0;
  left: 0;
}

.user_item.selected .user_item_inner {
  border: 1px solid #1aad19;
}

.page_global_msg.page_msg.mini {
  margin-bottom: 20px;
}

.page_global_msg.page_msg.mini .inner {
  background: #eff1f3;
  padding: 5px 20px;
  border-radius: 4px;
}

.page_global_msg.page_msg.mini .msg_icon_wrp {
  margin-top: 2px;
}

.table_cell {
  padding-left: 5px;
  padding-right: 5px;
}

.table_cell:first-child {
  text-align: left;
  padding-left: 20px;
}

tr > .table_cell:last-child {
  text-align: right;
  padding-right: 20px;
}

.qrcheck_hover_wrp {
  position: relative;
}

.qrcheck_hover_wrp:hover .show_qrcheck {
  visibility: visible;
  opacity: 1;
}

.qrcheck_hover_wrp .show_qrcheck {
  visibility: hidden;
  opacity: 0;
  -ms-transition: all 0.3s;
  -moz-transition: all 0.3s;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  width: 200px;
  right: 0;
  text-align: center;
}

.qrcheck_hover_wrp .show_qrcheck .popover_inner {
  padding: 10px 20px;
}

.qrcheck_hover_wrp .show_qrcheck .popover_inner img {
  width: 100%;
}

.main_bd {
  padding: 40px 0 20px;
}

.page_global_msg.page_msg.mini {
  margin-bottom: 10px;
}

.page_global_msg.page_msg.mini .inner {
  background: #eff1f3;
  padding: 0 8px;
  height: 32px;
  line-height: 32px;
  border-radius: 4px;
}

.page_global_msg.page_msg.mini .msg_icon_wrp {
  margin-top: 0;
}

.data_overview_title {
  border-left-width: 0;
}

.app_graph_opr {
  *zoom: 1;
  padding-bottom: 20px;
}

.app_graph_opr:after {
  content: '\200B';
  display: block;
  height: 0;
  clear: both;
}

.app_graph_opr .frm_msg {
  width: auto;
}

.date_select_compare_wrp {
  display: inline-block;
  vertical-align: middle;
  font-size: 0;
}

.date_select_compare_wrp .date_select_custom_area {
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
}

.date_select_compare_wrp .date_select_gap {
  margin: 0 1em;
}

.date_select_compare_wrp .dropdown_menu {
  margin-right: -1px;
}

.realtime_unit_select {
  display: inline-block;
  vertical-align: middle;
}

.realtime_unit_select label {
  margin-left: 3em;
  margin-right: 1em;
}

.dropdown_value {
  display: inline-block;
  vertical-align: middle;
  color: #9a9a9a;
  margin-left: 1em;
}

.dropdown_gap {
  margin: 0 1em;
  display: inline-block;
  vertical-align: middle;
}

.app_data_global,
.app_detail_overview,
.app_detail_user,
.app_detail_source,
.app_detail_url {
  margin-bottom: 20px;
}

.mod_default_box {
  margin-bottom: 30px;
}

.app_data_global .data_overview_item {
  padding: 0 50px;
  text-align: left;
  border-left: 1px solid #e7e7eb;
}

.app_data_global .data_overview_label {
  font-size: 16px;
}

.app_data_global .data_overview_desc {
  font-size: 44px;
  padding-top: 0;
  font-weight: 200;
}

.app_data_global .app_data_box {
  padding: 20px 0;
}

.app_data_global .app_data_box:first-child .data_overview_item {
  border-left-width: 0;
  padding-left: 20px;
}

.app_detail_overview .data_overview_list_wrp {
  overflow: hidden;
}

.app_detail_overview .data_overview_list {
  margin-left: -1px;
  padding: 0;
  font-size: 0;
}

.app_detail_overview .data_overview_item {
  font-size: 14px;
  width: 25%;
  box-sizing: border-box;
  min-width: 165px;
  margin: 15px 0;
  display: inline-block;
  vertical-align: top;
  border-left: 1px solid #e7e7eb;
}

.app_detail_overview .data_overview_item:first-child {
  border-left-width: 0;
}

.app_detail_overview .data_overview_percent {
  display: inline-block;
  vertical-align: top;
}

.app_detail_overview .data_overview_percent_item_inner label {
  color: #9a9a9a;
  float: left;
  width: 2em;
  text-align: left;
}

.app_detail_overview .data_overview_percent_item_inner p {
  overflow: hidden;
}

.app_detail_source .app_graph_content {
  text-align: center;
}

.app_detail_url_table .table_cell.url {
  width: 60%;
}

.app_detail_url_table .table_cell.pv {
  width: 20%;
}

.app_detail_url_table .pagination_wrp {
  padding-top: 20px;
}

.app_graph_content {
  margin-top: 10px;
  margin-bottom: 40px;
}

.app_graph_content:last-child {
  margin-bottom: 0;
}

.app_graph_wrp {
  display: inline-block;
  vertical-align: top;
  text-align: center;
}

.app_graph_title {
  color: #9a9a9a;
  display: block;
  padding-top: 1em;
}

.app_detail_popover {
  width: 400px;
}

.app_detail_popover p {
  overflow: hidden;
  padding-top: 10px;
}

.app_detail_popover p:first-child {
  padding-top: 0;
}

.app_detail_popover label {
  float: left;
  width: 6em;
  margin-right: 1em;
  color: #9a9a9a;
}

.app_detail_popover span {
  display: block;
  overflow: hidden;
}

.app_data_global_popover label {
  width: 7em;
}

.app_detail_overview_popover {
  width: 420px;
}

.app_detail_user_popover {
  width: 520px;
}

.app_detail_user_popover label {
  width: 7em;
}

.app_detail_url_popover label {
  width: 3em;
}

.app_visit_distribution .app_graph_content {
  overflow: hidden;
}

.app_visit_distribution .app_graph_wrp {
  width: 33.33%;
  float: left;
}

.app_visit_page .pagination {
  margin-top: 20px;
}

.app_visit_page .tbody .table_cell {
  padding-left: 5px;
  padding-right: 5px;
}

.app_visit_page .thead .table_cell {
  padding-left: 5px;
  padding-right: 5px;
}

.app_visit_page .table_cell:first-child {
  padding-left: 20px;
}

.app_visit_page .table_cell:last-child {
  padding-right: 20px;
}

.app_retained_data .table_cell.color-level-0 {
  background-color: #d1efd1;
}

.app_retained_data .table_cell.color-level-1 {
  background-color: #a3dea3;
}

.app_retained_data .table_cell.color-level-2 {
  background-color: #76ce75;
}

.app_retained_data .table_cell.color-level-3 {
  background-color: #48bd47;
}

.app_retained_data .table_cell.color-level-4 {
  background-color: #1aad19;
}

.app_retained_data .table_cell.color-level-5 {
  background-color: #1aad19;
}

.app_retained_data .table.complex_data tr > .table_cell:last-child {
  text-align: center;
  padding-right: 5px;
}

.app_retained_data .pagination {
  margin-top: 20px;
}

.table_wrp.qrcode {
  clear: both;
  padding-top: 40px;
}

.table_wrp.qrcode .pagination {
  margin-top: 20px;
}

@media screen and (max-width: 1338px) {
  .app_detail_overview .data_overview_list {
    text-align: center;
  }

  .app_detail_overview .data_overview_item {
    font-size: 14px;
    width: auto;
    box-sizing: border-box;
    padding: 0 2%;
    margin: 15px 0;
    display: inline-block;
    vertical-align: top;
    border-left: 1px solid #e7e7eb;
  }

  .app_detail_overview .data_overview_item:first-child {
    border-left-width: 0;
  }
}
@media only screen and (-webkit-min-device-pixel-ratio: 2) {
  .add_remove_opr.icon_add {
    background: url(/wxopenres/zh_CN/htmledition/comm_htmledition/style/page/data/index_z_@236dfb6.png)
      0 0 no-repeat;
    background-size: 22px auto;
  }

  .add_remove_opr.icon_add:hover {
    background: url(/wxopenres/zh_CN/htmledition/comm_htmledition/style/page/data/index_z_@236dfb6.png)
      0 -26px no-repeat;
    background-size: 22px auto;
  }

  .add_remove_opr.icon_add.without_hl:hover {
    background: url(/wxopenres/zh_CN/htmledition/comm_htmledition/style/page/data/index_z_@236dfb6.png)
      0 -52px no-repeat;
    background-size: 22px auto;
  }

  .add_remove_opr.icon_remove {
    background: url(/wxopenres/zh_CN/htmledition/comm_htmledition/style/page/data/index_z_@236dfb6.png)
      0 -78px no-repeat;
    background-size: 22px auto;
  }

  .add_remove_opr.icon_remove:hover {
    background: url(/wxopenres/zh_CN/htmledition/comm_htmledition/style/page/data/index_z_@236dfb6.png)
      0 -104px no-repeat;
    background-size: 22px auto;
  }
}
</style>
