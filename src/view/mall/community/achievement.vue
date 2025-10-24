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
<style lang="scss" scoped>
.sp-filter-form {
  margin-bottom: 16px;
  padding-bottom: 0;
}
.total-info {
  margin-top: 30px;
  .total-value {
    font-size: 28px;
  }
}
</style>
<template>
  <SpPage>
    <SpFilterForm :model="formQuery" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="chief_mobile" label="团长手机号:">
        <el-input v-model="formQuery.chief_mobile" placeholder="请输入团长手机号" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="chief_name" label="团长姓名:">
        <el-input v-model="formQuery.chief_name" placeholder="请输入团长姓名" />
      </SpFilterFormItem>
    </SpFilterForm>

    <SpFinder
      ref="finder"
      no-selection
      :setting="setting"
      :hooks="{
        beforeSearch: beforeSearch,
        afterSearch: afterSearch
      }"
      url="/community/rebate/count"
    />
  </SpPage>
</template>

<script>
import { createSetting } from '@shopex/finder'
export default {
  name: '',
  data() {
    return {
      formQuery: {
        chief_name: '',
        chief_mobile: ''
      },
      setting: createSetting({
        columns: [
          { name: '姓名', key: 'chief_name' },
          { name: '手机号', key: 'chief_mobile' },
          {
            name: '可提现（¥）',
            key: 'cash_withdrawal_rebate',
            render: (h, { row }) => h('span', {}, row.cash_withdrawal_rebate / 100)
          },
          {
            name: '已提现（¥）',
            key: 'payed_rebate',
            render: (h, { row }) => h('span', {}, row.payed_rebate / 100)
          },
          {
            name: '申请提现（¥）',
            key: 'freeze_cash_withdrawal_rebate',
            render: (h, { row }) => h('span', {}, row.freeze_cash_withdrawal_rebate / 100)
          },
          {
            name: '未结算（¥）',
            key: 'no_close_rebate',
            render: (h, { row }) => h('span', {}, row.no_close_rebate / 100)
          },
          {
            name: '佣金总额（¥）',
            key: 'rebate_total',
            render: (h, { row }) => h('span', {}, row.rebate_total / 100)
          }
        ]
      })
    }
  },
  created() {},
  methods: {
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    beforeSearch(params) {
      const formQuery = JSON.parse(JSON.stringify(this.formQuery))
      if (formQuery.approve_status == '-1') {
        delete formQuery.approve_status
      }
      return { ...params, ...formQuery }
    },
    afterSearch() {}
  }
}
</script>
