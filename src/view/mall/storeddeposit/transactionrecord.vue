<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="section-white content-padded">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-date-picker
          v-model="create_time"
          value-format="yyyy/MM/dd"
          type="daterange"
          :placeholder="$t('8276292e.4b8cb9')"
          style="width: 100%"
          @change="dateChange"
        />
      </el-col>
      <el-col :span="6">
        <el-input v-model="shop_name" :placeholder="$t('8276292e.a7da92')" @change="storeChange" />
      </el-col>
      <el-col :span="6"> &nbsp; </el-col>
      <el-col :span="6">
        <el-input v-model="mobile" :placeholder="$t('8276292e.6dfa37')">
          <el-button slot="append" icon="el-icon-search" @click="numberSearch" />
        </el-input>
      </el-col>
    </el-row>
    <div class="record-list">
      <el-table
        v-loading="loading"
        :data="recordList"
        :height="wheight - 250"
        @filter-change="filterTag"
      >
        <el-table-column
          prop="tradeType"
          column-key="type"
          :label="$t('8276292e.4e5463')"
          width="180"
          :filters="typeFilters"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            {{ scope.row.tradeType | formatTypeStr }}
          </template>
        </el-table-column>
        <el-table-column prop="timeStart" :label="$t('8276292e.eca37c')">
          <template slot-scope="scope">
            <span>{{ scope.row.timeStart | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="depositTradeId" :label="$t('8276292e.fa68e9')" />
        <el-table-column prop="mobile" :label="$t('8276292e.18b642')" />
        <el-table-column prop="money" :label="$t('8276292e.4cf24a')">
          <template slot-scope="scope">
            <span>{{ scope.row.money / 100 }}{{ $t('7f31cab4.c16655') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="shopName" :label="$t('8276292e.a7da92')" />
      </el-table>
    </div>
    <div v-if="total_count > pageSize" class="tc" style="margin-top: 20px">
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
import { mapGetters } from 'vuex'
import { i18n } from '@/i18n'
import { getDepositTradeList, getDepositCountIndex } from '../../../api/deposit'
export default {
  props: ['getStatus'],
  data() {
    return {
      loading: false,
      create_time: '',
      shop_name: '',
      mobile: '',
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
    ...mapGetters(['wheight']),
    typeFilters() {
      return [
        { text: this.$t('8276292e.415b28'), value: 'recharge' },
        { text: this.$t('8276292e.7be24a'), value: 'recharge_gift' },
        { text: this.$t('8276292e.58cd6d'), value: 'consume' },
        { text: this.$t('8276292e.f1398c'), value: 'recharge_send' },
        { text: this.$t('8276292e.d6b434'), value: 'refund' }
      ]
    }
  },
  watch: {
    getStatus(newVal, oldVal) {
      if (newVal) {
        let query = { pageSize: this.pageSize, page: 1 }
        this.getList(query)
      }
    }
  },
  methods: {
    filterTag(val) {
      if (val.type.length > 0 && val.type.length != this.typeFilters.length) {
        this.trade_type = val.type.join(',')
      } else {
        this.trade_type = ''
      }
      this.params.page = 1
      this.getParams()
      this.getList(this.params)
    },
    numberSearch(e) {
      this.params.page = 1
      this.getParams()
      this.getList(this.params)
    },
    dateChange(val) {
      if (val.length > 0) {
        this.date_begin = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.date_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.date_begin = ''
        this.date_end = ''
      }
      this.params.page = 1
      this.getParams()
      this.getList(this.params)
    },
    storeChange(val) {
      this.params.shop_name = val
      this.params.page = 1
      this.getParams()
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
      this.params.date_begin = this.date_begin
      this.params.date_end = this.date_end
      this.params.mobile = this.mobile
      this.params.shop_name = this.shop_name
      this.params.trade_type = this.trade_type
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    }
  },
  filters: {
    formatTypeStr(str) {
      const map = {
        recharge: '8276292e.415b28',
        consume: '8276292e.58cd6d',
        recharge_gift: '8276292e.7be24a',
        refund: '8276292e.d6b434',
        recharge_send: '8276292e.f1398c'
      }
      return map[str] ? i18n.t(map[str]) : str
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
