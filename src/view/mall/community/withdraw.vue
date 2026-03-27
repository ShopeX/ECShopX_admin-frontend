<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss" scoped>
.sp-filter-form {
  margin-bottom: 16px;
  padding-bottom: 0;
}
.total-info {
  margin-top: 30px;
  .total-value {
    font-size: 28px;
  }
}
</style>
<template>
  <SpPage>
    <div v-if="$route.path.indexOf('detail') === -1">
      <SpFilterForm :model="formQuery" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="status" :label="$t('2eada62f.2c30c4')">
          <!-- <el-input v-model="formQuery.name" placeholder="请选择" /> -->
          <el-select v-model="formQuery.status" clearable :placeholder="$t('2eada62f.708c9d')">
            <el-option
              v-for="item in withDrawStatusList"
              :key="item.value"
              size="mini"
              :label="item.title"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="mobile" :label="$t('2eada62f.ce2bf3')">
          <el-input v-model="formQuery.mobile" :placeholder="$t('2eada62f.999e78')" />
        </SpFilterFormItem>
      </SpFilterForm>

      <el-row class="total-info">
        <el-col :span="6">
          <div class="total-label">{{ $t('2eada62f.186472') }}</div>
          <div class="total-value">
            {{ rebate_total / 100 }}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-label">{{ $t('2eada62f.63df67') }}</div>
          <div class="total-value">
            {{ payed_rebate / 100 }}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-label">{{ $t('2eada62f.42cacb') }}</div>
          <div class="total-value">
            {{ freeze_cash_withdrawal_rebate / 100 }}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-label">{{ $t('2eada62f.28fe21') }}</div>
          <div class="total-value">
            {{ apply_chief_num }}
          </div>
        </el-col>
      </el-row>

      <SpFinder
        ref="finder"
        no-selection
        :setting="setting"
        :hooks="{
          beforeSearch: beforeSearch,
          afterSearch: afterSearch
        }"
        url="/community/cash_withdrawal"
      />

      <SpDialog
        ref="resloveDialogRef"
        v-model="resloveDialog"
        :title="$t('2eada62f.597e24')"
        :form="resloveForm"
        :form-list="resloveFormList"
        @onSubmit="onResloveSubmit"
      />
    </div>
    <router-view />
  </SpPage>
</template>

<script>
import { createSetting } from '@shopex-ui/finder'
import moment from 'moment'
import { i18n } from '@/i18n'

export default {
  name: '',
  data() {
    return {
      withDrawStatusList: [
        { title: i18n.t('2eada62f.047109'), value: 'apply' },
        { title: i18n.t('2eada62f.7173f8'), value: 'reject' },
        { title: i18n.t('2eada62f.dca060'), value: 'success' }
      ],
      formQuery: {
        status: '',
        mobile: ''
      },
      setting: createSetting({
        actions: [
          {
            name: i18n.t('2eada62f.1d6733'),
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              return row.status == 'apply'
            },
            action: {
              handler: async ([row]) => {
                // const { path } = this.$route
                // await this.$api.community.getPayInfo(row.id)
                this.resloveForm = {
                  id: row.id,
                  account_name: row.account_name,
                  pay_type: this.getPayType(row.pay_type),
                  bank_name: row.bank_name,
                  pay_account: row.pay_account,
                  cash_withdrawal_rebate: row.cash_withdrawal_rebate / 100,
                  money: row.money / 100
                }
                this.resloveDialog = true
              }
            }
          },
          {
            name: i18n.t('2eada62f.7173f8'),
            key: 'apply',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              return row.status == 'apply'
            },
            action: {
              handler: async ([row]) => {
                try {
                  const res = await this.$confirm(
                    this.$t('2eada62f.c508ab'),
                    this.$t('2eada62f.02d981'),
                    {
                      confirmButtonText: this.$t('2eada62f.38cf16'),
                      cancelButtonText: this.$t('2eada62f.625fb2')
                    }
                  )
                  await this.$api.community.withdrawApply(row.id, {
                    process_type: 'reject'
                  })
                  this.$refs.finder.refresh()
                } catch (e) {
                  console.error(e)
                }
              }
            }
          }
        ],
        columns: [
          { name: i18n.t('2eada62f.5ba072'), key: 'created_date' },
          {
            name: i18n.t('2eada62f.c11ddb'),
            key: 'pay_type',
            render: (h, { row }) => h('span', {}, this.getPayType(row.pay_type))
          },
          { name: i18n.t('2eada62f.5fdcbd'), key: 'mobile' },
          {
            name: i18n.t('2eada62f.10faa6'),
            key: 'money',
            render: (h, { row }) => h('span', {}, row.money / 100)
          },
          {
            name: i18n.t('2eada62f.0ed783'),
            key: 'status',
            render: (h, { row }) => h('span', {}, this.renderWithdrawStatu(row.status))
          }
        ]
      }),
      // 申请人数
      apply_chief_num: 0,
      // 待处理金额
      freeze_cash_withdrawal_rebate: 0,
      // 已提现总额
      payed_rebate: 0,
      // 佣金总额
      rebate_total: 0,
      resloveDialog: false,
      resloveForm: {
        id: '',
        account_name: '',
        pay_type: '',
        bank_name: '',
        pay_account: '',
        cash_withdrawal_rebate: '',
        money: ''
      },
      resloveFormList: [
        {
          label: i18n.t('2eada62f.07e57c'),
          key: 'account_name',
          type: 'text'
        },
        {
          label: i18n.t('2eada62f.e5bd6e'),
          key: 'pay_type',
          type: 'text'
        },
        {
          label: i18n.t('2eada62f.181d9a'),
          key: 'bank_name',
          type: 'text'
        },
        {
          label: i18n.t('2eada62f.d98e9d'),
          key: 'pay_account',
          type: 'text'
        },
        {
          label: i18n.t('2eada62f.e2201a'),
          key: 'cash_withdrawal_rebate',
          type: 'text'
        },
        {
          label: i18n.t('2eada62f.37fec4'),
          key: 'money',
          type: 'text'
        }
      ]
    }
  },
  created() {},
  methods: {
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    beforeSearch(params) {
      const formQuery = JSON.parse(JSON.stringify(this.formQuery))
      if (formQuery.approve_status == '-1') {
        delete formQuery.approve_status
      }
      return { ...params, ...formQuery }
    },
    afterSearch(response) {
      const { apply_chief_num, freeze_cash_withdrawal_rebate, payed_rebate, rebate_total } =
        response.data.data.count
      this.apply_chief_num = apply_chief_num
      this.freeze_cash_withdrawal_rebate = freeze_cash_withdrawal_rebate
      this.payed_rebate = payed_rebate
      this.rebate_total = rebate_total
    },
    getPayType(type) {
      const payType = {
        bankcard: this.$t('2eada62f.774267'),
        alipay: this.$t('2eada62f.ccd097'),
        wechat: this.$t('2eada62f.cfbf6f')
      }
      return payType[type]
    },
    renderWithdrawStatu(state) {
      return withDrawStatusList.find((item) => item.value == state).title
    },
    async onResloveSubmit() {
      const { id } = this.resloveForm
      await this.$api.community.withdrawApply(id, {
        process_type: 'argee'
      })
      this.resloveDialog = false
      this.$refs.finder.refresh()
    }
  }
}
</script>
