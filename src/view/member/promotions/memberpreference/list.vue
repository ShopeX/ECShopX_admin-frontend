<template>
  <div>
    <div v-if="$route.path.indexOf('editor') === -1">
      <SpPlatformTip h5 app alipay />
      <el-row :gutter="20">
        <el-col :md="4" :lg="8">
          <el-button size="mini" type="primary" icon="plus" @click="addActivityData">
            添加会员优先购活动
          </el-button>
        </el-col>
      </el-row>


      <SpFilterForm :model="form" @onSearch="onSearch" @onReset="onReset">
        <SpFilterFormItem prop="regionauth_id" label="区域:">
          <el-select v-model="form.regionauth_id" placeholder="请选择" clearable>
            <el-option
              v-for="item in areasList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="marketing_name" label="活动名称:">
          <el-input v-model="form.marketing_name" placeholder="请输入商品名称" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="marketing_id" label="活动ID:">
          <el-input v-model="form.marketing_id" placeholder="请输入活动ID" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="create_time" label="创建时间:">
          <el-date-picker
            v-model="form.create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            start-placeholder="开始日期"
            ange-separator="至"
            end-placeholder="结束日期"
            style="width: 100%"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="activity_time" label="活动时间:">
          <el-date-picker
            v-model="form.activity_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            start-placeholder="开始日期"
            ange-separator="至"
            end-placeholder="结束日期"
            style="width: 100%"
          />
        </SpFilterFormItem>
      </SpFilterForm>

      <el-tabs v-model="activeName" style="margin-top: 20px" type="card" @tab-click="handleClick">
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
          <el-table-column prop="marketing_id" width="100" label="活动ID" />
          <el-table-column prop="marketing_name" label="活动名称" />
          <el-table-column prop="regionauth_name" min-width="150" label="区域" />
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
          <el-table-column label="状态" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 'waiting'">待开始</span>
              <span v-if="scope.row.status == 'ongoing'">进行中</span>
              <span v-if="scope.row.status == 'end'">已结束</span>
            </template>
          </el-table-column>

          <el-table-column prop="created_date" width="150" label="创建时间">
              <template slot-scope="scope">
                <div>{{ scope.row.created_date }}</div>
              </template>
            </el-table-column>


          <el-table-column label="操作" width="150">
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
        </el-table>
        <div v-if="total_count > params.pageSize" class="content-padded content-center">
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
import { mapGetters } from 'vuex'
import {
  getMarketingActivityList,
  getMarketingActivityItemList,
  removeMarketingActivity
} from '../../../../api/promotions'
import shopSelect from '@/components/shopSelect'

export default {
  provide() {
    return {
      refresh: this.getActivityLists
    }
  },
  components: {
    shopSelect
  },
  data() {
    const initialForm = {
      activity_time: [],
      create_time:[],
      regionauth_id:undefined,
      marketing_name:undefined,
      marketing_id:undefined,
    }

    return {
      activeName: 'all',
      cursymbol: '￥',
      loading: false,
      create_time: '',
      form:{
        ...initialForm
      },
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
      ItemLoading: false,
      areasList:[]
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.getActivityLists()
    this.getAreaList()
  },
  methods: {
    onReset() {
      this.form = { ...this.initialForm }
      this.params = {
        ...this.params,
        page: 1,
        pageSize: 20,
        status:''
      }
      this.activeName = 'all'
      this.onSearch()
    },
    async getAreaList(){
      // 查询区域数据
     const res = await this.$api.regionauth.getRegionauth()
     this.areasList =  res?.list?.map((el) => ({
          value: el.regionauth_id,
          label: el.regionauth_name
        }))
    },
    onSearch() {
      this.activityItemParams.page = 1
      this.$nextTick(() => {
        this.getActivityLists()
      })
    },
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
      this.$router.push({ path: this.matchHidePage('editor') })
    },
    editActivityAction(index, row) {
      this.$router.push({ path: this.matchHidePage('editor/') + row.marketing_id })
    },
    deleteActivityAction(row) {
      var msg = '你确定要删除该活动吗?'
      this.$confirm(msg, '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            removeMarketingActivity({ marketing_id: row.marketing_id }).then((res) => {
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
    updateDetail(row) {
      this.$router.push({ path: this.matchHidePage('editor/') + row.marketing_id })
    },
    viewDetail(row) {
      this.$router.push({
        path: this.matchHidePage('editor/') + row.marketing_id,
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
        getMarketingActivityItemList(this.activityItemParams).then((res) => {
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
      getMarketingActivityItemList(this.activityItemParams).then((res) => {
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
      getMarketingActivityItemList(this.activityItemParams).then((res) => {
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
    getForm() {
      const time = {}
      const activity_time = this.form.activity_time
      if (activity_time && activity_time.length > 0) {
        time.start_time = this.dateStrToTimeStamp(activity_time[0] + ' 00:00:00')
        time.end_time = this.dateStrToTimeStamp(activity_time[1] + ' 23:59:59')
      }

      const create_time = this.form.create_time
      if (create_time && create_time.length > 0) {
        time.create_start_time = this.dateStrToTimeStamp(create_time[0] + ' 00:00:00')
        time.create_end_time = this.dateStrToTimeStamp(create_time[1] + ' 23:59:59')
      }

      let params = {
        ...this.form,
        activity_time: [],
        create_time:[],
        ...time
      }
      return params
    },
    getActivityLists() {
      this.loading = true
      var filter = { ...this.params,...this.getForm() }

      getMarketingActivityList(filter).then((response) => {
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
              (response) => {
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
