<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}
</style>

<template>
  <div class="page-body">
    <SpFilterForm
      :model="params"
      @onSearch="onSearch"
      @onReset="onReset"
    >
      <SpFilterFormItem
        prop="order_id"
        label="指令ID:"
      >
        <el-input
          v-model="params.division_id"
          placeholder="请输入指令ID"
        />
      </SpFilterFormItem>
      <SpFilterFormItem
        prop="order_id"
        label="订单号:"
      >
        <el-input
          v-model="params.order_id"
          placeholder="请输入订单号"
        />
      </SpFilterFormItem>
      <SpFilterFormItem
        prop="create_time"
        label="日期范围:"
      >
        <el-date-picker
          v-model="params.create_time"
          type="daterange"
          value-format="yyyy/MM/dd"
          placeholder="添加时间筛选"
        />
      </SpFilterFormItem>
    </SpFilterForm>
    <div class="action-container">
      <exportTip @exportHandle="exportData">
        <el-button
          type="primary"
          plain
        >
          导出
        </el-button>
      </exportTip>
    </div>
    <el-table
      v-loading="loading"
      border
      :data="tableList"
      :height="wheight - 150"
    >
      <el-table-column
        prop="division_id"
        label="指令ID"
        width="100"
      />
      <el-table-column
        prop="order_id"
        label="订单号"
        width="180"
      />
      <el-table-column
        prop="total_fee"
        label="订单金额"
      >
        <template slot-scope="scope">
          ￥{{ scope.row.total_fee / 100 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="actual_fee"
        label="实际金额"
      >
        <template slot-scope="scope">
          ￥{{ scope.row.actual_fee / 100 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="commission_rate_fee"
        label="收单手续费"
      >
        <template slot-scope="scope">
          ￥{{ scope.row.commission_rate_fee / 100 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="division_fee"
        label="分账金额"
      >
        <template slot-scope="scope">
          ￥{{ scope.row.division_fee / 100 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间"
        width="200"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="content-padded content-center">
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
  mixins: [mixin, pageMixin],
  components: {
    exportTip
  },
  data () {
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
  mounted () {
    this.fetchList()
  },
  methods: {
    dateStrToTimeStamp (str) {
      return Date.parse(new Date(str)) / 1000
    },
    dateTransfer (val) {
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
    getParams () {
      let params = {
        ...this.dateTransfer(this.params.create_time),
        order_id: this.params.order_id || undefined,
        division_id: this.params.division_id || undefined
      }
      return params
    },
    async fetchList () {
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
    onSearch () {
      this.page.pageIndex = 1
      this.$nextTick(() => {
        this.fetchList()
      })
    },
    onReset () {
      this.params = { ...this.initialParams }
      this.onSearch()
    },
    async exportData () {
      const { status, url, filename } = await this.$api.trade.chinaumsDivisionDetailExportData(this.getParams())
      if (status) {
        this.$message({
          type: 'success',
          message: '已加入执行队列，请在设置-导出列表中下载'
        })
        // this.$export_open('chinaums_division')
        return
      } else if (url) {
        this.downloadUrl = url
        this.downloadName = filename
        this.downloadView = true
      }
    },
  }
}
</script>
