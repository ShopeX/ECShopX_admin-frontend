<template>
  <div>
    <div v-if="$route.path.indexOf('editor') === -1">
      <el-row :gutter="20">
        <el-col :md="4" :lg="8">
          <el-button size="mini" type="primary" icon="plus" @click="addLimitPromotion"
            >添加限购商品活动</el-button
          >
        </el-col>
      </el-row>
      <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane label="待开始" name="waiting"></el-tab-pane>
        <el-tab-pane label="进行中" name="ongoing"></el-tab-pane>
        <el-tab-pane label="已结束" name="end"></el-tab-pane>
        <el-table
          :data="list"
          style="width: 100%"
          v-loading="loading"
          element-loading-text="数据加载中"
        >
          <el-table-column prop="limit_id" width="60" label="编号"></el-table-column>
          <el-table-column prop="limit_name" label="活动名称"></el-table-column>
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
                  @click="closeLimitPromotion(scope.row)"
                  type="text"
                  v-if="scope.row.status == 'ongoing'"
                  >取消
                </el-button>
                <el-button @click="showLimitPromotion(scope.row)" type="text">查看</el-button>
                <el-button
                  @click="updateLimitPromotion(scope.row)"
                  type="text"
                  v-if="scope.row.status == 'waiting'"
                  >编辑
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="total_count > params.pageSize" class="content-padded content-center">
          <el-pagination
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :current-page.sync="params.page"
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
import { cancelLimitPromotions, getLimitPromotions } from '../../../../api/promotions'

export default {
  data() {
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
  methods: {
    // 切换tab
    handleClick(tab, event) {
      this.activeName = tab.name
      this.params.status = tab.name == 'all' ? '' : tab.name
      this.params.page = 1
      this.getLimitPromotionsLists()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.loading = false
      this.getLimitPromotionsLists()
    },
    addLimitPromotion() {
      this.$router.push({ path: this.matchHidePage('editor') })
    },
    updateLimitPromotion(row) {
      this.$router.push({ path: this.matchHidePage('editor/') + row.limit_id })
    },
    getLimitPromotionsLists() {
      this.loading = true
      getLimitPromotions(this.params).then((res) => {
        this.loading = false
        this.list = res.data.data.list
        this.total_count = res.data.data.total_count
      })
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
                  that.getLimitPromotionsLists()
                }
              })
            })
          }
          done()
        }
      })
    }
  },
  mounted() {
    this.getLimitPromotionsLists()
  }
}
</script>
