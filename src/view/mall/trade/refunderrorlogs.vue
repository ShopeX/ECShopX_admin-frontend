<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <!-- <el-row :gutter="20">
      <el-col :span="6">
        <el-input v-model="params.order_id" placeholder="请输入订单号">
          <el-button slot="append" icon="el-icon-search" @click="dataSearch" />
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
    </el-row> -->

    <SpFilterForm :model="params" @onSearch="getDataList(params)" @onReset="getDataList(params)">
      <SpFilterFormItem prop="order_id" :label="$t('7533538d.070dce')">
        <el-input v-model="params.order_id" :placeholder="$t('7533538d.e9e836')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="create_time" :label="$t('7533538d.070dce')">
        <el-date-picker
          v-model="params.create_time"
          type="daterange"
          value-format="yyyy/MM/dd"
          :placeholder="$t('7533538d.5d92ab')"
          style="width: 100%"
          @change="dateChange"
        />
      </SpFilterFormItem>
    </SpFilterForm>

    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane :label="$t('7533538d.2839c8')" name="waiting" />
      <el-tab-pane :label="$t('7533538d.5ad605')" name="is_resubmit" />
      <el-tab-pane :label="$t('7533538d.a8b0c2')" name="all" />

      <el-table v-loading="loading" :data="dataList" :height="wheight - 150">
        <el-table-column prop="order_id" :label="$t('7533538d.1e8dc2')" width="180" />
        <el-table-column prop="status" :label="$t('7533538d.93f23e')" width="120" />
        <el-table-column prop="error_code" :label="$t('7533538d.ac41cc')" width="100" />
        <el-table-column prop="error_desc" :label="$t('7533538d.f23a26')" />
        <el-table-column prop="create_time" :label="$t('35ec026d.eca37c')" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="is_resubmit" :label="$t('7533538d.8ad7ca')" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.is_resubmit">{{ $t('7533538d.f5e626') }}</span>
            <span v-else>{{ $t('7533538d.c3ef66') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('7533538d.2b6bc0')" width="100">
          <template slot-scope="scope">
            <el-link v-if="scope.row.is_resubmit === false">
              <el-button type="primary" size="mini" @click="refundResubmit(scope.row)">
                {{ $t('7533538d.ece899') }}
              </el-button>
            </el-link>
          </template>
        </el-table-column>
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
    </el-tabs>
  </SpPage>
</template>

<script>
import { mapGetters } from 'vuex'
import { getRefundErrorLogsList, refundResubmit } from '../../../api/trade'

export default {
  data() {
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
  mounted() {
    this.getDataList(this.params)
  },
  methods: {
    handleClick(tab, event) {
      this.activeName = tab.name
      this.params.status = tab.name == 'all' ? '' : tab.name
      this.params.page = 1
      this.getDataList(this.params)
    },
    dataSearch() {
      this.params.start_time = ''
      this.params.end_time = ''
      this.create_time = ''
      this.params.page = 1
      this.getDataList(this.params)
    },
    getDataList(filter) {
      this.loading = true
      getRefundErrorLogsList(filter).then((response) => {
        this.dataList = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    dateChange(val) {
      this.params.status = ''
      if (val && val.length > 0) {
        this.params.start_time = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.params.end_time = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.params.start_time = ''
        this.params.end_time = ''
      }
      this.params.page = 1
      // this.getDataList(this.params)
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    refundResubmit(row) {
      refundResubmit(row.id).then((res) => {
        this.$message.success(this.$t('7533538d.814952'))
        this.getDataList(this.params)
      })
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getDataList(this.params)
    },
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getDataList(this.params)
    }
  }
}
</script>
