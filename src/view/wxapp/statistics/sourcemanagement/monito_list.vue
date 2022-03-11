<template>
  <div>
    <div v-if="$route.path.indexOf('detail') === -1">
      <div class="content-bottom-padded">
        <el-row>
          <el-col :span="12">
            <el-button
              type="primary"
              @click="addMonitors"
            >
              新增监控链接
            </el-button>
          </el-col>
          <el-col :span="12">
            <div
              v-if="monitorsParams.total_count > monitorsParams.pageSize"
              class="f_r"
            >
              <el-pagination
                layout="prev, pager, next"
                :total="monitorsParams.total_count"
                :page-size="monitorsParams.pageSize"
                @current-change="handleCurrentChange"
              />
            </div>
          </el-col>
        </el-row>
      </div>
      <el-table
        v-loading="loading"
        :data="monitorsList"
        style="width: 100%"
      >
        <el-table-column
          prop="monitorPath"
          label="监控页面"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.monitorPath }}</span><span
              v-show="scope.row.monitorPathParams != ''"
            >?{{ scope.row.monitorPathParams }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="pageName"
          label="页面描述"
        />
        <el-table-column
          prop="nickName"
          label="小程序"
        />
        <el-table-column
          prop="created"
          label="创建时间"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.created | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <a @click="removeMinotor(scope.$index, scope.row)">删除</a> &nbsp;
            <a @click="manageSources(scope.row.monitorId)">管理来源</a> &nbsp;
            <router-link
              :to="{ path: matchHidePage('detail'), query: { monitorId: scope.row.monitorId } }"
            >
              监控详情
            </router-link>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        title="新增跟踪链接"
        :visible="dialogVisibleMonitors"
        :close-on-click-modal="false"
        :before-close="cancelMonitorsDialog"
      >
        <el-form
          ref="monitorForm"
          :model="monitorForm"
          :rules="monitorFormRules"
        >
          <el-form-item
            prop="monitor_path"
            label="页面"
            :label-width="formLabelWidth"
          >
            <el-select
              v-model="monitorForm.monitor_path"
              filterable
              placeholder="选择页面"
              style="width: 260px"
              @change="pathParamsChange"
            >
              <el-option
                v-for="item in weappPagesList"
                :key="item.page"
                :label="item.label"
                :value="item.page"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            prop="monitor_path"
            label="页面描述"
            :label-width="formLabelWidth"
          >
            <el-col :span="10">
              <el-input v-model="monitorForm.page_name" />
            </el-col>
          </el-form-item>
          <el-form-item
            v-for="(item, index) in monitorForm.monitor_path_params"
            :key="item.param_name"
            :label="item.param_label"
            :prop="'monitor_path_params.' + index + '.value'"
            :label-width="formLabelWidth"
          >
            <el-col :span="10">
              <span v-if="item.option && item.option.length > 0">
                <el-radio-group
                  v-model="item.value"
                  @change="optionChange"
                >
                  <el-radio
                    v-for="(item, index) in item.option"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value"
                  >{{ item.label }}</el-radio>
                </el-radio-group>
              </span>
              <span v-else>
                <el-input
                  v-model="item.value"
                  :disabled="item.disabled ? true : false"
                />
              </span>
            </el-col>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="resetMonitorsForm">
            重 置
          </el-button>
          <el-button
            type="primary"
            @click="saveMonitor"
          >
            确 定
          </el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="管理跟踪来源"
        :visible="dialogVisibleSources"
        class="sources-dialog"
        :close-on-click-modal="false"
        :before-close="cancelSourcesDialog"
      >
        <template>
          <el-transfer
            v-model="sourcesForm.sourceIds"
            :titles="['来源名称列表', '已选中']"
            :props="{ key: 'sourceId', label: 'sourceName' }"
            :data="sourceList"
          >
            <div
              slot="left-footer"
              class="transfer-footer view-flex view-flex-center"
            >
              <el-pagination
                v-if="sourcesParams.total_count > sourcesParams.pageSize"
                small
                layout="prev, pager, next"
                :total="sourcesParams.total_count"
                :page-size="sourcesParams.pageSize"
                @current-change="handleCurrentSourceChange"
              />
            </div>
            <div
              slot="right-footer"
              class="transfer-footer"
            />
          </el-transfer>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="dialogVisibleSources = false">
              取 消
            </el-button>
            <el-button
              type="primary"
              @click="saveSources"
            >
              确 定
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import timeChoose from '../../../../components/timechoose'
import {
  listMonitors,
  getSourcesList,
  addMonitors,
  deleteMonitors,
  updateMonitors,
  getWxappPages,
  saveSources,
  getRelSources
} from '../../../../api/datacube'
import { getWxaAuthList } from '../../../../api/wxa'

export default {
  components: {
    timeChoose
  },
  data () {
    return {
      formLabelWidth: '120px',
      loading: false,
      dialogVisibleMonitors: false,
      dialogVisibleSources: false,
      monitorForm: {
        monitor_id: '',
        nick_name: '',
        monitor_path: '',
        monitor_path_params: []
      },
      monitorFormRules: {
        wxappid: [{ required: true, message: '请选择小程序', trigger: 'change' }],
        monitor_path: [{ required: true, message: '请选择页面', trigger: 'change' }]
      },
      sourcesForm: {
        monitor_id: '',
        sourceIds: []
      },
      sourcesParams: {
        page: 1,
        pageSize: 20,
        total_count: 0
      },
      monitorsParams: {
        page: 1,
        pageSize: 20,
        total_count: 0
      },
      monitorsList: [],
      wxaList: [],
      weappPagesList: [],
      sourceList: [],
      selectSourceList: []
    }
  },
  computed: {
    ...mapGetters(['wxapp_id', 'template_name'])
  },
  mounted () {
    // if (this.$route.query && this.$route.query.app_id) {
    //   this.wxapp_id = this.$route.query.app_id
    // }
    this.getMonitorsList()
  },
  methods: {
    saveMonitor: function () {
      // 保存监控链接
      var that = this
      this.$refs['monitorForm'].validate((valid) => {
        if (valid) {
          that.wxaList.forEach(function (item) {
            if (item.authorizer_appid == that.monitorForm.wxappid) {
              that.monitorForm.nick_name = item.nick_name
            }
          })
          let params = {
            monitor_id: '',
            wxappid: that.wxapp_id,
            monitor_path: that.monitorForm.monitor_path,
            monitor_path_params: that.monitorForm.monitor_path_params,
            page_name: that.monitorForm.page_name
          }

          addMonitors(params)
            .then((response) => {
              that.dialogVisibleMonitors = false
              that.getMonitorsList()
            })
            .catch((error) => {
              this.$message({
                type: 'error',
                message: '保存监控监控错误'
              })
            })
        } else {
          return false
        }
      })
    },
    manageSources: function (monitorId) {
      var that = this
      this.sourcesForm.monitor_id = monitorId
      this.sourcesParams.page = 1
      this.dialogVisibleSources = true
      getRelSources(monitorId).then((response) => {
        that.selectSourceList = []
        that.sourcesForm.sourceIds = []
        response.data.data.forEach((row) => {
          that.sourcesForm.sourceIds.push(row.source_id)
          that.selectSourceList.push({
            sourceId: row.source_id,
            sourceName: row.source_name
          })
        })
        this.getSourcesLists()
      })
    },
    saveSources: function () {
      saveSources(this.sourcesForm)
        .then((response) => {
          this.dialogVisibleSources = false
          this.cancelSourcesDialog()
          this.getMonitorsList()
        })
        .catch((error) => {
          this.$message({
            type: 'error',
            message: '关联来源保存错误'
          })
        })
    },
    getWxaList: function () {
      // 获取授权的小程序列表
      getWxaAuthList().then((response) => {
        this.wxaList = response.data.data.list
      })
    },
    resetMonitorsForm: function () {
      // 重置添加监控链接表单
      if (this.$refs['monitorForm']) {
        this.$refs['monitorForm'].resetFields()
      }
      this.monitorForm.monitor_path_params = []
      // this.weappPagesList = []
    },
    cancelMonitorsDialog: function () {
      //关闭添加监控链接对话框
      this.resetMonitorsForm()
      this.dialogVisibleMonitors = false
    },
    cancelSourcesDialog: function () {
      //关闭管理来源对话框
      this.dialogVisibleSources = false
      this.sourcesForm.monitor_id = ''
      this.sourcesForm.sourceIds = []
      this.selectSourceList = []
      this.sourceList = []
      this.sourcesParams.page = 1
      this.sourcesParams.total_count = 0
    },
    addMonitors: function () {
      this.dialogVisibleMonitors = true
      // 获取小程序列表
      this.wxappChange()
      // 获取来源列表
      this.getSourcesLists()
      // 重置添加表单
      this.resetMonitorsForm()
    },
    getSourcesLists: function () {
      let params = { page: this.sourcesParams.page, pageSize: this.sourcesParams.pageSize }
      getSourcesList(params)
        .then((response) => {
          let list = []
          response.data.data.list.forEach((row) => {
            let index = -1
            if (this.sourcesForm.sourceIds) {
              index = this.sourcesForm.sourceIds.indexOf(row.sourceId)
            }
            //如果未选中
            if (index === -1) {
              list.push(row)
            }
          })
          if (this.selectSourceList) {
            this.sourceList = list.concat(this.selectSourceList)
          } else {
            this.sourceList = list
          }
          this.sourcesParams.total_count = response.data.data.total_count
        })
        .catch((error) => {
          this.$message({
            type: 'error',
            message: '获取来源信息出错'
          })
        })
    },
    wxappChange: function () {
      // 获取小程序对应的页面信息
      if (this.wxapp_id) {
        let params = { wxappid: this.wxapp_id }
        getWxappPages(params).then((response) => {
          this.weappPagesList = response.data.data
        })
      }
    },
    pathParamsChange: function (val) {
      var that = this
      this.weappPagesList.forEach(function (item) {
        if (item.page == val) {
          that.monitorForm.monitor_path_params = item.pathParams
          // that.monitorForm.page_name = item.label
          that.$set(that.monitorForm, 'page_name', item.label)
        }
      })
    },
    optionChange: function (val) {
      var that = this
      that.monitorForm.monitor_path_params.forEach(function (item) {
        if (item.option && item.option.length > 0) {
          item.option.forEach((item) => {
            if (item.value == val) {
              that.monitorForm = Object.assign({}, that.monitorForm, { page_name: item.label })
            }
          })
        }
      })
    },
    removeMinotor: function (index, row) {
      this.$confirm('此操作将删除该监控页面, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteMonitors(row.monitorId)
            .then((response) => {
              this.$message({
                message: '删除监控页面成功',
                type: 'success',
                duration: 2 * 1000
              })
              this.getMonitorsList()
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '删除监控页面失败'
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
    handleCurrentChange: function (page_num) {
      this.monitorsParams.page = page_num
      this.getMonitorsList()
    },
    handleCurrentSourceChange: function (page_num) {
      this.sourcesParams.page = page_num
      this.selectSourceList = []
      this.sourceList.forEach((row) => {
        let index = this.sourcesForm.sourceIds.indexOf(row.sourceId)
        if (index != -1) {
          this.selectSourceList.push(row)
        }
      })
      this.getSourcesLists()
    },
    getMonitorsList: function () {
      console.log(this.wxapp_id)

      this.loading = true
      let params = {
        page: this.monitorsParams.page,
        pageSize: this.monitorsParams.pageSize,
        wxappid: this.wxapp_id
      }
      listMonitors(params)
        .then((response) => {
          this.monitorsList = response.data.data.list
          this.monitorsParams.total_count = response.data.data.total_count
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: '获取监控页面列表信息出错'
          })
        })
    }
  }
}
</script>
<style scoped lang="scss">
.refresh {
  color: #38f;
  cursor: pointer;
}
.el-button a {
  color: #fff;
}
.el-transfer {
  text-align: center;
  padding: 10px 0 20px;
}
</style>
<style type="text/css" lang="scss">
.sources-dialog {
  .el-transfer-panel {
    text-align: left;
    width: 270px;
    .el-transfer-panel__body.is-with-footer {
      box-sizing: content-box;
    }
  }
}
</style>
