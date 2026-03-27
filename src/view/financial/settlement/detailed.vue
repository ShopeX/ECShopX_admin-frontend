<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss" scoped>
.sp-filter-form {
  margin-bottom: 16px;
}
</style>
<template>
  <div>
    <SpFilterForm :model="formQuery" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="cycleTime" :label="$t('ca597823.e2a03f')" size="max">
        <el-date-picker
          v-model="formQuery.cycleTime"
          clearable
          type="datetimerange"
          align="right"
          format="yyyy-MM-dd HH:mm:ss"
          :range-separator="$t('ca597823.981cbe')"
          :start-placeholder="$t('ca597823.b44c0f')"
          :end-placeholder="$t('ca597823.1d468b')"
          prefix-icon="null"
          :default-time="defaultTime"
          :picker-options="pickerOptions"
        />
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
  </div>
</template>

<script>
import { PICKER_DATE_OPTIONS, PAY_TYPE } from '@/consts'
import { createSetting } from '@shopex-ui/finder'
import moment from 'moment'
export default {
  name: '',
  data() {
    return {
      formQuery: {
        distributor_id: '',
        merchant_id: '',
        statement_status: '',
        cycleTime: []
      },
      id: '',
      defaultTime: ['00:00:00', '23:59:59'],
      merchantLoading: false,
      merchantList: []
    }
  },
  computed: {
    pickerOptions() {
      return {
        shortcuts: PICKER_DATE_OPTIONS.shortcuts.map((s) => ({ ...s, text: this.$t(s.text) }))
      }
    },
    setting() {
      return createSetting({
        actions: [
          {
            name: this.$t('ca597823.55405e'),
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
                await this.$api.financial.exportDetialData({
                  statement_id: this.id,
                  start_time: formQuery.start_time,
                  end_time: formQuery.end_time
                })
                this.$message.success(this.$t('ca597823.105c8a'))
              }
            }
          }
        ],
        columns: [
          { name: this.$t('ca597823.1e8dc2'), key: 'order_id', width: 160 },
          { name: this.$t('ca597823.295713'), key: 'distributor_name', width: 160 },
          {
            name: this.$t('ca597823.9f01f5'),
            key: 'total_fee',
            render: (h, { row }) => h('span', {}, row.total_fee / 100)
          },
          {
            name: this.$t('ca597823.4dd437'),
            key: 'freight_fee',
            width: 100,
            render: (h, { row }) => h('span', {}, row.freight_fee / 100)
          },
          {
            name: this.$t('ca597823.e3a3c9'),
            key: 'intra_city_freight_fee',
            width: 100,
            render: (h, { row }) => h('span', {}, row.intra_city_freight_fee / 100)
          },
          {
            name: this.$t('ca597823.f4a147'),
            key: 'refund_fee',
            render: (h, { row }) => h('span', {}, row.refund_fee / 100)
          },
          {
            name: this.$t('ca597823.a69a62'),
            key: 'statement_fee',
            render: (h, { row }) => h('span', {}, row.statement_fee / 100)
          },
          {
            name: this.$t('ca597823.eca37c'),
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
            name: this.$t('ca597823.0c9d2b'),
            key: 'statement_status',
            render: (h, { row }) =>
              h('span', {}, this.$t(this.getPayment(row.pay_channel, row.pay_type)))
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
