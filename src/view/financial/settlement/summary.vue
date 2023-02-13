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
  <div>
    <div v-if="$route.path.indexOf('detail') === -1">
      <SpFilterForm :model="formQuery" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="distributor_id" label="店铺:">
          <SpSelectShop v-model="formQuery.distributor_id" clearable placeholder="请选择" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="merchant_id" label="商家:">
          <SpSelectMerchant v-model="formQuery.merchant_id" clearable placeholder="请选择" />
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
  </div>
</template>

<script>
import { PICKER_DATE_OPTIONS } from '@/consts'
import { createSetting } from '@shopex/finder'
import moment from 'moment'
import daijiesuan from '@/assets/daijiesuan.png'
import yijiesuan from '@/assets/yijiesuan.png'
export default {
  name: '',
  data() {
    return {
      daijiesuan,
      yijiesuan,
      formQuery: {
        distributor_id: '',
        merchant_id: '',
        statement_status: '',
        cycleTime: []
      },
      statusOption: [
        { title: '已结算', value: 'done' },
        { title: '待平台结算', value: 'confirmed' },
        { title: '待店铺确认', value: 'ready' }
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
            name: this.IS_ADMIN ? '结算' : '确认',
            key: 'settlement',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              if (this.IS_ADMIN && row.statement_status == 'confirmed') {
                return true
              }
              if (this.IS_DISTRIBUTOR && row.statement_status == 'ready') {
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
          { name: '账单编号', key: 'statement_no', width: 160 },
          {
            name: '商家',
            key: 'merchant_name',
            width: 160
          },
          {
            name: '店铺',
            key: 'distributor_name',
            width: 160
          },
          {
            name: '订单数量',
            key: 'order_num'
          },
          {
            name: '实付金额（¥）',
            key: 'total_fee',
            width: 120,
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
          //   width: 120,
          //   render: (h, { row }) => h('span', {}, row.rebate_fee / 100)
          // },
          {
            name: '退款金额（¥）',
            key: 'refund_fee',
            width: 120,
            render: (h, { row }) => h('span', {}, row.refund_fee / 100)
          },
          {
            name: '结算金额（¥）',
            key: 'statement_fee',
            width: 120,
            render: (h, { row }) => h('span', {}, row.statement_fee / 100)
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
            name: '结算时间',
            key: 'statement_time',
            width: 160,
            formatter: (row, column) => {
              if (column.statement_time) {
                return (
                  <div>{moment(column.statement_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
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
        return '待店铺确认'
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
      await this.$api.financial.exportData(formQuery)
      this.$message.success('导出成功')
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
