<template>
  <div>
    <el-table
      v-loading="loading"
      :data="groupsTeamMemberList"
      style="width: 100%"
      border
      height="580"
    >
      <el-table-column
        prop="member_info"
        label="会员"
      >
        <template slot-scope="scope">
          {{ scope.row.member_info.nickname }}
        </template>
      </el-table-column>
      <el-table-column label="参团时间">
        <template slot-scope="scope">
          {{ scope.row.join_time | datetime('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column label="订单状态">
        <template slot-scope="scope">
          <span v-if="1 == teamInfo.team_status">进行中</span>
          <span v-else-if="2 == teamInfo.team_status">拼团成功</span>
          <span v-else>拼团失败</span>
          |
          <span v-if="'NOTPAY' == scope.row.order_status">未支付</span>
          <span v-else-if="'CANCEL' == scope.row.order_status">取消支付</span>
          <span v-else-if="'DONE' == scope.row.order_status">支付成功</span>
          <span v-else-if="'PAYED' == scope.row.order_status">支付成功</span>
          <span v-else-if="'REFUND_PROCESS' == scope.row.order_status">退款中</span>
          <span v-else-if="'REFUND_SUCCESS' == scope.row.order_status">退款成功</span>
          <span v-else>拼团机器人</span>
        </template>
      </el-table-column>
      <el-table-column label="订单编号">
        <template slot-scope="scope">
          <router-link
            v-if="scope.row.order_id"
            :to="{
              path: `/order/entitytrade/tradenormalorders/detail`,
              query: { orderId: scope.row.order_id, resource: '/mall/trade/service' }
            }"
          >
            详情
          </router-link>
          <span v-else>我是拼团机器人</span>
        </template>
      </el-table-column>
    </el-table>
    <div
      v-if="total_count > params.pageSize"
      class="content-center content-top-padded"
    >
      <el-pagination
        layout="prev, pager, next"
        :current-page.sync="params.page"
        :total="total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { getGroupsTeamInfo } from '../../../api/promotions'

export default {
  data () {
    return {
      loading: false,
      team_id: null,
      groupsTeamMemberList: [],
      teamInfo: {},
      total_count: 0,
      params: {
        view: 0,
        page: 1,
        pageSize: 20,
        keywords: ''
      }
    }
  },
  mounted () {
    this.team_id = this.$route.params.team_id
    this.getGroupsTeamInfo()
  },
  methods: {
    handleCurrentChange (pageNum) {
      this.params.page = pageNum
    },
    getGroupsTeamInfo () {
      this.loading = true
      getGroupsTeamInfo(this.team_id, this.params)
        .then((response) => {
          this.groupsTeamMemberList = response.data.data.list
          this.teamInfo = response.data.data.teamInfo
          this.total_count = response.data.data.total_count
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: '获取拼团详情失败'
          })
        })
    }
  }
}
</script>

<style scoped></style>
