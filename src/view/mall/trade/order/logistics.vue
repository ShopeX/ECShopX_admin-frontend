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
  <SpPage title="物流信息">
    <div class="section-white">
      <div v-loading="loading" class="detail-info">
        <el-timeline v-if="list.length > 0" :reverse="false">
          <el-timeline-item
            v-for="(key, index) in list"
            :key="index"
            :timestamp="key.AcceptTime"
            placement="top"
          >
            <p>{{ key.AcceptStation }}</p>
          </el-timeline-item>
        </el-timeline>
        <p v-else>目前暂无物流信息~</p>
      </div>
    </div>
  </SpPage>
</template>

<style scoped lang="scss" type="text/css">
h3.title {
  padding: 20px;
  font-size: 18px;
  color: #ff5000;
}
.col-3 {
  width: 120px;
  margin-right: 10px;
}
.detail-info {
  margin: 0 10px;
}
.el-row {
  margin-bottom: 10px;
}
.item-image {
  max-width: 80px;
  margin: 0 auto;
}
img {
  max-width: 100px;
  margin: 0 auto;
}
.block {
  margin-left: 85px;
}
.radio {
  margin-bottom: 15px;
}
</style>
<script>
import { getDeliveryDetail } from '@/api/trade'
export default {
  data() {
    return {
      loading: false,
      delivery_corp: '',
      delivery_code: '',
      delivery_corp_source: '',
      list: []
    }
  },
  mounted() {
    if (this.$route.query.delivery_corp) {
      this.delivery_corp = this.$route.query.delivery_corp
    }
    if (this.$route.query.delivery_code) {
      this.delivery_code = this.$route.query.delivery_code
    }
    if (this.$route.query.delivery_corp_source) {
      this.delivery_corp_source = this.$route.query.delivery_corp_source
    }
    this.deliveryDesc()
  },
  methods: {
    retrunClick() {
      this.$router.go(-1)
    },
    deliveryDesc() {
      this.loading = true
      let query = {
        delivery_corp: this.delivery_corp,
        delivery_code: this.delivery_code,
        delivery_corp_source: this.delivery_corp_source
      }
      getDeliveryDetail(query).then(response => {
        this.list = response.data.data
        this.loading = false
      })
    }
  }
}
</script>
