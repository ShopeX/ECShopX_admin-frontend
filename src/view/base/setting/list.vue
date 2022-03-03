<template>
  <section class="section section-white">
    <div class="section-header with-border">
      <div class="section-title">支付配置</div>
    </div>
    <div class="section-body">
      <el-table :data="paymentData" height="580" border v-loading="loading">
        <el-table-column prop="name" label="支付名称"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="getDetail(scope.row.payment_type)"
              >编辑</el-button
            >
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
  },
  mounted() {
    this.getPaymentList()
  }
}
</script>

<style scoped></style>
