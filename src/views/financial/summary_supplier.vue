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
    <div v-if="$route.path.indexOf('detail') === -1">
      <SpFilterForm :model="formQuery" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="distributor_id" :label="$t('cbc8b202.efa91f')">
          <SpSelectShop
            v-model="formQuery.distributor_id"
            clearable
            :placeholder="$t('cbc8b202.708c9d')"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="supplier_id" :label="$t('cbc8b202.83bbcd')" v-if="!IS_SUPPLIER()">
          <SpSelectSupplier
            v-model="formQuery.supplier_id"
            clearable
            :placeholder="$t('cbc8b202.708c9d')"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="statement_status" :label="$t('cbc8b202.b81f30')">
          <el-select
            v-model="formQuery.statement_status"
            clearable
            :placeholder="$t('cbc8b202.708c9d')"
          >
            <el-option
              v-for="item in statusOption"
              :key="item.value"
              :label="item.title"
              size="mini"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="cycleTime" :label="$t('cbc8b202.78f74e')" size="max">
          <el-date-picker
            v-model="formQuery.cycleTime"
            clearable
            type="datetimerange"
            align="right"
            format="yyyy-MM-dd HH:mm:ss"
            :range-separator="$t('cbc8b202.981cbe')"
            :start-placeholder="$t('cbc8b202.b44c0f')"
            :end-placeholder="$t('cbc8b202.1d468b')"
            prefix-icon="null"
            :default-time="defaultTime"
            :picker-options="pickerOptions"
          />
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-button type="primary" plain @click="exportData">{{ $t('cbc8b202.55405e') }}</el-button>
      </div>

      <div class="summary-info">
        <div class="summary-item">
          <SpImage :src="daijiesuan" :width="40" :height="40" />
          <div>
            <div>{{ $t('cbc8b202.46bc70') }}</div>
            <div class="daijiesuan">
              {{ feeReady }}
            </div>
          </div>
        </div>
        <div class="summary-item">
          <SpImage :src="yijiesuan" :width="40" :height="40" />
          <div>
            <div>{{ $t('cbc8b202.86e08f') }}</div>
            <div class="yijiesuan">
              {{ feeDone }}
            </div>
          </div>
        </div>
      </div>

      <SpFinder
        v-if="setting"
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
import { createSetting } from '@shopex-ui/finder'
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
      statusOption: [],
      feeDone: 0,
      feeReady: 0,
      defaultTime: ['00:00:00', '23:59:59'],
      pickerOptions: PICKER_DATE_OPTIONS,
      merchantLoading: false,
      merchantList: [],
      setting: null
    }
  },
  created() {
    this.statusOption = [
      { title: this.$t('cbc8b202.139304'), value: 'done' },
      { title: this.$t('cbc8b202.7f38dd'), value: 'confirmed' },
      { title: this.$t('cbc8b202.95287c'), value: 'ready' }
    ]
  },
  mounted() {
    const t = this.$t.bind(this)
    this.setting = createSetting({
      actions: [
        {
          name: t('cbc8b202.bc8a96'),
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
          name: this.IS_ADMIN() ? t('cbc8b202.89159f') : t('cbc8b202.e83a25'),
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
              await this.$confirm(
                this.$t('cbc8b202.c7996a', [row.statement_no]),
                this.$t('cbc8b202.02d981'),
                {
                  confirmButtonText: this.$t('cbc8b202.38cf16'),
                  cancelButtonText: this.$t('cbc8b202.625fb2')
                }
              )
              await this.$api.financial.confirmStatement(row.id)
              this.$message.success(this.$t('cbc8b202.33130f'))
              this.onSearch()
            }
          }
        }
      ],
      columns: [
        { name: t('cbc8b202.36bf9c'), key: 'statement_no', width: 160 },
        { name: t('cbc8b202.bab268'), key: 'supplier_name', width: 160 },
        { name: t('cbc8b202.317517'), key: 'order_num', width: 160 },
        {
          name: t('cbc8b202.f2a74b'),
          key: 'total_fee',
          width: 160,
          render: (h, { row }) => h('span', {}, row.point_fee / 100 + row.total_fee / 100),
          visible: !IS_SUPPLIER()
        },
        {
          name: t('cbc8b202.a69a62'),
          key: 'statement_fee',
          width: 120,
          render: (h, { row }) => h('span', {}, row.statement_fee / 100)
        },
        {
          name: t('cbc8b202.863d38'),
          key: 'total_fee',
          width: 160,
          render: (h, { row }) => h('span', {}, row.total_fee / 100),
          visible: !IS_SUPPLIER()
        },
        {
          name: t('cbc8b202.d443a9'),
          key: 'point_fee',
          width: 160,
          render: (h, { row }) => h('span', {}, row.point_fee / 100),
          visible: !IS_SUPPLIER()
        },
        {
          name: t('cbc8b202.08ea95'),
          key: 'freight_fee',
          width: 160,
          render: (h, { row }) => h('span', {}, row.freight_fee / 100)
        },
        { name: t('cbc8b202.3a1664'), key: 'refund_num', width: 160 },
        {
          name: t('cbc8b202.f4a147'),
          key: 'refund_fee',
          width: 160,
          render: (h, { row }) => h('span', {}, row.refund_fee / 100),
          visible: !IS_SUPPLIER()
        },
        {
          name: t('cbc8b202.d9591a'),
          key: 'refund_point',
          width: 160,
          render: (h, { row }) => h('span', {}, row.refund_point / 100)
        },
        {
          name: t('cbc8b202.8cf4a5'),
          key: 'refund_cost_fee',
          width: 160,
          render: (h, { row }) => h('span', {}, row.refund_cost_fee / 100)
        },
        {
          name: t('cbc8b202.6ddb7c'),
          key: 'statement_fee',
          width: 120,
          render: (h, { row }) => h('span', {}, row.statement_fee / 100),
          visible: IS_SUPPLIER()
        },
        {
          name: t('cbc8b202.71412a'),
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
          name: t('cbc8b202.df713d'),
          key: 'confirm_time',
          width: 160,
          formatter: (row, column) => {
            if (column.confirm_time) {
              return <div>{moment(column.confirm_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
            }
          }
        },
        {
          name: t('cbc8b202.a8b38b'),
          key: 'end_time',
          width: 160,
          formatter: (row, column) => {
            if (column.end_time) {
              return <div>{moment(column.end_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
            }
          }
        },
        {
          name: t('cbc8b202.50cdff'),
          key: 'statement_status',
          width: 120,
          render: (h, { row }) => h('span', {}, this.getStateMentStatus(row.statement_status))
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
      const { total_statement_fee_done, total_statement_fee_ready } = response.data.data
      this.feeDone = (total_statement_fee_done / 100).toFixed(2)
      this.feeReady = (total_statement_fee_ready / 100).toFixed(2)
    },
    getStateMentStatus(status) {
      if (status == 'ready') {
        return this.$t('cbc8b202.95287c')
      } else if (status == 'confirmed') {
        return this.$t('cbc8b202.7f38dd')
      } else if (status == 'done') {
        return this.$t('cbc8b202.139304')
      }
    },
    async exportData() {
      const formQuery = JSON.parse(JSON.stringify(this.formQuery))
      if (formQuery.cycleTime.length > 0) {
        formQuery['start_time'] = moment(formQuery.cycleTime[0]).unix()
        formQuery['end_time'] = moment(formQuery.cycleTime[1]).unix()
        delete formQuery.cycleTime
      }
      const { status } = await this.$api.financial.exportData(formQuery)
      if (status) {
        this.$message({
          type: 'success',
          message: this.$t('cbc8b202.3e1ddd')
        })
        this.$export_open('statements')
        return
      } else {
        this.$message({
          type: 'error',
          message: this.$t('cbc8b202.bfd8d5')
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
