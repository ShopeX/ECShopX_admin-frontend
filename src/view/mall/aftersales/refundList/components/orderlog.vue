<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}
</style>

<template>
  <div class="page-body">
    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
      <SpFilterFormItem prop="order_id" :label="$t('44537686.070dce')">
        <el-input v-model="params.order_id" :placeholder="$t('44537686.e9e836')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="create_time" :label="$t('44537686.8d3bf9')">
        <el-date-picker
          v-model="params.create_time"
          type="daterange"
          value-format="yyyy/MM/dd"
          :placeholder="$t('44537686.5d92ab')"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="status" :label="$t('44537686.da9d4c')">
        <el-select v-model="params.status" :placeholder="$t('44537686.9e471b')">
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
      <el-table-column prop="order_id" :label="$t('44537686.1e8dc2')" width="180" />
      <el-table-column prop="status" :label="$t('44537686.93f23e')" width="120" />
      <el-table-column prop="error_code" :label="$t('44537686.ac41cc')" width="100" />
      <el-table-column prop="error_desc" :label="$t('44537686.f23a26')" />
      <el-table-column prop="create_time" :label="$t('44537686.eca37c')" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="is_resubmit" :label="$t('44537686.8ad7ca')" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.is_resubmit"> {{ $t('44537686.f5e626') }}</span>
          <span v-else> {{ $t('44537686.c3ef66') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('44537686.2b6bc0')" width="100">
        <template slot-scope="scope">
          <el-link v-if="scope.row.is_resubmit === false">
            <el-button type="primary" size="mini" @click="refundResubmit(scope.row)">
              {{ $t('44537686.ece899') }}
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
import { i18n } from '@/i18n'

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
        { name: i18n.t('44537686.a8b0c2'), value: 'all' },
        { name: i18n.t('44537686.5ad605'), value: 'is_resubmit' },
        { name: i18n.t('44537686.2839c8'), value: 'waiting' }
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
      this.$message.success(this.$t('44537686.814952'))
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
