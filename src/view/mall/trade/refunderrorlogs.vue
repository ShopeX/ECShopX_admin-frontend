<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input
          v-model="params.order_id"
          placeholder="请输入订单号"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="dataSearch"
          />
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-date-picker
          v-model="create_time"
          type="daterange"
          value-format="yyyy/MM/dd"
          placeholder="添加时间筛选"
          style="width: 100%"
          @change="dateChange"
        />
      </el-col>
    </el-row>

    <el-tabs
      v-model="activeName"
      type="border-card"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="未处理"
        name="waiting"
      />
      <el-tab-pane
        label="已处理"
        name="is_resubmit"
      />
      <el-tab-pane
        label="全部"
        name="all"
      />

      <el-table
        v-loading="loading"
        :data="dataList"
        :height="wheight - 150"
      >
        <el-table-column
          prop="order_id"
          label="订单号"
          width="180"
        />
        <el-table-column
          prop="status"
          label="错误状态"
          width="120"
        />
        <el-table-column
          prop="error_code"
          label="错误码"
          width="100"
        />
        <el-table-column
          prop="error_desc"
          label="错误描述"
        />
        <el-table-column
          prop="create_time"
          label="创建时间"
          width="200"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_resubmit"
          label="是否已重新提交"
          width="120"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.is_resubmit"> 已提交</span>
            <span v-else> 未提交</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="100"
        >
          <template slot-scope="scope">
            <el-link v-if="scope.row.is_resubmit === false">
              <el-button
                type="primary"
                size="mini"
                @click="refundResubmit(scope.row)"
              >
                重新提交
              </el-button>
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="content-padded content-center">
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
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getRefundErrorLogsList, refundResubmit } from '../../../api/trade'

export default {
  data () {
    return {
      create_time: '',
      activeName: 'waiting',
      loading: false,
      total_count: 0,
      dataList: [],
      params: {
        page: 1,
        pageSize: 20,
        order_id: '',
        status: 'waiting'
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted () {
    this.getDataList(this.params)
  },
  methods: {
    handleClick (tab, event) {
      this.activeName = tab.name
      this.params.status = tab.name == 'all' ? '' : tab.name
      this.params.page = 1
      this.getDataList(this.params)
    },
    dataSearch () {
      this.params.start_time = ''
      this.params.end_time = ''
      this.create_time = ''
      this.params.page = 1
      this.getDataList(this.params)
    },
    getDataList (filter) {
      this.loading = true
      getRefundErrorLogsList(filter).then((response) => {
        this.dataList = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    dateChange (val) {
      this.params.status = ''
      if (val && val.length > 0) {
        this.params.start_time = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.params.end_time = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.params.start_time = ''
        this.params.end_time = ''
      }
      this.params.page = 1
      this.getDataList(this.params)
    },
    dateStrToTimeStamp (str) {
      return Date.parse(new Date(str)) / 1000
    },
    refundResubmit (row) {
      refundResubmit(row.id).then((res) => {
        this.$message.success('提交成功!')
        this.getDataList(this.params)
      })
    },
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getDataList(this.params)
    },
    handleSizeChange (pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getDataList(this.params)
    }
  }
}
</script>
