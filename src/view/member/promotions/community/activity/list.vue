<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="3">
        <el-button type="primary" icon="plus" @click="addActivityData"> 添加活动 </el-button>
      </el-col>
      <el-col :span="6">
        <el-input v-model="params.name" placeholder="活动名称">
          <el-button slot="append" icon="el-icon-search" @click="dataSearch" />
        </el-input>
      </el-col>
      <el-col :span="8">
        <el-date-picker
          v-model="create_time"
          type="daterange"
          value-format="yyyy/MM/dd"
          placeholder="选择日期范围"
          style="width: 100%"
          @change="dateChange"
        />
      </el-col>
    </el-row>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="全部" name="all" />
      <el-tab-pane label="进行中" name="processing" />
      <el-tab-pane label="待开始" name="waiting" />
      <el-tab-pane label="自动已结束" name="over" />
      <el-tab-pane label="手动已终止" name="close" />
      <el-table v-loading="loading" :data="activityLists" :height="wheight - 220">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="活动描述">
                <span>{{ props.row.description }}</span>
              </el-form-item>
              <!--el-form-item label="活动库存"> <span>{{props.row.total_num}}</span> </el-form-item-->
              <el-form-item label="提货时间">
                <span>{{ props.row.delivery_date }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ props.row.created_date }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="activity_id" label="活动ID" width="80" />
        <el-table-column label="活动名称">
          <template slot-scope="scope"> {{ scope.row.activity_name }}<br> </template>
        </el-table-column>
        <el-table-column prop="activity_start_date" label="开始时间" width="160" />
        <el-table-column prop="activity_end_date" label="结束时间" width="160" />
        <el-table-column prop="community" label="社区限制" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.community == 'all'"> 全部社区 </span>
            <span v-else>
              <el-button type="text" @click="viewCommunityList(scope.row.community)"
                >查看社区</el-button
              >
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="coupon_id" label="优惠券">
        <template slot-scope="scope">
          <el-button size="mini" type="text">查看优惠券</el-button>
        </template>
      </el-table-column> -->
        <!-- <el-table-column prop="coupon_id" label="活动终止操作">
        <template slot-scope="scope">
          <el-button size="mini" type="text" v-if="scope.row.status == 'processing' || scope.row.status == 'waiting'" @click="updateStatusCommunityAction(scope.$index, scope.row)">终止活动</el-button>
        </template>
      </el-table-column> -->
        <el-table-column label="操作" min-width="150" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="viewGoodsList(scope.row.activity_id)">
              查看商品
            </el-button>
            <el-button
              v-if="scope.row.status == 'processing' || scope.row.status == 'waiting'"
              type="text"
              @click="updateStatusCommunityAction('close', scope.row)"
            >
              终止
            </el-button>
            <el-button
              v-if="scope.row.status == 'waiting' && scope.row.is_maturity"
              type="text"
              @click="updateStatusCommunityAction('start', scope.row)"
            >
              开启
            </el-button>
            <el-button
              v-if="scope.row.status == 'processing' || scope.row.status == 'waiting'"
              type="text"
              @click="editCommunityAction(scope.$index, scope.row)"
            >
              编辑
            </el-button>
            <el-button type="text" @click="addSimilarActvity(scope.row.activity_id)">
              添加相似
            </el-button>
            <el-button
              v-if="scope.row.status == 'over' || scope.row.status == 'close'"
              type="text"
              @click="exportActivityItemList(scope.row.activity_id)"
            >
              下载备货单
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="total_count > params.pageSize" class="content-center content-top-padded">
        <el-pagination
          background
          layout="prev, pager, next, total"
          :current-page.sync="params.page"
          :total="total_count"
          :page-size="params.pageSize"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-tabs>

    <el-dialog
      title="社区信息列表"
      :visible.sync="communityVisible"
      :before-close="handleCancel"
      width="70%"
    >
      <template>
        <el-table v-loading="loading" :data="communityLists">
          <el-table-column prop="community_id" label="ID" width="50" />
          <el-table-column prop="community_name" label="名称" />
          <el-table-column prop="leader_name" label="团长姓名" width="110" />
          <el-table-column prop="leader_mobile" label="团长手机" width="120" />
          <el-table-column prop="address" label="提货地址" />
          <el-table-column prop="created_date" label="入驻时间" width="100" />
          <el-table-column prop="status" label="状态" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 'open'">营业</span>
              <span v-if="scope.row.status === 'close'">暂停</span>
              <span v-if="scope.row.status === 'loading'">待审核</span>
              <span v-if="scope.row.status === 'refuse'">拒绝申请</span>
            </template>
          </el-table-column>
          <el-table-column prop="pass_date" label="通过时间" width="100" />
        </el-table>
      </template>
    </el-dialog>
    <el-dialog
      title="活动商品列表"
      :visible.sync="goodsVisible"
      :before-close="handleCancel"
      width="70%"
    >
      <template>
        <el-table v-loading="loading" :data="goodsList">
          <el-table-column prop="item_id" label="id" width="60" />
          <el-table-column prop="item_name" label="商品名称" />
          <el-table-column prop="activity_price" label="活动价" width="70">
            <template slot-scope="scope">
              {{ cursymbol }}{{ scope.row.activity_price }}
              <!-- <el-input v-model="scope.row.activity_price"  @change="editItemPrice(scope.$index, scope.row)"><i slot="prefix" class="el-input__icon el-icon-edit"></i><i slot="suffix" class="el-input__icon">元</i></el-input> -->
            </template>
          </el-table-column>
          <el-table-column prop="vip_price" label="vip价" width="70">
            <template slot-scope="scope"> {{ cursymbol }}{{ scope.row.vip_price }} </template>
          </el-table-column>
          <el-table-column prop="svip_price" label="svip价" width="70">
            <template slot-scope="scope"> {{ cursymbol }}{{ scope.row.svip_price }} </template>
          </el-table-column>
          <el-table-column prop="activity_store" label="库存" width="60" />
          <el-table-column prop="points" label="积分" width="60" />
          <el-table-column prop="sort" label="排序" width="60" />
        </el-table>
        <div v-if="goodsCount > goodsPageSize" class="content-center content-top-padded">
          <el-pagination
            layout="prev, pager, next"
            :current-page.sync="goodsPage"
            :total="goodsCount"
            :page-size="goodsPageSize"
            @current-change="handleGoodsCurrentChange"
          />
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { getDefaultCurrency } from '../../../../../api/company'
import {
  CommunityActivityList,
  getCommunityList,
  CommunityActivityInfo,
  communityActivityItemList,
  CommunityActivityStatusUpdate,
  exportActivityItemList
} from '../../../../../api/community'
export default {
  props: ['getStatus'],
  data() {
    return {
      activeName: 'all',
      create_time: '',
      form: {
        service_type: 'timescard',
        label_name: '',
        label_price: '',
        label_desc: ''
      },
      activityLists: [],
      communityDetailVisible: false,
      communityDetailData: {},
      loading: false,
      total_count: 0,
      params: {
        page: 1,
        pageSize: 20,
        status: '',
        name: '',
        mobile: '',
        time_start_begin: '',
        time_start_end: ''
      },
      communityLists: [],
      communityVisible: false,
      couponVisible: false,
      goodsVisible: false,
      goodsList: [],
      goodsCount: 0,
      goodsPageSize: 10,
      goodsPage: 1,
      nowActivity: '',
      cursymbol: '',
      currency: {}
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    getStatus(val) {
      if (val) {
        this.getActivityLists(this.params)
      }
    }
  },
  mounted() {
    this.getActivityLists(this.params)
    this.getCurrencyInfo()
  },
  methods: {
    // 切换tab
    handleClick(tab, event) {
      this.activeName = tab.name
      this.params.page = 1
      if (this.activeName != 'all') {
        this.params.status = tab.name
      } else {
        this.params.status = ''
      }
      this.getActivityLists(this.params)
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getActivityLists(this.params)
    },
    handleGoodsCurrentChange(page_num) {
      this.goodsPage = page_num
      this.viewGoodsList(this.nowActivity)
    },
    addActivityData() {
      // 添加物料弹框
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    editCommunityAction(index, row) {
      // 编辑物料弹框
      this.$router.push({ path: this.matchRoutePath('editor/') + row.activity_id })
    },
    addSimilarActvity(activity_id) {
      this.$router.push({ path: this.matchRoutePath('editor/') + activity_id + '?is_new=true' })
    },
    exportActivityItemList(activity_id) {
      exportActivityItemList({ activity_id: activity_id }).then(res => {
        window.open(res.data.data.url, '_blank')
      })
    },
    communityDetail(index, row) {
      this.communityDetailVisible = true
      CommunityActivityInfo(row.activity_id).then(response => {
        this.communityDetailData = response.data.data
      })
    },
    dataSearch() {
      this.params.page = 1
      this.getActivityLists(this.params)
    },
    getActivityLists(params) {
      this.loading = true
      if (this.activeName != 'all') {
        this.params.status = this.activeName
      } else {
        this.params.status = ''
      }
      CommunityActivityList(params).then(response => {
        this.activityLists = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    updateStatusCommunityAction(status, row) {
      if (status == 'close') {
        var msg = '此操作将永久终止该活动, 是否继续?'
      } else {
        var msg = '是否要开启该活动？'
      }
      this.$confirm(msg, '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            CommunityActivityStatusUpdate({
              activity_id: row.activity_id,
              delete_type: status
            }).then(response => {
              this.getActivityLists(this.params)
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
      if (val && val.length > 0) {
        this.params.start_time = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.params.end_time = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.params.start_time = ''
        this.params.end_time = ''
      }
      this.params.page = 1
      this.getActivityLists(this.params)
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    viewCommunityList(ids) {
      this.communityVisible = true
      var params = { community_id: ids }
      getCommunityList(params).then(res => {
        if (res.data.data.total_count > 0) {
          this.communityLists = res.data.data.list
        }
      })
    },
    viewGoodsList(activityId) {
      this.nowActivity = activityId
      this.goodsVisible = true
      communityActivityItemList(activityId, {
        page: this.goodsPage,
        pageSize: this.goodsPageSize
      }).then(res => {
        this.goodsList = res.data.data.list
        this.goodsCount = res.data.data.total_count
      })
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
      getDefaultCurrency().then(res => {
        this.currency = res.data.data
        this.cursymbol = this.currency.symbol
      })
    },
    updateActivityData(params) {
      updateActivityItemData(params).then(res => {})
    },
    editItemPrice(row) {
      let form = {
        id: row.id,
        item_id: row.item_id,
        activity_price: row.activity_price,
        vip_price: row.vip_price,
        svip_price: row.svip_price,
        activity_store: row.activity_store,
        points: row.points
      }
      this.updateActivityData(form)
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
.text-muted {
  color: #999;
}
</style>
