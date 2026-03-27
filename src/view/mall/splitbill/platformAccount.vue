<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-card shadow="never">
      <div class="account-number">
        <div class="item">
          <h4 class="account-hd">{{ $t('1f2b8259.90b3f7') }}</h4>
          <h5>￥ {{ totle.income }}</h5>
        </div>
        <div class="item">
          <h4 class="account-hd">{{ $t('1f2b8259.47a1ec') }}</h4>
          <h5>￥ {{ totle.refund }}</h5>
        </div>
        <!-- <div class="item">
          <h4 class="account-hd">总提现金额</h4>
          <h5>￥ {{ totle.withdrawal }}</h5>
        </div> -->
        <div class="item">
          <h4 class="account-hd">{{ $t('1f2b8259.ea3b22') }}</h4>
          <h5>￥ {{ totle.unsettled_funds }}</h5>
        </div>
      </div>
    </el-card>

    <div>
      <el-form label-width="100px">
        <el-form-item :label="$t('1f2b8259.786622')">
          <el-row :gutter="20">
            <el-col :span="9">
              <el-date-picker
                v-model="vdate"
                value-format="yyyy-MM-dd"
                type="daterange"
                unlink-panels
                align="right"
                :range-separator="$t('1f2b8259.981cbe')"
                :start-placeholder="$t('1f2b8259.b44c0f')"
                :end-placeholder="$t('1f2b8259.1d468b')"
                style="width: 100%"
              />
            </el-col>
            <el-col :span="5">
              <el-input v-model="params.order_id" :placeholder="$t('1f2b8259.1e8dc2')" />
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="getList(true)">
                {{ $t('1f2b8259.e5f71f') }}
              </el-button>
              <el-button type="primary" @click="exportData()">
                {{ $t('1f2b8259.55405e') }}
              </el-button>
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                :content="$t('1f2b8259.676480')"
              >
                <i slot="reference" class="el-icon-question" />
              </el-popover>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <el-table v-loading="loading" :data="allListData" stripe border style="width: 100%">
        <el-table-column prop="trade_time" :label="$t('1f2b8259.4ff1e7')" fixed />
        <el-table-column prop="order_id" :label="$t('1f2b8259.1e8dc2')" />
        <el-table-column prop="fin_type" :label="$t('1f2b8259.226b09')" />

        <el-table-column prop="income" :label="$t('1f2b8259.4cf24a')">
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
        Message.error(this.$t('1f2b8259.0947df'))
      } else {
        this.params.start_date = this.vdate[0]
        this.params.end_date = this.vdate[1]
        this.loading = true
        getPlatformAccount(this.params).then((res) => {
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
      exportAccount(obj).then((res) => {
        this.$message({
          type: 'success',
          message: this.$t('1f2b8259.3e1ddd')
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
