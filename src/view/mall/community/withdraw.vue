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
  <div>
    <div v-if="$route.path.indexOf('detail') === -1">
      <SpFilterForm
        :model="formQuery"
        @onSearch="onSearch"
        @onReset="onSearch"
      >
        <SpFilterFormItem
          prop="status"
          label="提现状态:"
        >
          <!-- <el-input v-model="formQuery.name" placeholder="请选择" /> -->
          <el-select
            v-model="formQuery.status"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in withDrawStatusList"
              :key="item.value"
              size="mini"
              :label="item.title"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem
          prop="mobile"
          label="手机号:"
        >
          <el-input
            v-model="formQuery.mobile"
            placeholder="请输入团长手机号"
          />
        </SpFilterFormItem>
      </SpFilterForm>

      <el-row class="total-info">
        <el-col :span="6">
          <div class="total-label">
            佣金总额（¥）
          </div>
          <div class="total-value">
            {{ rebate_total / 100 }}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-label">
            已提现总额（¥）
          </div>
          <div class="total-value">
            {{ payed_rebate / 100 }}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-label">
            待处理金额（¥）
          </div>
          <div class="total-value">
            {{ freeze_cash_withdrawal_rebate / 100 }}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-label">
            申请提现人数
          </div>
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
        :title="`提现确认`"
        :form="resloveForm"
        :form-list="resloveFormList"
        @onSubmit="onResloveSubmit"
      />
    </div>
    <router-view />
  </div>
</template>

<script>
import { createSetting } from '@shopex/finder'
import moment from 'moment'

const withDrawStatusList = [
  { title: '待处理', value: 'apply' },
  { title: '拒绝', value: 'reject' },
  { title: '提现成功', value: 'success' }
  // { title: '处理中', value: 'process' },
  // { title: '提现失败', value: 'failed' }
]
export default {
  name: '',
  data () {
    return {
      formQuery: {
        status: '',
        mobile: ''
      },
      setting: createSetting({
        actions: [
          {
            name: '打款',
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
            name: '拒绝',
            key: 'apply',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              return row.status == 'apply'
            },
            action: {
              handler: async ([row]) => {
                try {
                  const res = await this.$confirm('拒绝提现？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                  })
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
          { name: '申请时间', key: 'created_date' },
          {
            name: '打款方式',
            key: 'pay_type',
            render: (h, { row }) => h('span', {}, this.getPayType(row.pay_type))
          },
          { name: '团长手机号', key: 'mobile' },
          {
            name: '申请提现金额（¥）',
            key: 'money',
            render: (h, { row }) => h('span', {}, row.money / 100)
          },
          {
            name: '提现状态',
            key: 'status',
            render: (h, { row }) => h('span', {}, this.renderWithdrawStatu(row.status))
          }
          // { name: '打款记录', key: 'chief_mobile' }
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
      withDrawStatusList,
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
          label: '团长姓名:',
          key: 'account_name',
          type: 'text'
        },
        {
          label: '提现方式:',
          key: 'pay_type',
          type: 'text'
        },
        {
          label: '银行名称:',
          key: 'bank_name',
          type: 'text'
        },
        {
          label: '银行卡号:',
          key: 'pay_account',
          type: 'text'
        },
        {
          label: '可提现金额:',
          key: 'cash_withdrawal_rebate',
          type: 'text'
        },
        {
          label: '申请提现:',
          key: 'money',
          type: 'text'
        }
      ]
    }
  },
  created () {},
  methods: {
    onSearch () {
      this.$refs.finder.refresh()
    },
    beforeSearch (params) {
      const formQuery = JSON.parse(JSON.stringify(this.formQuery))
      if (formQuery.approve_status == '-1') {
        delete formQuery.approve_status
      }
      return { ...params, ...formQuery }
    },
    afterSearch (response) {
      const { apply_chief_num, freeze_cash_withdrawal_rebate, payed_rebate, rebate_total } =
        response.data.data.count
      this.apply_chief_num = apply_chief_num
      ;(this.freeze_cash_withdrawal_rebate = freeze_cash_withdrawal_rebate),
        (this.payed_rebate = payed_rebate),
        (this.rebate_total = rebate_total)
    },
    getPayType (type) {
      const payType = {
        bankcard: '银行卡',
        alipay: '支付宝',
        wechat: '微信'
      }
      return payType[type]
    },
    renderWithdrawStatu (state) {
      return withDrawStatusList.find((item) => item.value == state).title
    },
    async onResloveSubmit () {
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
