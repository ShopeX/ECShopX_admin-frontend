<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}
</style>

<template>
  <div>
    <template v-if="$route.path.indexOf('detail') === -1 && $route.path.indexOf('editor') === -1">
      <div class="action-container">
        <el-button
          type="primary"
          @click="editorLog()"
        >
          上传日志
        </el-button>
      </div>

      <SpFilterForm
        :model="params"
        @onSearch="onSearch"
        @onReset="onReset"
      >
        <SpFilterFormItem
          prop="activity_id"
          label="活动:"
        >
          <el-select
            v-model="params.activity_id"
            placeholder="请选择活动"
          >
            <el-option
              v-for="item in activity_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem
          prop="mobile"
          label="手机号:"
        >
          <el-input
            v-model="params.mobile"
            placeholder="手机号"
          />
        </SpFilterFormItem>
        <SpFilterFormItem
          prop="create_time"
          label="时间:"
        >
          <el-date-picker
            v-model="params.create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            placeholder="根据添加时间筛选"
          />
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-button
          plain
          type="primary"
          @click="uploadHandleTemplate()"
        >
          下载模版
        </el-button>

        <export-tip @exportHandle="exportData">
          <el-button
            type="primary"
            plain
          >
            导出
          </el-button>
        </export-tip>

        <el-upload
          class="fl"
          action=""
          :on-change="uploadHandleChange"
          :auto-upload="false"
          :show-file-list="false"
        >
          <el-button
            type="primary"
            plain
          >
            点击上传
          </el-button>
        </el-upload>
      </div>

      <el-tabs
        v-model="params.status"
        type="card"
        @tab-click="onSearch"
      >
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.label"
          :name="item.name"
        >
          <el-table
            v-loading="loading"
            border
            :data="tableList"
            element-loading-text="数据加载中"
          >
            <el-table-column
              prop="record_id"
              label="报名编号"
            />
            <el-table-column
              prop="mobile"
              label="手机号"
            />
            <el-table-column
              prop="create_date"
              label="申请时间"
            />
            <el-table-column
              prop="status"
              label="状态"
            >
              <template slot-scope="scope">
                <el-tag
                  v-if="scope.row.status == 'pending'"
                  type="warning"
                  size="mini"
                >
                  待审核
                </el-tag>
                <el-tag
                  v-if="scope.row.status == 'passed'"
                  type="success"
                  size="mini"
                >
                  已通过
                </el-tag>
                <el-tag
                  v-if="scope.row.status == 'rejected'"
                  type="danger"
                  size="mini"
                >
                  已拒绝
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              label="操作"
            >
              <template slot-scope="scope">
                <router-link
                  v-if="scope.row.status == 'pending'"
                  :to="{ path: matchHidePage('detail'), query: { id: scope.row.record_id } }"
                >
                  审核
                </router-link>
                <router-link
                  v-if="scope.row.status != 'pending'"
                  :to="{ path: matchHidePage('detail'), query: { id: scope.row.record_id } }"
                >
                  详情
                </router-link>
              </template>
            </el-table-column>
          </el-table>
          <div class="content-padded content-center">
            <el-pagination
              layout="total, sizes, prev, pager, next, jumper"
              :current-page.sync="page.pageIndex"
              :page-sizes="[10, 20, 50]"
              :total="page.total"
              :page-size="page.pageSize"
              @current-change="onCurrentChange"
              @size-change="onSizeChange"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </template>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { regActivityEasylist, recordExport } from '@/api/selfhelpform'
import { handleUploadFile, exportUploadTemplate } from '@/api/common'
import mixin, { pageMixin } from '@/mixins'

export default {
  mixins: [mixin, pageMixin],
  data () {
    const initialParams = {
      activity_id: undefined,
      mobile: undefined,
      status: 'all',
      create_time: []
    }
    return {
      initialParams,
      params: {
        ...initialParams
      },
      tabList: [
        { label: '全部', name: 'all' },
        { label: '待审核', name: 'pending' },
        { label: '已通过', name: 'passed' },
        { label: '已拒绝', name: 'rejected' }
      ],
      activityParams: {
        page: 1,
        pageSize: 10,
        is_valid: true
      },
      loading: false,
      activity_options: []
    }
  },
  mounted () {
    if (this.$route.query.id) {
      this.params.record_id = this.$route.query.id
    }
    this.regActivityEasylists()
    this.fetchList()
  },
  methods: {
    onSearch () {
      this.page.pageIndex = 1
      this.$nextTick(() => {
        this.fetchList()
      })
    },
    onReset () {
      this.params = { ...this.initialParams }
      this.onSearch()
    },
    getParams () {
      const time = {}
      const create_time = this.params.create_time
      if (create_time.length) {
        time.start_time = this.dateStrToTimeStamp(create_time[0] + ' 00:00:00')
        time.end_time = this.dateStrToTimeStamp(create_time[1] + ' 00:00:00')
      }
      let params = {
        ...this.params,
        create_time: [],
        status: this.params.status === 'all' ? '' : this.params.status,
        ...time
      }
      return params
    },
    async fetchList () {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.getParams()
      }
      const { list, total_count } = await this.$api.selfhelpform.regActivityRecordlist(params)

      this.tableList = list
      this.page.total = total_count
      this.loading = false
    },
    // 切换tab
    handleClick (tab, event) {
      this.params.status = tab.name == 'all' ? '' : tab.name
      this.onSearch()
    },
    regActivityEasylists () {
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
    dateStrToTimeStamp (str) {
      return Date.parse(new Date(str)) / 1000
    },
    uploadHandleTemplate () {
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
    uploadHandleChange (file, fileList) {
      let params = { isUploadFile: true, file_type: 'selform_registration_record', file: file.raw }
      handleUploadFile(params).then((response) => {
        this.$message({
          type: 'success',
          message: '上传成功，等待处理'
        })
        this.$router.push({ path: this.matchHidePage('editor') })
      })
    },
    editorLog () {
      this.$router.push({ path: this.matchHidePage('editor') })
    },
    exportData () {
      this.currentPage = 1
      recordExport(this.params).then((response) => {
        if (response.data.data.status) {
          this.$message({
            type: 'success',
            message: '已加入执行队列，请在设置-导出列表中下载'
          })
          this.$export_open('selform_registration_record')
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
  computed: {
    ...mapGetters(['wheight'])
  }
}
</script>
