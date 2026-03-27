<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <div v-if="$route.path.indexOf('detail') === -1">
      <el-row :gutter="10">
        <el-col :md="8" :lg="6">
          <el-select
            v-model="currentCommunity"
            clearable
            :placeholder="$t('9d49798d.56ea59')"
            style="width: 100%"
            @change="communityHandle"
          >
            <el-option
              v-for="item in communityData"
              :key="item.community_id"
              :label="item.community_name"
              :value="item.community_id"
            />
          </el-select>
        </el-col>
        <el-col :md="10" :lg="8">
          <el-date-picker
            v-model="create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            :placeholder="$t('9d49798d.4b8cb9')"
            style="width: 100%"
            @change="dateChange"
          />
        </el-col>
        <el-col :md="8" :lg="6">
          <el-input v-model="identifier" :placeholder="$t('9d49798d.f4b2e7')">
            <el-button slot="append" icon="el-icon-search" @click="numberSearch" />
          </el-input>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, index) in orderStatusList"
          :key="index"
          :label="item.name"
          :name="item.value"
        />

        <el-table v-loading="loading" :data="list" style="width: 100%" :height="wheight - 220">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-card shadow="always" class="section-body">
                <div slot="header" class="clearfix">
                  <el-row v-if="communityObj[props.row.shop_id]" :gutter="24">
                    <el-col :md="8" :lg="6">
                      {{ $t('9d49798d.16cb48')
                      }}{{ communityObj[props.row.shop_id].community_name }}
                    </el-col>
                    <el-col :md="8" :lg="6">
                      {{ $t('9d49798d.21461a') }}{{ communityObj[props.row.shop_id].leader_name }}
                    </el-col>
                    <el-col :md="8" :lg="6">
                      {{ $t('9d49798d.c8d47d') }}{{ communityObj[props.row.shop_id].leader_mobile }}
                    </el-col>
                  </el-row>
                </div>
                <el-table :data="props.row.items" style="width: 100%">
                  <el-table-column
                    class="goods-img"
                    prop="pic"
                    :label="$t('9d49798d.20def7')"
                    min-width="50"
                  >
                    <template slot-scope="scope">
                      <span
                        ><img
                          width="50"
                          :src="wximageurl + scope.row.pic"
                          :alt="scope.row.item_name"
                      ></span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="item_name"
                    min-width="200"
                    :label="$t('9d49798d.d7ec2d')"
                  />
                  <el-table-column prop="num" min-width="50" :label="$t('9d49798d.0bf60b')" />
                  <el-table-column prop="price" min-width="50" :label="$t('9d49798d.1afdfe')">
                    <template slot-scope="scope">
                      {{ scope.row.fee_symbol }}{{ scope.row.price / 100 }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="total_fee" min-width="100" :label="$t('9d49798d.f33297')">
                    <template slot-scope="scope">
                      {{ scope.row.fee_symbol }}{{ scope.row.total_fee / 100 }}
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" width="160" :label="$t('9d49798d.eca37c')">
            <template slot-scope="scope">
              <span>{{ scope.row.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="order_id" width="160" :label="$t('9d49798d.1e8dc2')" />
          <el-table-column prop="total_fee" :label="$t('9d49798d.4cf24a')">
            <template slot-scope="scope">
              {{ scope.row.fee_symbol }}{{ scope.row.total_fee / 100 }}
            </template>
          </el-table-column>
          <el-table-column prop="mobile" width="110" :label="$t('9d49798d.6a52ee')" />
          <el-table-column prop="order_status" :label="$t('9d49798d.86f6cf')">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.order_status == 'DONE'" type="success" size="mini">
                {{ $t('9d49798d.fad522') }}
              </el-tag>
              <el-tag v-else-if="scope.row.order_status == 'PAYED'" type="primary" size="mini">
                {{ $t('9d49798d.64729d') }}
              </el-tag>
              <el-tag v-else-if="scope.row.order_status == 'NOTPAY'" size="mini">
{{
                $t('9d49798d.608afd')
              }}
</el-tag>
              <el-tag v-else-if="scope.row.order_status == 'CANCEL'" type="danger" size="mini">
                {{ $t('9d49798d.2111cc') }}
              </el-tag>
              <el-tag
                v-else-if="scope.row.order_status == 'REFUND_PROCESS'"
                type="warning"
                size="mini"
              >
                {{ $t('9d49798d.73ce8f') }}
              </el-tag>
              <el-tag
                v-else-if="scope.row.order_status == 'REFUND_SUCCESS'"
                type="info"
                size="mini"
              >
                {{ $t('9d49798d.d58cbd') }}
              </el-tag>
              <el-tag v-else-if="scope.row.order_status == 'REFUND_FAIL'" type="danger" size="mini">
                {{ $t('9d49798d.7c2544') }}
              </el-tag>
              <el-tag
                v-else-if="scope.row.order_status == 'WAIT_BUYER_CONFIRM'"
                type="primary"
                size="mini"
              >
                {{ $t('9d49798d.4933ca') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="order_id" width="160" :label="$t('9d49798d.d541f8')">
            <template slot-scope="scope">
              <span v-if="communityObj[scope.row.shop_id]">{{
                communityObj[scope.row.shop_id].community_name
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="order_id" width="100" :label="$t('9d49798d.07e57c')">
            <template slot-scope="scope">
              <span v-if="communityObj[scope.row.shop_id]">{{
                communityObj[scope.row.shop_id].leader_name
              }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('9d49798d.2b6bc0')">
            <template slot-scope="scope">
              <router-link
                :to="{
                  path: matchRoutePath('detail'),
                  query: {
                    orderId: scope.row.order_id,
                    resource: '/member/marketing/communityactivity/order',
                    params: params
                  }
                }"
              >
                {{ $t('9d49798d.f26225') }}
              </router-link>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="total_count > params.pageSize" class="mt-4 text-right">
          <el-pagination
            background
            layout="prev, pager, next, total"
            :current-page.sync="params.page"
            :total="total_count"
            :page-size="params.pageSize"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-tabs>
    </div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { CommunityActivityList, getCommunityList } from '../../../../../api/community'
import { getOrderList, orderExport } from '../../../../../api/trade'
import { getSourcesList } from '../../../../../api/datacube'

export default {
  data() {
    return {
      activeName: 'all',
      loading: false,
      create_time: '',
      params: {
        page: 1,
        pageSize: 20,
        order_type: 'normal',
        order_class: 'community',
        order_status: '',
        shop_id: '',
        time_start_begin: '',
        time_start_end: '',
        mobile: '',
        order_id: ''
      },
      order_status: '',
      time_start_begin: '',
      time_start_end: '',
      total_count: 0,
      list: [],
      currentCommunity: '',
      identifier: '',
      communityData: [],
      communityObj: {},
      source_list: [],
      source_name: '',
      source_id: '',
      downloadView: false,
      downloadUrl: '',
      downloadName: ''
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    orderStatusList() {
      return [
        { name: this.$t('9d49798d.a8b0c2'), value: 'all' },
        { name: this.$t('9d49798d.608afd'), value: 'notpay' },
        { name: this.$t('9d49798d.64729d'), value: 'payed' },
        { name: this.$t('9d49798d.fad522'), value: 'done' },
        { name: this.$t('9d49798d.2111cc'), value: 'ordercancel' },
        { name: this.$t('9d49798d.07e608'), value: 'refundprocess' },
        { name: this.$t('9d49798d.e85018'), value: 'refundsuccess' }
      ]
    }
  },
  mounted() {
    this.getOrders(this.params)
    let param = { page: 1, pageSize: 100, status: 'all' }
    this.communityList(param)
    this.getAllSourcesList()
  },
  methods: {
    // 切换tab
    handleClick(tab, event) {
      this.activeName = tab.name
      this.params.page = 1
      if (this.activeName !== 'all') {
        this.params.order_status = tab.name
      } else {
        this.params.order_status = ''
      }
      this.getOrders(this.params)
    },
    communityHandle(val) {
      this.currentCommunity = val
      this.getParams()
      this.params.page = 1
      this.params.shop_id = val
      this.getOrders(this.params)
    },
    TypeHandle() {
      this.getParams()
      this.params.page = 1
      this.getOrders(this.params)
    },
    orderStatusSelectHandle() {
      this.getParams()
      this.params.order_status = this.order_status
      this.params.page = 1
      this.getOrders(this.params)
    },
    numberSearch(e) {
      this.getParams()
      this.params.page = 1
      this.getOrders(this.params)
    },
    dateChange(val) {
      if (val && val.length > 0) {
        this.time_start_begin = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.time_start_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.time_start_begin = ''
        this.time_start_end = ''
      }
      this.getParams()
      this.params.page = 1
      this.getOrders(this.params)
    },
    sourceSearch(item) {
      this.getParams()
      this.params.source_id = item.source_id
      this.params.page = 1
      this.getOrders(this.params)
    },
    handleCurrentChange(val) {
      this.getParams()
      this.params.page = val
      this.loading = false
      this.getOrders(this.params)
    },
    getParams() {
      this.params.time_start_begin = this.time_start_begin
      this.params.time_start_end = this.time_start_end
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
        var list = response.data.data.list
        var newlist = []
        list.forEach((row) => {
          if (row.order_status == 'CANCEL_WAIT_PROCESS') {
            row.order_status = 'REFUND_PROCESS'
          } else if (row.order_status === 'CANCEL' && row.cancel_status === 'SUCCESS') {
            //row.order_status = 'REFUND_SUCCESS'
          }
          newlist.push(row)
        })
        this.list = newlist
        this.total_count =
          'undefined' == typeof response.data.data.pager
            ? response.data.data.total_count
            : Number(response.data.data.pager.count)
        this.loading = false
      })
    },
    communityList(filter) {
      this.loading = true
      getCommunityList(filter).then((response) => {
        this.communityData = response.data.data.list
        if (this.communityData) {
          var obj = {}
          this.communityData.forEach((row) => {
            var key = row.community_id
            obj[key] = row
          })
        }
        this.communityObj = obj
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
      orderExport(this.params).then((response) => {
        this.downloadUrl = response.data.url
        this.downloadName = response.data.filename
        this.downloadView = true
      })
    }
  }
}
</script>
