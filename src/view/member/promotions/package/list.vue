<template>
  <div>
    <template v-if="$route.path.indexOf('editor') === -1">
      <div class="action-container">
        <el-button
          type="primary"
          icon="iconfont icon-xinzengcaozuo-01"
          @click="addPackagePromotion"
        >
          添加组合促销
        </el-button>
      </div>

      <el-tabs
        v-model="params.status"
        type="card"
        @tab-click="handleTabClick"
      >
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
            <el-table-column
              prop="package_id"
              width="60"
              label="编号"
            />
            <el-table-column
              prop="package_name"
              label="组合促销名称"
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
                    @click="closePackagePromotion(scope.row)"
                  >
                    取消
                  </el-button>
                  <el-button
                    type="text"
                    @click="showPackagePromotion(scope.row)"
                  >
                    查看
                  </el-button>
                  <el-button
                    v-if="scope.row.status == 'waiting'"
                    type="text"
                    @click="updatePackagePromotion(scope.row)"
                  >
                    编辑
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div
            v-if="page.total > page.pageSize"
            class="content-padded content-center"
          >
            <el-pagination
              background
              layout="total, sizes, prev, pager, next"
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
import { cancelPackagePromotions } from '@/api/promotions'
import { pageMixin } from '@/mixins'

export default {
  mixins: [pageMixin],
  provide () {
    return {
      refresh: this.fetchList
    }
  },
  data () {
    return {
      loading: false,
      params: {
        status: 'all'
      },
      list: [],
      tabList: [
        { name: '全部', activeName: 'all' },
        { name: '待开始', activeName: 'waiting' },
        { name: '进行中', activeName: 'ongoing' },
        { name: '已结束', activeName: 'end' }
      ]
    }
  },
  mounted () {
    this.fetchList()
  },
  methods: {
    onSearch () {
      this.page.pageIndex = 1
      this.$nextTick(() => {
        this.fetchList()
      })
    },
    async fetchList () {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.params
      }
      const { list, total_count } = await this.$api.promotions.getPackagePromotions(params)
      this.tableList = list
      this.page.total = Number(total_count)
      this.loading = false
    },
    // 切换tab
    handleTabClick (tab, event) {
      this.onSearch()
    },
    addPackagePromotion () {
      this.$router.push({ path: this.matchHidePage('editor') })
    },
    updatePackagePromotion (row) {
      this.$router.push({ path: this.matchHidePage('editor/') + row.package_id })
    },

    showPackagePromotion (row) {
      this.$router.push({
        path: this.matchHidePage('editor/') + row.package_id,
        query: { isshow: true }
      })
    },
    closePackagePromotion (row) {
      let that = this
      var msg = '此操作将永久终止该活动, 是否继续?'
      this.$confirm(msg, '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            cancelPackagePromotions(row.package_id).then((res) => {
              this.$message({
                message: '取消成功',
                type: 'success',
                duration: 2 * 1000,
                onClose () {
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
