<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
      <SpFilterFormItem prop="employee_user_mobile" :label="$t('6932cf32.5f4688')">
        <el-input v-model="params.employee_user_mobile" :placeholder="$t('6932cf32.8098e2')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="dependents_user_mobile" :label="$t('6932cf32.125e4a')">
        <el-input v-model="params.dependents_user_mobile" :placeholder="$t('6932cf32.8098e2')" />
      </SpFilterFormItem>
    </SpFilterForm>
    <el-table v-loading="loading" :data="dataList" style="width: 100%" border height="580">
      <el-table-column prop="employee_user_mobile" :label="$t('6932cf32.1a1f66')" />
      <el-table-column prop="employee_user_name" :label="$t('6932cf32.4a1a2c')" />
      <el-table-column prop="dependents_user_mobile" :label="$t('6932cf32.ec6ed9')" />
      <el-table-column prop="dependents_user_name" :label="$t('6932cf32.5912a9')" />
      <el-table-column prop="dependents_used_limitfee" :label="$t('6932cf32.858ab4')">
        <template slot-scope="scope"> ￥{{ scope.row.dependents_used_limitfee / 100 }} </template>
      </el-table-column>
      <el-table-column :label="$t('6932cf32.d12952')">
        <template slot-scope="scope">
          {{ scope.row.created | datetime('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
    </el-table>
    <div v-if="total_count > params.pageSize" class="content-center content-top-padded">
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
import { getPurchaseDependentsLists } from '@/api/purchase'

export default {
  data() {
    const initialParams = {
      employee_user_mobile: undefined,
      dependents_user_mobile: undefined
    }
    return {
      initialParams,
      loading: false,
      purchase_id: null,
      dataList: [],
      total_count: 0,
      params: {
        ...initialParams,
        page: 1,
        pageSize: 20
      }
    }
  },
  mounted() {
    this.purchase_id = this.$route.query.id
    this.getPurchaseDependentsLists()
  },
  methods: {
    onReset() {
      this.params = { ...this.initialParams }
      this.onSearch()
    },
    onSearch() {
      this.params.page = 1
      this.$nextTick(() => {
        this.getPurchaseDependentsLists()
      })
    },
    handleCurrentChange(pageNum) {
      this.params.page = pageNum
      this.getPurchaseDependentsLists()
    },
    getPurchaseDependentsLists() {
      this.loading = true
      this.params.purchase_id = this.purchase_id
      getPurchaseDependentsLists(this.params)
        .then((response) => {
          this.dataList = response.data.data.list
          this.total_count = response.data.data.total_count
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: this.$t('6932cf32.2deb8d')
          })
        })
    }
  }
}
</script>

<style scoped></style>
