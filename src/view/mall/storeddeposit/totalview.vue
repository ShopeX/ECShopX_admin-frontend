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
    <div class="recharge-overview view-flex content-center content-padded">
      <div class="view-flex-item">
        <i class="iconfont icon-wallet" />
        <div>
          <span>储值总额</span>
          <span class="money mark">{{ count.shopDepositTotal / 100 }}</span> 元
        </div>
      </div>
      <div class="view-flex-item">
        <i class="iconfont icon-credit-card1" />
        <div>
          今日充值 <small class="muted">(不含赠送金额)</small>
          <span class="money mark">{{ count.rechargeDayTotal / 100 }}</span> 元
        </div>
      </div>
      <div class="view-flex-item">
        <i class="iconfont icon-store-alt" />
        <div>
          <span>今日使用</span> <span class="money mark">{{ count.consumeDayTotal / 100 }}</span> 元
        </div>
      </div>
    </div>
    <el-table v-loading="loading" :data="dataList" :height="wheight - 240">
      <el-table-column prop="timeStart" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.timeStart | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="depositTradeId" label="交易流水号" />
      <el-table-column prop="mobile" label="用户手机号" />
      <el-table-column label="类型">
        <template slot-scope="scope">
          <span v-if="scope.row.tradeType == 'consume'">消费记录</span>
          <span v-else-if="scope.row.tradeType == 'recharge_gift'">赠送记录</span>
          <span v-else>充值记录</span>
        </template>
      </el-table-column>
      <el-table-column prop="money" label="金额">
        <template slot-scope="scope">
          <span>{{ scope.row.money / 100 }}元</span>
        </template>
      </el-table-column>
      <el-table-column prop="shopName" label="门店" />
    </el-table>
    <!--
    <el-col :span="7">
      <div class="ranking section-white">
        <div class="ranking-header content-center">门店近30天吸储排行</div>
        <div class="ranking-body">
            <ul class="ranking-list">
              <li v-for="(item, index) in rankingList">{{index + 1}}&nbsp;<span class="store-name">{{item.name}}</span><span class="cost-money content-right">¥{{item.money}}</span></li>
            </ul>
            <div class="content-right">
              <span class="frm-tips more" v-if="rankingList.length > 10">更多>></span>
            </div>
          </el-tabs>
        </div>
      </div>
    </el-col>
    -->
  </div>
</template>

<script>
var stored1 = require('@/assets/img/stored1.png')
var stored2 = require('@/assets/img/stored2.png')
var stored3 = require('@/assets/img/stored3.png')
import { mapGetters } from 'vuex'
import { getDepositTradeList, getDepositCountIndex } from '../../../api/deposit'

export default {
  data() {
    return {
      icon1: stored1,
      icon2: stored2,
      icon3: stored3,
      loading: false,
      dataList: [],
      count: {},
      rankingList: []
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    getDepositTradeList().then(res => {
      this.dataList = res.data.data.list
    })
    getDepositCountIndex().then(res => {
      this.count = res.data.data
    })
  },
  methods: {}
}
</script>

<style scoped lang="scss">
.recharge-overview {
  .iconfont {
    font-size: 50px;
    color: #ff5000;
    margin-bottom: 10px;
  }
}
.deposit-des {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-bottom: 20px;
  border: 1px solid #dfe6ec;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  > div {
    float: left;
    width: 33%;
    color: #666;
    margin-left: 5%;
    img {
      float: left;
      margin-right: 10px;
    }
    > div > span {
      text-align: left;
      display: block;
    }
  }
  .money {
    font-size: 20px;
    color: #ff5000;
  }
  img {
    width: 55px;
    height: 55px;
  }
}
.ranking {
  border: 1px solid #dfe6ec;
  &-header {
    padding: 10px 15px;
    border-bottom: 1px solid #efefef;
    cursor: pointer;
    background: #f8f8f8;
  }
  &-body {
    padding: 10px;
  }
  &-list {
    padding: 0 10px;
    margin-bottom: 10px;
    li {
      .store-name,
      .cost-money {
        display: inline-block;
        width: 46%;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: middle;
      }
      &:hover {
        color: #ff5000;
      }
    }
  }
}
.more {
  cursor: pointer;
  font-size: 12px;
  padding-right: 10px;
  &:hover {
    color: #333;
  }
}
</style>
