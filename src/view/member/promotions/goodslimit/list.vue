<template>
  <div>
    <template v-if="$route.path.indexOf('editor') === -1">
      <SpPlatformTip h5 app alipay />
      <div class="action-container">
        <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="addLimitPromotion">
          添加限购商品活动
        </el-button>
      </div>

      <el-tabs v-model="params.status" type="card" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.name"
          :name="item.activeName"
        >
          <el-table
            v-loading="loading"
            :data="tableList"
            border
            style="width: 100%"
            element-loading-text="数据加载中"
          >
            <el-table-column prop="limit_id" width="60" label="编号" />
            <el-table-column prop="limit_name" label="活动名称" />
            <el-table-column prop="source_name" label="店铺" />
            <el-table-column label="开始时间" width="200">
              <template slot-scope="scope">
                <span>{{ scope.row.start_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="结束时间" width="200">
              <template slot-scope="scope">
                <span>{{ scope.row.end_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="类型" width="120">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 'waiting'">待开始</span>
                <span v-if="scope.row.status == 'ongoing'">进行中</span>
                <span v-if="scope.row.status == 'end'">已结束</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <div class="operating-icons">
                  <el-button
                    v-if="cancelActionVisible(scope.row)"
                    type="text"
                    @click="closeLimitPromotion(scope.row)"
                  >
                    取消
                  </el-button>
                  <el-button type="text" @click="showLimitPromotion(scope.row)"> 查看 </el-button>
                  <el-button
                    v-if="editlActionVisible(scope.row)"
                    type="text"
                    @click="updateLimitPromotion(scope.row)"
                  >
                    编辑
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="page.total > page.pageSize" class="content-padded content-center">
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
    <router-view />
  </div>
</template>
<script>
import { cancelLimitPromotions, getLimitPromotions } from '@/api/promotions'
import mixin, { pageMixin } from '@/mixins'
export default {
  mixins: [mixin, pageMixin],
  provide() {
    return {
      refresh: this.fetchList
    }
  },
  data() {
    const initialParams = {
      status: 'all'
    }
    return {
      initialParams,
      params: {
        ...initialParams
      },
      loading: false,
      tabList: [
        { name: '全部', activeName: 'all' },
        { name: '待开始', activeName: 'waiting' },
        { name: '进行中', activeName: 'ongoing' },
        { name: '已结束', activeName: 'end' }
      ]
    }
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    cancelActionVisible({ status, source_id }) {
      if (status == 'ongoing') {
        if (this.IS_ADMIN && source_id == '0') {
          return true
        }
        if (this.IS_DISTRIBUTOR) {
          return true
        }
      }
      return false
    },
    editlActionVisible({ status, source_id }) {
      if (status == 'waiting') {
        if (this.IS_ADMIN && source_id == '0') {
          return true
        }
        if (this.IS_DISTRIBUTOR) {
          return true
        }
      }
      return false
    },
    // 切换tab
    handleTabClick(tab, event) {
      this.onSearch()
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
    addLimitPromotion() {
      this.$router.push({ path: this.matchHidePage('editor') })
    },
    updateLimitPromotion(row) {
      this.$router.push({ path: this.matchHidePage('editor/') + row.limit_id })
    },
    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.params
      }
      const { list, total_count } = await this.$api.promotions.getLimitPromotions(params)
      this.tableList = list
      this.page.total = total_count
      this.loading = false
    },
    showLimitPromotion(row) {
      this.$router.push({
        path: this.matchHidePage('editor/') + row.limit_id,
        query: { isshow: true }
      })
    },
    closeLimitPromotion(row) {
      let that = this
      var msg = '此操作将永久终止该活动, 是否继续?'
      this.$confirm(msg, '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            cancelLimitPromotions(row.limit_id).then((res) => {
              this.$message({
                message: '取消成功',
                type: 'success',
                duration: 2 * 1000,
                onClose() {
                  that.fetchList()
                }
              })
            })
          }
          done()
        }
      })
    }
  }
}
</script>
