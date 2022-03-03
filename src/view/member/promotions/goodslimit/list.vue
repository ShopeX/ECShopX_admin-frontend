<template>
  <div>
    <div v-if="$route.path.indexOf('editor') === -1">
      <el-row :gutter="20">
        <el-col
          :md="4"
          :lg="8"
        >
          <el-button
            size="mini"
            type="primary"
            icon="plus"
            @click="addLimitPromotion"
          >
            添加限购商品活动
          </el-button>
        </el-col>
      </el-row>
      <el-tabs
        v-model="activeName"
        type="border-card"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="全部"
          name="all"
        />
        <el-tab-pane
          label="待开始"
          name="waiting"
        />
        <el-tab-pane
          label="进行中"
          name="ongoing"
        />
        <el-tab-pane
          label="已结束"
          name="end"
        />
        <el-table
          v-loading="loading"
          :data="list"
          style="width: 100%"
          element-loading-text="数据加载中"
        >
          <el-table-column
            prop="limit_id"
            width="60"
            label="编号"
          />
          <el-table-column
            prop="limit_name"
            label="活动名称"
          />
          <el-table-column
            label="开始时间"
            width="200"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.start_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="结束时间"
            width="200"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.end_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="类型"
            width="120"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status == 'waiting'">待开始</span>
              <span v-if="scope.row.status == 'ongoing'">进行中</span>
              <span v-if="scope.row.status == 'end'">已结束</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="150"
          >
            <template slot-scope="scope">
              <div class="operating-icons">
                <el-button
                  v-if="scope.row.status == 'ongoing'"
                  type="text"
                  @click="closeLimitPromotion(scope.row)"
                >
                  取消
                </el-button>
                <el-button
                  type="text"
                  @click="showLimitPromotion(scope.row)"
                >
                  查看
                </el-button>
                <el-button
                  v-if="scope.row.status == 'waiting'"
                  type="text"
                  @click="updateLimitPromotion(scope.row)"
                >
                  编辑
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div
          v-if="total_count > params.pageSize"
          class="content-padded content-center"
        >
          <el-pagination
            layout="prev, pager, next"
            :current-page.sync="params.page"
            :total="total_count"
            :page-size="params.pageSize"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-tabs>
    </div>
    <router-view />
  </div>
</template>
<script>
import { cancelLimitPromotions, getLimitPromotions } from '../../../../api/promotions'

export default {
  data () {
    return {
      loading: false,
      activeName: 'all',
      params: {
        page: 1,
        pageSize: 20,
        status: 'all'
      },
      total_count: 0,
      list: []
    }
  },
  mounted () {
    this.getLimitPromotionsLists()
  },
  methods: {
    // 切换tab
    handleClick (tab, event) {
      this.activeName = tab.name
      this.params.status = tab.name == 'all' ? '' : tab.name
      this.params.page = 1
      this.getLimitPromotionsLists()
    },
    handleCurrentChange (val) {
      this.params.page = val
      this.loading = false
      this.getLimitPromotionsLists()
    },
    addLimitPromotion () {
      this.$router.push({ path: this.matchHidePage('editor') })
    },
    updateLimitPromotion (row) {
      this.$router.push({ path: this.matchHidePage('editor/') + row.limit_id })
    },
    getLimitPromotionsLists () {
      this.loading = true
      getLimitPromotions(this.params).then((res) => {
        this.loading = false
        this.list = res.data.data.list
        this.total_count = res.data.data.total_count
      })
    },
    showLimitPromotion (row) {
      this.$router.push({
        path: this.matchHidePage('editor/') + row.limit_id,
        query: { isshow: true }
      })
    },
    closeLimitPromotion (row) {
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
                onClose () {
                  that.getLimitPromotionsLists()
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
