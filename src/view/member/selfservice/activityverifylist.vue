<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpRouterView>
    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
      <SpFilterFormItem prop="activity_name" :label="$t('6b57cb80.1cadc0')">
        <el-input v-model="params.activity_name" :placeholder="$t('6b57cb80.39834b')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="mobile" :label="$t('6b57cb80.ce2bf3')">
        <el-input v-model="params.mobile" :placeholder="$t('6b57cb80.8098e2')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="create_time" :label="$t('6b57cb80.374856')">
        <el-date-picker
          v-model="params.create_time"
          type="daterange"
          value-format="yyyy/MM/dd"
          :placeholder="$t('6b57cb80.e08045')"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="distributor" :label="$t('6b57cb80.4de1b7')">
        <el-autocomplete
          v-model="params.distributor.name"
          :fetch-suggestions="queryStoreSearch"
          :placeholder="$t('6b57cb80.867738')"
          @select="handleSelectStore"
        />
      </SpFilterFormItem>
    </SpFilterForm>

    <el-table v-loading="loading" border :data="tableList" style="width: 100%">
      <el-table-column prop="record_id" :label="$t('6b57cb80.a742f5')" />
      <el-table-column prop="activity_name" :label="$t('6b57cb80.39834b')" />
      <el-table-column prop="tem_name" :label="$t('6b57cb80.112a9c')" />
      <el-table-column prop="record_no" :label="$t('6b57cb80.6c5f80')" />
      <el-table-column prop="mobile" :label="$t('6b57cb80.c9c642')" />
      <el-table-column :label="$t('6b57cb80.dcb837')" width="300">
        <template slot-scope="scope">
          {{ scope.row.start_date }} ~ {{ scope.row.end_date }}
        </template>
      </el-table-column>
      <el-table-column prop="verify_operator" :label="$t('6b57cb80.ec69fc')" />
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
      return (restaurant) => {
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
        list.forEach((row) => {
          this.shopList.push({ value: row.name, distributor_id: row.distributor_id })
        })
      }
    }
  }
}
</script>
<style scoped lang="scss"></style>
