<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-table v-loading="loading" :data="groupsTeamList" style="width: 100%" border height="580">
      <el-table-column prop="username" :label="$t('50b00a23.15d03b')" />
      <el-table-column :label="$t('50b00a23.19fcb9')">
        <template slot-scope="scope">
          {{ scope.row.begin_time | datetime('YYYY-MM-DD HH:mm:ss') }} -
          {{ scope.row.end_time | datetime('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('50b00a23.0bedaa')" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.team_status == 1">{{ $t('50b00a23.fb852f') }}</span>
          <span v-else-if="scope.row.team_status == 2">{{ $t('50b00a23.330363') }}</span>
          <span v-else>{{ $t('50b00a23.acd5cb') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('50b00a23.e77dad')">
        <template slot-scope="scope">
          {{ scope.row.join_person_num }}/{{ groupsActivity.person_num }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('50b00a23.2b6bc0')" width="250">
        <template slot-scope="scope">
          <el-button size="mini" @click="showTeamAction(scope.$index, scope.row)">
            {{ $t('50b00a23.607e7a') }}
          </el-button>
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
import { getGroupsTeamList } from '../../../../api/promotions'

export default {
  props: ['view'],
  data() {
    return {
      loading: false,
      groups_id: null,
      groupsTeamList: [],
      groupsActivity: {},
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
    this.groups_id = this.$route.params.groups_id
    this.params.view = this.view
    this.getGroupsTeamList()
  },
  methods: {
    handleCurrentChange(pageNum) {
      this.params.page = pageNum
      this.getGroupsTeamList()
    },
    getGroupsTeamList() {
      this.loading = true
      getGroupsTeamList(this.groups_id, this.params)
        .then((response) => {
          this.groupsTeamList = response.data.data.list
          this.groupsActivity = response.data.data.groupsActivity
          this.total_count = response.data.data.total_count
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: this.$t('50b00a23.51081c')
          })
        })
    },
    showTeamAction(index, row) {
      this.$router.push({ path: '/marketing/fission-marketing/group-buying/detail/' + row.team_id })
    }
  }
}
</script>

<style scoped></style>
