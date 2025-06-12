<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}
</style>

<template>
  <div class="page-body">
    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
      <SpFilterFormItem prop="order_id" label="订单号:">
        <el-input v-model="params.order_id" placeholder="请输入订单号" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="create_time" label="日期范围:">
        <el-date-picker
          v-model="params.create_time"
          type="daterange"
          value-format="yyyy/MM/dd"
          placeholder="添加时间筛选"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="status" label="处理状态:">
        <el-select v-model="params.status" placeholder="请选择处理状态">
          <el-option
            v-for="(item, index) in statusList"
            :key="index"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
    </SpFilterForm>

    <el-table v-loading="loading" border :data="tableList" :height="wheight - 150">
      <el-table-column prop="order_id" label="订单号" width="180" />
      <el-table-column prop="status" label="错误状态" width="120" />
      <el-table-column prop="error_code" label="错误码" width="100" />
      <el-table-column prop="error_desc" label="错误描述" />
      <el-table-column prop="create_time" label="创建时间" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="is_resubmit" label="是否已重新提交" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.is_resubmit"> 已提交</span>
          <span v-else> 未提交</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-link v-if="scope.row.is_resubmit === false">
            <el-button type="primary" size="mini" @click="refundResubmit(scope.row)">
              重新提交
            </el-button>
          </el-link>
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
import mixin, { pageMixin } from '@/mixins'

export default {
  mixins: [mixin, pageMixin],
  data() {
    const initialParams = {
      create_time: '',
      order_id: undefined,
      status: 'all'
    }
    return {
      initialParams,
      loading: false,
      params: {
        ...initialParams
      },
      statusList: [
        { name: '全部', value: 'all' },
        { name: '已处理', value: 'is_resubmit' },
        { name: '未处理', value: 'waiting' }
      ]
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
      if (val.length > 0) {
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
        status: this.params.status || undefined
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
      const { list, total_count } = await this.$api.trade.getRefundErrorLogsList(params)
      this.tableList = list
      this.page.total = total_count
      this.loading = false
    },
    async refundResubmit(row) {
      await this.$api.trade.refundResubmit(row.id)
      this.$message.success('提交成功!')
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
    }
  }
}
</script>
