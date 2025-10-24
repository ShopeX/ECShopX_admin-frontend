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
<style lang="scss"></style>

<template>
  <div>
    <SpFinder
      ref="finder"
      url="/deposit/trades"
      no-selection
      :fixed-row-action="true"
      :setting="setting"
      :hooks="{
        beforeSearch: beforeSearch
      }"
    >
      <template slot="tableTop">
        <div class="action-container">
          <el-button @click="addStoreValue">充值</el-button>
        </div>
      </template>
    </SpFinder>

    <!-- 储值添加 -->
    <SpDialog
      ref="chuzhiDialogRef"
      v-model="chuzhiDialog"
      title="充值"
      :form="chuzhiForm"
      :form-list="chuzhiFormList"
      @onSubmit="onChuZhiFormSubmit"
    />
  </div>
</template>

<script>
import { createSetting } from '@shopex/finder'
import moment from 'moment'
export default {
  data() {
    return {
      setting: createSetting({
        columns: [
          {
            name: '充值时间',
            key: 'timeStart',
            formatter: (value, row, col) => {
              return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
            }
          },
          {
            name: '充值金额',
            key: 'curPayFee',
            formatter: (value, row, col) => {
              return (value / 100).toFixed(2)
            }
          },
          {
            name: '充值状态',
            key: 'tradeStatus',
            render: (h, { row }) => {
              return h(
                'el-tag',
                {
                  props: {
                    type: row.tradeStatus == 'SUCCESS' ? 'success' : 'danger'
                  }
                },
                row.tradeStatus == 'SUCCESS' ? '充值成功' : '充值失败'
              )
            }
          },
          { name: '描述', key: 'detail' }
        ]
      }),
      chuzhiDialog: false,
      chuzhiForm: {
        money: 0
      },
      chuzhiFormList: [
        {
          label: '充值金额',
          key: 'money',
          type: 'number',
          precision: 2,
          setp: 0.1
        }
      ]
    }
  },
  created() {},
  methods: {
    beforeSearch(params) {
      const { user_id } = this.$route.query
      params = {
        ...params,
        user_id,
        page: params.page,
        pageSize: params.pageSize
      }
      return params
    },
    addStoreValue() {
      this.chuzhiForm.money = 0
      this.chuzhiDialog = true
    },
    async onChuZhiFormSubmit() {
      const { user_id } = this.$route.query
      await this.$api.deposit.rechargeDeposit({
        user_id,
        money: parseInt(this.chuzhiForm.money * 100)
      })
      this.$message.success('添加成功')
      this.chuzhiDialog = false
      this.$refs['finder'].refresh(true)
    }
  }
}
</script>
