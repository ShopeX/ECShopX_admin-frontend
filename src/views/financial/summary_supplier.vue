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
.summary-info {
  background-color: #f6f7f9;
  padding: 14px 12px;
  display: flex;
  .summary-item {
    display: flex;
    align-items: center;
    margin-right: 20px;
    .sp-image {
      margin-right: 10px;
    }
  }
}
</style>
<template>
  <SpPage>
    <div v-if="$route.path.indexOf('detail') === -1">
      <SpFilterForm :model="formQuery" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="distributor_id" label="店铺:">
          <SpSelectShop v-model="formQuery.distributor_id" clearable placeholder="请选择" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="supplier_id" label="供应商:" v-if="!IS_SUPPLIER()">
          <SpSelectSupplier v-model="formQuery.supplier_id" clearable placeholder="请选择" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="statement_status" label="结算状态:">
          <el-select v-model="formQuery.statement_status" clearable placeholder="请选择">
            <el-option
              v-for="item in statusOption"
              :key="item.value"
              :label="item.title"
              size="mini"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="cycleTime" label="结算周期:" size="max">
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
      </SpFilterForm>

      <div class="action-container">
        <el-button type="primary" plain @click="exportData"> 导出 </el-button>
      </div>

      <div class="summary-info">
        <div class="summary-item">
          <SpImage :src="daijiesuan" :width="40" :height="40" />
          <div>
            <div>待结算金额（元）</div>
            <div class="daijiesuan">
              {{ feeReady }}
            </div>
          </div>
        </div>
        <div class="summary-item">
          <SpImage :src="yijiesuan" :width="40" :height="40" />
          <div>
            <div>已结算金额（元）</div>
            <div class="yijiesuan">
              {{ feeDone }}
            </div>
          </div>
        </div>
      </div>

      <SpFinder
        ref="finder"
        no-selection
        fixed-row-action
        :setting="setting"
        :hooks="{
          beforeSearch: beforeSearch,
          afterSearch: afterSearch
        }"
        url="/statement/summarized"
      />
    </div>
    <router-view />
  </SpPage>
</template>

<script>
import { PICKER_DATE_OPTIONS } from '@/consts'
import { createSetting } from '@shopex/finder'
import moment from 'moment'
import daijiesuan from '@/assets/daijiesuan.png'
import yijiesuan from '@/assets/yijiesuan.png'
import SpSelectSupplier from '../../components/sp-select-supplier/index'
import { IS_SUPPLIER } from '@/utils'
export default {
  name: '',
  components: { SpSelectSupplier },
  data() {
    return {
      daijiesuan,
      yijiesuan,
      formQuery: {
        merchant_type: 'supplier',
        supplier_id: '',
        merchant_id: '',
        statement_status: '',
        cycleTime: [],
        distributor_id: ''
      },
      statusOption: [
        { title: '已结算', value: 'done' },
        { title: '待平台结算', value: 'confirmed' },
        { title: '待供应商确认', value: 'ready' }
      ],
      feeDone: 0,
      feeReady: 0,
      defaultTime: ['00:00:00', '23:59:59'],
      pickerOptions: PICKER_DATE_OPTIONS,
      merchantLoading: false,
      merchantList: [],
      setting: createSetting({
        actions: [
          {
            name: '查看明细',
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                this.$router.push({
                  path: `${this.$route.path}/detail?id=${row.id}`
                })
              }
            }
          },
          {
            name: this.IS_ADMIN() ? '结算' : '确认',
            key: 'settlement',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              if (this.IS_ADMIN() && row.statement_status == 'confirmed') {
                return true
              }
              if (this.IS_SUPPLIER() && row.statement_status == 'ready') {
                return true
              }
              return false
            },
            action: {
              handler: async ([row]) => {
                await this.$confirm(`结算单号【${row.statement_no}】，确认是否结算？`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消'
                })
                await this.$api.financial.confirmStatement(row.id)
                this.$message.success('操作成功')
                this.onSearch()
              }
            }
          }
        ],
        columns: [
          { name: '结算单号', key: 'statement_no', width: 160 },
          { name: '供应商', key: 'supplier_name', width: 160 },
          { name: '订单数量', key: 'order_num', width: 160 },
          {
            name: '实付总金额（¥）',
            key: 'total_fee',
            width: 160,
            render: (h, { row }) => h('span', {}, row.point_fee / 100 + row.total_fee / 100),
            visible: !IS_SUPPLIER()
          },
          {
            name: '结算金额（¥）',
            key: 'statement_fee',
            width: 120,
            render: (h, { row }) => h('span', {}, row.statement_fee / 100)
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
          { name: '退款数量', key: 'refund_num', width: 160 },
          {
            name: '退款金额（¥）',
            key: 'refund_fee',
            width: 160,
            render: (h, { row }) => h('span', {}, row.refund_fee / 100),
            visible: !IS_SUPPLIER()
          },
          {
            name: '退款积分',
            key: 'refund_point',
            width: 160,
            render: (h, { row }) => h('span', {}, row.refund_point / 100)
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
            width: 120,
            render: (h, { row }) => h('span', {}, row.statement_fee / 100),
            visible: IS_SUPPLIER()
          },
          {
            name: '结算周期',
            key: 'alert_required_message',
            width: 160,
            formatter: (row, column) => {
              return (
                <div>
                  <div>{moment(column.start_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
                  <div>~{moment(column.end_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
                </div>
              )
            }
          },
          {
            name: '确认时间',
            key: 'confirm_time',
            width: 160,
            formatter: (row, column) => {
              if (column.confirm_time) {
                return <div>{moment(column.confirm_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
              }
            }
          },
          {
            name: '结算时间',
            key: 'end_time',
            width: 160,
            formatter: (row, column) => {
              if (column.end_time) {
                return (
                  <div>{moment(column.end_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
                )
              }
            }
          },
          {
            name: '结算状态',
            key: 'statement_status',
            width: 120,
            render: (h, { row }) => h('span', {}, this.getStateMentStatus(row.statement_status))
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
      if (formQuery.cycleTime.length > 0) {
        formQuery['start_time'] = moment(formQuery.cycleTime[0]).unix()
        formQuery['end_time'] = moment(formQuery.cycleTime[1]).unix()
        delete formQuery.cycleTime
      }

      return { ...params, ...formQuery }
    },
    afterSearch(response) {
      const { total_statement_fee_done, total_statement_fee_ready } = response.data.data
      this.feeDone = (total_statement_fee_done / 100).toFixed(2)
      this.feeReady = (total_statement_fee_ready / 100).toFixed(2)
    },
    getStateMentStatus(status) {
      if (status == 'ready') {
        return '待供应商确认'
      } else if (status == 'confirmed') {
        return '待平台结算'
      } else if (status == 'done') {
        return '已结算'
      }
    },
    async exportData() {
      const formQuery = JSON.parse(JSON.stringify(this.formQuery))
      if (formQuery.cycleTime.length > 0) {
        formQuery['start_time'] = moment(formQuery.cycleTime[0]).unix()
        formQuery['end_time'] = moment(formQuery.cycleTime[1]).unix()
        delete formQuery.cycleTime
      }
      const { status, url, filename } = await this.$api.financial.exportData(formQuery)
      if (status) {
        this.$message({
          type: 'success',
          message: '已加入执行队列，请在设置-导出列表中下载'
        })
        this.$export_open('statements')
        return
      } else {
        this.$message({
          type: 'error',
          message: '没有相关数据可导出'
        })
      }
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
