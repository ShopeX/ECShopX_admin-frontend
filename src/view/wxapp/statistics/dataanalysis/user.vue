<template>
  <div>
    <section class="section section-white">
      <div class="section-header">
        <div class="section-title">
          性别及年龄分布
        </div>
      </div>
      <div class="section-header">
        <el-select
          v-model="gender.currentUserType"
          placeholder="请选择"
          @change="handleGenderUser"
        >
          <el-option
            v-for="item in user"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="gender.date"
          placeholder="请选择"
          @change="handleGenderDate"
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
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="content-padded-b">
              <canvas id="gender-doughnut" />
            </div>
          </el-col>
          <el-col :span="12">
            <canvas id="gender-bar" />
          </el-col>
        </el-row>
      </div>
    </section>
    <section class="section section-white">
      <div class="section-header">
        <div class="section-title">
          地区分布
        </div>
      </div>
      <div class="section-header">
        <el-select
          v-model="area.currentUserType"
          placeholder="请选择"
          @change="handleAreaUser"
        >
          <el-option
            v-for="item in user"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="area.date"
          placeholder="请选择"
          @change="handleAreaDate"
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
        <canvas id="area-bar" />
      </div>
    </section>
    <section class="section section-white">
      <div class="section-header">
        <div class="section-title">
          终端及机型分布
        </div>
      </div>
      <div class="section-header">
        <el-select
          v-model="terminal.currentUserType"
          placeholder="请选择"
          @change="handleTerminalUser"
        >
          <el-option
            v-for="item in user"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="terminal.date"
          placeholder="请选择"
          @change="handleTerminalDate"
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
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="content-padded-b">
              <canvas id="terminal-doughnut" />
            </div>
          </el-col>
          <el-col :span="12">
            <div class="content-padded-b">
              <canvas id="model-doughnut" />
            </div>
          </el-col>
        </el-row>
      </div>
    </section>
  </div>
</template>

<script>
import Chart from 'chart.js'
import { getUserPortrait } from '../../../../api/wxastats'
import util from '../../../../common/js/util'

export default {
  props: {
    wxapp: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      user: [
        {
          label: '活跃用户数',
          value: 'visit_uv'
        },
        {
          label: '新增用户数',
          value: 'visit_uv_new'
        }
      ],
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
      gender: {
        currentUserType: 'visit_uv',
        date: 'weekly',
        chart: {
          gender: '',
          age: ''
        },
        data: ''
      },
      area: {
        currentUserType: 'visit_uv',
        date: 'weekly',
        chart: '',
        data: ''
      },
      terminal: {
        currentUserType: 'visit_uv',
        date: 'weekly',
        chart: {
          terminal: '',
          model: ''
        },
        data: ''
      }
    }
  },
  watch: {
    wxapp (value) {
      if (value) {
        this.setAppId(value)
        if (this.wxAppId) {
          this.fetchUserData()
        }
      }
    }
  },
  mounted () {
    this.setAppId(this.wxapp)
    if (this.wxAppId) {
      this.fetchUserData()
    }
  },
  methods: {
    initGenderChart () {
      if (!this.gender.data) return
      var gender_label = [],
        gender_value = [],
        age_label = [],
        age_value = []
      var genders = this.gender.data.visit_uv.genders
      var ages = this.gender.data.visit_uv.ages

      for (var i = 0; i < genders.length; i++) {
        gender_label.push(genders[i].name)
        gender_value.push(genders[i].value)
      }

      for (var i = 0; i < ages.length; i++) {
        age_label.push(ages[i].name)
        age_value.push(ages[i].value)
      }

      var config = {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: gender_value,
              backgroundColor: [
                this.chartColors.red,
                this.chartColors.orange,
                this.chartColors.yellow
              ]
            }
          ],
          labels: gender_label
        },
        options: {
          responsive: true,
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: '性别分布'
          },
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }
      }
      var color = Chart.helpers.color
      var barChartData = {
        labels: age_label,
        datasets: [
          {
            label: '',
            backgroundColor: color(this.chartColors.red).alpha(0.5).rgbString(),
            borderColor: this.chartColors.red,
            borderWidth: 1,
            data: age_value
          }
        ]
      }
      var doughnut = document.getElementById('gender-doughnut').getContext('2d')
      var bar = document.getElementById('gender-bar').getContext('2d')
      this.gender.chart.gender = new Chart(doughnut, config)
      this.gender.chart.age = new Chart(bar, {
        type: 'bar',
        data: barChartData,
        options: {
          responsive: true,
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: '年龄分布'
          }
        }
      })
    },
    initAreaChart () {
      if (!this.area.data) return
      var area_label = [],
        area_value = []
      var area = this.gender.data.visit_uv.city

      for (var i = 0; i < area.length; i++) {
        area_label.push(area[i].name)
        area_value.push(area[i].value)
      }

      var color = Chart.helpers.color
      var barChartData = {
        labels: area_label,
        datasets: [
          {
            label: '',
            backgroundColor: color(this.chartColors.red).alpha(0.5).rgbString(),
            borderColor: this.chartColors.red,
            borderWidth: 0,
            data: area_value
          }
        ]
      }
      var bar = document.getElementById('area-bar').getContext('2d')
      this.area.chart = new Chart(bar, {
        type: 'horizontalBar',
        data: barChartData,
        options: {
          responsive: true,
          legend: {
            position: 'top'
          },
          title: {
            display: false
          }
        }
      })
    },
    initTerminal () {
      if (!this.terminal.data) return
      var terminal_label = [],
        terminal_value = [],
        model_label = [],
        model_value = []
      var terminal = this.gender.data.visit_uv.platforms
      var model = this.gender.data.visit_uv.devices

      for (var i = 0; i < terminal.length; i++) {
        terminal_label.push(terminal[i].name)
        terminal_value.push(terminal[i].value)
      }

      for (var i = 0; i < model.length; i++) {
        model_label.push(model[i].name)
        model_value.push(model[i].value)
      }

      var terminalConfig = {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: terminal_value,
              backgroundColor: [
                this.chartColors.red,
                this.chartColors.orange,
                this.chartColors.yellow
              ],
              label: '终端分布'
            }
          ],
          labels: terminal_label
        },
        options: {
          responsive: true,
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: '终端分布'
          },
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }
      }
      var modelConfig = {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: model_value,
              backgroundColor: [
                this.chartColors.red,
                this.chartColors.orange,
                this.chartColors.yellow,
                this.chartColors.green,
                this.chartColors.blue,
                this.chartColors.purple,
                this.chartColors.grey,
                this.chartColors.red,
                this.chartColors.orange,
                this.chartColors.yellow
              ],
              label: '机型分布'
            }
          ],
          labels: model_label
        },
        options: {
          responsive: true,
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: '机型分布'
          },
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }
      }
      var terminalDoughnut = document.getElementById('terminal-doughnut').getContext('2d')
      var modelDoughnut = document.getElementById('model-doughnut').getContext('2d')
      this.terminal.chart.terminal = new Chart(terminalDoughnut, terminalConfig)
      this.terminal.chart.model = new Chart(modelDoughnut, modelConfig)
    },
    handleGenderUser (val) {
      this.gender.currentUserType = val
      this.updateGender()
    },
    handleGenderDate (val) {
      this.gender.date = val
      this.fetchUserData(val, 'gender')
    },
    handleAreaUser (val) {
      this.area.currentUserType = val
      this.updateArea()
    },
    handleAreaDate (val) {
      this.area.date = val
      this.fetchUserData(val, 'area')
    },
    handleTerminalUser (val) {
      this.terminal.currentUserType = val
      this.updateTerminal()
    },
    handleTerminalDate (val) {
      this.terminal.date = val
      this.fetchUserData(val, 'terminal')
    },
    updateGender () {
      var gender_label = [],
        gender_value = [],
        age_label = [],
        age_value = []
      var genders = this.gender.data[this.gender.currentUserType].genders
      var ages = this.gender.data[this.gender.currentUserType].ages

      for (var i = 0; i < genders.length; i++) {
        gender_label.push(genders[i].name)
        gender_value.push(genders[i].value)
      }

      for (var i = 0; i < ages.length; i++) {
        age_label.push(ages[i].name)
        age_value.push(ages[i].value)
      }

      this.gender.chart.gender.data.labels = gender_label
      this.gender.chart.gender.data.datasets[0].data = gender_value
      this.gender.chart.gender.update()

      this.gender.chart.age.data.labels = age_label
      this.gender.chart.age.data.datasets[0].data = age_value
      this.gender.chart.age.update()
    },
    updateArea () {
      var area_label = [],
        area_value = []
      var area = this.area.data[this.area.currentUserType].city

      for (var i = 0; i < area.length; i++) {
        area_label.push(area[i].name)
        area_value.push(area[i].value)
      }

      this.area.chart.data.labels = area_label
      this.area.chart.data.datasets[0].data = area_value
      this.area.chart.update()
    },
    updateTerminal () {
      var terminal_label = [],
        terminal_value = [],
        model_label = [],
        model_value = []
      var terminal = this.terminal.data[this.terminal.currentUserType].platforms
      var model = this.terminal.data[this.terminal.currentUserType].devices

      for (var i = 0; i < terminal.length; i++) {
        terminal_label.push(terminal[i].name)
        terminal_value.push(terminal[i].value)
      }

      for (var i = 0; i < model.length; i++) {
        model_label.push(model[i].name)
        model_value.push(model[i].value)
      }

      this.terminal.chart.terminal.data.labels = terminal_label
      this.terminal.chart.terminal.data.datasets[0].data = terminal_value
      this.terminal.chart.terminal.update()

      this.terminal.chart.model.data.labels = model_label
      this.terminal.chart.model.data.datasets[0].data = model_value
      this.terminal.chart.model.update()
    },
    fetchUserData (date, chart) {
      getUserPortrait({
        wxaAppId: this.wxAppId,
        queryType: date || 'weekly'
      }).then((res) => {
        if (chart) {
          this[chart].data = res.data.data
          if (chart === 'gender') {
            this.updateGender()
          }
          if (chart === 'area') {
            this.updateArea()
          }
          if (chart === 'terminal') {
            this.updateTerminal()
          }
          this[chart].chart.update()
        } else {
          this.gender.data = res.data.data
          this.area.data = res.data.data
          this.terminal.data = res.data.data

          if (this.gender.chart.gender) {
            this.updateGender()
          } else {
            this.initGenderChart()
          }

          if (this.area.chart) {
            this.updateArea()
          } else {
            this.initAreaChart()
          }

          if (this.terminal.chart.terminal) {
            this.updateTerminal()
          } else {
            this.initTerminal()
          }
        }
      })
    },
    setAppId (val) {
      this.wxAppId = val
    }
  }
}
</script>
