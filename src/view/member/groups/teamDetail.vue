<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-table
      v-loading="loading"
      :data="groupsTeamMemberList"
      style="width: 100%"
      border
      height="580"
    >
      <el-table-column prop="member_info" :label="$t('3f4c07c6.4d9dd5')">
        <template slot-scope="scope">
          {{ scope.row.member_info.nickname }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('3f4c07c6.fc0e0b')">
        <template slot-scope="scope">
          {{ scope.row.join_time | datetime('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('3f4c07c6.86f6cf')">
        <template slot-scope="scope">
          <span v-if="1 == teamInfo.team_status">{{ $t('3f4c07c6.fb852f') }}</span>
          <span v-else-if="2 == teamInfo.team_status">{{ $t('3f4c07c6.1e792a') }}</span>
          <span v-else>{{ $t('3f4c07c6.11afd7') }}</span>
          |
          <span v-if="'NOTPAY' == scope.row.order_status">{{ $t('3f4c07c6.608afd') }}</span>
          <span v-else-if="'CANCEL' == scope.row.order_status">{{ $t('3f4c07c6.cc30f5') }}</span>
          <span v-else-if="'DONE' == scope.row.order_status">{{ $t('3f4c07c6.eb5dc9') }}</span>
          <span v-else-if="'PAYED' == scope.row.order_status">{{ $t('3f4c07c6.eb5dc9') }}</span>
          <span v-else-if="'REFUND_PROCESS' == scope.row.order_status">{{
            $t('3f4c07c6.07e608')
          }}</span>
          <span v-else-if="'REFUND_SUCCESS' == scope.row.order_status">{{
            $t('3f4c07c6.d58cbd')
          }}</span>
          <span v-else>{{ $t('3f4c07c6.3515e2') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('3f4c07c6.3e8657')">
        <template slot-scope="scope">
          <router-link
            v-if="scope.row.order_id"
            class="text-blue-400"
            :to="{
              path: `/order/order-manage/order-list/detail`,
              query: { orderId: scope.row.order_id, resource: '/mall/trade/service' }
            }"
          >
            {{ $t('3f4c07c6.f26225') }}
          </router-link>
          <span v-else>{{ $t('3f4c07c6.fa0061') }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="total_count > params.pageSize" class="content-center content-top-padded">
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
  data() {
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
  mounted() {
    this.team_id = this.$route.params.team_id
    this.getGroupsTeamInfo()
  },
  methods: {
    handleCurrentChange(pageNum) {
      this.params.page = pageNum
    },
    getGroupsTeamInfo() {
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
            message: this.$t('3f4c07c6.7ac5b0')
          })
        })
    }
  }
}
</script>

<style scoped></style>
