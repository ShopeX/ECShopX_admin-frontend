<template>
  <div>
    <div v-if="$route.path.indexOf('detail') === -1 && $route.path.indexOf('editor') === -1">
      <el-row :gutter="20">
        <el-col>
          <el-select v-model="params.activity_id" placeholder="请选择活动" @change="searchData">
            <el-option
              v-for="item in activity_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input class="input-m" placeholder="手机号" v-model="params.mobile">
            <el-button slot="append" icon="el-icon-search" @click="searchData"></el-button>
          </el-input>
          <el-date-picker
            v-model="create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            placeholder="根据添加时间筛选"
            @change="dateChange"
          ></el-date-picker>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col>
          <el-button-group>
            <el-button @click="uploadHandleTemplate()" type="primary">下载模版</el-button>
            <export-tip @exportHandle='exportData'>
              <el-button type="primary">导出</el-button>
            </export-tip>
            <el-button type="primary" @click="editorLog()">上传日志</el-button>
            <el-upload
              class="fl"
              action=""
              :on-change="uploadHandleChange"
              :auto-upload="false"
              :show-file-list="false"
            >
              <el-button type="primary">点击上传</el-button>
            </el-upload>
          </el-button-group>
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            content="导出任务会以队列执行，点击导出后，请至‘设置-导出列表’页面中查看及下载数据"
          >
            <i class="el-icon-question" slot="reference"></i>
          </el-popover>
        </el-col>
      </el-row>
      <el-tabs type="border-card" v-model="activeName" v-loading="loading" @tab-click="handleClick">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane label="待审核" name="pending"></el-tab-pane>
        <el-tab-pane label="已通过" name="passed"></el-tab-pane>
        <el-tab-pane label="已拒绝" name="rejected"></el-tab-pane>
        <el-table :data="list" v-loading="loading" element-loading-text="数据加载中">
          <el-table-column prop="record_id" label="报名编号"></el-table-column>
          <el-table-column prop="mobile" label="手机号"></el-table-column>
          <el-table-column prop="create_date" label="申请时间"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status == 'pending'" type="warning" size="mini"
                >待审核</el-tag
              >
              <el-tag v-if="scope.row.status == 'passed'" type="success" size="mini">已通过</el-tag>
              <el-tag v-if="scope.row.status == 'rejected'" type="danger" size="mini"
                >已拒绝</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="status" label="操作">
            <template slot-scope="scope">
              <router-link
                v-if="scope.row.status == 'pending'"
                :to="{ path: matchHidePage('detail'), query: { id: scope.row.record_id } }"
                >审核</router-link
              >
              <router-link
                v-if="scope.row.status != 'pending'"
                :to="{ path: matchHidePage('detail'), query: { id: scope.row.record_id } }"
                >详情</router-link
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="content-padded content-center">
          <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="params.page"
            :page-sizes="[10, 20, 50]"
            :total="total_count"
            :page-size="params.pageSize"
          >
          </el-pagination>
        </div>
      </el-tabs>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  regActivityRecordlist,
  regActivityEasylist,
  recordExport,
  registrationReview
} from '@/api/selfhelpform'
import {
  handleUploadFile,
  getUploadLists,
  exportUploadErrorFile,
  exportUploadTemplate
} from '@/api/common'
export default {
  data() {
    return {
      activeName: 'pending',
      params: {
        page: 1,
        pageSize: 20,
        activity_id: '',
        mobile: '',
        start_time: '',
        end_time: ''
      },
      create_time: '',
      activityParams: {
        page: 1,
        pageSize: 10,
        is_valid: true
      },
      list: [],
      loading: false,
      total_count: 0,
      activity_options: []
    }
  },
  methods: {
    // 切换tab
    handleClick(tab, event) {
      this.activeName = tab.name
      this.params.status = tab.name == 'all' ? '' : tab.name
      this.params.page = 1
      this.getRegActivityRecordeList()
    },
    searchData() {
      this.params.page = 1
      this.getRegActivityRecordeList()
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getRegActivityRecordeList()
    },
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getRegActivityRecordeList()
    },
    getRegActivityRecordeList() {
      this.loading = true
      regActivityRecordlist(this.params).then((res) => {
        this.list = res.data.data.list
        this.total_count = res.data.data.total_count
        this.loading = false
      })
    },
    regActivityEasylists() {
      this.loading = true
      regActivityEasylist(this.activityParams).then((response) => {
        response.data.data.list.map((item) => {
          this.activity_options.push({
            label: item.activity_name,
            value: item.activity_id
          })
        })
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    dateChange(val) {
      if (val.length > 0) {
        this.params.start_time = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.params.end_time = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      }
      this.params.page = 1
      this.getRegActivityRecordeList()
    },
    uploadHandleTemplate() {
      var fileName = '报名批量审核'
      let params = { file_type: 'selform_registration_record', file_name: fileName }
      exportUploadTemplate(params).then((response) => {
        if (response.data.data.file) {
          var a = document.createElement('a')
          a.href = response.data.data.file
          a.download = response.data.data.name
          document.body.appendChild(a)
          a.click()
          a.remove()
        } else {
          this.$message({
            type: 'error',
            message: '没有相关数据可导出'
          })
        }
      })
    },
    uploadHandleChange(file, fileList) {
      let params = { isUploadFile: true, file_type: 'selform_registration_record', file: file.raw }
      handleUploadFile(params).then((response) => {
        this.$message({
          type: 'success',
          message: '上传成功，等待处理'
        })
        this.$router.push({ path: this.matchHidePage('editor') })
      })
    },
    editorLog() {
      this.$router.push({ path: this.matchHidePage('editor') })
    },
    exportData() {
      this.currentPage = 1
      recordExport(this.params).then((response) => {
        if (response.data.data.status) {
          this.$message({
            type: 'success',
            message: '已加入执行队列，请在设置-导出列表中下载'
          })
          this.$export_open('selform_registration_record');
          return
        } else if (response.data.data.url) {
          this.downloadUrl = response.data.data.url
          this.downloadName = response.data.data.filename
          this.downloadView = true
        } else {
          this.$message({
            type: 'error',
            message: '无内容可导出 或 执行失败，请检查重试'
          })
          return
        }
      })
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.params.record_id = this.$route.query.id
    }
    this.regActivityEasylists()
    this.getRegActivityRecordeList()
  },
  computed: {
    ...mapGetters(['wheight'])
  }
}
</script>
