<style scoped lang="scss">
.time-box {
  margin: 10px 0;
  background-color: #efefef;
}
.basic {
  padding: 30px 0;
  text-align: center;
  span {
    color: #ff5000;
    font-size: 22px;
  }
}
</style>
<template>
  <div>
    <div class="time-box basic"   v-if="loginType !== 'distributor'  && $route.path.indexOf('detail') === -1" >
      <el-row>
        <el-col
          :span="3"
        >
          可提现:&nbsp;<span>{{ count.cashWithdrawalRebate / 100 }}</span>元
        </el-col>
        <el-col
          :span="3"
        >
          已提现:&nbsp;<span>{{ count.payedRebate / 100 }}</span>元
        </el-col>
        <el-col
          :span="3"
        >
          申请提现:&nbsp;<span>{{ count.freezeCashWithdrawalRebate / 100 }}</span>元
        </el-col>
        <el-col
          :span="3"
        >
          未结算:&nbsp;<span>{{ count.noCloseRebate / 100 }}</span>元
        </el-col>
        <el-col
          :span="3"
        >
          佣金总额:&nbsp;<span>{{ count.rebateTotal / 100 }}</span>元
        </el-col>
        <el-col
          :span="3"
        >
          积分总额:&nbsp;<span>{{ count.pointTotal }}</span>积分
        </el-col>
        <el-col
          :span="3"
        >
          商品总额:&nbsp;<span>{{ count.itemTotalPrice / 100 }}</span>元
        </el-col>
      </el-row>
    </div>

    <div class="time-box basic"   v-if="loginType == 'distributor' || $route.path.indexOf('detail') !== -1 || $route.path.indexOf('sellers') !== -1" >
      <el-row>
        <!-- <el-col
          :span="3"
        >
          可提现:&nbsp;<span>{{ count.cashWithdrawalRebate / 100 }}</span>元
        </el-col>
        <el-col
          :span="3"
        >
          已提现:&nbsp;<span>{{ count.payedRebate / 100 }}</span>元
        </el-col>
        <el-col
          :span="3"
        >
          申请提现:&nbsp;<span>{{ count.freezeCashWithdrawalRebate / 100 }}</span>元
        </el-col> -->
        <el-col
          :span="3"
        >
          未结算:&nbsp;<span>{{ count.countDataShop.rebate_sum_noclose / 100 }}</span>元
        </el-col>
        <el-col
          :span="3"
        >
          佣金总额:&nbsp;<span>{{ count.countDataShop.rebate_sum / 100 }}</span>元
        </el-col>
        <!-- <el-col
          :span="3"
        >
          积分总额:&nbsp;<span>{{ count.pointTotal }}</span>积分
        </el-col> -->
        <el-col
          :span="3"
        >
          商品总额:&nbsp;<span>{{ count.countDataShop.price_sum / 100 }}</span>元
        </el-col>
      </el-row>
    </div>    
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="index"
        :label="item.name"
        :name="item.activeName"
      >
        <el-table
          v-loading="loading"
          :data="list"
          border
          :height="wheight - 240"
        >
          <el-table-column
            prop="order_id"
            label="订单号"
            min-width="84"
          >
            <template slot-scope="scope">
              <router-link
                :to="{
                  path: matchInternalRoute('communityactivityorder_detail'),
                  query: {
                    orderId: scope.row.order_id,
                    resource: '/popularize/logs/?user_id=' + scope.row.user_id
                  }
                }"
              >
                {{ scope.row.order_id }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column
            label="返佣来源"
            min-width="64"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.source == 'order'">提成</span>
              <span v-if="scope.row.source == 'order_team'">津贴</span>
            </template>
          </el-table-column>
          <el-table-column
            label="商品价格"
            min-width="64"
          >
            <template slot-scope="scope">
              <span> {{ scope.row.price / 100 }} </span> 元
            </template>
          </el-table-column>
          <el-table-column
            label="返佣金额"
            min-width="60"
          >
            <template slot-scope="scope">
              <span> {{ scope.row.rebate / 100 }} </span> 元
            </template>
          </el-table-column>
          <el-table-column v-if="1==2"
            label="返佣积分"
            min-width="60"
          >
            <template slot-scope="scope">
              <span> {{ scope.row.rebate_point }}积分 </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="is_close"
            label="是否已结算"
            min-width="50"
          >
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.is_close == true"
                type="warning"
              >
                已结算
              </el-tag>
              <el-tag
                v-else
                type="info"
              >
                未结算
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="loginType == 'distributor'" prop="store_name" label="店铺"></el-table-column>
          <el-table-column v-if="loginType == 'distributor'" prop="user_id" label="业务员ID"></el-table-column>
          <el-table-column v-if="loginType == 'distributor'" prop="title"   label="订单内容"></el-table-column>
        </el-table>
        <div
          v-if="total_count > params.pageSize"
          class="content-padded content-center"
        >
          <el-pagination
            background
            layout="total, sizes, prev, pager, next"
            :page-sizes="[params.pageSize]"
            :total="total_count"
            :page-size="params.pageSize"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getBrokerageLog, withdrawalStatistics } from '../../api/promotions'

export default {
  data () {
    return {
      tabList: [
        { name: '全部', value: null, activeName: 'first' },
        { name: '已结算', value: 'true', activeName: 'second' },
        { name: '未结算', value: 'false', activeName: 'third' }
      ],
      activeName: 'first',
      total_count: 0,
      loading: false,
      count: {
        cashWithdrawalRebate: 0,
        freezeCashWithdrawalRebate: 0,
        itemTotalPrice: 0,
        noCloseRebate: 0,
        payedRebate: 0,
        rebateTotal: 0,
        pointTotal: 0
      },
      params: {
        page: 1,
        pageSize: 20,
        user_id: 0,
        distributor_id: 0,
        pathSource: ''

      },
      list: [{}]
    }
  },
  mounted () {
    this.loginType = this.$store.getters.login_type
    this.params.pathSource = this.$route.path
    console.log(this.$route.path);
    console.log(this.$route.path);
    console.log(this.$route.path);
    console.log(this.$route.path);
    console.log(this.loginType);
    console.log(this.loginType);
    console.log(this.loginType);
    if (this.$route.query.user_id) {
      this.params.user_id = this.$route.query.user_id
    }
    if (this.$route.query.distributor_id) {
      this.params.distributor_id = this.$route.query.distributor_id
    }
    console.log(this.params)
    this.getCount()
    this.getList()
  },
  methods: {
    handleClick (tab, event) {
      this.params.page = 1
      if (this.activeName == 'second') {
        this.params.is_close = 'true'
      } else if (this.activeName == 'third') {
        this.params.is_close = 'false'
      } else {
        this.params.is_close = ''
      }
      this.getList()
    },
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getList()
    },
    getCount () {
      withdrawalStatistics({ user_id: this.params.user_id,distributor_id: this.params.distributor_id }).then((response) => {
        this.count = response.data.data
      })
    },
    getList () {
      this.loading = true
      getBrokerageLog(this.params).then((response) => {
        if (response.data.data.list) {
          this.list = response.data.data.list
          this.total_count = response.data.data.total_count
        }
        this.loading = false
      })
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  }
}
</script>
