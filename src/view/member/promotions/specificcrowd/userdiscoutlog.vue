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
.sp-filter-form {
  margin-bottom: 16px;
}
</style>

<template>
  <div>
    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
      <SpFilterFormItem prop="order_id" label="订单号:">
        <el-input v-model="params.order_id" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="mobile" label="手机号:">
        <el-input v-model="params.mobile" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="mobile" label="起始日期:">
        <el-date-picker
          v-model="datedata"
          size="mini"
          type="daterange"
          value-format="yyyy/MM/dd"
          placeholder="选择日期范围"
          @change="dateChange"
        />
      </SpFilterFormItem>
    </SpFilterForm>

    <div class="action-container">
      <el-button type="primary" @click="handleCancel"> 返回 </el-button>
    </div>

    <el-table v-loading="loading" :data="tableList" :height="wheight - 150" border>
      <el-table-column prop="order_id" label="订单号" width="170" />
      <el-table-column prop="user_mobile" label="会员手机号" width="120" />
      <el-table-column prop="specific_name" label="针对人群" width="120" />
      <el-table-column prop="discount_fee" label="优惠金额" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.discount_fee / 100 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="action_type" label="增/减">
        <template slot-scope="scope">
          <span v-if="scope.row.action_type == 'plus'">+</span>
          <span v-else-if="scope.row.action_type == 'less'">-(订单已取消或已退款)</span>
        </template>
      </el-table-column>
      <el-table-column prop="created" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.created | formatTimestamp }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-4 text-right">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync="page.pageIndex"
        :page-sizes="[10, 20, 50]"
        :total="total_count"
        :page-size="page.pageSize"
        @current-change="onCurrentChange"
        @size-change="onSizeChange"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { specificcrowddiscountList } from '@/api/promotions'
import { pageMixin } from '@/mixins'
export default {
  mixins: [pageMixin],
  data() {
    return {
      loading: false,
      params: {
        order_id: '',
        mobile: '',
        start_time: '',
        end_time: '',
        activity_id: undefined
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.params.activity_id = this.$route.params.id
    this.fetchList(this.params)
  },
  methods: {
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    onReset() {
      this.params.start_time = ''
      this.params.end_time = ''
      this.onSearch()
    },
    dateChange(val) {
      if (val) {
        this.params.start_time = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.params.end_time = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.params.start_time = ''
        this.params.end_time = ''
      }
      this.page.pageIndex = 1
    },
    fetchList() {
      this.loading = true
      specificcrowddiscountList(this.params).then(response => {
        this.tableList = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    handleCancel: function () {
      this.$router.go(-1)
    }
  }
}
</script>
