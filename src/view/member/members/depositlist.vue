<template>
  <div class="section-white">
    <div class="record-list">
      <el-table
        v-loading="loading"
        :data="recordList"
        border
        @filter-change="filterTag"
      >
        <el-table-column
          prop="tradeType"
          column-key="type"
          label="交易记录类型"
          width="180"
          :filters="typeFilters"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            {{ scope.row.tradeType | formatTypeStr }}
          </template>
        </el-table-column>
        <el-table-column
          prop="timeStart"
          label="创建时间"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.timeStart | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="depositTradeId"
          label="交易流水号"
        />
        <el-table-column
          prop="money"
          label="金额"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.money / 100 }}元</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="detail"
          label="备注"
        />
        <el-table-column
          prop="shopName"
          label="门店"
        />
      </el-table>
    </div>
    <div
      v-if="total_count > pageSize"
      class="content-padded tc"
    >
      <el-pagination
        layout="prev, pager, next"
        :current-page.sync="params.page"
        :total="total_count"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { getDepositTradeList, getDepositCountIndex } from '../../../api/deposit'
export default {
  filters: {
    formatTypeStr (str) {
      switch (str) {
        case 'recharge':
          str = '充值记录'
          break
        case 'consume':
          str = '消费记录'
          break
        case 'recharge_gift':
          str = '赠送记录'
          break
        case 'refund':
          str = '退回记录'
          break
        case 'recharge_send':
          str = '返佣记录'
          break
      }
      return str
    }
  },
  props: ['userId', 'isLoad'],
  data () {
    return {
      loading: false,
      trade_type: '',
      total_count: 0,
      pageSize: 20,
      recordList: [],
      typeFilters: [
        { text: '充值记录', value: 'recharge' },
        { text: '赠送记录', value: 'recharge_gift' },
        { text: '消费记录', value: 'consume' },
        { text: '返佣记录', value: 'recharge_send' },
        { text: '退回记录', value: 'refund' }
      ],
      params: {
        page: 1
      },
      date_begin: '',
      date_end: ''
    }
  },
  watch: {
    userId (newVal, oldVal) {
      if (this.isLoad) {
        let query = { pageSize: this.pageSize, page: 1, user_id: newVal }
        this.getList(query)
      }
    },
    isLoad (newVal, oldVal) {
      if (newVal) {
        let query = { pageSize: this.pageSize, page: 1, user_id: this.userId }
        this.getList(query)
      }
    }
  },
  mounted () {
    // let query = {pageSize: this.pageSize, page: 1}
    // this.getList(query)
  },
  methods: {
    filterTag (val) {
      if (val.type.length > 0 && val.type.length != this.typeFilters.length) {
        this.trade_type = val.type.join(',')
      } else {
        this.trade_type = ''
      }
      this.getParams()
      this.params.page = 1
      this.params.user_id = this.userId
      this.getList(this.params)
    },
    handleCurrentChange (val) {
      this.params.page = val
      this.params.pageSize = this.pageSize
      this.getList(this.params)
    },
    getList (query) {
      this.loading = true
      getDepositTradeList(query).then((res) => {
        this.recordList = res.data.data.list
        this.total_count = res.data.data.total_count
        this.loading = false
      })
    },
    getParams () {
      // this.params.date_begin = this.date_begin
      // this.params.date_end = this.date_end
      // this.params.mobile = this.mobile
      // this.params.shop_name = this.shop_name
      this.params.trade_type = this.trade_type
    },
    dateStrToTimeStamp (str) {
      return Date.parse(new Date(str)) / 1000
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
