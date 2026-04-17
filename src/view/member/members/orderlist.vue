<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-table v-loading="loading" :data="list" border>
      <el-table-column prop="create_time" :label="$t('63018193.eca37c')">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="order_id" :label="$t('63018193.1e8dc2')" />
      <el-table-column prop="title" :label="$t('63018193.32c65d')" />
      <el-table-column prop="total_fee" :label="$t('63018193.4cf24a')">
        <template slot-scope="scope"> ￥{{ scope.row.total_fee / 100 }} </template>
      </el-table-column>
      <el-table-column prop="order_type" :label="$t('63018193.226b09')">
        <template slot-scope="scope">
          <span
            v-for="(item, index) in orderType"
            v-if="item.type == scope.row.order_type"
            :key="index"
          >
            {{ item.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="order_status" :label="$t('63018193.86f6cf')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.order_status == 'DONE'" type="success">
            {{ $t('63018193.fad522') }}
          </el-tag>
          <el-tag v-else-if="scope.row.order_status == 'NOTPAY'">
            {{ $t('63018193.608afd') }}
          </el-tag>
          <el-tag v-else-if="scope.row.order_status == 'CLOSED'" type="danger">
            {{ $t('63018193.2111cc') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('63018193.2b6bc0')">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.order_type != 'membercard'"
            size="small"
            icon="view"
            @click="getDetail(scope.row.order_id)"
          >
            {{ $t('63018193.f26225') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="total_count > pageSize" class="content-padded tc">
      <el-pagination
        layout="prev, pager, next"
        :total="total_count"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
import { getOrderList } from '../../../api/trade'
export default {
  props: ['userId', 'isLoad'],
  data() {
    return {
      loading: false,
      params: {},
      // time_start_begin: '',
      // time_start_end: '',
      total_count: 0,
      currentPage: 1,
      pageSize: 20,
      list: [],
      currentShop: '',
      wxShopsList: []
    }
  },
  computed: {
    orderStatusList() {
      return [
        { name: this.$t('63018193.608afd'), value: 'notpay' },
        { name: this.$t('63018193.fad522'), value: 'done' }
      ]
    }
  },
  watch: {
    userId(newVal, oldVal) {
      if (this.isLoad) {
        this.params = { page: this.currentPage, pageSize: this.pageSize, user_id: newVal }
        this.getOrders(this.params)
      }
    },
    isLoad(newVal, oldVal) {
      if (newVal) {
        this.params = { page: this.currentPage, pageSize: this.pageSize, user_id: this.userId }
        this.getOrders(this.params)
      }
    }
  },
  mounted() {
    // this.params = {page: this.currentPage, pageSize: this.pageSize, user_id: userId}
    // this.getOrders(this.params)
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val
      this.loading = false
      this.getParams()
      this.getOrders(this.params)
    },
    getParams() {
      // this.params.time_start_begin = this.time_start_begin
      // this.params.time_start_end = this.time_start_end
      // this.params.order_type = this.order_type
      // if(this.order_type == 'service') {
      //   this.params.shop_id = this.currentShop
      // } else if(this.order_type == 'bargain') {
      //   delete this.params.shop_id
      // }
      // if(this.identifier.length == 11) {
      //   this.params.mobile = this.identifier
      // } else {
      //   this.params.mobile = ''
      //   this.params.order_id = this.identifier
      // }
      this.params.page = this.currentPage
      this.params.pageSize = this.pageSize
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
    getDetail(orderId) {
      this.$router.push({
        path: `${
          this.$store.getters.login_type != 'distributor'
            ? '/order/order-manage/order-list/detail'
            : '/shopadmin/order/order-manage/order-list/detail'
        }`,
        query: {
          orderId: orderId,
          resource: '/member/manage/members/detail?user_id=' + this.userId,
          user_id: this.userId
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 10px;
  .frm-tips {
    color: #8d8d8d;
  }
}
</style>
