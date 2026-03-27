<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}
</style>

<template>
  <div class="page-body">
    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
      <SpFilterFormItem prop="order_id" :label="$t('a23a610a.429106')">
        <el-input v-model="params.division_id" :placeholder="$t('a23a610a.40bf18')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="order_id" :label="$t('a23a610a.070dce')">
        <el-input v-model="params.order_id" :placeholder="$t('a23a610a.e9e836')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="create_time" :label="$t('a23a610a.8d3bf9')">
        <el-date-picker
          v-model="params.create_time"
          type="daterange"
          value-format="yyyy/MM/dd"
          :placeholder="$t('a23a610a.5d92ab')"
        />
      </SpFilterFormItem>
    </SpFilterForm>
    <div class="action-container">
      <el-button type="primary" @click="exportData"> {{ $t('a23a610a.55405e') }} </el-button>
    </div>
    <el-table v-loading="loading" border :data="tableList" :height="wheight - 150">
      <el-table-column prop="division_id" :label="$t('a23a610a.662bb7')" width="100" />
      <el-table-column prop="order_id" :label="$t('a23a610a.1e8dc2')" width="180" />
      <el-table-column prop="total_fee" :label="$t('a23a610a.b1862e')">
        <template slot-scope="scope"> ￥{{ scope.row.total_fee / 100 }} </template>
      </el-table-column>
      <el-table-column prop="actual_fee" :label="$t('a23a610a.dff07e')">
        <template slot-scope="scope"> ￥{{ scope.row.actual_fee / 100 }} </template>
      </el-table-column>
      <el-table-column prop="commission_rate_fee" :label="$t('a23a610a.2e9852')">
        <template slot-scope="scope"> ￥{{ scope.row.commission_rate_fee / 100 }} </template>
      </el-table-column>
      <el-table-column prop="division_fee" :label="$t('a23a610a.1e61f1')">
        <template slot-scope="scope"> ￥{{ scope.row.division_fee / 100 }} </template>
      </el-table-column>
      <el-table-column prop="create_time" :label="$t('a23a610a.eca37c')" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-4 text-right">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :current-page.sync="page.pageIndex"
        :page-sizes="[10, 20, 50]"
        :total="page.total"
        :page-size="page.pageSize"
        @current-change="onCurrentChange"
        @size-change="onSizeChange"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import exportTip from '@/components/export_tips'
import mixin, { pageMixin } from '@/mixins'

export default {
  components: {
    exportTip
  },
  mixins: [mixin, pageMixin],
  data() {
    const initialParams = {
      create_time: '',
      order_id: undefined,
      division_id: undefined
    }
    return {
      initialParams,
      loading: false,
      params: {
        ...initialParams
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    dateTransfer(val) {
      let time_start_begin = undefined
      let time_start_end = undefined
      if (val) {
        time_start_begin = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        time_start_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      }
      return {
        time_start_begin,
        time_start_end
      }
    },
    getParams() {
      let params = {
        ...this.dateTransfer(this.params.create_time),
        order_id: this.params.order_id || undefined,
        division_id: this.params.division_id || undefined
      }
      return params
    },
    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.getParams()
      }
      const { list, total_count } = await this.$api.trade.chinaumsDivisionDetailList(params)
      this.tableList = list
      this.page.total = total_count
      this.loading = false
    },
    onSearch() {
      this.page.pageIndex = 1
      this.$nextTick(() => {
        this.fetchList()
      })
    },
    onReset() {
      this.params = { ...this.initialParams }
      this.onSearch()
    },
    async exportData() {
      const { status, url, filename } = await this.$api.trade.chinaumsDivisionDetailExportData(
        this.getParams()
      )
      if (status) {
        this.$message({
          type: 'success',
          message: this.$t('a23a610a.3e1ddd')
        })
        return
      } else if (url) {
        this.downloadUrl = url
        this.downloadName = filename
        this.downloadView = true
      }
    }
  }
}
</script>
