<template>
  <div>
    <div v-if="$route.path.indexOf('detail') === -1">
      <div class="content-bottom-padded">
        <el-form ref="listForm" :inline="true" :model="listForm" label-width="80px">
          <el-form-item label="区域">
            <el-select v-model="listForm.regionauth_id" placeholder="请选择区域">
              <el-option v-for="(item) in areas" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="页面路径">
            <el-input v-model="listForm.monitorPath" placeholder="请输入" />
          </el-form-item>
          <div class="flex-right">
            <el-button size="small" @click="handleReset">
              重置
            </el-button>
            <el-button size="small" type="primary" @click="getSearchDataList()">
              搜索
            </el-button>
          </div>
        </el-form>
        <el-row>
          <el-col :span="12">
            <el-button type="primary" @click="addMonitors">
              新增监控链接
            </el-button>
          </el-col>
        </el-row>
      </div>
      <el-table v-loading="loading" :data="monitorsList" style="width: 100%">
        <el-table-column prop="monitorId" label="监控ID" />
        <el-table-column prop="monitorPath" label="监控页面">
          <template slot-scope="scope">
            <span>{{ scope.row.monitorPath }}</span><span v-show="scope.row.monitorPathParams != ''">?{{
              scope.row.monitorPathParams }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="pageName" label="页面描述" />
        <el-table-column prop="regionauth_name" label="区域" />
        <el-table-column prop="nickName" label="小程序" />
        <el-table-column prop="created" label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.created | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <a @click="removeMinotor(scope.$index, scope.row)">删除</a> &nbsp;
            <a @click="manageSources(scope.row.monitorId)">管理来源</a> &nbsp;
            <router-link :to="{ path: matchHidePage('detail'), query: { monitorId: scope.row.monitorId } }">
              监控详情
            </router-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="content-center content-top-padded">
        <el-pagination background layout="total, sizes, prev, pager, next, jumper"
          :current-page.sync="monitorsParams.page" :page-sizes="[10, 20, 50]" :total="monitorsParams.total_count"
          :page-size="monitorsParams.pageSize" @current-change="handleCurrentChange" @size-change="handleSizeChange" />
      </div>
      <el-dialog title="新增跟踪链接" :visible="dialogVisibleMonitors" :close-on-click-modal="false"
        :before-close="cancelMonitorsDialog">
        <el-form ref="monitorForm" :model="monitorForm" :rules="monitorFormRules">
          <!-- <el-form-item label="区域" prop="regionauth_id" :label-width="formLabelWidth">
            <el-select v-model="monitorForm.regionauth_id" placeholder="请选择区域">
              <el-option v-for="(item) in areas" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item prop="monitor_path" label="页面" :label-width="formLabelWidth">
            <el-select v-model="monitorForm.monitor_path" filterable placeholder="选择页面" style="width: 233px"
              @change="pathParamsChange">
              <el-option v-for="item in weappPagesList" :key="item.page" :label="item.label" :value="item.page" />
            </el-select>
          </el-form-item> -->
          <el-form-item prop="link_type" label="页面" :label-width="formLabelWidth">
            <el-radio-group v-model="monitorForm.link_type" class="linktype-radio">
              <el-radio :label="0"> 选择路径 </el-radio>
              <el-radio :label="1" disabled>自定义路径</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="monitorForm.link_type == 0" :label-width="formLabelWidth">
            <el-col :span="10">
              <el-button class="monito_select_btn" @click="handleSelectPage">
                <span v-if="monitorForm.page_type">{{ monitorForm.page_type + ':' }}</span>{{ monitorForm.page_title }}
              </el-button>
            </el-col>
          </el-form-item>
          <el-form-item prop="page_name" label="页面描述" :label-width="formLabelWidth">
            <el-col :span="10">
              <el-input v-model="monitorForm.page_name" />
            </el-col>
          </el-form-item>
          <el-form-item v-for="(item, index) in monitorForm.monitor_path_params" :key="item.param_name"
            :label="item.param_label" :prop="'monitor_path_params.' + index + '.value'" :label-width="formLabelWidth">
            <el-col :span="10">
              <span v-if="item.option && item.option.length > 0">
                <el-radio-group v-model="item.value" @change="optionChange">
                  <el-radio v-for="item in item.option" :key="item.value" :label="item.value" :value="item.value">{{
                    item.label }}</el-radio>
                </el-radio-group>
              </span>
              <span v-else>
                <el-input v-model="item.value" :disabled="item.disabled ? true : false" />
              </span>
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="resetMonitorsForm">
            重 置
          </el-button>
          <el-button type="primary" @click="saveMonitor">
            确 定
          </el-button>
        </div>
      </el-dialog>

      <el-dialog title="管理跟踪来源" :visible="dialogVisibleSources" class="sources-dialog" :close-on-click-modal="false"
        :before-close="cancelSourcesDialog">
        <template>
          <el-transfer v-model="sourcesForm.sourceIds" :titles="['来源名称列表', '已选中']"
            :props="{ key: 'sourceId', label: 'sourceName' }" :data="sourceList">
            <div slot="left-footer" class="transfer-footer view-flex view-flex-center">
              <el-pagination v-if="sourcesParams.total_count > sourcesParams.pageSize" small layout="prev, pager, next"
                :total="sourcesParams.total_count" :page-size="sourcesParams.pageSize"
                @current-change="handleCurrentSourceChange" />
            </div>
            <div slot="right-footer" class="transfer-footer" />
          </el-transfer>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleSources = false">
              取 消
            </el-button>
            <el-button v-debounce="saveSources" type="primary">
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
import { getRegionauth } from '@/api/regionauth'

export default {
  components: {
    timeChoose
  },
  data() {
    return {
      formLabelWidth: '120px',
      loading: false,
      dialogVisibleMonitors: false,
      dialogVisibleSources: false,
      listForm: {
        regionauth_id: '',
        monitorPath: ''
      },
      monitorForm: {
        monitor_id: '',
        nick_name: '',
        monitor_path: '',
        monitor_path_params: [],
        link_type: 0,
        regionauth_id: '',
        page_name: '',
        page_title: '选择页面',
        page_type: ''
      },
      monitorFormRules: {
        wxappid: [{ required: true, message: '请选择小程序', trigger: 'change' }],
        link_type: [{ required: true, message: '请选择页面', trigger: 'change' }],
        // regionauth_id: [{ required: true, message: '请选择区域', trigger: 'change' }],
        page_name: [{ required: true, message: '请输入页面描述', trigger: 'change' }],
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
        pageSize: 10,
        total_count: 0
      },
      monitorsList: [],
      wxaList: [],
      weappPagesList: [],
      sourceList: [],
      selectSourceList: [],
      wxappid: '',
      areas: [],
      pagesData: [],
    }
  },
  computed: {
    ...mapGetters(['template_name'])
  },
  mounted() {
    if (this.$route.query && this.$route.query.app_id) {
      this.wxappid = this.$route.query.app_id
    }
    this.getMonitorsList();
    // this.getRegionList();
  },
  methods: {
    handleReset() {
      this.listForm = {}
      this.getMonitorsList();
    },
    getSearchDataList() {
      this.getMonitorsList(this.listForm);
    },
    // 获取区域
    getRegionList() {
      getRegionauth().then((res) => {
        this.areas = res?.data?.data?.list?.map((el) => ({
          value: el.regionauth_id,
          label: el.regionauth_name,
          title: el.regionauth_name
        }))
      })
    },
    handleLink(type, id) {
      let info = {}
      switch (type) {
        case 'goods':
          info = { url: 'pages/item/espier-detail?id=' + id, page_name: '商品详情页' }
          break
        case 'custom_page':
          info = { url: 'pages/custom/custom-page?id=' + id, page_name: '商品详情页' }
          break
        case 'coupon':
          info = { url: 'subpages/marketing/coupon-detail?c=' + id, page_name: '券详情' }
          break
        case 'sale_category':
          info = { url: 'pages/item/list?cid=' + id, page_name: '销售分类' }
          break
        case 'category':
          info = { url: 'pages/category/index', page_name: '分类页' }
          break
        case 'store':
          info = { url: 'subpages/store/index?id=' + id, page_name: '店铺首页' }
          break
        case 'activity_collection':
          info = { url: 'subpages/marketing/limited-sale?kid=' + id, page_name: '活动集合页限时特惠' }
          break
        case 'vipgrades':
          info = { url: 'subpage/pages/vip/vipgrades', page_name: '活动页' }
          break
        case 'applyChief':
          info = { url: 'subpages/community/apply-chief?distributor_id=' + this.monitorForm.regionauth_id, page_name: '活动页' }
          break
        case 'recharge':
          info = { url: 'others/pages/recharge/index', page_name: '活动页' }
          break
        case 'purchase':
          info = { url: 'subpages/purchase/select-identity', page_name: '活动页' }
          break
        case 'pointShop':
          info = { url: 'subpages/pointshop/list', page_name: '活动页' }
          break
        case 'registActivity':
          info = { url: 'marketing/pages/member/activity-list', page_name: '活动页' }
          break
        case 'liveList':
          info = { url: 'subpages/live/list', page_name: '活动页' }
          break
        case 'zitiOrder':
          info = { url: 'subpages/store/ziti-list', page_name: '活动页' }
          break
        case 'group':
          info = { url: 'subpages/marketing/group-list', page_name: '活动页' }
          break
        case 'appointment':
          info = { url: 'subpages/marketing/group-list', page_name: '活动页' }
          break
        case 'shequGroup':
          info = { url: 'subpages/marketing/group-list', page_name: '活动页' }
          break
        case 'completeInfo':
          info = { url: 'subpages/member/complete-profile', page_name: '活动页' }
          break
        case 'couponCenter':
          info = { url: 'subpages/marketing/coupon-center', page_name: '活动页' }
          break
        case 'myCollect':
          info = { url: 'pages/member/item-fav', page_name: '活动页' }
          break
        case 'myInvoice':
          info = { url: 'subpages/trade/invoice-list', page_name: '活动页' }
          break
        case 'onlineService':
          info = { url: 'pages/chat/index', page_name: '活动页' }
          break
        case 'addressManage':
          info = { url: 'subpages/member/address-list', page_name: '活动页' }
          break
        case 'shopRanking':
          info = { url: 'subpages/store/shop-ranking?distributor_id=' + this.monitorForm.regionauth_id, page_name: '活动页' }
          break
        case 'pageIndex':
          info = { url: 'pages/index', page_name: '首页' }
          break
        default:
      }

      return info
    },
    //选择页面
    async handleSelectPage() {
      // if (!this.monitorForm.regionauth_id) {
      //   this.$message.error("请选择区域");
      //   return
      // }
      const tabs = [
        { label: '商品详情', name: 'goods' },
        // { label: '自定义页面', name: 'custom_page' },
        { label: '券详情', name: 'coupon' },
        // { label: '页面', name: 'link' },
        // { label: '秒杀', name: 'seckill' },
        // { label: '活动集合页', name: 'activity_collection' },
        // { label: '销售分类', name: 'sale_category' },
        // { label: '管理分类', name: 'category' },
        // { label: '店铺', name: 'store' },
      ]
      console.log(this.pagesData, 'pagesData---')
      const res = await this.$picker.path({
        multiple: false,
        data: this.pagesData.map((el) => el.rel_id),
        guide: 'share_page' 
      })
      console.log(res, 'res---')
      this.pagesData = [{
        ...res,
        page_type: tabs?.find((el) => el.name == res.linkPage)?.label,
        page_name: res?.title,
        custom_name: '',
        image: '',
        itemId: res.id,
        rel_id: res.id
      }]
      this.monitorForm.page_type = tabs?.find((el) => el.name == res.linkPage)?.label,
        this.monitorForm.page_title = res?.title
      const type = res?.linkPage == 'link' ? res.id : res?.linkPage
      const { page_name, url } = this.handleLink(type, res.id)
      this.monitorForm.page_name = res?.description || page_name
      this.monitorForm.monitor_path = url || ''

    },
    saveMonitor: function () {
      // 保存监控链接
      var that = this
      this.$refs['monitorForm'].validate((valid) => {
        if (valid) {
          console.log(that.monitorForm, 'monitorForm---')
          if (!that.monitorForm.page_type) {
            return this.$message.error("请选择页面");
          }
          that.wxaList.forEach(function (item) {
            if (item.authorizer_appid == that.monitorForm.wxappid) {
              that.monitorForm.nick_name = item.nick_name
            }
          })
          let dataParams = []
          const pathName = that.monitorForm.monitor_path && that.monitorForm.monitor_path.indexOf('?') > -1 && that.monitorForm.monitor_path.split('?')[0]
          const pathParams = that.monitorForm.monitor_path && that.monitorForm.monitor_path.indexOf('?') > -1 && (that.monitorForm.monitor_path.split('?')[1]).split('=');
          if (pathParams) {
            dataParams = [{ param_name: pathParams[0], value: pathParams[1] } ]
          } else {
            // dataParams = [{ param_name: 'r', value: that.monitorForm.regionauth_id }]
          }
          if (that.monitorForm.page_type == '券详情') {
            dataParams.push({ param_name: 't', value: '1' })
          }
          let params = {
            monitor_id: '',
            wxappid: that.wxappid,
            monitor_path: pathName || that.monitorForm.monitor_path,
            monitor_path_params: dataParams || [],
            page_name: that.monitorForm.page_name,
            // regionauth_id: this.monitorForm.regionauth_id
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
      if (this.sourcesForm.sourceIds.length == 0) {
        return this.$message.error("请选择来源");
      }
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
      this.monitorForm.page_type = ''
      this.monitorForm.page_name = ''
      this.monitorForm.page_title = '选择页面'
      this.monitorForm.monitor_path_params = []
      this.pagesData = []
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
      let wxappid = this.wxappid
      if (wxappid) {
        let params = { wxappid }
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
    handleSizeChange(pageSize) {
      this.monitorsParams.pageSize = pageSize
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
    getMonitorsList: function (info) {

      this.loading = true
      let params = {
        page: this.monitorsParams.page,
        pageSize: this.monitorsParams.pageSize,
        wxappid: this.wxappid,
        ...info
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

.flex-right {
  float: right
}

.monito_select_btn {
  width: 100%;
  background-color: #fff;
  border-color: var(--themeColor);
  color: var(--themeColor);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
