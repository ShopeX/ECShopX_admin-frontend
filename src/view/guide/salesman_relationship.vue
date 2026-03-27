<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-card v-loading="loading">
    <el-table :data="list">
      <el-table-column :label="$t('17e08149.a6d9eb')">
        <template slot-scope="scope">
          {{ scope.row.salesperson_info.salesman_name }}
        </template>
      </el-table-column>
      <el-table-column prop="work_userid" :label="$t('17e08149.f1215f')" />
      <el-table-column :label="$t('17e08149.4d9dd5')">
        <template slot-scope="scope">
          <router-link
            :to="{
              path: '/member/member/memberlist/detail',
              query: { user_id: scope.row.user_id }
            }"
          >
            {{ scope.row.user_info.username }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column :label="$t('17e08149.884694')">
        <template slot-scope="scope">
          <span v-if="scope.row.is_friend == 0">{{ $t('17e08149.c9744f') }}</span>
          <span v-else>{{ $t('17e08149.0a60ac') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('17e08149.d388c5')">
        <template slot-scope="scope">
          <span v-if="scope.row.is_bind == 0">{{ $t('17e08149.c9744f') }}</span>
          <span v-else>{{ $t('17e08149.0a60ac') }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-4 text-right">
      <el-pagination
        background
        :current-page="params.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total_count"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-card>
</template>
<script>
import { getWorkWechatRelList } from '@/api/wechat'
export default {
  data() {
    return {
      loading: false,
      salesperson_id: 0,
      list: [],
      total_count: 0,
      params: {
        page: 1,
        pageSize: 20,
        is_friend: 0,
        is_bind: 0
      }
    }
  },
  mounted() {
    if (this.$route.query.salesperson_id) {
      this.salesperson_id = this.$route.query.salesperson_id
    }
    if (this.$route.query.is_friend) {
      this.params.is_friend = this.$route.query.is_friend
    }
    if (this.$route.query.is_bind) {
      this.params.is_bind = this.$route.query.is_bind
    }
    this.getWorkWechatRelList()
  },
  methods: {
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getWorkWechatRelList()
    },
    getWorkWechatRelList() {
      this.loading = true
      getWorkWechatRelList(this.salesperson_id, this.params).then((res) => {
        this.list = res.data.data.list
        this.total_count = res.data.data.total_count
        this.loading = false
      })
    }
  }
}
</script>
<style scoped lang="scss"></style>
