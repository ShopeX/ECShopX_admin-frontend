<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
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
            :placeholder="$t('8d50047c.4b8cb9')"
            @change="dateChange"
          />
          <el-input v-model="identifier" class="input-m" :placeholder="$t('8d50047c.f4b2e7')">
            <el-button slot="append" icon="el-icon-search" @click="numberSearch" />
          </el-input>
          <el-select v-model="order_type" :placeholder="$t('8d50047c.249ee7')" @change="TypeHandle">
            <el-option
              v-for="(item, index) in orderType"
              :key="index"
              :label="item.name"
              :value="item.type"
            />
            <el-option :key="2" :label="$t('8d50047c.ad0b88')" value="groups" />
          </el-select>
          <el-autocomplete
            v-model="source_name"
            class="inline-input"
            :fetch-suggestions="querySearch"
            :placeholder="$t('8d50047c.4b525f')"
            @select="sourceSearch"
          />
          <el-button type="primary" @click="exportData"> {{ $t('d41d8cd9.aa1bb2') }} </el-button>
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            :content="$t('8d50047c.676480')"
          >
            <i slot="reference" class="el-icon-question" />
          </el-popover>
        </el-col>
      </el-row>
      <el-dialog
        :title="$t('8d50047c.2cf869')"
        :visible.sync="downloadView"
        :close-on-click-modal="false"
      >
        <template v-if="downloadUrl">
          <a :href="downloadUrl" download>{{ downloadName }}</a>
        </template>
      </el-dialog>
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane :label="$t('8d50047c.a8b0c2')" name="all" />
        <el-tab-pane :label="$t('8d50047c.fad522')" name="done" />
        <el-tab-pane :label="$t('8d50047c.608afd')" name="notpay" />
        <el-table v-loading="loading" :data="list">
          <el-table-column min-width="160" :label="$t('8d50047c.4c117f')">
            <template slot-scope="scope">
              <div class="order-num">
                {{ scope.row.order_id }}
                <el-tooltip effect="dark" :content="$t('8d50047c.79d3ab')" placement="top-start">
                  <i
                    v-clipboard:copy="scope.row.order_id"
                    v-clipboard:success="onCopy"
                    class="el-icon-document-copy"
                  />
                </el-tooltip>
              </div>
              <div>
                {{ $t('d41d8cd9.ee5ff6')
                }}<span class="mark"
                  ><span class="cur">{{ scope.row.fee_symbol }}</span
                  >{{ scope.row.total_fee / 100 }}</span
                >
              </div>
              <div class="order-time">
                <el-tooltip effect="dark" :content="$t('8d50047c.2240cc')" placement="top-start">
                  <i class="el-icon-time" />
                </el-tooltip>
                {{ scope.row.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="150" prop="title" :label="$t('8d50047c.3016ef')" />
          <el-table-column width="150" :label="$t('8d50047c.8098e2')">
            <template slot-scope="scope">
              <i class="el-icon-mobile" />
              {{ scope.row.mobile }}
              <el-tooltip effect="dark" :content="$t('8d50047c.79d3ab')" placement="top-start">
                <i
                  v-clipboard:copy="scope.row.mobile"
                  v-clipboard:success="onCopy"
                  class="el-icon-document-copy"
                />
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column width="100" prop="order_type" :label="$t('8d50047c.226b09')">
            <template slot-scope="scope">
              <span v-if="'groups' == scope.row.order_class">
                <span> {{ $t('d41d8cd9.gg7hh8') }} </span>
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
          <el-table-column width="100" prop="order_status" :label="$t('8d50047c.86f6cf')">
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.order_status == 'DONE' || scope.row.order_status == 'PAYED'"
                type="success"
                size="mini"
              >
                {{ $t('d41d8cd9.ii9jj0') }}
              </el-tag>
              <el-tag v-else-if="scope.row.order_status == 'NOTPAY'" size="mini">
                {{ $t('d41d8cd9.kk1ll2') }}
              </el-tag>
              <el-tag
                v-else-if="scope.row.order_status == 'CLOSED' || scope.row.order_status == 'CANCEL'"
                type="danger"
                size="mini"
              >
                {{ $t('d41d8cd9.mm3nn4') }}
              </el-tag>
              <el-tag
                v-else-if="scope.row.order_status == 'WAIT_GROUPS_SUCCESS'"
                type="warning"
                size="mini"
              >
                {{ $t('d41d8cd9.oo5pp6') }}
              </el-tag>
              <el-tag
                v-else-if="scope.row.order_status == 'REFUND_PROCESS'"
                type="warning"
                size="mini"
              >
                {{ $t('d41d8cd9.qq7rr8') }}
              </el-tag>
              <el-tag
                v-else-if="scope.row.order_status == 'REFUND_SUCCESS'"
                type="info"
                size="mini"
              >
                {{ $t('d41d8cd9.ss9tt0') }}
              </el-tag>
              <el-tag v-else-if="scope.row.order_status == 'REFUND_FAIL'" type="danger" size="mini">
                {{ $t('d41d8cd9.uu1vv2') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="source_name" :label="$t('8d50047c.26ca20')" />
          <el-table-column prop="operator_desc" width="150" :label="$t('8d50047c.0cba5b')">
            <template slot-scope="scope">
              <div v-if="scope.row.operator_desc" class="">
                <div><i class="el-icon-user" />{{ scope.row.operator_desc.name }}</div>
                <div>
                  <i class="el-icon-mobile" />
                  {{ scope.row.operator_desc.mobile }}
                  <el-tooltip effect="dark" :content="$t('8d50047c.79d3ab')" placement="top-start">
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
          <el-table-column width="90" :label="$t('8d50047c.2b6bc0')">
            <template slot-scope="scope">
              <router-link
                :to="{
                  path: matchRoutePath('detail'),
                  query: { orderId: scope.row.order_id, resource: '/mall/trade/service' }
                }"
              >
                {{ $t('d41d8cd9.l9m0n1') }}
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
        message: this.$t('8d50047c.20a495'),
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
      getOrderList(filter).then((response) => {
        let list = response.data.data.list
        list.forEach((item) => {
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
      getSourcesList(params).then((response) => {
        if (response.data.data.list) {
          response.data.data.list.forEach((row) => {
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
      return (restaurant) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    exportData() {
      this.getParams()
      this.params.page = 1
      if (this.params.order_type != 'service') {
        this.$message({
          type: 'error',
          message: this.$t('8d50047c.08bd5c')
        })
        return
      }
      orderExport(this.params).then((response) => {
        if (response.data.data.status) {
          this.$message({
            type: 'success',
            message: this.$t('8d50047c.3e1ddd')
          })
          return
        } else if (response.data.data.url) {
          this.downloadUrl = response.data.data.url
          this.downloadName = response.data.data.filename
          this.downloadView = true
        } else {
          this.$message({
            type: 'error',
            message: this.$t('8d50047c.89ae53')
          })
          return
        }
      })
    }
  }
}
</script>
