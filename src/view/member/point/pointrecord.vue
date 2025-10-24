<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <div class="section-white content-padded">
    <!-- <el-row :gutter="20">
      <el-col :span="6">
        <el-date-picker
          v-model="created"
          value-format="yyyy/MM/dd"
          type="daterange"
          placeholder="选择日期范围"
          style="width: 100%"
          @change="dateChange"
        />
      </el-col>
      <el-col :span="6">
        <el-input v-model="mobile" placeholder="手机号">
          <el-button slot="append" icon="el-icon-search" @click="numberSearch" />
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-input v-model="username" placeholder="昵称">
          <el-button slot="append" icon="el-icon-search" @click="numberSearch" />
        </el-input>
      </el-col>
    </el-row> -->
    <SpFilterForm :model="params" @onSearch="getList(params)" @onReset="getList(params)">
      <SpFilterFormItem prop="created" label="日期范围:">
        <el-date-picker
          v-model="params.created"
          value-format="yyyy/MM/dd"
          type="daterange"
          placeholder="选择日期范围"
          style="width: 100%"
          @change="dateChange"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="mobile" label="手机号:">
        <el-input v-model="params.mobile" placeholder="手机号" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="username" label="昵称:">
        <el-input v-model="params.username" placeholder="昵称" />
      </SpFilterFormItem>
    </SpFilterForm>

    <el-button type="primary" @click="exportData"> 导出 </el-button>
    <div class="record-list">
      <el-table
        v-loading="loading"
        :data="recordList"
        :height="wheight - 250"
        @filter-change="filterTag"
      >
        <el-table-column prop="timeStart" label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.created | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="username" label="昵称" />
        <el-table-column prop="name" label="用户名" />
        <el-table-column prop="mobile" label="手机号" />
        <el-table-column prop="point" label="积分变动">
          <template slot-scope="scope">
            <span v-if="scope.row.point == 0">{{ scope.row.point }}</span>
            <span v-else-if="scope.row.income > 0"
              >+{{ scope.row.income }}</span
            >
            <span v-else-if="scope.row.outcome > 0"
              >-{{ scope.row.outcome }}</span
            >
          </template>
        </el-table-column>

        <el-table-column prop="point_desc" label="变动类型" />
        <el-table-column prop="s_point" label="当前剩余积分" />
        <el-table-column prop="point_desc" label="记录" />
        <el-table-column prop="order_id" label="订单号" />
      </el-table>
    </div>
    <div v-if="total_count > pageSize" class="tc" style="margin-top: 20px">
      <el-pagination
        layout="prev, pager, next"
        class="text-right"
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
import { getMemberPoint, pointMemberExport } from '../../../api/point'
export default {
  props: ['getStatus'],
  data() {
    return {
      loading: false,
      // created: '',
      // mobile: '',
      // username: '',
      total_count: 0,
      pageSize: 20,
      recordList: [],
      params: {
        page: 1,
        created: '',
        mobile: '',
        username: ''
      },
      date_begin: '',
      date_end: ''
    }
  },
  computed: {
    ...mapGetters(['wheight'])
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
      ;(this.params.page = 1), this.getParams()
      // this.getList(this.params)
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.params.pageSize = this.pageSize
      this.getList(this.params)
    },
    exportData() {
      this.params.page = 1
      pointMemberExport(this.params).then(response => {
        if (response.data.data.status) {
          this.$message({
            type: 'success',
            message: '已加入执行队列，请在设置-导出列表中下载'
          })
          this.$export_open('member_point_logs')
          return
        } else if (response.data.data.url) {
          this.downloadUrl = response.data.data.url
          this.downloadName = response.data.data.filename
          this.downloadView = true
        } else {
          this.$message({
            type: 'error',
            message: '无内容可导出 或 执行失败，请检查重试'
          })
          return
        }
      })
    },
    getList(query) {
      this.loading = true
      getMemberPoint(query).then(res => {
        this.recordList = res.data.data.list
        this.total_count = res.data.data.total_count
        this.loading = false
      })
    },
    getParams() {
      this.params.date_begin = this.date_begin
      this.params.date_end = this.date_end
      this.params.mobile = this.mobile
      this.params.username = this.username
      // this.params.created = [this.date_begin,this.date_end]
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
