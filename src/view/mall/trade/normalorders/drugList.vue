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
  <div class="">
    <div v-if="$route.path.indexOf('detail') === -1">
      <el-row :gutter="10">
        <el-col :md="12" :lg="12">
          <shop-select
            v-if="$store.getters.login_type != 'distributor'"
            distributors
            @update="storeSearch"
          />
          <!--distributors wxshops 需要哪个api传哪个-->
        </el-col>
        <el-col :md="10" :lg="8">
          <el-date-picker
            v-model="create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            placeholder="选择日期范围"
            style="width: 100%"
            size="mini"
            @change="dateChange"
          />
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :md="7" :lg="5">
          <el-autocomplete
            v-model="source_name"
            class="inline-input"
            :fetch-suggestions="querySearch"
            placeholder="请输入来源"
            size="mini"
            @select="sourceSearch"
          />
        </el-col>
        <el-col :md="7" :lg="5">
          <el-input v-model="salesman_mobile" placeholder="导购员手机号" size="mini">
            <el-button slot="append" icon="el-icon-search" @click="numberSearch" />
          </el-input>
        </el-col>
        <el-col :md="7" :lg="5">
          <el-input v-model="identifier" placeholder="手机号/订单号" size="mini">
            <el-button slot="append" icon="el-icon-search" @click="numberSearch" />
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button size="mini" type="primary" @click="exportData"> 导出 </el-button>
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            content="当导出数据大于500条时，导出任务会以队列执行，点击导出后，请至‘设置-导出列表’页面中查看及下载数据"
          >
            <i slot="reference" class="el-icon-question" />
          </el-popover>
        </el-col>
      </el-row>
      <el-dialog title="订单下载" :visible.sync="downloadView" :close-on-click-modal="false">
        <template v-if="downloadUrl">
          <a :href="downloadUrl" download>{{ downloadName }}</a>
        </template>
      </el-dialog>
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="全部" name="all" />
        <el-tab-pane label="待审核" name="notpay" />
        <el-tab-pane label="待自提" name="done" />
        <el-tab-pane label="已取消" name="cancel" />
        <el-table
          v-loading="loading"
          :data="list"
          style="width: 100%"
          :height="wheight - 190"
          element-loading-text="数据加载中"
        >
          <el-table-column prop="order_id" width="150" label="订单号" fixed />
          <el-table-column prop="create_time" width="160" label="创建时间">
            <template slot-scope="scope">
              <span>{{ scope.row.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="distributor_name" label="所属店铺">
            <template slot-scope="scope">
              <span v-if="scope.row.distributor_name">{{ scope.row.distributor_name }}</span>
              <span v-else>总部</span>
            </template>
          </el-table-column>
          <el-table-column width="70" label="运费">
            <template slot-scope="scope">
              {{ scope.row.fee_symbol }}{{ scope.row.freight_fee / 100 }}
            </template>
          </el-table-column>
          <el-table-column prop="total_fee" width="70" label="金额">
            <template slot-scope="scope">
              {{ scope.row.fee_symbol }}{{ scope.row.total_fee / 100 }}
            </template>
          </el-table-column>
          <el-table-column prop="mobile" width="110" label="手机号" />
          <el-table-column prop="order_status" label="订单状态">
            <template slot-scope="scope">
              <!-- 订单状态 -->
              <el-tag v-if="scope.row.order_status == 'CANCEL'" type="danger" size="mini">
                已取消
              </el-tag>
              <template v-if="scope.row.order_status != 'CANCEL'">
                <!-- 发货状态 -->
                <el-tag v-if="scope.row.ziti_status == 'APPROVE'" type="success" size="mini">
                  审核通过
                </el-tag>
                <el-tag v-else type="primary" size="mini"> 待审核 </el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="source_name" label="来源" />
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <router-link
                :to="{
                  path: matchRoutePath('detail'),
                  query: { orderId: scope.row.order_id, resource: $route.path }
                }"
              >
                详情
              </router-link>
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
    </div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  getOrderList,
  getOrderDetail,
  delivery,
  orderExport,
  getCancelOrderInfo,
  cancelConfirm
} from '../../../../api/trade'
import { getSourcesList } from '../../../../api/datacube'
import shopSelect from '@/components/shopSelect'

export default {
  components: {
    shopSelect
  },
  data() {
    return {
      IsDisabled: false,
      activeName: 'all',
      loading: false,
      create_time: '',
      params: {
        page: 1,
        pageSize: 20
      },
      order_status: '',
      time_start_begin: '',
      time_start_end: '',
      salesman_mobile: '',
      total_count: 0,
      order_type: 'normal',
      order_class: 'drug',
      list: [],
      identifier: '',
      source_list: [],
      source_name: '',
      source_id: '',
      downloadView: false,
      downloadUrl: '',
      downloadName: ''
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.params.order_type = this.order_type
    this.params.order_class = this.order_class
    this.getOrders(this.params)
    this.getAllSourcesList()
  },
  methods: {
    // 切换tab
    handleClick(tab, event) {
      this.activeName = tab.name
      this.params.order_status = tab.name == 'all' ? '' : tab.name
      this.params.page = 1
      this.getParams()
      this.getOrders(this.params)
    },
    storeSearch(val) {
      val && val.shop_id
      this.params.distributor_id = val.shop_id
      this.params.page = 1
      this.getParams()
      this.getOrders(this.params)
    },
    numberSearch(e) {
      this.params.page = 1
      this.getParams()
      this.getOrders(this.params)
    },
    dateChange(val) {
      if (val.length > 0) {
        this.time_start_begin = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.time_start_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.time_start_begin = ''
        this.time_start_end = ''
      }
      this.params.page = 1
      this.getParams()
      this.getOrders(this.params)
    },
    sourceSearch(item) {
      this.params.source_id = item.source_id
      this.params.page = 1
      this.getParams()
      this.getOrders(this.params)
    },
    handleCurrentChange(page_num) {
      this.loading = false
      this.params.page = page_num
      this.getParams()
      this.getOrders(this.params)
    },
    handleSizeChange(pageSize) {
      this.loading = false
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getParams()
      this.getOrders(this.params)
    },
    getParams() {
      this.params.time_start_begin = this.time_start_begin
      this.params.time_start_end = this.time_start_end
      this.params.order_type = this.order_type
      this.params.order_class = this.order_class
      this.params.salesman_mobile = this.salesman_mobile
      if (this.identifier.length == 11) {
        this.params.mobile = this.identifier
      } else {
        this.params.mobile = ''
        this.params.order_id = this.identifier
      }
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    getOrders(filter) {
      this.loading = true
      getOrderList(filter).then(response => {
        this.list = response.data.data.list
        this.total_count = Number(response.data.data.pager.count)
        this.loading = false
      })
    },
    getAllSourcesList() {
      let params = { page: 1, pageSize: 1000 }
      getSourcesList(params).then(response => {
        if (response.data.data.list) {
          response.data.data.list.forEach(row => {
            this.source_list.push({ value: row.sourceName, source_id: row.sourceId })
          })
        }
      })
    },
    querySearch(queryString, cb) {
      var restaurants = this.source_list
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return restaurant => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    exportData() {
      this.getParams()
      this.params.page = 1
      if (this.params.order_type != 'normal') {
        this.$message({
          type: 'error',
          message: '暂不支持该类型订单导出'
        })
        return
      }
      orderExport(this.params).then(response => {
        if (response.data.data.status) {
          this.$message({
            type: 'success',
            message: '已加入执行队列，请在设置-导出列表中下载'
          })
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
    }
  }
}
</script>
<style>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
