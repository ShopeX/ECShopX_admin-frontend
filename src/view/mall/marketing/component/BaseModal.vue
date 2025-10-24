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
  <el-card class="mycard">
    <div slot="header">
      {{ title }}
    </div>
    <div class="body">
      <el-row>
        <el-col v-for="(col, colIndex) in labelList" :key="colIndex" :span="span" :offset="1">
          <el-row class="cus-row-mb">
            <el-col :span="span === 20 ? 4 : 11" class="cus-row-flex">
              {{ addSymbol(col.name) }}
            </el-col>
            <el-col
              v-for="(pic, index) in info[col.field]"
              v-if="col.list"
              :key="pic"
              :span="1"
              :offset="index > 0 ? 1 : 0"
            >
              <img :src="wximageurl + pic" width="40" height="40">
            </el-col>
            <el-col v-if="col.type" :span="20" class="word-warp">
              <img :src="col.type && info[col.field]" alt="">
            </el-col>
            <el-col v-else :span="span === 20 ? 20 : 13" class="word-warp">
              {{ col.filter ? col.filter(info[col.field]) || '-' : info[col.field] || '-' }}
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import { dateFilter } from '@/utils'
export default {
  props: ['labelList', 'info', 'title', 'span'],
  methods: {
    addSymbol: function (symbol) {
      if (symbol.indexOf('：') > -1) {
        return symbol
      }
      return `${symbol}：`
    }
  }
}
</script>

<style lang="scss" scoped>
.word-warp {
  word-break: break-all;
}
.cus-row-flex {
  text-align: right;
}
.cus-row-mb {
  margin-bottom: 20px !important;
}
</style>
