<template>
  <div>
    <div v-if="$route.path.indexOf('_child') === -1 && $route.path.indexOf('detail') === -1">
      <el-row :gutter="20">
        <el-col>
          <el-input
            v-model="identifier"
            class="input-m"
            placeholder="会员手机号"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchList"
            />
          </el-input>
          <el-input
            v-model="username"
            class="input-m"
            placeholder="会员名称"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchList"
            />
          </el-input>
          <el-button-group>
            <export-tip @exportHandle="exportPopularizeData">
              <el-button type="primary">
                导出推广员业绩
              </el-button>
            </export-tip>
          </el-button-group>
        </el-col>
      </el-row>
      <el-card>
        <el-table
          v-loading="loading"
          :data="list"
          :height="wheight - 170"
          element-loading-text="数据加载中"
          :default-sort="{ prop: 'bind_date', order: 'descending' }"
        >
          <el-table-column
            prop="username"
            label="姓名"
          />
          <el-table-column
            prop="mobile"
            label="手机号"
            width="150"
          >
            <template slot-scope="scope">
              <i
                v-if="scope.row.mobile"
                class="el-icon-mobile"
              />
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
          <el-table-column label="可提现">
            <template slot-scope="scope">
              {{ scope.row.cashWithdrawalRebate / 100 }}元
            </template>
          </el-table-column>
          <el-table-column label="已提现">
            <template slot-scope="scope">
              {{ scope.row.payedRebate / 100 }}元
            </template>
          </el-table-column>
          <el-table-column label="申请提现">
            <template slot-scope="scope">
              {{ scope.row.freezeCashWithdrawalRebate / 100 }}元
            </template>
          </el-table-column>
          <el-table-column label="未结算">
            <template slot-scope="scope">
              {{ scope.row.noCloseRebate / 100 }}元
            </template>
          </el-table-column>
          <el-table-column label="未结算积分">
            <template slot-scope="scope">
              {{ scope.row.noClosePoint || 0 }}积分
            </template>
          </el-table-column>
          <el-table-column label="佣金总额">
            <template slot-scope="scope">
              {{ scope.row.rebateTotal / 100 }}元
            </template>
          </el-table-column>
          <el-table-column label="积分总额">
            <template slot-scope="scope">
              {{ scope.row.pointTotal || 0 }}积分
            </template>
          </el-table-column>
          <el-table-column label="商品总额">
            <template slot-scope="scope">
              {{ scope.row.itemTotalPrice / 100 }}元
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="90"
          >
            <template slot-scope="scope">
              <el-button
                icon="edit"
                type="text"
                class="btn-gap"
                @click="detail(scope.row)"
              >
                分佣详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div
          v-if="total_count > params.pageSize"
          class="content-padded content-center"
        >
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :current-page.sync="params.page"
            :total="total_count"
            :page-size="params.pageSize"
            @size-change="handleSizeChange"
            @current-change="handlePage"
          />
        </div>
      </el-card>
    </div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getPopularizeList, exportPopularizeData } from '../../api/promotions'
export default {
  data () {
    return {
      params: {
        page: 1,
        pageSize: 14,
        mobile: '',
        username: ''
      },
      list: [],
      loading: false,
      row: {},
      identifier: '',
      username: '',
      total_count: 0,
      datapass_block: 1
    }
  },
  mounted () {
    this.getPopularizeListFun(this.params)
  },
  methods: {
    exportPopularizeData () {
      exportPopularizeData(this.params).then((res) => {
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
    onCopy () {
      this.$notify.success({
        message: '复制成功',
        showClose: true
      })
    },
    detail (row) {
      let routeData = this.$router.resolve({
        path: '/marketing/popularize/popularizelist/detail',
        query: { user_id: row.user_id }
      })
      window.open(routeData.href, '_blank')
    },
    // usernameSearch(val) {
    //   this.params.page = 1
    //   this.params.username = this.username
    //   this.getPopularizeListFun(this.params)
    // },
    // numberSearch(e) {
    //   this.params.page = 1
    //   this.params.mobile = this.identifier
    //   this.getPopularizeListFun(this.params)
    // },
    searchList () {
      this.params.page = 1
      this.params.username = this.username
      this.params.mobile = this.identifier
      this.getPopularizeListFun(this.params)
    },
    getPopularizeListFun (filter) {
      this.loading = true
      getPopularizeList(filter).then((res) => {
        this.list = res.data.data.list
        this.total_count = Number(res.data.data.total_count)
        this.datapass_block = res.data.data.datapass_block
        this.loading = false
      })
    },
    handlePage (page_num) {
      this.params.page = page_num
      this.getPopularizeListFun(this.params)
    },
    handleSizeChange (val) {
      this.params.pageSize = val
      this.getPopularizeListFun(this.params)
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
</style>
