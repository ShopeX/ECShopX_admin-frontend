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
}
</style>
<style lang="scss">
.sp-page--financial-detailed .sp-finder .sp-finder-actions__wrap {
  margin-bottom: 16px !important;
}
.sp-page--financial-detailed .sp-finder .sp-finder-actions__wrap .sp-finder-button .el-button {
  padding: 8px 8px;
}
</style>
<template>
  <SpPage class="sp-page--financial-detailed">
    <SpFilterForm :model="formQuery" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="cycleTime" label="创建时间:" size="max">
        <el-date-picker
          v-model="formQuery.cycleTime"
          clearable
          type="datetimerange"
          align="right"
          format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          prefix-icon="null"
          :default-time="defaultTime"
          :picker-options="pickerOptions"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="order_id" label="订单号:">
        <el-input v-model="formQuery.order_id" placeholder="订单号" />
      </SpFilterFormItem>
    </SpFilterForm>
    <SpFinder
      ref="finder"
      no-selection
      :setting="setting"
      :hooks="{
        beforeSearch: beforeSearch
      }"
      :url="`/statement/detail/${id}`"
    />
  </SpPage>
</template>

<script>
import { PICKER_DATE_OPTIONS, PAY_TYPE } from '@/consts'
import { createSetting } from '@shopex/finder'
import moment from 'moment'
import { IS_SUPPLIER } from '@/utils'
export default {
  name: '',
  data() {
    return {
      formQuery: {
        distributor_id: '',
        merchant_id: '',
        statement_status: '',
        cycleTime: [],
        order_id: ''
      },
      id: '',
      defaultTime: ['00:00:00', '23:59:59'],
      pickerOptions: PICKER_DATE_OPTIONS,
      merchantLoading: false,
      merchantList: [],
      setting: createSetting({
        actions: [
          {
            name: '导出',
            key: 'action',
            type: 'button',
            slot: 'header',
            buttonType: 'primary is-plain',
            action: {
              handler: async val => {
                const formQuery = JSON.parse(JSON.stringify(this.formQuery))
                if (formQuery.cycleTime.length > 0) {
                  formQuery['start_time'] = moment(formQuery.cycleTime[0]).unix()
                  formQuery['end_time'] = moment(formQuery.cycleTime[1]).unix()
                  delete formQuery.cycleTime
                }
                const { status, url, filename } = await this.$api.financial.exportDetialData({
                  statement_id: this.id,
                  start_time: formQuery.start_time,
                  end_time: formQuery.end_time
                })
                if (status) {
                  this.$message({
                    type: 'success',
                    message: '已加入执行队列，请在设置-导出列表中下载'
                  })
                  this.$export_open('statement_details')
                  return
                } else {
                  this.$message({
                    type: 'error',
                    message: '没有相关数据可导出'
                  })
                }
              }
            }
          }
        ],
        columns: [
          { name: '订单号', key: 'order_id', width: 160 },
          { name: '供应商', key: 'supplier_name', width: 160 },
          {
            name: '店铺',
            key: 'distributor_name',
            width: 160,
            visible: !IS_SUPPLIER()
          },
          { name: '购买数量', key: 'num', width: 160 },
          {
            name: '实付总金额（¥）',
            key: 'total_fee',
            width: 160,
            render: (h, { row }) => h('span', {}, row.point_fee / 100 + row.total_fee / 100),
            visible: !IS_SUPPLIER()
          },
          {
            name: '结算金额（¥）',
            key: 'cost_fee',
            width: 160,
            render: (h, { row }) => h('span', {}, row.cost_fee / 100),
            visible: IS_SUPPLIER()
          },
          {
            name: '现金实付（¥）',
            key: 'total_fee',
            width: 160,
            render: (h, { row }) => h('span', {}, row.total_fee / 100),
            visible: !IS_SUPPLIER()
          },
          {
            name: '积分抵扣',
            key: 'point_fee',
            width: 160,
            render: (h, { row }) => h('span', {}, row.point_fee / 100),
            visible: !IS_SUPPLIER()
          },
          {
            name: '运费（总）',
            key: 'freight_fee',
            width: 160,
            render: (h, { row }) => h('span', {}, row.freight_fee / 100)
          },
          { name: '退货数量', key: 'refund_num', width: 160, visible: IS_SUPPLIER() },
          {
            name: '退款金额（¥）',
            key: 'refund_fee',
            width: 160,
            render: (h, { row }) => h('span', {}, row.refund_fee / 100)
          },
          {
            name: '退款积分',
            key: 'refund_point',
            width: 160,
            render: (h, { row }) => h('span', {}, row.refund_point / 100),
            visible: !IS_SUPPLIER()
          },
          {
            name: '退货结算价（¥）',
            key: 'refund_cost_fee',
            width: 160,
            render: (h, { row }) => h('span', {}, row.refund_cost_fee / 100)
          },
          {
            name: '结算实付（¥）',
            key: 'statement_fee',
            width: 160,
            render: (h, { row }) => h('span', {}, row.statement_fee / 100)
          },
          {
            name: '创建时间',
            key: 'alert_required_message',
            width: 160,
            formatter: (row, column) => {
              return (
                <div>
                  <div>{moment(column.created * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
                </div>
              )
            }
          },
          {
            name: '订单完成时间',
            key: 'end_time',
            width: 160,
            // formatter: (row, column) => {
            //   if (column.confirm_time) {
            //     return <div>{moment(column.confirm_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
            //   }
            // }
          },
          {
            name: '结算时间',
            key: 'statement_time',
            width: 160,
            // visible: !IS_SUPPLIER(),
            formatter: (row, column) => {
              if (column.statement_time) {
                return (
                  <div>{moment(column.statement_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
                )
              }
            }
          },
          {
            name: '支付方式',
            key: 'statement_status',
            render: (h, { row }) => h('span', {}, this.getPayment(row.pay_channel, row.pay_type))
          }
        ]
      })
    }
  },
  created() {
    this.id = this.$route.query.id
  },
  methods: {
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    beforeSearch(params) {
      const formQuery = JSON.parse(JSON.stringify(this.formQuery))
      if (formQuery.cycleTime.length > 0) {
        formQuery['start_time'] = moment(formQuery.cycleTime[0]).unix()
        formQuery['end_time'] = moment(formQuery.cycleTime[1]).unix()
        delete formQuery.cycleTime
      }

      return { ...params, ...formQuery }
    },
    afterSearch(response) {
      const { total_statement_fee_done, total_statement_fee_ready } = response.data.data.count
      this.feeDone = total_statement_fee_done
      this.feeReady = total_statement_fee_ready
    },
    getPayment(pay_channel, pay_type) {
      return pay_channel ? PAY_TYPE[pay_channel] : PAY_TYPE[pay_type]
    },
    remoteMerchantList: async function (name) {
      this.merchantLoading = true
      const list = await this.$api.marketing.getMerchantsList({
        pageSize: 10,
        page: 1
        // merchant_name
      })
      this.merchantLoading = false
      return list
      // this.merchantList = list.map((item) => ({ value: item.id, label: item.merchant_name }))
    }
  }
}
</script>
