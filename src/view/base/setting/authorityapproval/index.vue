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
  <SpRouterView>
    <SpPage>
      <SpFilterForm :model="queryParams" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="status" label="审批状态:">
          <el-select v-model="queryParams.status" placeholder="请选择审批状态">
            <el-option
              v-for="(item, index) in approveStatusList"
              :key="index"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="login_name" label="账户名称:">
          <el-input v-model="queryParams.login_name" placeholder="请输入账户名称" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="queryTime" label="申请日期:">
          <el-date-picker
            v-model="queryParams.queryTime"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </SpFilterFormItem>
      </SpFilterForm>
      <SpFinder
        ref="finder"
        url="/datapass"
        no-selection
        :fixed-row-action="true"
        row-actions-align="left"
        :setting="setting"
        :hooks="{
          beforeSearch: beforeSearch
        }"
      />
    </SpPage>
  </SpRouterView>
</template>
<script>
import moment from 'moment'
import { createSetting } from '@shopex/finder'
export default {
  data() {
    return {
      queryParams: {
        login_name: '',
        status: '',
        queryTime: []
      },
      approveStatusList: [
        { name: '全部', value: undefined },
        { name: '待审批', value: '0' },
        { name: '已通过', value: '1' },
        { name: '未通过', value: '2' }
      ],
      setting: createSetting({
        actions: [
          {
            name: '详情',
            key: 'apply',
            type: 'button',
            buttonType: 'text',
            // visible: (row) => {
            //   return row.status == '0'
            // },
            action: {
              handler: async ([row]) => {
                const { pass_id, operator_id } = row
                this.$router.push({
                  path: this.matchRoutePath('approve'),
                  query: { pass_id, operator_id }
                })
              }
            }
          }
        ],
        columns: [
          {
            name: '账户名称',
            key: 'login_name'
          },
          {
            name: '账户角色',
            key: 'operator_type',
            formatter: (value, row, col) => {
              return value === 'staff'
                ? '平台管理员'
                : value === 'distributor'
                ? '店铺管理员'
                : '供应商管理员'
            }
          },
          {
            name: '申请时间',
            key: 'create_time',
            formatter: (value, row, col) => {
              return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
            }
          },
          {
            name: '申请结果',
            key: 'status',
            render: (h, scope) => {
              if (scope.row.status == '1' || scope.row.status == '2') {
                return h(
                  'el-tag',
                  {
                    props: {
                      type: scope.row.status == '1' ? 'success' : 'danger',
                      size: 'small'
                    }
                  },
                  scope.row.status == '1' ? '通过' : '拒绝'
                )
              } else {
                return ''
              }
            }
          }
        ]
      })
    }
  },
  methods: {
    beforeSearch(params) {
      const [startTime, endTime] = this.queryParams.queryTime
      if (startTime) {
        params['start_time'] = moment(startTime).unix()
      }
      if (endTime) {
        params['end_time'] = moment(endTime).unix()
      }
      return params
    },
    onSearch() {
      this.$refs.finder.refresh(true)
    }
  }
}
</script>
<style lang="scss"></style>
