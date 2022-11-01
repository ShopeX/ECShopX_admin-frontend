<template>
  <div>
    <el-table
      v-loading="loading"
      :data="list"
      border
    >
      <el-table-column
        prop="create_time"
        label="创建时间"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="order_id"
        label="订单号"
      />
      <el-table-column
        prop="title"
        label="标题"
      />
      <el-table-column
        prop="total_fee"
        label="金额"
      >
        <template slot-scope="scope">
          ￥{{ scope.row.total_fee / 100 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="order_type"
        label="类型"
      >
        <template slot-scope="scope">
          <span
            v-for="(item, index) in orderType"
            v-if="item.type == scope.row.order_type"
            :key="index"
          >
            {{ item.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="order_status"
        label="订单状态"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.order_status == 'DONE'"
            type="success"
          >
            已完成
          </el-tag>
          <el-tag v-else-if="scope.row.order_status == 'NOTPAY'">
            未支付
          </el-tag>
          <el-tag
            v-else-if="scope.row.order_status == 'CLOSED'"
            type="danger"
          >
            已取消
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="small"
            icon="view"
            @click="getDetail(scope.row.order_id)"
          >
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div
      v-if="total_count > pageSize"
      class="content-padded tc"
    >
      <el-pagination
        layout="prev, pager, next"
        :total="total_count"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import { getOrderList } from '../../../api/trade'
export default {
  props: ['userId', 'isLoad'],
  data () {
    return {
      loading: false,
      params: {},
      orderStatusList: [
        { name: '未支付', value: 'notpay' },
        { name: '已完成', value: 'done' }
      ],
      // time_start_begin: '',
      // time_start_end: '',
      total_count: 0,
      currentPage: 1,
      pageSize: 20,
      list: [],
      currentShop: '',
      wxShopsList: []
    }
  },
  watch: {
    userId (newVal, oldVal) {
      if (this.isLoad) {
        this.params = { page: this.currentPage, pageSize: this.pageSize, user_id: newVal }
        this.getOrders(this.params)
      }
    },
    isLoad (newVal, oldVal) {
      if (newVal) {
        this.params = { page: this.currentPage, pageSize: this.pageSize, user_id: this.userId }
        this.getOrders(this.params)
      }
    }
  },
  mounted () {
    // this.params = {page: this.currentPage, pageSize: this.pageSize, user_id: userId}
    // this.getOrders(this.params)
  },
  methods: {
    handleCurrentChange (val) {
      this.currentPage = val
      this.loading = false
      this.getParams()
      this.getOrders(this.params)
    },
    getParams () {
      // this.params.time_start_begin = this.time_start_begin
      // this.params.time_start_end = this.time_start_end
      // this.params.order_type = this.order_type
      // if(this.order_type == 'service') {
      //   this.params.shop_id = this.currentShop
      // } else if(this.order_type == 'bargain') {
      //   delete this.params.shop_id
      // }
      // if(this.identifier.length == 11) {
      //   this.params.mobile = this.identifier
      // } else {
      //   this.params.mobile = ''
      //   this.params.order_id = this.identifier
      // }
      this.params.page = this.currentPage
      this.params.pageSize = this.pageSize
    },
    dateStrToTimeStamp (str) {
      return Date.parse(new Date(str)) / 1000
    },
    getOrders (filter) {
      this.loading = true
      getOrderList(filter).then((response) => {
        this.list = response.data.data.list
        this.total_count = Number(response.data.data.pager.count)
        this.loading = false
      })
    },
    getDetail (orderId) {
      this.$router.push({
        path: `${
          this.$store.getters.login_type != 'distributor'
            ? '/order/entitytrade/tradenormalorders/detail'
            : '/shopadmin/order/tradenormalorders/detail'
        }`,
        query: {
          orderId: orderId,
          resource: '/member/manage/members/detail?user_id=' + this.userId,
          user_id: this.userId
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 10px;
  .frm-tips {
    color: #8d8d8d;
  }
}
</style>
