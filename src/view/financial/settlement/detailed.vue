<style lang="scss" scoped>
.sp-filter-form {
  margin-bottom: 16px;
}
</style>
<template>
  <div>
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
import { createSetting } from '@shopex/finder'
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
                this.$message.success('导出成功')
              }
            }
          }
        ],
        columns: [
          { name: '订单号', key: 'order_id', width: 160 },
          {
            name: '店铺',
            key: 'distributor_name',
            width: 160
          },
          {
            name: '订单实付（¥）',
            key: 'total_fee',
            render: (h, { row }) => h('span', {}, row.total_fee / 100)
          },
          {
            name: '运费（¥）',
            key: 'freight_fee',
            width: 100,
            render: (h, { row }) => h('span', {}, row.freight_fee / 100)
          },
          {
            name: '同城配（¥）',
            key: 'intra_city_freight_fee',
            width: 100,
            render: (h, { row }) => h('span', {}, row.intra_city_freight_fee / 100)
          },
          // {
          //   name: '分销佣金（¥）',
          //   key: 'rebate_fee',
          //   render: (h, { row }) => h('span', {}, row.rebate_fee / 100)
          // },
          {
            name: '退款金额（¥）',
            key: 'refund_fee',
            render: (h, { row }) => h('span', {}, row.refund_fee / 100)
          },
          {
            name: '结算金额（¥）',
            key: 'statement_fee',
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
