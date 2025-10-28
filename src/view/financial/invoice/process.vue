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
  <div class="section-white">
    <div v-loading="loading" class="detail-info">
      <el-timeline :reverse="false">
        <el-timeline-item
          v-for="(key, index) in list"
          :key="index"
          :timestamp="key.create_time | datetime('YYYY-MM-DD HH:mm:ss')"
          placement="top"
        >
          <el-card>
            <h2>{{ key.operator_content?.title }}</h2>
            <p>操作人员：{{ key.operator_id ?? key.user_id }}</p>
            <p>
              人员类型：
              <span v-if="'user' == key.operator_type"> 用户 </span>
              <span v-else-if="'salesperson' == key.operator_type"> 导购员 </span>
              <span v-else-if="'admin' == key.operator_type"> 管理员 </span>
              <span v-else-if="'system' == key.operator_type"> 系统 </span>
              <span v-else-if="'distributor' == key.operator_type"> 店铺管理员 </span>
            </p>
            <p>操作详情：{{ key.operator_content?.remark }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
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
  // max-width: 100px;
  margin: 0 auto;
}
.block {
  margin-left: 85px;
}
.radio {
  margin-bottom: 15px;
}
.img-box {
  display: flex;
  flex-wrap: wrap;
}
.img-item {
  width: 150px;
  height: 150px;
  margin: 0 20px 20px 0;
}
</style>
<script>
export default {
  data() {
    return {
      loading: false,
      invoice_id: '',
      list: []
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.invoice_id = this.$route.query.id
    }
    this.getProcessLogInfo()
  },
  methods: {
    retrunClick() {
      this.$router.go(-1)
    },
    getProcessLogInfo() {
      this.loading = true
      this.$api.financial.getInvoiceLog({invoice_id:this.invoice_id}).then((response) => {
        this.list = response.list.map(item=>({...item,operator_content:JSON.parse(item.operator_content)}))
        console.log(this.list)
        this.loading = false
      })
    }
  }
}
</script>
