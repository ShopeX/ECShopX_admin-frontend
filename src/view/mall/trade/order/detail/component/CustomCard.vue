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
  <el-card :shadow="cardConfig.shadow" class="mycard" :class="{ 'base-card': isBase }">
    <div v-if="!isBase" slot="header">
      {{ title }}
    </div>
    <div v-if="isBase" slot="header" class="baseTitle">
      <div class="title1">
        {{ title }}
      </div>
      <el-button type="text" @click="clickShowRemark(dataSource, 'orderDetail')">
        修改商家备注
      </el-button>
    </div>
    <template v-if="isCommon">
      <div class="body">
        <el-row v-for="(row, index) in info" :key="index">
          <el-col v-for="(col, colIndex) in row" :key="colIndex" :span="col.isHidden ? 0 : 6">
            <div class="flex">
              <div class="left">
                {{ addSymbol(col.name) }}
              </div>
              <div class="right">
                {{ col.filter ? col.filter(dataSource[col.field]) : dataSource[col.field] }}
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </template>
    <slot />
    <RemarkModal ref="modalRef" @onDone="handleRemarksDone" />
    <div v-if="isBase" class="footer">
      <div class="footer_title">客户留言：</div>
      <div class="footer_content">
        {{ dataSource.remark }}
      </div>
    </div>
    <div v-if="isBase" class="footer">
      <div class="footer_title">商家备注：</div>
      <div class="footer_content">
        {{ dataSource.distributor_remark }}
      </div>
    </div>
  </el-card>
</template>

<script>
import RemarkModal from '@/components/remarkModal'
import remarkMixin from '@/mixins/remarkMixin'
export default {
  components: {
    RemarkModal
  },
  mixins: [remarkMixin],
  props: ['title', 'info', 'dataSource', 'isCommon', 'isBase'],
  data() {
    return {
      cardConfig: {
        shadow: 'never'
      }
    }
  },
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

<style lang="scss">
.mycard {
  &.base-card {
    .el-card__body {
      padding: 0;
    }
    .body {
      padding: 24px;
    }
  }

  .el-card__header {
    padding: 8px 20px;
  }
  .baseTitle {
    display: flex;
    align-items: center;

    .title1 {
      margin-right: 10px;
    }
  }
  .footer {
    display: flex;
    border-top: 1px solid #ebeef5;
    padding: 24px;

    &_title {
      width: 120px;
      white-space: nowrap;
    }
    &_content {
    }
  }
  .flex {
    display: flex;

    .right {
      margin-left: 10px;
      color: grey;
    }
  }
}
</style>
