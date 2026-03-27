<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div class="zyk_adapay_withdraw">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>{{ $t('d901a946.b96522') }}</span>
        </div>
        <div class="content">
          <div class="part1">
            <div style="margin-right: 50px">
              <div style="margin-left: 30px; margin-bottom: 20px; color: #333">
                <span
                  >{{ $t('d901a946.54bcf0') }}{{ (available_balance / 100) | formatNumMoney }}</span
                >
                <span style="margin-left: 30px"
                  >{{ $t('d901a946.568012') }}{{ (pending_balance / 100) | formatNumMoney }}</span
                >
                <span style="margin-left: 30px; color: #0079fe; font-weight: bold"
                  >{{ $t('d901a946.f9a7b6')
                  }}{{
                    Math.max(0, (available_balance - pending_balance) / 100) | formatNumMoney
                  }}</span
                >
              </div>
              <div>
                <SpForm
                  ref="ruleForm"
                  :value="form"
                  :form-list="formList"
                  label-width="100px"
                  :submit="false"
                  @input="(val) => (form = val)"
                />
              </div>
              <div style="margin-top: 20px">
                <loading-btn
                  ref="loadingBtn"
                  size="medium"
                  type="primary"
                  :text="$t('d901a946.33011e')"
                  @clickHandle="btnClick"
                />
              </div>
            </div>
            <div v-if="$store.getters.login_type == 'admin' && auto_draw_cash == 'N'" class="tips">
              <p v-if="$store.getters.login_type == 'admin' && auto_draw_cash == 'N'">
                *
                {{ $t('d901a946.aae577') }}
              </p>
              <template v-if="$store.getters.login_type != 'admin' && auto_draw_cash == 'Y'">
                <p>{{ $t('d901a946.c67e72') }}</p>
                <p>{{ $t('d901a946.2f5c36') }}</p>
                <p>{{ $t('d901a946.f0bb50') }}</p>
                <p>{{ $t('d901a946.aa4888') }}</p>
              </template>
              <p v-if="auto_draw_cash == 'N'">
                {{ $t('d901a946.7f9771') }}
              </p>
            </div>
          </div>
          <div class="list">
            <SpFinder
              ref="finder"
              :no-selection="true"
              :setting="setting"
              url="/bspay/withdraw/lists"
              :hooks="{
                beforeSearch: beforeSearch,
                afterSearch: afterSearch
              }"
              @reset="reset"
            >
              <template #date>
                <el-date-picker
                  v-model="time"
                  style="width: 100%"
                  type="daterange"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :default-time="['00:00:00', '23:59:59']"
                  range-separator="-"
                  :start-placeholder="$t('d901a946.b44c0f')"
                  :end-placeholder="$t('d901a946.1d468b')"
                  :clearable="false"
                  @change="timeHandle"
                />
              </template>
            </SpFinder>
          </div>
        </div>
      </el-card>
    </div>
  </SpPage>
</template>

<script>
// applyForWithdrawal
import setting_ from './finder/setting'
import loadingBtn from '@/components/loading-btn'
import SpForm from '@/components/sp-form'
import SpImagePicker from '@/components/sp-image-picker'
import { i18n } from '@/i18n'
export default {
  components: {
    loadingBtn,
    SpForm,
    SpImagePicker
  },
  data() {
    return {
      time: '',
      begin_time: '',
      end_time: '',
      search_options: [],
      auto_draw_cash: '',
      form: {
        cash_amt: '',
        cash_type: '',
        invoice_url: ''
      },
      cash_balance: 0,
      cash_limit: 0,
      available_balance: 0, // 可申请提现余额
      pending_balance: 0, // 审核中提现余额
      formList: [
        {
          label: i18n.t('d901a946.292a28'),
          key: 'cash_amt',
          type: 'input',
          required: true,
          width: '300px',
          placeholder: i18n.t('d901a946.02cc4f'),
          append: i18n.t('d901a946.c16655'),
          component: ({ key }, value) => {
            // 可提现金额 = 可申请提现余额 - 审核中提现余额
            const maxAmount = Math.max(0, (this.available_balance - this.pending_balance) / 100)
            return (
              <div style='display: flex; align-items: center; white-space: nowrap;'>
                <el-input
                  v-model={value[key]}
                  placeholder={i18n.t('d901a946.02cc4f')}
                  style='width: 300px; flex-shrink: 0;'
                  type='number'
                  min='0'
                  max={maxAmount}
                  onInput={(val) => {
                    // 限制输入金额不能超过实际可提现金额
                    const numVal = parseFloat(val) || 0
                    if (numVal > maxAmount) {
                      value[key] = maxAmount.toFixed(2)
                    }
                  }}
                >
                  <template slot='append'>{this.$t('d901a946.c16655')}</template>
                </el-input>
                <span
                  style='margin-left: 12px; color: #0079fe; cursor: pointer; white-space: nowrap; flex-shrink: 0;'
                  onClick={() => this.allHandle()} // 全部提现
                >
                  {i18n.t('d901a946.5eb161')}
                </span>
              </div>
            )
          }
        },
        {
          label: i18n.t('d901a946.79b414'),
          key: 'cash_type',
          type: 'select',
          required: true,
          width: '300px',
          placeholder: i18n.t('d901a946.88c618'),
          options: [
            //   { title: 'D0', value: 'D0' },
            //   { title: 'D1', value: 'D1' },
            { title: 'T1', value: 'T1' }
          ]
        },
        {
          label: i18n.t('d901a946.0030df'),
          key: 'invoice_url',
          type: 'input',
          required: true,
          width: '300px',
          placeholder: i18n.t('d901a946.75e903'),
          component: ({ key }, value) => {
            return (
              <div>
                <SpImagePicker v-model={value[key]} max={1} size='small' />
              </div>
            )
          }
        }
      ]
    }
  },
  computed: {
    setting() {
      return setting_(this)
    }
  },
  async mounted() {
    console.log(this.$store.getters.login_type)
    console.log('auto_draw_cash:', this.auto_draw_cash)
    console.log('formList:', this.formList)

    // 初始化时获取提现余额
    await this.getWithdrawBalance()
  },
  methods: {
    reset() {
      this.time = []
      this.begin_time = ''
      this.end_time = ''
    },
    timeHandle(val) {
      this.begin_time = val[0]
      this.end_time = val[1]
    },
    async btnClick() {
      try {
        await this.$refs.ruleForm.handleSubmit()

        // 构建请求参数
        const params = {
          amount: this.form.cash_amt,
          withdraw_type: this.form.cash_type,
          invoice_url: this.form.invoice_url
        }

        const { status } = await this.$api.bspay.withdrawApply(params)
        if (status == 0) {
          // 提现成功提示
          this.$message({
            message: this.$t('d901a946.17cdbe') + this.form.cash_amt + this.$t('d41d8cd9.m8n9o0'),
            type: 'success',
            duration: 5000,
            showClose: true
          })

          // 显示成功提示框
          this.$confirm(this.$t('d901a946.4b050b'), this.$t('d901a946.dca060'), {
            confirmButtonText: this.$t('d901a946.38cf16'),
            type: 'success',
            showCancelButton: false,
            center: true
          }).then(() => {
            // 用户点击确定后的操作
            console.log('User confirmed withdrawal success')
          })

          // 重置表单
          this.$refs.ruleForm.resetFields()
          // 刷新列表
          this.$refs.finder.refresh(true)
          // 刷新余额
          await this.getWithdrawBalance()
        } else {
          this.$message.error(this.$t('d901a946.68ac19'))
        }
      } catch (error) {
        console.log('Withdrawal failed:', error)
        // this.$message.error('提现申请提交失败，请检查网络连接或联系客服')
      } finally {
        // 关闭loading状态
        this.$refs.loadingBtn.closeLoading()
      }
    },
    allHandle() {
      // 可提现金额 = 可申请提现余额 - 审核中提现余额
      const maxAmount = Math.max(0, (this.available_balance - this.pending_balance) / 100)
      this.form.cash_amt = maxAmount.toFixed(2)
    },
    beforeSearch(params) {
      params.begin_time = this.begin_time
      params.end_time = this.end_time

      return params
    },
    async getWithdrawBalance() {
      try {
        const balanceResult = await this.$api.bspay.getWithdrawBalance()
        const { available_balance = 0, pending_balance = 0 } = balanceResult
        this.available_balance = available_balance
        this.pending_balance = pending_balance
      } catch (error) {
        console.error('Get withdraw balance failed:', error)
      }
    },

    async afterSearch({ data }) {
      const { search_options = {} } = data.data
      this.search_options = search_options.status
      // 获取提现余额
      await this.getWithdrawBalance()
    }
  }
}
</script>

<style lang="scss">
.zyk_adapay_withdraw {
  .clearfix span {
    font-weight: 700;
  }
  label {
    font-size: 12px;
    color: #000;
  }
  .el-row {
    margin-bottom: 0px;
  }
  .el-table th {
    background: #f5f5f5;
    color: #000;
  }
  .sp-finder-bd {
    padding: 0;
  }
  .sp-finder .el-pagination {
    text-align: center;
    margin: 20px 0px;
  }
  .sp-finder-search {
    padding: 20px 0;
    margin-top: 20px;
    background: #f5f5f5;
  }
  .sp-finder-search .el-input__inner {
    height: 40px;
    line-height: 40px;
  }
}
</style>
<style lang="scss" scoped>
.zyk_adapay_withdraw {
  .part1 {
    background: #f5f5f5;
    padding: 20px;
    display: flex;
    align-items: center;
    .tips {
      flex: 1;
      min-height: 130px;
    }
  }
  .list {
    margin: 0px 0 50px;
  }
  .tips {
    padding: 20px;
    margin: 0 30px;
    background: #fff;
    p {
      margin-bottom: 10px;
    }
  }
}
</style>
