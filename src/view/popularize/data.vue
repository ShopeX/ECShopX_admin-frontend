<template>
  <div>
    <div v-if="$route.path.indexOf('_child') === -1 && $route.path.indexOf('detail') === -1">
      <shop-select distributors @update="storeChange" @init="initChange" />
      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="mobile" label="会员手机号:">
          <el-input v-model="params.mobile" class="input-m" placeholder="请输入会员手机号" />
        </SpFilterFormItem>
        <!-- <SpFilterFormItem prop="username" label="会员名称:">
          <el-input
            v-model="params.username"
            class="input-m"
            placeholder="请输入会员名称"
          />
        </SpFilterFormItem> -->
      </SpFilterForm>
      <div class="action-container">
        <div class="action-container">
          <el-button-group>
            <export-tip
              v-if="loginType !== 'distributor' && $route.path.indexOf('sellers') === -1"
              @exportHandle="exportPopularizeData"
            >
              <el-button type="primary" plain> 导出业绩统计 </el-button>
            </export-tip>
          </el-button-group>
        </div>

        <export-tip
          v-if="loginType == 'distributor' || $route.path.indexOf('sellers') !== -1"
          @exportHandle="exportPopularizeStatic"
        >
          <el-button type="primary" plain> 导出业绩订单统计 </el-button>
        </export-tip>

        <export-tip @exportHandle="exportPopularizeOrder">
          <el-button type="primary" plain> 导出业绩订单详细 </el-button>* 下载订单详细日期
        </export-tip>
        <SpFilterFormItem prop="tag_id" label="下载日期:">
          <el-date-picker
            v-model="created"
            unlink-panels
            type="daterange"
            align="right"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            prefix-icon="null"
            :picker-options="pickerOptions"
            @change="dateChange"
          />
        </SpFilterFormItem>
      </div>

      <el-table
        v-loading="loading"
        border
        :data="list"
        :height="wheight - 170"
        element-loading-text="数据加载中"
        :default-sort="{ prop: 'bind_date', order: 'descending' }"
      >
        <el-table-column prop="username" label="姓名" />
        <el-table-column prop="mobile" label="手机号" width="150">
          <template slot-scope="scope">
            <i v-if="scope.row.mobile" class="el-icon-mobile" />
            {{ scope.row.mobile }}
            <el-tooltip
              v-if="scope.row.mobile && datapass_block == 0"
              effect="dark"
              content="复制"
              placement="top-start"
            >
              <i
                v-clipboard:copy="scope.row.mobile"
                v-clipboard:success="onCopy"
                class="el-icon-document-copy"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- v-if="$route.path.indexOf('_child') === -1  -->
        <el-table-column
          v-if="loginType !== 'distributor' && $route.path.indexOf('sellers') === -1"
          label="可提现"
        >
          <template slot-scope="scope"> {{ scope.row.cashWithdrawalRebate / 100 }}元 </template>
        </el-table-column>
        <el-table-column
          v-if="loginType !== 'distributor' && $route.path.indexOf('sellers') === -1"
          label="已提现"
        >
          <template slot-scope="scope"> {{ scope.row.payedRebate / 100 }}元 </template>
        </el-table-column>
        <el-table-column
          v-if="loginType !== 'distributor' && $route.path.indexOf('sellers') === -1"
          label="申请提现"
        >
          <template slot-scope="scope">
            {{ scope.row.freezeCashWithdrawalRebate / 100 }}元
          </template>
        </el-table-column>
        <el-table-column
          v-if="loginType !== 'distributor' && $route.path.indexOf('sellers') === -1"
          label="未结算"
        >
          <template slot-scope="scope"> {{ scope.row.noCloseRebate / 100 }}元 </template>
        </el-table-column>
        <el-table-column
          v-if="loginType !== 'distributor' && $route.path.indexOf('sellers') === -1"
          label="未结算积分"
        >
          <template slot-scope="scope"> {{ scope.row.noClosePoint || 0 }}积分 </template>
        </el-table-column>
        <el-table-column
          v-if="loginType !== 'distributor' && $route.path.indexOf('sellers') === -1"
          label="佣金总额"
        >
          <template slot-scope="scope"> {{ scope.row.rebateTotal / 100 }}元 </template>
        </el-table-column>
        <el-table-column
          v-if="loginType !== 'distributor' && $route.path.indexOf('sellers') === -1"
          label="积分总额"
        >
          <template slot-scope="scope"> {{ scope.row.pointTotal || 0 }}积分 </template>
        </el-table-column>
        <el-table-column
          v-if="loginType !== 'distributor' && $route.path.indexOf('sellers') === -1"
          label="商品总额"
        >
          <template slot-scope="scope"> {{ scope.row.itemTotalPrice / 100 }}元 </template>
        </el-table-column>

        <el-table-column
          v-if="loginType == 'distributor' || $route.path.indexOf('sellers') !== -1"
          label="店铺"
        >
          <template slot-scope="scope">
            {{ scope.row.store_name }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="loginType == 'distributor' || $route.path.indexOf('sellers') !== -1"
          label="未结算"
        >
          <template slot-scope="scope"> {{ scope.row.rebate_sum_noclose / 100 }}元 </template>
        </el-table-column>
        <el-table-column
          v-if="loginType == 'distributor' || $route.path.indexOf('sellers') !== -1"
          label="佣金总额"
        >
          <template slot-scope="scope"> {{ scope.row.rebate_sum / 100 }}元 </template>
        </el-table-column>
        <el-table-column
          v-if="loginType == 'distributor' || $route.path.indexOf('sellers') !== -1"
          label="商品总额"
        >
          <template slot-scope="scope"> {{ scope.row.price_sum / 100 }}元 </template>
        </el-table-column>

        <el-table-column label="操作" width="90">
          <template slot-scope="scope">
            <el-button icon="edit" type="text" class="btn-gap" @click="detail(scope.row)">
              分佣详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="content-padded content-center">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :current-page.sync="page.pageIndex"
          :page-sizes="[10, 20, 50]"
          :total="total_count"
          :page-size="page.pageSize"
          @current-change="onCurrentChange"
          @size-change="onSizeChange"
        />
      </div>
    </div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  getPopularizeList,
  exportPopularizeData,
  exportPopularizeStatic,
  exportPopularizeOrder
} from '../../api/promotions'
import { pageMixin } from '@/mixins'
import shopSelect from '@/components/shopSelect'

export default {
  components: {
    shopSelect
  },
  mixins: [pageMixin],
  data() {
    return {
      params: {
        mobile: '',
        username: '',
        pathSource: ''
      },
      list: [],
      loading: false,
      row: {},
      username: '',
      total_count: 0,

      created: '',
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },

      datapass_block: 1
    }
  },
  mounted() {
    this.loginType = this.$store.getters.login_type
    this.params.pathSource = this.$route.path
    console.log(this.$route.path)
    console.log(this.$route.path)
    console.log(this.$route.path)
    console.log(this.$route.path)
    console.log(this.loginType)
    console.log(this.loginType)
    console.log(this.loginType)
    this.fetchList()
  },
  methods: {
    exportPopularizeData() {
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.params
      }
      exportPopularizeData(params).then((res) => {
        if (res.data.data.status == true) {
          this.$message({
            type: 'success',
            message: '已加入执行队列，请在设置-导出列表中下载'
          })
        } else {
          this.$message({
            type: 'error',
            message: '导出失败'
          })
        }
      })
    },

    storeChange(params) {
      params && params.shop_id
      this.params.distributor_id = params.shop_id
      this.params.page = 1
      this.getList()
    },
    initChange() {
      this.shopId = ''
    },

    exportPopularizeStatic() {
      console.log(this.created)
      console.log(this.created[0])
      console.log(this.created[1])
      let date_start = this.created[0]
      let date_end = this.created[1]
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        date_start,
        date_end,
        ...this.params
      }
      exportPopularizeStatic(params).then((res) => {
        if (res.data.data.status == true) {
          this.$message({
            type: 'success',
            message: '已加入执行队列，请在设置-导出列表中下载'
          })
        } else {
          this.$message({
            type: 'error',
            message: '导出失败'
          })
        }
      })
    },

    exportPopularizeOrder() {
      console.log(this.created)
      console.log(this.created[0])
      console.log(this.created[1])
      let date_start = this.created[0]
      let date_end = this.created[1]
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        date_start,
        date_end,
        ...this.params
      }
      exportPopularizeOrder(params).then((res) => {
        if (res.data.data.status == true) {
          this.$message({
            type: 'success',
            message: '已加入执行队列，请在设置-导出列表中下载'
          })
        } else {
          this.$message({
            type: 'error',
            message: '导出失败'
          })
        }
      })
    },
    onCopy() {
      this.$notify.success({
        message: '复制成功',
        showClose: true
      })
    },
    detail(row) {
      let routeData = this.$router.resolve({
        // path: '/marketing/popularize/popularizelist/detail',
        path: this.matchHidePage('detail'),
        query: { user_id: row.user_id, distributor_id: row.distributor_id }
      })
      window.open(routeData.href, '_blank')
    },
    fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.params
      }
      getPopularizeList(params).then((res) => {
        this.list = res.data.data.list
        this.total_count = Number(res.data.data.total_count)
        this.datapass_block = res.data.data.datapass_block
        this.loading = false
      })
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  }
}
</script>
<style scoped lang="scss">
.grade-setting-col {
  line-height: 40px;
}
.btn-gap {
  margin-left: 10px;
}
.sp-filter-form {
  margin-bottom: 16px;
}
</style>
