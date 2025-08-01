<template>
  <div class="section-white">
    <div class="transfer-list">
      <el-table v-loading="loading" :data="transferList" border>
        <el-table-column prop="rights_name" label="权益名称" />
        <el-table-column prop="timeStart" label="转让时间">
          <template slot-scope="scope">
            <span>{{ scope.row.created | datetime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="原持有者" />
        <el-table-column prop="transfer_mobile" label="现持有者" />
        <el-table-column prop="remark" label="备注" />
      </el-table>
    </div>
    <div v-if="total_count > params.pageSize" class="content-padded tc">
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
import { transferRightsList } from '../../../api/trade'
export default {
  props: ['userId', 'userMobile', 'isLoad'],
  data() {
    return {
      loading: false,
      total_count: 0,
      transferList: [],
      currentPage: 1,
      pageSize: 20,
      params: {}
    }
  },
  watch: {
    userId(newVal, oldVal) {
      if (this.isLoad) {
        this.params = { page: this.currentPage, pageSize: this.pageSize, user_id: newVal }
        this.getList(this.params)
      }
    },
    isLoad(newVal, oldVal) {
      if (newVal) {
        this.params = { page: this.currentPage, pageSize: this.pageSize, user_id: this.userId }
        this.getList(this.params)
      }
    }
  },
  mounted() {
    this.params.user_id = this.userId
    this.getParams()
    this.getList(this.params)
  },
  methods: {
    getList(params) {
      this.loading = true
      transferRightsList(params).then(res => {
        this.transferList = res.data.data.list
        this.total_count = res.data.data.total_count
        this.loading = false
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.loading = false
      this.getParams()
      this.getList(this.params)
    },
    getParams() {
      this.params.page = this.currentPage
      this.params.pageSize = this.pageSize
    }
  }
}
</script>
<style type="text/css">
.record-list .el-table .cell,
.record-list .el-table th > div {
  padding-left: 10px;
  padding-right: 10px;
}
</style>
