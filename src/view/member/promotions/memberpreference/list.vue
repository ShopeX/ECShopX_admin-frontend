<template>
  <SpPage>
    <SpRouterView>
      <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />

      <div class="action-container">
        <el-button type="primary" @click="addActivityData"> 添加会员优先购活动 </el-button>
      </div>

      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="全部" name="all" />
        <el-tab-pane label="待开始" name="waiting" />
        <el-tab-pane label="进行中" name="ongoing" />
        <el-tab-pane label="已结束" name="end" />
        <el-table
          v-loading="loading"
          :data="list"
          style="width: 100%"
          element-loading-text="数据加载中"
        >
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <div class="operating-icons">
                <el-button
                  v-if="scope.row.status == 'ongoing'"
                  type="text"
                  @click="updateStatusCommunityAction(scope.row)"
                >
                  取消
                </el-button>
                <el-button type="text" @click="viewDetail(scope.row)"> 查看 </el-button>
                <el-button type="text" @click="copyActivity(scope.row)"> 复制活动 </el-button>
                <el-button
                  v-if="scope.row.status == 'waiting'"
                  type="text"
                  @click="updateDetail(scope.row)"
                >
                  编辑
                </el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="marketing_id" width="60" label="编号" />
          <el-table-column prop="marketing_name" label="活动名称" />
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
        </el-table>
        <div v-if="total_count > params.pageSize" class="mt-4 text-right">
          <el-pagination
            layout="prev, pager, next"
            :current-page.sync="params.page"
            :total="total_count"
            :page-size="params.pageSize"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-tabs>
    </SpRouterView>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  getMarketingActivityList,
  getMarketingActivityItemList,
  removeMarketingActivity
} from '../../../../api/promotions'
import shopSelect from '@/components/shopSelect'

export default {
  components: {
    shopSelect
  },
  provide() {
    return {
      refresh: this.getActivityLists
    }
  },
  data() {
    return {
      activeName: 'all',
      cursymbol: '￥',
      loading: false,
      create_time: '',
      params: {
        page: 1,
        pageSize: 20,
        marketing_type: 'member_preference',
        item_type: '',
        status: '',
        start_time: '',
        end_time: ''
      },
      activityItemParams: {
        page: 1,
        pageSize: 20
      },
      activityItemTotalCount: 0,
      activityItemListsData: [],
      total_count: 0,
      list: [],
      activityItemDialog: false,
      ItemLoading: false
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.getActivityLists()
  },
  methods: {
    // 切换tab
    handleClick(tab, event) {
      this.activeName = tab.name
      this.params.status = tab.name == 'all' ? '' : tab.name
      this.params.page = 1
      this.getActivityLists()
    },
    storeSearch(val) {
      val && val.shop_id
      this.params.store_id = val.shop_id
      this.params.page = 1
      this.getActivityLists()
    },
    itemTypeChange() {
      this.params.page = 1
      this.getActivityLists()
    },
    addActivityData() {
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    editActivityAction(index, row) {
      this.$router.push({ path: this.matchRoutePath('editor/') + row.marketing_id })
    },
    deleteActivityAction(row) {
      var msg = '你确定要删除该活动吗?'
      this.$confirm(msg, '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            removeMarketingActivity({ marketing_id: row.marketing_id }).then(res => {
              this.getActivityLists()
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
    copyActivity(row) {
      this.$router.push({
        path: this.matchRoutePath('editor/') + row.marketing_id,
        query: { is_copy: 1 }
      })
    },
    updateDetail(row) {
      this.$router.push({ path: this.matchRoutePath('editor/') + row.marketing_id })
    },
    viewDetail(row) {
      this.$router.push({
        path: this.matchRoutePath('editor/') + row.marketing_id,
        query: { isnodata: true }
      })
    },
    viewItemList(id, itemType) {
      if (id == 'all') {
        if (itemType == 'normal') {
          this.$router.push({ path: this.matchInternalRoute('goodsphysical') })
        } else {
          this.$router.push({ path: this.matchInternalRoute('servicegoods') })
        }
      } else {
        this.ItemLoading = true
        this.activityItemDialog = true
        this.activityItemParams.marketing_id = id
        getMarketingActivityItemList(this.activityItemParams).then(res => {
          if (res != undefined && res.data.data && res.data.data.total_count > 0) {
            this.activityItemListsData = res.data.data.list
            this.activityItemTotalCount = res.data.data.total_count
          }
          this.ItemLoading = false
        })
      }
    },
    handleGoodsCurrentChange(page_num) {
      this.ItemLoading = true
      this.activityItemDialog = true
      this.activityItemParams.page = page_num
      getMarketingActivityItemList(this.activityItemParams).then(res => {
        if (res != undefined && res.data.data && res.data.data.total_count > 0) {
          this.activityItemListsData = res.data.data.list
          this.activityItemTotalCount = res.data.data.total_count
        }
        this.ItemLoading = false
      })
    },
    handleGoodsSizeChange(pageSize) {
      this.ItemLoading = true
      this.activityItemDialog = true
      this.activityItemParams.page = 1
      this.activityItemParams.pageSize = pageSize
      getMarketingActivityItemList(this.activityItemParams).then(res => {
        if (res != undefined && res.data.data && res.data.data.total_count > 0) {
          this.activityItemListsData = res.data.data.list
          this.activityItemTotalCount = res.data.data.total_count
        }
        this.ItemLoading = false
      })
    },
    handleCancel() {
      this.activityItemDialog = false
    },
    dateChange(val) {
      if (val.length > 0) {
        this.params.start_time = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.params.end_time = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      }
      this.params.page = 1
      this.getActivityLists()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.loading = false
      this.getActivityLists()
    },
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getActivityLists()
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    getActivityLists() {
      this.loading = true
      var filter = this.params
      getMarketingActivityList(filter).then(response => {
        this.list = response.data.data.list
        this.total_count = Number(response.data.data.total_count)
        this.loading = false
      })
    },
    updateStatusCommunityAction(row) {
      var msg = '此操作将永久终止该活动, 是否继续?'
      this.$confirm(msg, '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            removeMarketingActivity({ marketing_id: row.marketing_id, isEnd: true }).then(
              response => {
                this.getActivityLists()
                this.$message({
                  message: '修改活动状态成功',
                  type: 'success',
                  duration: 5 * 1000
                })
              }
            )
          }
          done()
        }
      })
    }
  }
}
</script>
