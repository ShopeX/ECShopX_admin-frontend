<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
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
      <SpFilterFormItem prop="cycleTime" :label="$t('9ed0f534.e2a03f')" size="max">
        <el-date-picker
          v-model="formQuery.cycleTime"
          clearable
          type="datetimerange"
          align="right"
          format="yyyy-MM-dd HH:mm:ss"
          :range-separator="$t('9ed0f534.981cbe')"
          :start-placeholder="$t('9ed0f534.b44c0f')"
          :end-placeholder="$t('9ed0f534.1d468b')"
          prefix-icon="null"
          :default-time="defaultTime"
          :picker-options="pickerOptions"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="order_id" :label="$t('9ed0f534.070dce')">
        <el-input v-model="formQuery.order_id" :placeholder="$t('9ed0f534.1e8dc2')" />
      </SpFilterFormItem>
    </SpFilterForm>
    <SpFinder
      v-if="setting"
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
import { createSetting } from '@shopex-ui/finder'
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
      setting: null
    }
  },
  created() {
    this.id = this.$route.query.id
  },
  mounted() {
    const t = this.$t.bind(this)
    this.setting = createSetting({
      actions: [
        {
          name: t('9ed0f534.55405e'),
          key: 'action',
          type: 'button',
          slot: 'header',
          buttonType: 'primary is-plain',
          action: {
            handler: async (val) => {
              const formQuery = JSON.parse(JSON.stringify(this.formQuery))
              if (formQuery.cycleTime.length > 0) {
                formQuery['start_time'] = moment(formQuery.cycleTime[0]).unix()
                formQuery['end_time'] = moment(formQuery.cycleTime[1]).unix()
                delete formQuery.cycleTime
              }
              const { status } = await this.$api.financial.exportDetialData({
                statement_id: this.id,
                start_time: formQuery.start_time,
                end_time: formQuery.end_time
              })
              if (status) {
                this.$message({
                  type: 'success',
                  message: t('9ed0f534.3e1ddd')
                })
                this.$export_open('statement_details')
                return
              } else {
                this.$message({
                  type: 'error',
                  message: t('9ed0f534.bfd8d5')
                })
              }
            }
          }
        }
      ],
      columns: [
        { name: t('9ed0f534.1e8dc2'), key: 'order_id', width: 160 },
        { name: t('9ed0f534.bab268'), key: 'supplier_name', width: 160 },
        {
          name: t('9ed0f534.295713'),
          key: 'distributor_name',
          width: 160,
          visible: !IS_SUPPLIER()
        },
        { name: t('9ed0f534.548ef4'), key: 'num', width: 160 },
        {
          name: t('9ed0f534.f2a74b'),
          key: 'total_fee',
          width: 160,
          render: (h, { row }) => h('span', {}, row.point_fee / 100 + row.total_fee / 100),
          visible: !IS_SUPPLIER()
        },
        {
          name: t('9ed0f534.a69a62'),
          key: 'cost_fee',
          width: 160,
          render: (h, { row }) => h('span', {}, row.cost_fee / 100),
          visible: IS_SUPPLIER()
        },
        {
          name: t('9ed0f534.863d38'),
          key: 'total_fee',
          width: 160,
          render: (h, { row }) => h('span', {}, row.total_fee / 100),
          visible: !IS_SUPPLIER()
        },
        {
          name: t('9ed0f534.d443a9'),
          key: 'point_fee',
          width: 160,
          render: (h, { row }) => h('span', {}, row.point_fee / 100),
          visible: !IS_SUPPLIER()
        },
        {
          name: t('9ed0f534.08ea95'),
          key: 'freight_fee',
          width: 160,
          render: (h, { row }) => h('span', {}, row.freight_fee / 100)
        },
        { name: t('9ed0f534.4a18aa'), key: 'refund_num', width: 160, visible: IS_SUPPLIER() },
        {
          name: t('9ed0f534.f4a147'),
          key: 'refund_fee',
          width: 160,
          render: (h, { row }) => h('span', {}, row.refund_fee / 100)
        },
        {
          name: t('9ed0f534.d9591a'),
          key: 'refund_point',
          width: 160,
          render: (h, { row }) => h('span', {}, row.refund_point / 100),
          visible: !IS_SUPPLIER()
        },
        {
          name: t('9ed0f534.8cf4a5'),
          key: 'refund_cost_fee',
          width: 160,
          render: (h, { row }) => h('span', {}, row.refund_cost_fee / 100)
        },
        {
          name: t('9ed0f534.6ddb7c'),
          key: 'statement_fee',
          width: 160,
          render: (h, { row }) => h('span', {}, row.statement_fee / 100)
        },
        {
          name: t('9ed0f534.eca37c'),
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
          name: t('9ed0f534.382212'),
          key: 'end_time',
          width: 160
        },
        {
          name: t('9ed0f534.a8b38b'),
          key: 'statement_time',
          width: 160,
          formatter: (row, column) => {
            if (column.statement_time) {
              return <div>{moment(column.statement_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
            }
          }
        },
        {
          name: t('9ed0f534.0c9d2b'),
          key: 'statement_status',
          render: (h, { row }) => h('span', {}, this.getPayment(row.pay_channel, row.pay_type))
        }
      ]
    })
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
