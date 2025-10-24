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
  <div>
    <el-row :gutter="20">
      <el-col :span="4">
        <el-radio-group v-model="params.api_type" size="small" @change="searchDate">
          <el-radio label="request" border> 请求 </el-radio>
          <el-radio label="response" border> 响应 </el-radio>
        </el-radio-group>
      </el-col>
      <el-col :span="10">
        <el-radio-group v-model="params.status" size="small" @change="searchDate">
          <el-radio label="running" border> 执行中 </el-radio>
          <el-radio label="success" border> 成功 </el-radio>
          <el-radio label="fail" border> 失败 </el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="10">
        <el-input v-model="params.content" placeholder="请输入内容" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="searchDate" />
        </el-input>
      </el-col>
      <el-col :span="10">
        <el-date-picker
          v-model="params.updated"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="最后更新开始日期"
          end-placeholder="最后更新结束日期"
          align="right"
          value-format="yyyy-MM-dd"
          @change="searchDate"
        />
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="dataList" :height="wheight - 150">
      <el-table-column type="expand">
        <template slot-scope="props">
          <!-- <el-collapse>
            <el-collapse-item title="参数详情" name="1">
              <pre>{{props.row.params}}</pre>
            </el-collapse-item>
            <el-collapse-item title="返回值详情" name="2">
              <pre>{{props.row.result}}</pre>
            </el-collapse-item>
          </el-collapse> -->
          返回值详情:
          <el-row :gutter="20">
            <el-col :span="12">
              <pre>{{ props.row.result }}</pre>
            </el-col>
          </el-row>
          参数详情:
          <el-row :gutter="20">
            <el-col :span="12">
              <pre>{{ props.row.params }}</pre>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column prop="api_type" label="类型" />
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="worker" label="接口名称" />
      <el-table-column prop="created_date" label="创建时间" />
      <el-table-column prop="updated_date" label="更新时间" />
    </el-table>
    <div class="mt-4 text-right">
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { OmsQueueLogList } from '@/api/trade'
export default {
  data() {
    return {
      loading: false,
      total_count: 0,
      dataList: [],
      params: {
        page: 1,
        pageSize: 20,
        api_type: '',
        status: '',
        content: '',
        updated: []
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      this.loading = true
      OmsQueueLogList(this.params).then(response => {
        this.dataList = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getDataList()
    },
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getDataList()
    },
    searchDate() {
      this.params.page = 1
      this.getDataList()
    }
  }
}
</script>

[object Object]
