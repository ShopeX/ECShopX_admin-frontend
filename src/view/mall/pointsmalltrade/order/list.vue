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
    <div v-if="$route.path.indexOf('detail') === -1">
      <el-row class="filter-header" :gutter="20">
        <el-col>
          <shop-select
            v-if="$store.getters.login_type != 'distributor'"
            wxshops
            @update="shopHandle"
          />
          <!--distributors wxshops 需要哪个api传哪个-->
          <el-date-picker
            v-model="create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            placeholder="选择日期范围"
            @change="dateChange"
          />
          <el-input v-model="identifier" class="input-m" placeholder="手机号/订单号">
            <el-button slot="append" icon="el-icon-search" @click="numberSearch" />
          </el-input>
          <el-select v-model="order_type" placeholder="请选择订单类型" @change="TypeHandle">
            <el-option
              v-for="(item, index) in orderType"
              :key="index"
              :label="item.name"
              :value="item.type"
            />
            <el-option :key="2" label="拼团订单" value="groups" />
          </el-select>
          <el-autocomplete
            v-model="source_name"
            class="inline-input"
            :fetch-suggestions="querySearch"
            placeholder="请输入来源"
            @select="sourceSearch"
          />
          <el-button type="primary" @click="exportData"> 导出 </el-button>
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            content="导出任务会以队列执行，点击导出后，请至‘设置-导出列表’页面中查看及下载数据"
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
        <el-tab-pane label="已完成" name="done" />
        <el-tab-pane label="未支付" name="notpay" />
        <el-table v-loading="loading" :data="list">
          <el-table-column min-width="160" label="订单">
            <template slot-scope="scope">
              <div class="order-num">
                {{ scope.row.order_id }}
                <el-tooltip effect="dark" content="复制" placement="top-start">
                  <i
                    v-clipboard:copy="scope.row.order_id"
                    v-clipboard:success="onCopy"
                    class="el-icon-document-copy"
                  />
                </el-tooltip>
              </div>
              <div>
                实付：<span class="mark"
                  ><span class="cur">{{ scope.row.fee_symbol }}</span
                  >{{ scope.row.total_fee / 100 }}</span
                >
              </div>
              <div class="order-time">
                <el-tooltip effect="dark" content="下单时间" placement="top-start">
                  <i class="el-icon-time" />
                </el-tooltip>
                {{ scope.row.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="150" prop="title" label="服务商品" />
          <el-table-column width="150" label="手机号">
            <template slot-scope="scope">
              <i class="el-icon-mobile" />
              {{ scope.row.mobile }}
              <el-tooltip effect="dark" content="复制" placement="top-start">
                <i
                  v-clipboard:copy="scope.row.mobile"
                  v-clipboard:success="onCopy"
                  class="el-icon-document-copy"
                />
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column width="100" prop="order_type" label="类型">
            <template slot-scope="scope">
              <span v-if="'groups' == scope.row.order_class">
                <span> 拼团订单 </span>
              </span>
              <span v-else>
                <span
                  v-for="(item, index) in orderType"
                  v-if="item.type == scope.row.order_type"
                  :key="index"
                >
                  {{ item.name }}
                </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column width="100" prop="order_status" label="订单状态">
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.order_status == 'DONE' || scope.row.order_status == 'PAYED'"
                type="success"
                size="mini"
              >
                已完成
              </el-tag>
              <el-tag v-else-if="scope.row.order_status == 'NOTPAY'" size="mini"> 未支付 </el-tag>
              <el-tag
                v-else-if="scope.row.order_status == 'CLOSED' || scope.row.order_status == 'CANCEL'"
                type="danger"
                size="mini"
              >
                已取消
              </el-tag>
              <el-tag
                v-else-if="scope.row.order_status == 'WAIT_GROUPS_SUCCESS'"
                type="warning"
                size="mini"
              >
                等待拼团成功
              </el-tag>
              <el-tag
                v-else-if="scope.row.order_status == 'REFUND_PROCESS'"
                type="warning"
                size="mini"
              >
                退款处理中
              </el-tag>
              <el-tag
                v-else-if="scope.row.order_status == 'REFUND_SUCCESS'"
                type="info"
                size="mini"
              >
                退款成功
              </el-tag>
              <el-tag v-else-if="scope.row.order_status == 'REFUND_FAIL'" type="danger" size="mini">
                退款失败
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="source_name" label="来源" />
          <el-table-column prop="operator_desc" width="150" label="代客下单操作员">
            <template slot-scope="scope">
              <div v-if="scope.row.operator_desc" class="">
                <div><i class="el-icon-user" />{{ scope.row.operator_desc.name }}</div>
                <div>
                  <i class="el-icon-mobile" />
                  {{ scope.row.operator_desc.mobile }}
                  <el-tooltip effect="dark" content="复制" placement="top-start">
                    <i
                      v-clipboard:copy="scope.row.operator_desc.mobile"
                      v-clipboard:success="onCopy"
                      class="el-icon-document-copy"
                    />
                  </el-tooltip>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="90" label="操作">
            <template slot-scope="scope">
              <router-link
                :to="{
                  path: matchRoutePath('detail'),
                  query: { orderId: scope.row.order_id, resource: '/mall/trade/service' }
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
            layout="total, sizes, prev, pager, next, jumper"
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
import { getOrderList, orderExport } from '../../../../api/trade'
import { getSourcesList } from '../../../../api/datacube'
import shopSelect from '@/components/shopSelect'

export default {
  components: {
    shopSelect
  },
  data() {
    return {
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
      total_count: 0,
      order_type: 'service',
      list: [],
      currentShop: '',
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
    this.getOrders(this.params)
    this.getAllSourcesList()
  },
  methods: {
    onCopy() {
      this.$notify({
        message: '复制成功',
        type: 'success'
      })
    },
    // 切换tab
    handleClick(tab, event) {
      this.activeName = tab.name
      this.params.order_status = tab.name == 'all' ? '' : tab.name
      this.params.page = 1
      this.getParams()
      this.getOrders(this.params)
    },
    shopHandle(val) {
      val && val.shop_id
      this.currentShop = val.shop_id
      this.params.page = 1
      this.getParams()
      this.getOrders(this.params)
    },
    TypeHandle() {
      this.params.page = 1
      this.getParams()
      this.getOrders(this.params)
    },
    orderStatusSelectHandle() {
      this.params.order_status = this.order_status
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
    handleCurrentChange(val) {
      this.params.page = val
      this.loading = false
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
      if (this.order_type == 'service') {
        this.params.shop_id = this.currentShop
      } else if (this.order_type == 'bargain') {
        delete this.params.shop_id
      }
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
        let list = response.data.data.list
        list.forEach(item => {
          let operator = ''
          if (item.operator_desc) {
            let saler = item.operator_desc.split(':')
            operator = {
              mobile: saler[0],
              name: saler[1]
            }
            item.operator_desc = operator
          }
        })
        this.list = list
        this.total_count =
          'undefined' == typeof response.data.data.pager
            ? response.data.data.total_count
            : Number(response.data.data.pager.count)
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
      if (this.params.order_type != 'service') {
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
