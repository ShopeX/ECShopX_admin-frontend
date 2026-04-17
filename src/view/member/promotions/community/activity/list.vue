<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="3">
        <el-button type="primary" icon="plus" @click="addActivityData">
          {{ $t('cada7636.23b46b') }}
        </el-button>
      </el-col>
      <el-col :span="6">
        <el-input v-model="params.name" :placeholder="$t('cada7636.39834b')">
          <el-button slot="append" icon="el-icon-search" @click="dataSearch" />
        </el-input>
      </el-col>
      <el-col :span="8">
        <el-date-picker
          v-model="create_time"
          type="daterange"
          value-format="yyyy/MM/dd"
          :placeholder="$t('cada7636.4b8cb9')"
          style="width: 100%"
          @change="dateChange"
        />
      </el-col>
    </el-row>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane :label="$t('cada7636.a8b0c2')" name="all" />
      <el-tab-pane :label="$t('cada7636.fb852f')" name="processing" />
      <el-tab-pane :label="$t('cada7636.1568ba')" name="waiting" />
      <el-tab-pane :label="$t('cada7636.b0a6b1')" name="over" />
      <el-tab-pane :label="$t('cada7636.55727b')" name="close" />
      <el-table v-loading="loading" :data="activityLists" :height="wheight - 220">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item :label="$t('cada7636.7add39')">
                <span>{{ props.row.description }}</span>
              </el-form-item>
              <!--el-form-item label="活动库存"> <span>{{props.row.total_num}}</span> </el-form-item-->
              <el-form-item :label="$t('cada7636.2aa50d')">
                <span>{{ props.row.delivery_date }}</span>
              </el-form-item>
              <el-form-item :label="$t('cada7636.eca37c')">
                <span>{{ props.row.created_date }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="activity_id" :label="$t('cada7636.be3322')" width="80" />
        <el-table-column :label="$t('cada7636.39834b')">
          <template slot-scope="scope"> {{ scope.row.activity_name }}<br /> </template>
        </el-table-column>
        <el-table-column prop="activity_start_date" :label="$t('cada7636.592c59')" width="160" />
        <el-table-column prop="activity_end_date" :label="$t('cada7636.f78277')" width="160" />
        <el-table-column prop="community" :label="$t('cada7636.ed9ea7')" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.community == 'all'">{{ $t('cada7636.333a81') }}</span>
            <span v-else>
              <el-button type="text" @click="viewCommunityList(scope.row.community)">
                {{ $t('cada7636.65f220') }}
              </el-button>
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
        <el-table-column :label="$t('cada7636.2b6bc0')" min-width="150" fixed="left">
          <template slot-scope="scope">
            <el-button type="text" @click="viewGoodsList(scope.row.activity_id)">
              {{ $t('cada7636.f13684') }}
            </el-button>
            <el-button
              v-if="scope.row.status == 'processing' || scope.row.status == 'waiting'"
              type="text"
              @click="updateStatusCommunityAction('close', scope.row)"
            >
              {{ $t('cada7636.ff6c6a') }}
            </el-button>
            <el-button
              v-if="scope.row.status == 'waiting' && scope.row.is_maturity"
              type="text"
              @click="updateStatusCommunityAction('start', scope.row)"
            >
              {{ $t('cada7636.cc42dd') }}
            </el-button>
            <el-button
              v-if="scope.row.status == 'processing' || scope.row.status == 'waiting'"
              type="text"
              @click="editCommunityAction(scope.$index, scope.row)"
            >
              {{ $t('cada7636.95b351') }}
            </el-button>
            <el-button type="text" @click="addSimilarActvity(scope.row.activity_id)">
              {{ $t('cada7636.d30586') }}
            </el-button>
            <el-button
              v-if="scope.row.status == 'over' || scope.row.status == 'close'"
              type="text"
              @click="exportActivityItemList(scope.row.activity_id)"
            >
              {{ $t('cada7636.61b952') }}
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
      :title="$t('cada7636.c349f2')"
      :visible.sync="communityVisible"
      :before-close="handleCancel"
      width="70%"
    >
      <template>
        <el-table v-loading="loading" :data="communityLists">
          <el-table-column prop="community_id" label="ID" width="50" />
          <el-table-column prop="community_name" :label="$t('cada7636.d7ec2d')" />
          <el-table-column prop="leader_name" :label="$t('cada7636.07e57c')" width="110" />
          <el-table-column prop="leader_mobile" :label="$t('cada7636.6621f6')" width="120" />
          <el-table-column prop="address" :label="$t('cada7636.f0c36d')" />
          <el-table-column prop="created_date" :label="$t('cada7636.773775')" width="100" />
          <el-table-column prop="status" :label="$t('cada7636.3fea7c')" width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.status === 'open'">{{ $t('cada7636.e52902') }}</span>
              <span v-if="scope.row.status === 'close'">{{ $t('cada7636.8d63ef') }}</span>
              <span v-if="scope.row.status === 'loading'">{{ $t('cada7636.5cb424') }}</span>
              <span v-if="scope.row.status === 'refuse'">{{ $t('cada7636.ff88e0') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="pass_date" :label="$t('cada7636.db185f')" width="100" />
        </el-table>
      </template>
    </el-dialog>
    <el-dialog
      :title="$t('cada7636.d43d09')"
      :visible.sync="goodsVisible"
      :before-close="handleCancel"
      width="70%"
    >
      <template>
        <el-table v-loading="loading" :data="goodsList">
          <el-table-column prop="item_id" label="id" width="60" />
          <el-table-column prop="item_name" :label="$t('cada7636.1fd1d5')" />
          <el-table-column prop="activity_price" :label="$t('cada7636.08ee55')" width="70">
            <template slot-scope="scope">
              {{ cursymbol }}{{ scope.row.activity_price }}
              <!-- <el-input v-model="scope.row.activity_price"  @change="editItemPrice(scope.$index, scope.row)"><i slot="prefix" class="el-input__icon el-icon-edit"></i><i slot="suffix" class="el-input__icon">元</i></el-input> -->
            </template>
          </el-table-column>
          <el-table-column prop="vip_price" :label="$t('cada7636.5307dd')" width="70">
            <template slot-scope="scope"> {{ cursymbol }}{{ scope.row.vip_price }} </template>
          </el-table-column>
          <el-table-column prop="svip_price" :label="$t('cada7636.9502f9')" width="70">
            <template slot-scope="scope"> {{ cursymbol }}{{ scope.row.svip_price }} </template>
          </el-table-column>
          <el-table-column prop="activity_store" :label="$t('cada7636.0eac88')" width="60" />
          <el-table-column prop="points" :label="$t('cada7636.9f68a8')" width="60" />
          <el-table-column prop="sort" :label="$t('cada7636.c360e9')" width="60" />
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
      exportActivityItemList({ activity_id: activity_id }).then((res) => {
        window.open(res.data.data.url, '_blank')
      })
    },
    communityDetail(index, row) {
      this.communityDetailVisible = true
      CommunityActivityInfo(row.activity_id).then((response) => {
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
      CommunityActivityList(params).then((response) => {
        this.activityLists = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    updateStatusCommunityAction(status, row) {
      const msg = status == 'close' ? this.$t('cada7636.01be42') : this.$t('cada7636.cc0067')
      this.$confirm(msg, this.$t('cada7636.02d981'), {
        cancelButtonText: this.$t('cada7636.625fb2'),
        confirmButtonText: this.$t('cada7636.38cf16'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            CommunityActivityStatusUpdate({
              activity_id: row.activity_id,
              delete_type: status
            }).then((response) => {
              this.getActivityLists(this.params)
              this.$message({
                message: this.$t('cada7636.b69694'),
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
      getCommunityList(params).then((res) => {
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
      }).then((res) => {
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
