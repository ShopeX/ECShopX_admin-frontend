<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
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
            :placeholder="$t('d3a5c6b0.4b8cb9')"
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
            :placeholder="$t('d3a5c6b0.4b525f')"
            size="mini"
            @select="sourceSearch"
          />
        </el-col>
        <el-col :md="7" :lg="5">
          <el-input v-model="salesman_mobile" :placeholder="$t('d3a5c6b0.f1ba67')" size="mini">
            <el-button slot="append" icon="el-icon-search" @click="numberSearch" />
          </el-input>
        </el-col>
        <el-col :md="7" :lg="5">
          <el-input v-model="identifier" :placeholder="$t('d3a5c6b0.f4b2e7')" size="mini">
            <el-button slot="append" icon="el-icon-search" @click="numberSearch" />
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button size="mini" type="primary" @click="exportData">
            {{ $t('d3a5c6b0.55405e') }}
          </el-button>
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            :content="$t('d3a5c6b0.32ac80')"
          >
            <i slot="reference" class="el-icon-question" />
          </el-popover>
        </el-col>
      </el-row>
      <el-dialog
        :title="$t('d3a5c6b0.2cf869')"
        :visible.sync="downloadView"
        :close-on-click-modal="false"
      >
        <template v-if="downloadUrl">
          <a :href="downloadUrl" download>{{ downloadName }}</a>
        </template>
      </el-dialog>
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane :label="$t('d3a5c6b0.a8b0c2')" name="all" />
        <el-tab-pane :label="$t('d3a5c6b0.5cb424')" name="notpay" />
        <el-tab-pane :label="$t('d3a5c6b0.25d532')" name="done" />
        <el-tab-pane :label="$t('d3a5c6b0.2111cc')" name="cancel" />
        <el-table
          v-loading="loading"
          :data="list"
          style="width: 100%"
          :height="wheight - 190"
          :element-loading-text="$t('d3a5c6b0.f09b12')"
        >
          <el-table-column prop="order_id" width="150" :label="$t('d3a5c6b0.1e8dc2')" fixed />
          <el-table-column prop="create_time" width="160" :label="$t('d3a5c6b0.eca37c')">
            <template slot-scope="scope">
              <span>{{ scope.row.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="distributor_name" :label="$t('d3a5c6b0.baad7e')">
            <template slot-scope="scope">
              <span v-if="scope.row.distributor_name">{{ scope.row.distributor_name }}</span>
              <span v-else>{{ $t('d3a5c6b0.d166bb') }}</span>
            </template>
          </el-table-column>
          <el-table-column width="70" :label="$t('d3a5c6b0.9a935b')">
            <template slot-scope="scope">
              {{ scope.row.fee_symbol }}{{ scope.row.freight_fee / 100 }}
            </template>
          </el-table-column>
          <el-table-column prop="total_fee" width="70" :label="$t('d3a5c6b0.4cf24a')">
            <template slot-scope="scope">
              {{ scope.row.fee_symbol }}{{ scope.row.total_fee / 100 }}
            </template>
          </el-table-column>
          <el-table-column prop="mobile" width="110" :label="$t('d3a5c6b0.8098e2')" />
          <el-table-column prop="order_status" :label="$t('d3a5c6b0.86f6cf')">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.order_status == 'CANCEL'" type="danger" size="mini">
                {{ $t('d3a5c6b0.2111cc') }}
              </el-tag>
              <template v-if="scope.row.order_status != 'CANCEL'">
                <el-tag v-if="scope.row.ziti_status == 'APPROVE'" type="success" size="mini">
                  {{ $t('d3a5c6b0.871a30') }}
                </el-tag>
                <el-tag v-else type="primary" size="mini"> {{ $t('d3a5c6b0.5cb424') }} </el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="source_name" :label="$t('d3a5c6b0.26ca20')" />
          <el-table-column :label="$t('d3a5c6b0.2b6bc0')" fixed="left">
            <template slot-scope="scope">
              <router-link
                :to="{
                  path: matchRoutePath('detail'),
                  query: { orderId: scope.row.order_id, resource: $route.path }
                }"
              >
                {{ $t('d3a5c6b0.f26225') }}
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
      getOrderList(filter).then((response) => {
        this.list = response.data.data.list
        this.total_count = Number(response.data.data.pager.count)
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
      if (this.params.order_type != 'normal') {
        this.$message({
          type: 'error',
          message: this.$t('8906cb64.08bd5c')
        })
        return
      }
      orderExport(this.params).then((response) => {
        if (response.data.data.status) {
          this.$message({
            type: 'success',
            message: this.$t('8906cb64.3e1ddd')
          })
          return
        } else if (response.data.data.url) {
          this.downloadUrl = response.data.data.url
          this.downloadName = response.data.data.filename
          this.downloadView = true
        } else {
          this.$message({
            type: 'error',
            message: this.$t('8906cb64.89ae53')
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
