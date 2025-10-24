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
  <section class="section section-white">
    <div class="section-header with-border">
      <div class="section-title">支付配置</div>
    </div>
    <div class="section-body">
      <el-table v-loading="loading" :data="paymentData" height="580" border>
        <el-table-column prop="name" label="支付名称" />
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="getDetail(scope.row.payment_type)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>

<script>
import { getPaymentList } from '../../../api/trade'

export default {
  data() {
    return {
      loading: false,
      paymentData: []
    }
  },
  mounted() {
    this.getPaymentList()
  },
  methods: {
    getPaymentList() {
      this.loading = true
      getPaymentList()
        .then(response => {
          const data = response.data.data
          this.paymentData = Object.keys(data).map(v => data[v])
          this.loading = false
        })
        .catch(error => {
          this.loading = false
        })
    },
    getDetail(payment_type) {
      this.$router.push({
        path: '/base/asset/payment/' + payment_type
      })
    }
  }
}
</script>

<style scoped></style>
