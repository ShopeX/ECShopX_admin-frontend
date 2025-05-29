<style lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}
.sp-filter-form-item.label .form-item__label {
  white-space: nowrap !important;
}
</style>

<template>
  <div>
    <template v-if="$route.path.indexOf('editor') === -1">
      <SpPlatformTip h5 app pc alipay />
      <div class="action-container">
        <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="addActivityData">
          添加活动
        </el-button>
      </div>

      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
        <SpFilterFormItem prop="regionauth_id" label="区域:">
          <el-select v-model="params.regionauth_id" placeholder="请选择" clearable>
            <el-option
              v-for="item in areasList"
              :key="item.template_id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="name" label="活动名称:">
          <el-input v-model="params.name" placeholder="请输入商品名称" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="seckill_id" label="活动ID:">
          <el-input v-model="params.seckill_id" placeholder="请输入活动ID" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="create_time" label="创建时间:">
          <el-date-picker
            v-model="params.create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            start-placeholder="开始日期"
            ange-separator="至"
            end-placeholder="结束日期"
            style="width: 100%"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="po_code" label="PO编码:">
          <el-input v-model="params.po_code" placeholder="请输入PO编码" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="budget_code" label="Budget code:">
          <el-input v-model="params.budget_code" placeholder="请输入Budget code" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="activity_time" label="活动时间:">
          <el-date-picker
            v-model="params.activity_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            start-placeholder="开始日期"
            ange-separator="至"
            end-placeholder="结束日期"
            style="width: 100%"
          />
        </SpFilterFormItem>
      </SpFilterForm>

      <el-tabs v-model="params.status" type="card" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.name"
          :name="item.activeName"
        >
          <el-table v-loading="loading" border :data="tableList" :height="wheight - 200">
            <el-table-column prop="seckill_id" width="100" label="活动ID" />
            <el-table-column prop="activity_name" label="活动名称" min-width="180" />
            <el-table-column prop="regionauth_name" min-width="150" label="区域" />
            <el-table-column prop="created_date" label="创建时间" min-width="150" />
            <el-table-column prop="po_code" width="120" label="PO编码">
              <template slot-scope="scope">
                {{ scope.row.finance_data?.po_code }}
              </template>
            </el-table-column>
            <el-table-column prop="budget_code" width="120" label="Budget code">
              <template slot-scope="scope">
                {{ scope.row.finance_data?.budget_code }}
              </template>
            </el-table-column>
            <el-table-column label="活动时间" min-width="150">
              <template slot-scope="scope">
                <div>{{ scope.row.activity_start_date }}</div>
                <div>~</div>
                <div>{{ scope.row.activity_end_date }}</div>
              </template>
            </el-table-column>
            <el-table-column min-width="140" label="状态">
              <template slot-scope="scope">
                <span
                  v-if="scope.row.audit_status == 'processing' && scope.row.approve_status == ''"
                  >待审核</span
                >
                <span v-if="scope.row.audit_status == 'rejected' && scope.row.approve_status == ''">
                  <el-tooltip
                    :content="scope.row.rejected_reason"
                    placement="bottom"
                    effect="light"
                  >
                    <span>审核拒绝</span>
                  </el-tooltip>
                </span>
                <span v-if="scope.row.audit_status == 'approved' && scope.row.approve_status == ''"
                  >审核通过</span
                >
                <span
                  v-if="scope.row.audit_status == 'approved' && scope.row.approve_status == 'on'"
                >
                  已上架
                  <div :style="{ color: scope.row.status == 'waiting' ? '#68A2F2' : '#009900' }">
                    {{ scope.row.status == 'waiting' ? '活动未开始' : '活动进行中' }}
                  </div>
                </span>
                <span
                  v-if="scope.row.audit_status == 'approved' && scope.row.approve_status == 'down'"
                  >已下架</span
                >
              </template>
            </el-table-column>
            <el-table-column min-width="70" prop="source_name" label="店铺" />
            <el-table-column label="操作" width="250">
              <template slot-scope="scope">
                <ActionListView :list="actionsList" :row="scope.row" />
                <!-- <a v-show="false" ref="download" :href="downloadUrl" :download="downloadfilename" />
                <template v-if="scope.row.edit_btn == 'Y'">
                  <el-button
                    v-if="editActionVisible(scope.row)"
                    type="text"
                    @click="editAction(scope.$index, scope.row)"
                  >
                    编辑活动
                  </el-button>
                </template>
                <el-button
                  v-if="editActionVisible(scope.row)"
                  type="text"
                  @click="updateStatusCommunityAction(scope.row)"
                >
                  终止活动
                </el-button>
                <el-button
                  v-if="scope.row.status == 'it_has_ended'"
                  type="text"
                  @click="editAction(scope.$index, scope.row)"
                >
                  查看活动
                </el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <div v-if="page.total > page.pageSize" class="content-center content-top-padded">
            <el-pagination
              background
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

    <el-dialog title="活动支持店铺列表" :visible.sync="dialogVisible" width="50%">
      <el-table v-loading="loading" :data="distributors.distributor_info" :height="wheight - 500">
        <el-table-column prop="name" label="店铺名称" min-width="180" />
        <el-table-column prop="address" label="地址" min-width="180" />
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="uploadActionWxaCode(scope.$index, distributors, scope.row.distributor_id)"
            >
              下载小程序码
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <compUpdateLogs v-model="updateLogsDialog" :list="updateLogsList" />
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getDefaultCurrency } from '@/api/company'
import { seckillActivityUpdateStatus, seckillActivityWxcode, removeMarketingActivity, deleteSeckillactivity } from '@/api/promotions'
import { pageMixin } from '@/mixins'
import ActionListView from '@/components/actionListView'
import compUpdateLogs from '../comps/comp-update-logs'

export default {
  provide() {
    return {
      refresh: this.refresh
    }
  },
  components: {
    ActionListView,
    compUpdateLogs
  },
  mixins: [pageMixin],
  props: ['getStatus'],
  data() {
    const initialParams = {
      activity_time: [],
      create_time: [],
      status: '0',
      name: undefined,
      seckill_type: 'limited_time_sale',
      regionauth_id:undefined,
      seckill_id:undefined,
      po_code:undefined,
      budget_code:undefined,
    }

    return {
      initialParams,
      params: {
        ...initialParams
      },
      downloadfilename: '',
      downloadUrl: '',
      loading: false,
      updateLogsDialog:false,
      updateLogsList:[],
      communityVisible: false,
      couponVisible: false,
      goodsVisible: false,
      goodsList: [],
      goodsCount: 0,
      distributors: [],
      goodsPageSize: 10,
      goodsPage: 1,
      nowActivity: '',
      cursymbol: '',
      dialogVisible: false,
      currency: {},
      tabList: [
        { name: '全部', activeName: '0' },
        { name: '待审核', activeName: '1' },
        { name: '审核通过', activeName: '2' },
        { name: '审核拒绝', activeName: '3' },
        { name: '已上架', activeName: '4' },
        { name: '已下架', activeName: '5' },
      ],
      areasList:[],
      actionsList: [
        {
          name: '编辑',
          type: 'button',
          key: 'edit',
          buttonType: 'text',
          visible: (row) => {
            //除了已上架，其他都展示
            return !(row.audit_status == 'approved' && row.approve_status == 'on')
          },
          action: {
            handler: ([row]) => {
              this.editActivityAction(row)
            }
          }
        },
        {
          name: '审核',
          type: 'button',
          key: 'review',
          buttonType: 'text',
          visible: (row) => {
            //只有待审核展示
            return (row.audit_status == 'processing' && row.approve_status == '')
          },
          action: {
            handler: ([row]) => {
              this.editActivityAction(row, 'isReview')
            }
          }
        },
        {
          name: '上架',
          type: 'button',
          key: 'put',
          buttonType: 'text',
          visible: (row) => {
            //审核通过和已下架展示
            // scope.row.audit_status == 'approved' && scope.row.approve_status == ''
            // scope.row.audit_status == 'approved' && scope.row.approve_status == 'down'
            return (
              row.audit_status == 'approved' &&
              (row.approve_status == '' || row.approve_status == 'down')
            )
          },
          action: {
            handler: ([row]) => {
              this.handleOnOff(row)
            }
          }
        },
        {
          name: '下架',
          type: 'button',
          key: 'takeoff',
          buttonType: 'text',
          visible: (row) => {
            //已上架展示
            return row.audit_status == 'approved' && row.approve_status == 'on'
          },
          action: {
            handler: ([row]) => {
              this.handleOnOff(row, 'isOff')
            }
          }
        },
        {
          name: '查看详情',
          type: 'button',
          key: 'detail',
          buttonType: 'text',
          visible: (row) => {
            return 1
          },
          action: {
            handler: ([row]) => {
              this.editActivityAction(row,'isnodata')
            }
          }
        },
        {
          name: '日志',
          type: 'button',
          key: 'logs',
          buttonType: 'text',
          visible: (row) => {
            return 1
          },
          action: {
            handler: ([row]) => {
              this.logAction(row)
            }
          }
        },
        {
          name: '删除',
          type: 'button',
          key: 'delete',
          buttonType: 'text',
          visible: (row) => {
            //待审核和审核拒绝展示
            // scope.row.audit_status == 'processing' && scope.row.approve_status == ''
            // scope.row.audit_status == 'rejected' && scope.row.approve_status == ''
            return (
              (row.audit_status == 'processing' || row.audit_status == 'rejected') &&
              row.approve_status == ''
            )
          },
          action: {
            handler: ([row]) => {
              this.deleteActivityAction(row)
            }
          }
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    getStatus(val) {
      if (val) {
        this.fetchList()
      }
    }
  },
  mounted() {
    
    this.getCurrencyInfo()
    this.getAreaList()
  },
  methods: {
    async getAreaList(){
      // 查询区域数据
     const res = await this.$api.regionauth.getRegionauth()
     this.areasList =  res?.list?.map((el) => ({
          value: el.regionauth_id,
          label: el.regionauth_name
        }))
        this.params.regionauth_id =  this.areasList[0]?.value
        this.fetchList()
    },
    editActionVisible({ status, source_id }) {
      if (status !== 'it_has_ended') {
        if (this.IS_ADMIN() && source_id == '0') {
          return true
        }
        if (this.IS_DISTRIBUTOR()) {
          return true
        }
      }
      return false
    },
    getParams() {
      const time = {}
      const activity_time = this.params.activity_time
      if (activity_time && activity_time.length > 0) {
        time.start_time = this.dateStrToTimeStamp(activity_time[0] + ' 00:00:00')
        time.end_time = this.dateStrToTimeStamp(activity_time[1] + ' 23:59:59')
      }

      const create_time = this.params.create_time
      if (create_time && create_time.length > 0) {
        time.create_start_time = this.dateStrToTimeStamp(create_time[0] + ' 00:00:00')
        time.create_end_time = this.dateStrToTimeStamp(create_time[1] + ' 23:59:59')
      }
      let params = {
        ...this.params,
        status: this.params.status === 'all' ? undefined : this.params.status,
        activity_time: [],
        create_time: [],
        ...time
      }
      const statusMap =  {
          0:{status:undefined},
          1:{audit_status:'processing',approve_status:''},
          2:{audit_status:'approved',approve_status:''},
          3:{audit_status:'rejected',approve_status:''},
          4:{audit_status:'approved',approve_status:'on'},
          5:{audit_status:'approved',approve_status:'down'},
        }
      const statusParams = statusMap[this.params.status]
      if(statusParams){
        params = {
          ...params,
          ...statusParams
        }
      }
      delete params.status
      return params
    },
    async logAction({seckill_id}) {
      this.updateLogsDialog = true
      this.updateLogsList = []
      const {result} = await this.$api.promotions.getLogInfo({
        relation_id:seckill_id,
        promotion_type:'seckill'
      })
      this.updateLogsList = result
    },
    editActivityAction(row, type) {
      let path = `${this.matchHidePage('editor/') + row.seckill_id}${
        type ? `?${type}=1` : ''
      }`
      this.$router.push({ path })
    },
    deleteActivityAction(row) {
      var msg = '你确定要删除该活动吗?'
      this.$confirm(msg, '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            deleteSeckillactivity({ seckill_id: row.seckill_id }).then((res) => {
              this.fetchList()
              this.$message({
                message: '删除活动成功',
                type: 'success',
                duration: 5 * 1000
              })
            })
          }
          done()
        }
      })
    },
    async handleOnOff(row, isOff) {
      const msg = `是否确认${isOff ? '下' : '上'}架该活动？`
      this.$confirm(msg, '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            this.$api.promotions
              .approvePromotion({
                relation_id: row.seckill_id,
                approve_status: isOff ? 'down' : 'on',
                promotion_type: 'seckill'
              })
              .then((res) => {
                this.$message({
                  message: `${isOff ? '下' : '上'}架成功`,
                  type: 'success',
                  duration: 3 * 1000
                })
                done()
                this.fetchList()
              }).finally(() => {
                instance.confirmButtonLoading = false
              })
          }
          done()
        }
      })
    },
    onSearch() {
      this.page.pageIndex = 1
      this.$nextTick(() => {
        this.fetchList()
      })
    },
    onReset() {
      this.params = { ...this.initialParams }
      this.onSearch()
    },
    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.getParams()
      }
      const { list, total_count } = await this.$api.promotions.seckillActivityGetList(params)
      this.tableList = list
      this.page.total = total_count
      this.loading = false

      this.loading = false
    },
    uploadActionWxaCode(index, row, distributor_id = 0) {
      var params = { seckill_type: row.seckill_type, seckill_id: row.seckill_id }
      if (distributor_id) {
        params.distributor_id = distributor_id
      } else if (row.distributor_id === null) {
        params.distributor_id = 0
      } else if (row.distributor_id.length === 1) {
        params.distributor_id = row.distributor_id[0]
      } else if (row.distributor_id.length > 1) {
        this.distributors = row
        this.dialogVisible = true
        return
      }

      this.downloadfilename = row.activity_name + '.jpg'
      seckillActivityWxcode(params).then((res) => {
        this.downloadUrl = res.data.data.code
        setTimeout(() => {
          this.$refs.download.click()
        }, 200)
      })
    },
    handleTabClick(tab, event) {
      this.onSearch()
    },
    addActivityData() {
      // 添加物料弹框
      this.$router.push({ path: this.matchHidePage('editor') })
    },
    editAction(index, row) {
      // 编辑物料弹框
      this.$router.push({ path: this.matchHidePage('editor/') + row.seckill_id })
    },
    updateStatusCommunityAction(row) {
      var msg = '此操作将永久终止该活动, 是否继续?'
      this.$confirm(msg, '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            seckillActivityUpdateStatus({ seckill_id: row.seckill_id }).then((response) => {
              this.fetchList()
              this.$message({
                message: '修改活动状态成功',
                type: 'success',
                duration: 5 * 1000
              })
            })
          }
          done()
        }
      })
    },
    dateChange(val) {
      this.params.status = ''
      if (val && val.length > 0) {
        this.params.start_time = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.params.end_time = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.params.start_time = ''
        this.params.end_time = ''
      }
      this.params.page = 1
      this.fetchList()
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    viewCouponList(ids) {
      this.couponVisible = true
    },
    handleCancel() {
      this.communityVisible = false
      this.couponVisible = false
      this.goodsVisible = false
    },
    getCurrencyInfo() {
      getDefaultCurrency().then((res) => {
        this.currency = res.data.data
        this.cursymbol = this.currency.symbol
      })
    },
    updateActivityData(params) {
      updateActivityItemData(params).then((res) => {})
    },
    editItemPrice(row) {
      let form = {
        'id': row.id,
        'item_id': row.item_id,
        'activity_price': row.activity_price,
        'vip_price': row.vip_price,
        'svip_price': row.svip_price,
        'activity_store': row.activity_store,
        'points': row.points
      }
      this.updateActivityData(form)
    },
    refresh() {
      this.fetchList()
      this.getCurrencyInfo()
    }
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 10px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.icon-search-plus {
  cursor: pointer;
}
.text-muted {
  color: #999;
}
</style>
