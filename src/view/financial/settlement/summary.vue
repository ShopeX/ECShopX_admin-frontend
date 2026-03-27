<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
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
    <SpRouterView>
      <SpFilterForm :model="formQuery" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="distributor_id" :label="$t('dec78e3c.efa91f')">
          <SpSelectShop
            v-model="formQuery.distributor_id"
            clearable
            :placeholder="$t('dec78e3c.708c9d')"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="merchant_id" :label="$t('dec78e3c.e29708')">
          <SpSelectMerchant
            v-model="formQuery.merchant_id"
            clearable
            :placeholder="$t('dec78e3c.708c9d')"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="statement_status" :label="$t('dec78e3c.b81f30')">
          <el-select
            v-model="formQuery.statement_status"
            clearable
            :placeholder="$t('dec78e3c.708c9d')"
          >
            <el-option
              v-for="item in statusOption"
              :key="item.value"
              :label="$t(item.titleKey)"
              size="mini"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="cycleTime" :label="$t('dec78e3c.78f74e')" size="max">
          <el-date-picker
            v-model="formQuery.cycleTime"
            clearable
            type="datetimerange"
            align="right"
            format="yyyy-MM-dd HH:mm:ss"
            :range-separator="$t('dec78e3c.981cbe')"
            :start-placeholder="$t('dec78e3c.b44c0f')"
            :end-placeholder="$t('dec78e3c.1d468b')"
            prefix-icon="null"
            :default-time="defaultTime"
            :picker-options="pickerOptions"
          />
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-button type="primary" plain @click="exportData">
          {{ $t('dec78e3c.55405e') }}
        </el-button>
      </div>

      <div class="summary-info">
        <div class="summary-item">
          <SpImage :src="daijiesuan" :width="40" :height="40" />
          <div>
            <div>{{ $t('dec78e3c.46bc70') }}</div>
            <div class="daijiesuan">
              {{ feeReady }}
            </div>
          </div>
        </div>
        <div class="summary-item">
          <SpImage :src="yijiesuan" :width="40" :height="40" />
          <div>
            <div>{{ $t('dec78e3c.86e08f') }}</div>
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
    </SpRouterView>
  </SpPage>
</template>

<script>
import { PICKER_DATE_OPTIONS } from '@/consts'
import { createSetting } from '@shopex-ui/finder'
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
        { titleKey: 'dec78e3c.139304', value: 'done' },
        { titleKey: 'dec78e3c.7f38dd', value: 'confirmed' },
        { titleKey: 'dec78e3c.fcefe4', value: 'ready' }
      ],
      feeDone: 0,
      feeReady: 0,
      defaultTime: ['00:00:00', '23:59:59'],
      pickerOptions: PICKER_DATE_OPTIONS,
      merchantLoading: false,
      merchantList: []
    }
  },
  computed: {
    setting() {
      return createSetting({
        actions: [
          {
            name: this.$t('dec78e3c.bc8a96'),
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
            name: this.IS_ADMIN() ? this.$t('dec78e3c.89159f') : this.$t('dec78e3c.e83a25'),
            key: 'settlement',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              if (this.IS_ADMIN() && row.statement_status == 'confirmed') {
                return true
              }
              if (this.IS_DISTRIBUTOR() && row.statement_status == 'ready') {
                return true
              }
              return false
            },
            action: {
              handler: async ([row]) => {
                await this.$confirm(
                  this.$t('dec78e3c.01aeec') + row.statement_no + this.$t('dec78e3c.b1d296'),
                  this.$t('dec78e3c.02d981'),
                  {
                    confirmButtonText: this.$t('dec78e3c.38cf16'),
                    cancelButtonText: this.$t('dec78e3c.625fb2')
                  }
                )
                await this.$api.financial.confirmStatement(row.id)
                this.$message.success(this.$t('dec78e3c.33130f'))
                this.onSearch()
              }
            }
          }
        ],
        columns: [
          { name: this.$t('dec78e3c.aea239'), key: 'statement_no', width: 160 },
          { name: this.$t('dec78e3c.0f09a8'), key: 'merchant_name', width: 160 },
          { name: this.$t('dec78e3c.295713'), key: 'distributor_name', width: 160 },
          { name: this.$t('dec78e3c.317517'), key: 'order_num' },
          {
            name: this.$t('dec78e3c.fddcee'),
            key: 'total_fee',
            width: 120,
            render: (h, { row }) => h('span', {}, row.total_fee / 100)
          },
          {
            name: this.$t('dec78e3c.4dd437'),
            key: 'freight_fee',
            width: 100,
            render: (h, { row }) => h('span', {}, row.freight_fee / 100)
          },
          {
            name: this.$t('dec78e3c.e3a3c9'),
            key: 'intra_city_freight_fee',
            width: 100,
            render: (h, { row }) => h('span', {}, row.intra_city_freight_fee / 100)
          },
          {
            name: this.$t('dec78e3c.f4a147'),
            key: 'refund_fee',
            width: 120,
            render: (h, { row }) => h('span', {}, row.refund_fee / 100)
          },
          {
            name: this.$t('dec78e3c.a69a62'),
            key: 'statement_fee',
            width: 120,
            render: (h, { row }) => h('span', {}, row.statement_fee / 100)
          },
          {
            name: this.$t('dec78e3c.71412a'),
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
            name: this.$t('dec78e3c.a8b38b'),
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
            name: this.$t('dec78e3c.50cdff'),
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
        return this.$t('dec78e3c.fcefe4')
      } else if (status == 'confirmed') {
        return this.$t('dec78e3c.7f38dd')
      } else if (status == 'done') {
        return this.$t('dec78e3c.139304')
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
      this.$message.success(this.$t('dec78e3c.105c8a'))
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
