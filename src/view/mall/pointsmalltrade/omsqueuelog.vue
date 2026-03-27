<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="4">
        <el-radio-group v-model="params.api_type" size="small" @change="searchDate">
          <el-radio label="request" border>{{ $t('91a4bf73.75b160') }}</el-radio>
          <el-radio label="response" border>{{ $t('91a4bf73.8aa9de') }}</el-radio>
        </el-radio-group>
      </el-col>
      <el-col :span="10">
        <el-radio-group v-model="params.status" size="small" @change="searchDate">
          <el-radio label="running" border>{{ $t('91a4bf73.46e386') }}</el-radio>
          <el-radio label="success" border>{{ $t('91a4bf73.330363') }}</el-radio>
          <el-radio label="fail" border>{{ $t('91a4bf73.acd5cb') }}</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="10">
        <el-input
          v-model="params.content"
          :placeholder="$t('91a4bf73.a11cc7')"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchDate" />
        </el-input>
      </el-col>
      <el-col :span="10">
        <el-date-picker
          v-model="params.updated"
          type="datetimerange"
          :picker-options="pickerOptions"
          :range-separator="$t('91a4bf73.981cbe')"
          :start-placeholder="$t('91a4bf73.57974c')"
          :end-placeholder="$t('91a4bf73.744e59')"
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
          {{ $t('91a4bf73.40137a') }}
          <el-row :gutter="20">
            <el-col :span="12">
              <pre>{{ props.row.result }}</pre>
            </el-col>
          </el-row>
          {{ $t('91a4bf73.d2ab43') }}
          <el-row :gutter="20">
            <el-col :span="12">
              <pre>{{ props.row.params }}</pre>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column prop="api_type" :label="$t('91a4bf73.226b09')" />
      <el-table-column prop="status" :label="$t('91a4bf73.3fea7c')" />
      <el-table-column prop="worker" :label="$t('91a4bf73.34cab8')" />
      <el-table-column prop="created_date" :label="$t('91a4bf73.eca37c')" />
      <el-table-column prop="updated_date" :label="$t('91a4bf73.a001a2')" />
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
            text: this.$t('91a4bf73.56ee10'),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: this.$t('91a4bf73.335dfc'),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: this.$t('91a4bf73.d96eb4'),
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
      OmsQueueLogList(this.params).then((response) => {
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
