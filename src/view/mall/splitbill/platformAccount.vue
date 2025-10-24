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
    <el-card shadow="never">
      <div class="account-number">
        <div class="item">
          <h4 class="account-hd">总计收入</h4>
          <h5>￥ {{ totle.income }}</h5>
        </div>
        <div class="item">
          <h4 class="account-hd">总退款金额</h4>
          <h5>￥ {{ totle.refund }}</h5>
        </div>
        <!-- <div class="item">
          <h4 class="account-hd">总提现金额</h4>
          <h5>￥ {{ totle.withdrawal }}</h5>
        </div> -->
        <div class="item">
          <h4 class="account-hd">未结算资金</h4>
          <h5>￥ {{ totle.unsettled_funds }}</h5>
        </div>
      </div>
    </el-card>

    <div>
      <el-form label-width="100px">
        <el-form-item label="日期范围">
          <el-row :gutter="20">
            <el-col :span="9">
              <el-date-picker
                v-model="vdate"
                value-format="yyyy-MM-dd"
                type="daterange"
                unlink-panels
                align="right"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%"
              />
            </el-col>
            <el-col :span="5">
              <el-input v-model="params.order_id" placeholder="订单号" />
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="getList(true)"> 搜索 </el-button>
              <el-button type="primary" @click="exportData()"> 导出 </el-button>
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
        </el-form-item>
      </el-form>
      <el-table v-loading="loading" :data="allListData" stripe border style="width: 100%">
        <el-table-column prop="trade_time" label="日期" fixed />
        <el-table-column prop="order_id" label="订单号" />
        <el-table-column prop="fin_type" label="类型" />

        <el-table-column prop="income" label="金额">
          <template slot-scope="scope">
            <span v-if="scope.row.income != 0" style="color: #70b603">
              +￥{{ scope.row.income }}
            </span>
            <span v-else style="color: red"> -￥{{ scope.row.outcome }} </span>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="total_count > params.page_size" class="mt-4 text-right">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :current-page.sync="params.page"
          :page-sizes="[10, 20, 50]"
          :total="total_count"
          :page-size="params.page_size"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
  </div>
</template>
<script>
import store from '@/store'
import { getPlatformAccount, exportAccount } from '@/api/fenzhang'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      vdate: '',
      loading: true,
      params: {
        page: 1,
        page_size: 20,
        order_id: '',
        type: '2',
        start_date: '',
        end_date: ''
      },
      total_count: 0,
      loading: false,
      allListData: [],
      totle: {
        income: 0,
        disburse: 0,
        withdrawal: 0,
        refund: 0,
        balance: 0,
        withdrawal_balance: 0,
        unsettled_funds: 0
      }
    }
  },
  mounted() {
    var start = new Date()
    var end = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
    end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
    this.vdate = [start, end]

    this.getList()
  },
  methods: {
    getList() {
      if (!this.vdate) {
        Message.error('请输入日期')
      } else {
        this.params.start_date = this.vdate[0]
        this.params.end_date = this.vdate[1]
        this.loading = true
        getPlatformAccount(this.params).then(res => {
          this.allListData = res.data.data.list.data
          this.total_count = res.data.data.list.total_count
          this.totle = res.data.data.totle
          this.loading = false
        })
      }
    },
    handleSizeChange(page_size) {
      this.params.page = 1
      this.params.page_size = page_size
      this.getList()
    },
    handleCurrentChange(page) {
      this.params.page = page
      this.getList()
    },
    exportData() {
      let obj = {
        start_date: this.params.start_date,
        end_date: this.params.end_date,
        order_id: this.params.order_id
      }
      exportAccount(obj).then(res => {
        this.$message({
          type: 'success',
          message: '已加入执行队列，请在设置-导出列表中下载'
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.account-number {
  font-size: 16px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 25px;
    color: red;
    .account-hd {
      margin-right: 25px;
      font-size: 15px;
      display: inline-block;
    }
    h5 {
      font-size: 18px;
      color: red;
      font-weight: 700;
    }
  }
}
.tips {
  p {
    font-size: 13px;
  }
}
</style>
