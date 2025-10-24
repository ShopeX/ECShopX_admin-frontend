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
  <div>
    <div v-if="$route.path.indexOf('detail') === -1">
      <el-row class="filter-header" :gutter="20">
        <el-col>
          <el-input v-model="identifier" class="input-m" placeholder="订单号" />
          <el-input v-model="brand" class="input-m" placeholder="品牌" />
          <el-input v-model="main_category" class="input-m" placeholder="商品品类" />
        </el-col>
        <el-col>
          下单日期
          <el-date-picker
            v-model="create_time"
            class="input-m"
            type="daterange"
            value-format="yyyy/MM/dd"
            placeholder="选择日期范围"
            @change="dateChange"
          />
        </el-col>
        <el-col>
          发货日期
          <el-date-picker
            v-model="delivery_time"
            class="input-m"
            type="daterange"
            value-format="yyyy/MM/dd"
            placeholder="选择日期范围"
            @change="dateDeliveryChange"
          />
          <el-button type="primary" @click="exportData"> 导出 </el-button>
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            content="导出任务会以队列执行，点击导出后，请至‘设置-导出列表’页面中查看及下载数据"
          >
            <i slot="reference" class="el-icon-question" />
          </el-popover>
        </el-col>
      </el-row>
    </div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { exportSalesReport } from '../../../../api/trade'
export default {
  data() {
    return {
      currentShop: '',
      loading: false,
      create_time: '',
      delivery_time: '',
      params: {
        page: 1,
        pageSize: 20,
        aftersales_status: 2
      },
      time_start_begin: '',
      time_start_end: '',
      delivery_time_start_begin: '',
      delivery_time_start_end: '',
      total_count: 0,
      list: [],
      identifier: '',
      brand: '',
      main_category: ''
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  methods: {
    onCopy() {
      this.$notify.success({
        message: '复制成功',
        showClose: true
      })
    },
    dateChange(val) {
      if (val && val.length > 0) {
        this.time_start_begin = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.time_start_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.time_start_begin = ''
        this.time_start_end = ''
      }
    },
    dateDeliveryChange(val) {
      if (val && val.length > 0) {
        this.delivery_time_start_begin = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.delivery_time_start_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.delivery_time_start_begin = ''
        this.delivery_time_start_end = ''
      }
    },
    getParams() {
      this.params.time_start_begin = this.time_start_begin
      this.params.time_start_end = this.time_start_end
      this.params.delivery_time_start_begin = this.delivery_time_start_begin
      this.params.delivery_time_start_end = this.delivery_time_start_end
      this.params.order_id = this.identifier
      this.params.brand = this.brand
      this.params.main_category = this.main_category
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    querySearch(queryString, cb) {
      var restaurants = this.source_list
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return restaurant => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    exportData() {
      this.getParams()
      this.params.page = 1
      exportSalesReport(this.params).then(response => {
        if (response.data.data.status) {
          this.$message({
            type: 'success',
            message: '已加入执行队列，请在设置-导出列表中下载'
          })
          return
        } else if (response.data.data.url) {
          this.downloadUrl = response.data.data.url
          this.downloadName = response.data.data.filename
          this.downloadView = true
        } else {
          this.$message({
            type: 'error',
            message: '没有相关数据可导出'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.input-m {
  width: 400px !important;
}
</style>
