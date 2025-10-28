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
  <SpRouterView>
    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
      <SpFilterFormItem prop="activity_name" label="活动名称:">
        <el-input v-model="params.activity_name" placeholder="活动名称" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="mobile" label="手机号:">
        <el-input v-model="params.mobile" placeholder="手机号" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="create_time" label="时间:">
        <el-date-picker
          v-model="params.create_time"
          type="daterange"
          value-format="yyyy/MM/dd"
          placeholder="根据添加时间筛选"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="distributor" label="店铺名称:">
        <el-autocomplete
          v-model="params.distributor.name"
          :fetch-suggestions="queryStoreSearch"
          placeholder="请输入店铺名称"
          @select="handleSelectStore"
        />
      </SpFilterFormItem>
    </SpFilterForm>

    <el-table v-loading="loading" border :data="tableList" style="width: 100%">
      <el-table-column prop="record_id" label="核销编号" />
      <el-table-column prop="activity_name" label="活动名称" />
      <el-table-column prop="tem_name" label="报名表单" />
      <el-table-column prop="record_no" label="报名编号" />
      <el-table-column prop="mobile" label="报名用户" />
      <el-table-column label="核销时间" width="300">
        <template slot-scope="scope">
          {{ scope.row.start_date }} ~ {{ scope.row.end_date }}
        </template>
      </el-table-column>
      <el-table-column prop="verify_operator" label="核销员" />
    </el-table>
    <div class="content-center content-top-padded">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync="page.pageIndex"
        :page-sizes="[10, 20, 50]"
        :total="page.total"
        :page-size="page.pageSize"
        @current-change="onCurrentChange"
        @size-change="onSizeChange"
      />
    </div>
  </SpRouterView>
</template>
<script>
import mixin, { pageMixin } from '@/mixins'
export default {
  mixins: [mixin, pageMixin],
  provide() {
    return {
      refresh: this.fetchList
    }
  },
  data() {
    const initialParams = {
      activity_name: undefined,
      create_time: [],
      distributor_id: '',
      distributor: {
        id: undefined,
        name: undefined
      },
      mobile: ''
    }
    return {
      initialParams,
      params: {
        ...initialParams
      },
      loading: false,
      shopList: []
    }
  },
  mounted() {
    this.fetchList()
    this.getStoreList()
  },
  methods: {
    onSearch() {
      this.page.pageIndex = 1
      this.$nextTick(() => {
        this.fetchList()
      })
    },
    onReset() {
      this.params = { ...this.initialParams }
      this.params = {
        ...this.params,
        distributor: {
          id: undefined,
          name: undefined
        }
      }
      this.onSearch()
    },
    getParams() {
      const time = {}
      const create_time = this.params.create_time
      if (create_time.length) {
        time.start_time = this.dateStrToTimeStamp(create_time[0] + ' 00:00:00')
        time.end_time = this.dateStrToTimeStamp(create_time[1] + ' 00:00:00')
      }
      let params = {
        ...this.params,
        create_time: [],
        ...time
      }
      delete params.distributor
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
      const { list, total_count } = await this.$api.selfhelpform.registrationVerifyLog(params)
      this.tableList = list
      this.page.total = total_count
      this.loading = false
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    queryStoreSearch(queryString, cb) {
      var restaurants = this.shopList
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return restaurant => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    handleSelectStore(storeItem) {
      this.params.distributor_id = storeItem.distributor_id
      this.params.distributor.id = storeItem.distributor_id
    },
    async getStoreList() {
      let params = { page: 1, pageSize: 500 }
      const { list } = await this.$api.marketing.getDistributorList(params)
      if (list) {
        list.forEach(row => {
          this.shopList.push({ value: row.name, distributor_id: row.distributor_id })
        })
      }
    }
  }
}
</script>
<style scoped lang="scss"></style>
