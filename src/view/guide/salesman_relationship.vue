<template>
  <el-card v-loading="loading">
    <el-table :data="list">
      <el-table-column label="导购员">
        <template slot-scope="scope">
          {{ scope.row.salesperson_info.salesman_name }}
        </template>
      </el-table-column>
      <el-table-column
        prop="work_userid"
        label="导购员企业微信userid"
      />
      <el-table-column label="会员">
        <template slot-scope="scope">
          <router-link
            :to="{ path: '/member/member/detail', query: { user_id: scope.row.user_id } }"
          >
            {{ scope.row.user_info.username }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="是否是朋友">
        <template slot-scope="scope">
          <span v-if="scope.row.is_friend == 0">否</span>
          <span v-else>是</span>
        </template>
      </el-table-column>
      <el-table-column label="是否绑定">
        <template slot-scope="scope">
          <span v-if="scope.row.is_bind == 0">否</span>
          <span v-else>是</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="content-padded content-center"
      background
      :current-page="params.page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="params.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total_count"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>
<script>
import { getWorkWechatRelList } from '@/api/wechat'
export default {
  data () {
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
  mounted () {
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
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getWorkWechatRelList()
    },
    getWorkWechatRelList () {
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
