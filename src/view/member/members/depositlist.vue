<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="section-white">
    <div class="record-list">
      <el-table v-loading="loading" :data="recordList" border @filter-change="filterTag">
        <el-table-column
          prop="tradeType"
          column-key="type"
          :label="$t('11682082.4e5463')"
          width="180"
          :filters="typeFilters"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            {{ getTradeTypeLabel(scope.row.tradeType) }}
          </template>
        </el-table-column>
        <el-table-column prop="timeStart" :label="$t('11682082.eca37c')">
          <template slot-scope="scope">
            <span>{{ scope.row.timeStart | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="depositTradeId" :label="$t('11682082.fa68e9')" />
        <el-table-column prop="money" :label="$t('11682082.4cf24a')">
          <template slot-scope="scope">
            <span>{{ scope.row.money / 100 }}元</span>
          </template>
        </el-table-column>
        <el-table-column prop="detail" :label="$t('11682082.2432b5')" />
        <el-table-column prop="shopName" :label="$t('11682082.a7da92')" />
      </el-table>
    </div>
    <div v-if="total_count > pageSize" class="content-padded tc">
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
  props: ['userId', 'isLoad'],
  data() {
    return {
      loading: false,
      trade_type: '',
      total_count: 0,
      pageSize: 20,
      recordList: [],
      params: {
        page: 1
      },
      date_begin: '',
      date_end: ''
    }
  },
  computed: {
    typeFilters() {
      return [
        { text: this.$t('11682082.415b28'), value: 'recharge' },
        { text: this.$t('11682082.7be24a'), value: 'recharge_gift' },
        { text: this.$t('11682082.58cd6d'), value: 'consume' },
        { text: this.$t('11682082.f1398c'), value: 'recharge_send' },
        { text: this.$t('11682082.d6b434'), value: 'refund' }
      ]
    }
  },
  watch: {
    userId(newVal, oldVal) {
      if (this.isLoad) {
        let query = { pageSize: this.pageSize, page: 1, user_id: newVal }
        this.getList(query)
      }
    },
    isLoad(newVal, oldVal) {
      if (newVal) {
        let query = { pageSize: this.pageSize, page: 1, user_id: this.userId }
        this.getList(query)
      }
    }
  },
  mounted() {
    // let query = {pageSize: this.pageSize, page: 1}
    // this.getList(query)
  },
  methods: {
    getTradeTypeLabel(type) {
      const map = {
        recharge: '11682082.415b28',
        consume: '11682082.58cd6d',
        recharge_gift: '11682082.7be24a',
        refund: '11682082.d6b434',
        recharge_send: '11682082.f1398c'
      }
      return this.$t(map[type] || '')
    },
    filterTag(val) {
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
    handleCurrentChange(val) {
      this.params.page = val
      this.params.pageSize = this.pageSize
      this.getList(this.params)
    },
    getList(query) {
      this.loading = true
      getDepositTradeList(query).then((res) => {
        this.recordList = res.data.data.list
        this.total_count = res.data.data.total_count
        this.loading = false
      })
    },
    getParams() {
      // this.params.date_begin = this.date_begin
      // this.params.date_end = this.date_end
      // this.params.mobile = this.mobile
      // this.params.shop_name = this.shop_name
      this.params.trade_type = this.trade_type
    },
    dateStrToTimeStamp(str) {
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
