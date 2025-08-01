<template>
  <div>
    <el-table v-loading="loading" :data="cardList" style="width: 100%" border height="600">
      <!-- <el-table-column prop="title" label="优惠券名称" width="200"></el-table-column> -->
      <el-table-column prop="code" label="优惠券码" width="120" />
      <el-table-column prop="username" label="用户名字" width="150" />
      <el-table-column prop="mobile" label="手机号" width="120" />
      <el-table-column prop="used_status" label="操作途径" width="100">
        <template slot-scope="scope">
          <template v-if="scope.row.used_status == 'callback'"> 回退 </template>
          <template v-else> 核销 </template>
        </template>
      </el-table-column>
      <el-table-column prop="used_time" label="记录时间" width="170" />
      <el-table-column prop="shop_name" label="核销门店" />
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next"
      :current-page.sync="params.page"
      :page-sizes="[10, 20, 50]"
      :total="total_count"
      :page-size="params.pageSize"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
import { getCardUserList } from '../../../../api/cardticket'

export default {
  props: ['getStatus'],
  data() {
    return {
      loading: false,
      total_count: 0,
      cardList: [],
      params: {
        card_id: 0,
        is_use: true,
        page: 1,
        pageSize: 20
      }
    }
  },
  watch: {
    getStatus(val) {
      if (val) {
        this.getCardUserList()
      }
    }
  },
  mounted() {
    if (this.$route.query.cardId) {
      this.params.card_id = this.$route.query.cardId
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.params.page = val
      this.getCardUserList()
    },
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getCardUserList()
    },
    getCardUserList() {
      this.loading = true
      getCardUserList(this.params)
        .then(res => {
          if (res.data.data.list.length > 0) {
            this.cardList = res.data.data.list
            this.total_count = res.data.data.total_count
            this.loading = false
          } else {
            this.cardList = []
            this.loading = false
          }
        })
        .catch(error => {
          this.loading = false
        })
    }
  }
}
</script>
<style scoped lang="scss"></style>
