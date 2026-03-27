<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-table v-loading="loadingTable" :data="list" style="width: 100%">
      <el-table-column prop="salesperson_name" :label="$t('59a747c4.a33c35')" />
      <el-table-column prop="times" :label="$t('59a747c4.667fa5')" />
      <el-table-column prop="percentage" :label="$t('59a747c4.68de5f')" />
    </el-table>
    <div class="mt-4 text-right">
      <el-pagination
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
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

import { getSalesperosnTaskStatistics } from '@/api/shop'

export default {
  data() {
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
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loadingTable = true
      getSalesperosnTaskStatistics(this.params).then((response) => {
        this.list = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loadingTable = false
      })
    },
    handelClickSearch() {
      this.getList()
    },
    handleSizeChange(val) {
      this.params.page = 1
      this.params.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
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
