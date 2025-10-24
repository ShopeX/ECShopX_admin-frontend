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
<style scoped lang="scss">
.time-box {
  margin: 20px 0;
  padding: 10px 15px;
  background-color: #efefef;
}
.basic {
  padding: 30px 0;
  text-align: center;
  span {
    color: #ff5000;
    font-size: 22px;
  }
}
</style>
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/mall' }"> 商城 </el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/mall/marketing/distributor' }">
        店铺管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>店铺详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="time-box basic">
      <el-row>
        <el-col :span="4">
          可提现:&nbsp;<span>{{ count.cashWithdrawalRebate / 100 }}</span
          >元
        </el-col>
        <el-col :span="4">
          已提现:&nbsp;<span>{{
            (count.rebateTotal -
              count.cashWithdrawalRebate -
              count.freezeCashWithdrawalRebate -
              count.noCloseRebate) /
            100
          }}</span
          >元
        </el-col>
        <el-col :span="4">
          申请提现:&nbsp;<span>{{ count.freezeCashWithdrawalRebate / 100 }}</span
          >元
        </el-col>
        <el-col :span="4">
          未结算:&nbsp;<span>{{ count.noCloseRebate / 100 }}</span
          >元
        </el-col>
        <el-col :span="4">
          佣金总额:&nbsp;<span>{{ count.rebateTotal / 100 }}</span
          >元
        </el-col>
        <el-col :span="4">
          商品总额:&nbsp;<span>{{ count.itemTotalPrice / 100 }}</span
          >元
        </el-col>
      </el-row>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="index"
        :label="item.name"
        :name="item.activeName"
      >
        <el-table v-loading="loading" :data="list" height="550" border>
          <el-table-column prop="order_id" label="店铺关联订单" min-width="84">
            <template slot-scope="scope">
              <router-link
                :to="{
                  path: '/mall/trade/order/detail',
                  query: {
                    orderId: scope.row.order_id,
                    resource:
                      '/mall/marketing/distributor/log?distributor_id=' + scope.row.distributor_id
                  }
                }"
              >
                {{ scope.row.order_id }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column prop="distributor_mobile" label="店铺手机号" min-width="64" />
          <el-table-column prop="item_name" label="店铺商品" />
          <el-table-column prop="num" label="商品数量" min-width="48" />
          <el-table-column label="商品佣金" min-width="60">
            <template slot-scope="scope">
              <span> {{ scope.row.rebate / 100 }} </span> 元
            </template>
          </el-table-column>
          <el-table-column label="总佣金" min-width="60">
            <template slot-scope="scope">
              <span> {{ scope.row.total_rebate / 100 }} </span> 元
            </template>
          </el-table-column>
          <el-table-column prop="is_close" label="是否已结算" min-width="50">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.is_close == true" type="warning"> 已结算 </el-tag>
              <el-tag v-else type="info"> 未结算 </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="plan_close_date" label="预计结算时间" />
        </el-table>
        <div v-if="total_count > params.pageSize" class="mt-4 text-right">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total_count"
            :page-size="params.pageSize"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { getDistributeLogs, getDistributorCount } from '../../../api/marketing'

export default {
  data() {
    return {
      tabList: [
        { name: '全部', value: null, activeName: 'first' },
        { name: '已结算', value: 'true', activeName: 'second' },
        { name: '未结算', value: 'false', activeName: 'third' }
      ],
      activeName: 'first',
      total_count: 0,
      pageLimit: 10,
      loading: false,
      count: {
        cashWithdrawalRebate: 0,
        freezeCashWithdrawalRebate: 0,
        itemTotalPrice: 0,
        noCloseRebate: 0,
        rebateTotal: 0
      },
      params: {
        page: 1,
        pageSize: 20,
        distributor_id: ''
      },
      list: [{}]
    }
  },
  mounted() {
    this.params.distributor_id = this.$route.query.distributor_id
    if (!this.params.distributor_id) {
      this.$router.go(-1)
    }
    this.distributorInfo()
    this.getList()
  },
  methods: {
    handleClick(tab, event) {
      this.params.page = 1
      if (this.activeName == 'second') {
        this.params.is_close = 'true'
      } else if (this.activeName == 'third') {
        this.params.is_close = 'false'
      } else {
        this.params.is_close = ''
      }
      this.getList()
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getList()
    },
    distributorInfo() {
      getDistributorCount(this.params.distributor_id).then(response => {
        this.count = response.data.data
      })
    },
    getList() {
      this.loading = true
      getDistributeLogs(this.params).then(response => {
        if (response.data.data.list) {
          this.list = response.data.data.list
          this.total_count = response.data.data.total_count
        }
        this.loading = false
      })
    }
  }
}
</script>
