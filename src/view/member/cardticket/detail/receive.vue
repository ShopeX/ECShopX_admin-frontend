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
    <el-table v-loading="loading" :data="cardList" style="width: 100%" border height="600">
      <el-table-column prop="username" label="用户名字" />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column label="领取时间">
        <template slot-scope="scope">
          <span v-if="'0' != scope.row.get_date">{{
            scope.row.get_date | datetime('YYYY-MM-DD HH:mm:ss')
          }}</span>
          <span v-else>老数据</span>
        </template>
      </el-table-column>
      <el-table-column prop="source_type" label="来源类型" />
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next"
      :current-page.sync="params.page"
      :page-sizes="[10, 20, 50]"
      :total="total_count"
      :page-size="params.pageSize"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
import { getCardUserList } from '../../../../api/cardticket'

export default {
  props: ['getStatus'],
  data() {
    return {
      loading: false,
      total_count: 0,
      cardList: [],
      params: {
        card_id: 0,
        page: 1,
        pageSize: 20
      }
    }
  },
  watch: {
    getStatus(val) {
      if (val) {
        this.getCardUserList()
      }
    }
  },
  mounted() {
    if (this.$route.query.cardId) {
      this.params.card_id = this.$route.query.cardId
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.params.page = val
      this.getCardUserList()
    },
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getCardUserList()
    },
    getCardUserList() {
      this.loading = true
      getCardUserList(this.params)
        .then(res => {
          if (res.data.data.list.length > 0) {
            this.cardList = res.data.data.list
            this.total_count = res.data.data.count
            this.loading = false
          } else {
            this.cardList = []
            this.loading = false
          }
        })
        .catch(error => {
          this.loading = false
        })
    }
  }
}
</script>
<style scoped lang="scss"></style>
