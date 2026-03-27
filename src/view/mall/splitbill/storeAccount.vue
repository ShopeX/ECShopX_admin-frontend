<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-card shadow="never">
      <div class="account-number">
        <div class="item">
          <h4 class="account-hd">{{ $t('e79e4a27.90b3f7') }}</h4>
          <h5>￥ {{ totle.income }}</h5>
        </div>
        <div class="item">
          <h4 class="account-hd">{{ $t('e79e4a27.47a1ec') }}</h4>
          <h5>￥ {{ totle.refund }}</h5>
        </div>
        <div class="item">
          <h4 class="account-hd">{{ $t('e79e4a27.9d5404') }}</h4>
          <h5>￥ {{ totle.withdrawal }}</h5>
        </div>
        <div class="item">
          <h4 class="account-hd">{{ $t('e79e4a27.504406') }}</h4>
          <h5>￥ {{ totle.withdrawal_balance }}</h5>
        </div>
        <div class="item">
          <h4 class="account-hd">{{ $t('e79e4a27.c9dd52') }}</h4>
          <h5>￥ {{ totle.unsettled_funds }}</h5>
        </div>
      </div>
    </el-card>

    <div>
      <el-form label-width="100px">
        <el-form-item :label="$t('e79e4a27.786622')">
          <el-row :gutter="20">
            <el-col :span="9">
              <el-date-picker
                v-model="vdate"
                type="daterange"
                alue-format="yyyy-MM-dd"
                align="right"
                unlink-panels
                :range-separator="$t('e79e4a27.981cbe')"
                :start-placeholder="$t('e79e4a27.b44c0f')"
                :end-placeholder="$t('e79e4a27.1d468b')"
                style="width: 100%"
                value-format="yyyy-MM-dd"
              />
            </el-col>
            <el-col v-if="$store.getters.login_type !== 'distributor'" :span="5">
              <el-select
                v-model="params.distributor_id"
                :placeholder="$t('e79e4a27.ca95a5')"
                style="width: 100%"
              >
                <el-option
                  v-for="item in distributorOption"
                  :key="item.distributor_id"
                  :label="item.name"
                  size="mini"
                  :value="item.distributor_id"
                />
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-input v-model="params.order_id" :placeholder="$t('e79e4a27.1e8dc2')" />
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="getList(true)">
                {{ $t('e79e4a27.e5f71f') }}
              </el-button>

              <el-button type="primary" @click="exportData()">
                {{ $t('e79e4a27.55405e') }}
              </el-button>
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                :content="$t('e79e4a27.c11fa3')"
              >
                <i slot="reference" class="el-icon-question" />
              </el-popover>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <el-table v-loading="loading" :data="allListData" stripe border style="width: 100%">
        <el-table-column prop="trade_time" :label="$t('e79e4a27.4ff1e7')" fixed />
        <el-table-column prop="order_id" :label="$t('e79e4a27.1e8dc2')" />
        <el-table-column prop="fin_type" :label="$t('e79e4a27.226b09')" />

        <el-table-column prop="income" :label="$t('e79e4a27.4cf24a')">
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
import { mapGetters } from 'vuex'

import { getDistributorData } from '../../../api/datacube'
import { getDistributorList } from '../../../api/marketing'
import { getStoreAccount, exportAccount } from '@/api/fenzhang'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      vdate: '',
      loading: true,
      is_distributor: false,
      distributorOption: [],
      allListData: [],
      params: {
        page: 1,
        page_size: 20,
        order_id: '',
        start_date: '',
        end_date: '',
        distributor_id: ''
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
    // console.log(this.$store.getters,'this.$store.getter');
    var start = new Date()
    var end = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
    end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
    this.vdate = [start, end]
    if (store.getters.login_type === 'distributor') {
      this.is_distributor = true
      this.params.distributor_id = this.$store.getters.shopId
      this.getList()
    }
    if (this.is_distributor === false) {
      this.getDistributorData()
    }
  },
  methods: {
    getDistributorData() {
      getDistributorList().then((res) => {
        this.distributorOption = res.data.data.list
        this.params.distributor_id = this.distributorOption[0].distributor_id
        this.getList()
      })
    },
    getList(isfirst) {
      if (this.is_distributor === false && this.params.distributor === '') {
        this.$message({
          type: 'error',
          message: this.$t('e79e4a27.0d3b95')
        })
        return false
      }
      if (!this.vdate) {
        Message.error(this.$t('e79e4a27.0947df'))
      } else {
        this.loading = true
        this.params.start_date = this.vdate[0]
        this.params.end_date = this.vdate[1]

        getStoreAccount(this.params).then((res) => {
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
        order_id: this.params.order_id,
        distributor_id: this.params.distributor_id
      }
      exportAccount(obj).then((res) => {
        this.$message({
          type: 'success',
          message: this.$t('e79e4a27.3e1ddd')
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
