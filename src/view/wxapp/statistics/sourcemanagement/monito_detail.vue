<template>
  <div class="section-white content-padded">
    <div>
      页面路径：<a
        href="#"
        class="page-name"
      >{{ detail.monitor_path
      }}<span
        v-show="detail.monitor_path_params != ''"
      >?{{ detail.monitor_path_params }}</span></a><span>小程序：{{ detail.nick_name }}</span>
    </div>
    <div class="time-box">
      <div>
        <span>日期筛选：</span>
        <el-select
          v-model="timeType"
          @change="timeTypeChange"
        >
          <el-option
            v-for="item in timeTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <span
          v-if="isNeardate"
        >{{ typeText
        }}<span
          v-if="isRealTime"
          class="refresh"
          @click="getRealTime"
        >&nbsp;刷新</span></span>
        <el-date-picker
          v-if="ischooseDay"
          v-model="chooseDate"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions"
        />
        <el-date-picker
          v-if="iscustom"
          v-model="customDate"
          type="daterange"
          placeholder="选择日期范围"
          :picker-options="pickerOptions2"
        />
        <el-button
          type="primary"
          size="small"
          style="margin: 0 10px"
          @click="searchStats"
        >
          查询
        </el-button>
      </div>
    </div>
    <div class="time-box basic">
      <el-row>
        <!-- <el-col :span="6">浏览人数:&nbsp;<span>{{statstotal.total_view_num}}</span></el-col> -->
        <!-- <el-col :span="6"
          >新客访问量:&nbsp;<span>{{ statstotal.total_fans_num }}</span></el-col
        > -->
        <el-col
          :span="6"
        >
          注册量:&nbsp;<span>{{ statstotal.total_register_num }}</span>
        </el-col>
        <el-col
          :span="6"
        >
          购买量:&nbsp;<span>{{ statstotal.total_entries_num }}</span>
        </el-col>
        <el-col
          :span="6"
        >
          注册购买转化率:&nbsp;<span>{{ statstotal.total_register_entries_rate }}</span>
        </el-col>
      </el-row>
    </div>
    <div>
      <div class="content-bottom-padded">
        <el-button
          type="primary"
          @click="codePack"
        >
          二维码打包
        </el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="dataList"
        style="width: 100%"
        :row-key="handleRowKey"
      >
        <el-table-column
          prop="source_id"
          label="来源ID"
        />
        <el-table-column
          prop="monitor_id"
          label="跟踪ID"
        />
        <el-table-column
          prop="source_name"
          label="来源名称"
        />
        <!-- <el-table-column prop="view_num" label="浏览人数"></el-table-column> -->
        <el-table-column
          prop="fans_num"
          label="新客访问量"
        />
        <el-table-column
          prop="register_num"
          label="注册量"
        />
        <el-table-column
          prop="entries_num"
          label="购买量"
        />
        <el-table-column
          prop="register_entries_rate"
          label="转化率"
        />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <a
              href="#"
              @click="showlink(scope.row)"
            >链接</a> &nbsp;
            <a
              href="#"
              @click="remove(scope.row)"
            >删除</a>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="二维码信息"
      :visible="dialogVisible"
      :close-on-click-modal="false"
      :before-close="cancelDialog"
    >
      <template>
        <el-alert
          title="将此链接或二维码进行投放，获取对应跟踪数据"
          type="warning"
          :closeable="false"
        />
        <el-row class="row-bg">
          <el-col :span="4">
            <div class="grid-content">
              来源名称
            </div>
          </el-col>
          <el-col :span="15">
            {{ wxaCodeInfo.source_name }}
          </el-col>
        </el-row>
        <el-row class="row-bg">
          <el-col :span="4">
            <div class="grid-content">
              跟踪二维码
            </div>
          </el-col>
          <el-col
            :span="15"
          >
            <img
              :src="wxaCodeInfo.code_src"
              style="width: 100%; height: 100%"
            >
          </el-col>
        </el-row>
        <el-row class="row-bg">
          <el-col
            :span="15"
          >
            <a
              href="javascript:void(0)"
              @click="downloadCode(wxaCodeInfo.source_name, wxaCodeInfo.code_src)"
            ><i class="iconfont icon-download" />下载二维码</a>
          </el-col>
        </el-row>
      </template>
    </el-dialog>
    <el-dialog
      title="二维码打包下载"
      :visible.sync="codeDialogVisible"
      :close-on-click-modal="false"
    >
      <template v-if="dataList.length > 0">
        <div
          v-for="(item, index) in dataSpan"
          class="code-span"
          :class="{ 'cur': index === codespanIndex }"
          @click="codeSpanChoose(index)"
        >
          <span>{{ item }}</span>
          <span
            v-if="index === codespanIndex && !isdownloadOk"
            class="bg-waiting"
          ><i class="el-icon-loading" /></span>
          <span
            v-if="index === codespanIndex && isdownloadOk"
            class="download-ok"
          ><i class="el-icon-circle-check" /></span>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import timeChoose from '../../../../components/timechoose'
import {
  getMonitorsDetail,
  getMonitorsStats,
  getMonitorsWxaCode64,
  getMonitorsWxaCodeStream,
  deleteRelSources,
  listMonitors,
  getSourcesList,
  addMonitors,
  deleteMonitors,
  updateMonitors,
  getWxappPages,
  saveSources,
  getRelSources
} from '../../../../api/datacube'

const getWxaCodeImg = (url) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url,
      responseType: 'arraybuffer'
    })
      .then((data) => {
        resolve(data.data)
      })
      .catch((error) => {
        reject(error.toString())
      })
  })
}

export default {
  components: {
    timeChoose
  },
  data () {
    return {
      monitor_id: '',
      detail: {
        monitor_id: '',
        monitor_path: '',
        monitor_path_params: '',
        nick_name: ''
      },
      dialogVisible: false,
      loading: false,
      statstotal: {
        'total_fans_num': 0,
        'total_register_num': 0,
        'total_entries_num': 0,
        'total_register_entries_rate': '0%'
      },
      dataList: [],
      wxaCodeInfo: {
        source_name: '',
        code_src: ''
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e7
        }
      },
      pickerOptions2: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e7
        }
      },
      timeTypeOptions: [
        {
          value: '1',
          label: '最近7天'
        },
        {
          value: '2',
          label: '最近30天'
        },
        {
          value: '3',
          label: '自然天'
        },
        {
          value: '4',
          label: '今日实时'
        },
        {
          value: '5',
          label: '自定义'
        }
      ],
      chooseDate: '',
      customDate: '',
      timeType: '4',
      typeText: '',
      isNeardate: true,
      ischooseDay: false,
      isRealTime: false,
      iscustom: false,
      checkedSource: [],
      codeDialogVisible: false,
      dataSpan: [],
      codeInterval: 10,
      codeLeft: false,
      codespanIndex: -1,
      codeSpanMax: -1,
      codeSpanMin: -1,
      isdownloadOk: false
    }
  },
  mounted () {
    this.timeTypeChange(this.timeType)
    this.monitor_id = this.$route.query.monitorId
    this.getPageInfo()
    this.getStats()
  },
  methods: {
    remove (row) {
      this.$confirm('确定是否删除该监控来源?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteRelSources(row.monitor_id, row.source_id)
            .then((response) => {
              this.$message({
                message: '删除监控来源成功',
                type: 'success',
                duration: 2 * 1000
              })
              this.getPageInfo()
              this.getStats()
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '删除监控来源失败'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    showlink (row) {
      var that = this
      that.wxaCodeInfo.source_name = row.source_name
      let params = { monitor_id: row.monitor_id, source_id: row.source_id }
      getMonitorsWxaCode64(params).then((response) => {
        that.wxaCodeInfo.code_src = response.data.data.base64Image
      })
      that.dialogVisible = true
    },
    cancelDialog () {
      this.dialogVisible = false
    },
    downloadCode (source_name, code_src) {
      var a = document.createElement('a')
      a.href = code_src
      a.download = source_name + '.png'
      a.click()
    },
    getPageInfo () {
      getMonitorsDetail(this.monitor_id).then((response) => {
        this.detail = response.data.data
      })
    },
    getStats () {
      let params = {}
      params.monitor_id = this.monitor_id
      switch (this.timeType) {
        case '1':
          params.date_type = 'before7days'
          break
        case '2':
          params.date_type = 'before30days'
          break
        case '3':
          params.date_type = 'custom'
          if (!this.chooseDate) {
            this.$message.error('请选择日期')
            return false
          }
          params.begin_date = this.getTaskTime(this.chooseDate, true)
          params.end_date = this.getTaskTime(this.chooseDate, true)
          break
        case '4':
          params.date_type = 'today'
          break
        case '5':
          params.date_type = 'custom'
          if (!this.customDate) {
            this.$message.error('请选择日期范围')
            return false
          }
          params.begin_date = this.getTaskTime(this.customDate[0], true)
          params.end_date = this.getTaskTime(this.customDate[1], true)
          break
      }
      this.dataSpan = []
      getMonitorsStats(params).then((response) => {
        this.dataList = response.data.data.stats_list
        this.statstotal = response.data.data.stats_total
        var codeSpan = (this.dataList.length / this.codeInterval + '').indexOf('.')
        var totalSpan = 0
        if (codeSpan >= 0) {
          totalSpan = parseInt(this.dataList.length / this.codeInterval)
          this.codeLeft = true
        } else {
          totalSpan = this.dataList.length / this.codeInterval
        }
        var preNumber = 0
        if (totalSpan == 0) {
          this.dataSpan.push('0~' + this.dataList.length)
        }
        for (var i = 0; i < totalSpan; i++) {
          if (i === 0) {
            this.dataSpan.push(i + 1 + '~' + (i + 1) * 10)
          } else {
            this.dataSpan.push(preNumber + 1 + '~' + (i + 1) * 10)
          }
          preNumber = (i + 1) * 10
        }
        if (totalSpan > 0 && this.codeLeft) {
          this.dataSpan.push(totalSpan * this.codeInterval + 1 + '~' + this.dataList.length)
        }
      })
    },
    searchStats () {
      this.getStats()
    },
    timeTypeChange (val) {
      var day = 86400000
      var yesterday = new Date(new Date().getTime() - day)
      yesterday = this.getTaskTime(yesterday, true)
      var startDate = ''
      this.isNeardate = this.ischooseDay = this.isRealTime = this.iscustom = false
      switch (val) {
        case '1':
          startDate = this.getTaskTime(new Date(new Date().getTime() - day * 7), true)
          this.typeText = startDate + ' 至 ' + yesterday
          this.isNeardate = true
          break
        case '2':
          startDate = this.getTaskTime(new Date(new Date().getTime() - day * 30), true)
          this.typeText = startDate + ' 至 ' + yesterday
          this.isNeardate = true
          break
        case '3':
          this.ischooseDay = true
          break
        case '4':
          this.isRealTime = this.isNeardate = true
          this.typeText = this.getTaskTime('', false)
          break
        case '5':
          this.iscustom = true
          break
      }
    },
    getTaskTime (s, isShortTime) {
      let date = s ? s : new Date()
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let h = date.getHours()
      h = h < 10 ? '0' + h : h
      let mm = date.getMinutes()
      mm = mm < 10 ? '0' + mm : mm
      let ms = date.getSeconds()
      ms = ms < 10 ? '0' + ms : ms
      let str = isShortTime
        ? y + '-' + m + '-' + d
        : y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + ms
      return str
    },
    getRealTime () {
      this.typeText = this.getTaskTime('', false)
    },
    handleRowKey: function (row) {
      return row.source_id
    },
    handleBatchDownload: function () {
      if (this.checkedSource.length <= 0) {
        this.$message({
          type: 'error',
          message: '请至少选择一条数据!'
        })
        return
      }
      if (this.checkedSource.length > 20) {
        this.$message({
          type: 'error',
          message: '每次最多可选择20条数据!否则可能导致浏览器崩溃！'
        })
        return
      }
      const zip = new JSZip()
      const cache = {}
      const promises = []
      var that = this
      this.checkedSource.forEach((item) => {
        var url =
          this.BASE_API +
          '/datacube/monitorsWxaCodeStream?monitor_id=' +
          item.monitor_id +
          '&source_id=' +
          item.source_id
        const promise = getWxaCodeImg(url).then((result_file) => {
          // 下载文件, 并存成ArrayBuffer对象
          const file_name = item.source_name + '(' + item.source_id + ')' + '.png' // 获取文件名
          zip.file(file_name, result_file, { binary: true }) // 逐个添加文件
          cache[file_name] = result_file
        })
        promises.push(promise)
      })
      this.checkedSource = []
      Promise.all(promises).then(() => {
        zip.generateAsync({ type: 'blob' }).then((content) => {
          // 生成二进制流
          FileSaver.saveAs(content, '小程序码(批量).zip') // 利用file-saver保存文件
          that.isdownloadOk = true
        })
      })
    },
    codePack () {
      this.codeDialogVisible = true
      this.codespanIndex = -1
      this.codeSpanMin = -1
      this.codeSpanMax = -1
      this.isdownloadOk = false
    },
    codeSpanChoose (index) {
      this.isdownloadOk = false
      this.codespanIndex = index
      var arry = this.dataSpan[index].split('~')
      this.codeSpanMin = Number(arry[0])
      this.codeSpanMax = Number(arry[1])

      this.checkedSource = []
      if (this.codeSpanMin < 0 || this.codeSpanMax < 0) return
      for (
        var i = this.codeSpanMin === 0 ? 0 : this.codeSpanMin - 1;
        i < this.dataList.length;
        i++
      ) {
        if (i < this.codeSpanMax) {
          this.checkedSource.push(this.dataList[i])
        }
      }
      this.handleBatchDownload()
    }
  }
}
</script>

<style scoped lang="scss">
.page-name {
  margin-right: 50px;
}
.time-box {
  margin: 20px 0;
  padding: 10px 15px;
  background-color: #efefef;
}
.basic {
  padding: 30px 0;
  text-align: center;
  span {
    color: #ff5000;
    font-size: 24px;
  }
}
.frm-tips {
  margin: 10px 0 0 75px;
}
.refresh {
  color: #459ae9;
  text-decoration: underline;
  cursor: pointer;
  margin-left: 5px;
}
.code-span {
  position: relative;
  display: inline-block;
  margin: 0 5px 10px;
  padding: 5px 20px;
  border: 1px solid #ddd;
  color: #666;
  border-radius: 5px;
  cursor: pointer;
  &:hover,
  &.cur {
    background: #ff5000;
    color: #fff;
  }
}
.bg-waiting {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  text-align: center;
  color: #fff;
  i {
    font-size: 18px;
    line-height: 34px;
  }
}
.download-ok {
  position: absolute;
  top: -4px;
  right: 2px;
  color: #fff;
  i {
    font-size: 12px;
  }
}
</style>
