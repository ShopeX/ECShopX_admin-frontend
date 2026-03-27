<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <section class="section section-white">
    <div class="section-header with-border">
      <div class="section-title">{{ $t('186c5ea8.1c3835') }}</div>
    </div>
    <div class="section-body">
      <el-table v-loading="loading" :data="paymentData" height="580" border>
        <el-table-column prop="name" :label="$t('186c5ea8.f16ae8')" />
        <el-table-column :label="$t('186c5ea8.2b6bc0')" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="getDetail(scope.row.payment_type)">
              {{ $t('186c5ea8.95b351') }}
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
        .then((response) => {
          const data = response.data.data
          this.paymentData = Object.keys(data).map((v) => data[v])
          this.loading = false
        })
        .catch((error) => {
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
