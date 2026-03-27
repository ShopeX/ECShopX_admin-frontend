<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input v-model="identifier" :placeholder="$t('ee7d0777.afc795')">
          <el-button slot="append" icon="el-icon-search" @click="numberSearch" />
        </el-input>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="dataList" :height="wheight - 150">
      <el-table-column prop="shop_name" :label="$t('ee7d0777.740032')" width="150" />
      <el-table-column prop="attendant" :label="$t('ee7d0777.4dd82e')" width="120" />
      <el-table-column prop="name" :label="$t('ee7d0777.ec69fc')" width="120" />
      <el-table-column prop="salesperson_mobile" :label="$t('ee7d0777.b0d2f1')" width="120" />
      <el-table-column prop="rights_name" :label="$t('ee7d0777.01295d')" width="200" />
      <el-table-column prop="user_name" :label="$t('ee7d0777.733d42')" width="100" />
      <el-table-column prop="user_mobile" :label="$t('ee7d0777.6a52ee')" width="120" />
      <el-table-column prop="user_sex" :label="$t('ee7d0777.319847')" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.user_sex == '2'">{{ $t('ee7d0777.87c835') }}</span>
          <span v-else-if="scope.row.user_sex == '1'">{{ $t('ee7d0777.36a490') }}</span>
          <span v-else>{{ $t('ee7d0777.1622dc') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="end_time" :label="$t('ee7d0777.4dbab1')" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.end_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="total_count > params.pageSize" class="mt-4 text-right">
      <el-pagination
        layout="prev, pager, next"
        :current-page.sync="params.page"
        :total="total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getRightsLogList } from '../../../api/trade'
export default {
  props: ['userId', 'isLoad'],
  data() {
    return {
      loading: false,
      total_count: 0,
      dataList: [],
      identifier: '',
      create_time: '',
      date_begin: '',
      date_end: '',
      params: {
        page: 1,
        pageSize: 20
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    userId(newVal, oldVal) {
      if (this.isLoad) {
        this.params.user_id = newVal
        this.getParams()
        this.getDataList(this.params)
      }
    },
    isLoad(newVal, oldVal) {
      if (newVal) {
        this.params.user_id = this.userId
        this.getParams()
        this.getDataList(this.params)
      }
    }
  },
  mounted() {
    let param = { page: 1, pageSize: 20 }
    this.params.user_id = this.userId
    this.getParams()
    this.getDataList(this.params)
  },
  methods: {
    numberSearch(e) {
      this.params.page = 1
      this.getParams()
      this.getDataList(this.params)
    },
    dateChange(val) {
      if (val && val.length > 0) {
        this.date_begin = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.date_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.date_begin = ''
        this.date_end = ''
      }
      this.params.page = 1
      this.getParams()
      this.getDataList(this.params)
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    getParams() {
      this.params.time_start_begin = this.date_begin
      this.params.time_start_end = this.date_end
      this.params.mobile = this.identifier
    },
    getDataList(filter) {
      this.loading = true
      getRightsLogList(filter).then((response) => {
        this.dataList = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getDataList(this.params)
    }
  }
}
</script>
