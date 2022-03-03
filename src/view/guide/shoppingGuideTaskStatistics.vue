<template>
  <div>
    <el-table
      v-loading="loadingTable"
      :data="list"
      style="width: 100%"
    >
      <el-table-column
        prop="salesperson_name"
        label="导购员名称"
      />
      <el-table-column
        prop="times"
        label="完成次数"
      />
      <el-table-column
        prop="percentage"
        label="完成占比"
      />
    </el-table>
    <el-pagination
      class="content-padded content-center"
      background
      :current-page="params.page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="params.page_size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total_count"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

import { getSalesperosnTaskStatistics } from '@/api/shop'

export default {
  data () {
    return {
      loadingTable: false,
      list: [],
      total_count: 0,
      params: {
        //分页
        page: 1,
        page_size: 10,
        task_id: 1
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      this.loadingTable = true
      getSalesperosnTaskStatistics(this.params).then((response) => {
        this.list = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loadingTable = false
      })
    },
    handelClickSearch () {
      this.getList()
    },
    handleSizeChange (val) {
      this.params.page = 1
      this.params.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.paging.page = val
      this.getList()
    }
  }
}
</script>

<style scoped lang="scss">
.shoppingguidenotification {
  .flex {
    display: flex;
  }
  &-header {
    height: 73px;
  }
  .label {
    width: 105px;
  }
  .ma-t {
    margin-top: 30px;
  }
  .ma-r {
    margin-right: 20px;
  }
}
</style>
