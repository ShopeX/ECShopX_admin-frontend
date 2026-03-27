<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
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
      <el-breadcrumb-item :to="{ path: '/mall' }"> {{ $t('dbc8a05e.2c7b38') }} </el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/mall/marketing/distributor' }">
        {{ $t('dbc8a05e.9be38c') }}
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('dbc8a05e.9d54ec') }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="time-box basic">
      <el-row>
        <el-col :span="4">
          {{ $t('dbc8a05e.6d318d') }}&nbsp;<span>{{ count.cashWithdrawalRebate / 100 }}</span
          >{{ $t('dbc8a05e.c16655') }}
        </el-col>
        <el-col :span="4">
          {{ $t('dbc8a05e.5924da') }}&nbsp;<span>{{
            (count.rebateTotal -
              count.cashWithdrawalRebate -
              count.freezeCashWithdrawalRebate -
              count.noCloseRebate) /
            100
          }}</span
          >{{ $t('dbc8a05e.c16655') }}
        </el-col>
        <el-col :span="4">
          {{ $t('dbc8a05e.69a03c') }}&nbsp;<span>{{ count.freezeCashWithdrawalRebate / 100 }}</span
          >{{ $t('dbc8a05e.c16655') }}
        </el-col>
        <el-col :span="4">
          {{ $t('dbc8a05e.1cd7cd') }}&nbsp;<span>{{ count.noCloseRebate / 100 }}</span
          >{{ $t('dbc8a05e.c16655') }}
        </el-col>
        <el-col :span="4">
          {{ $t('dbc8a05e.51771a') }}&nbsp;<span>{{ count.rebateTotal / 100 }}</span
          >{{ $t('dbc8a05e.c16655') }}
        </el-col>
        <el-col :span="4">
          {{ $t('dbc8a05e.6eb0c2') }}&nbsp;<span>{{ count.itemTotalPrice / 100 }}</span
          >{{ $t('dbc8a05e.c16655') }}
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
          <el-table-column prop="order_id" :label="$t('dbc8a05e.42353e')" min-width="84">
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
          <el-table-column
            prop="distributor_mobile"
            :label="$t('dbc8a05e.69e563')"
            min-width="64"
          />
          <el-table-column prop="item_name" :label="$t('dbc8a05e.54d6cd')" />
          <el-table-column prop="num" :label="$t('dbc8a05e.06612d')" min-width="48" />
          <el-table-column :label="$t('dbc8a05e.d07413')" min-width="60">
            <template slot-scope="scope">
              <span> {{ scope.row.rebate / 100 }} </span> {{ $t('dbc8a05e.c16655') }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('dbc8a05e.28313c')" min-width="60">
            <template slot-scope="scope">
              <span> {{ scope.row.total_rebate / 100 }} </span> {{ $t('dbc8a05e.c16655') }}
            </template>
          </el-table-column>
          <el-table-column prop="is_close" :label="$t('dbc8a05e.b5aa25')" min-width="50">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.is_close == true" type="warning">
                {{ $t('dbc8a05e.139304') }}
              </el-tag>
              <el-tag v-else type="info"> {{ $t('dbc8a05e.facb53') }} </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="plan_close_date" :label="$t('dbc8a05e.8b1d87')" />
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
        { name: this.$t('dbc8a05e.a8b0c2'), value: null, activeName: 'first' },
        { name: this.$t('dbc8a05e.139304'), value: 'true', activeName: 'second' },
        { name: this.$t('dbc8a05e.facb53'), value: 'false', activeName: 'third' }
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
      getDistributorCount(this.params.distributor_id).then((response) => {
        this.count = response.data.data
      })
    },
    getList() {
      this.loading = true
      getDistributeLogs(this.params).then((response) => {
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
