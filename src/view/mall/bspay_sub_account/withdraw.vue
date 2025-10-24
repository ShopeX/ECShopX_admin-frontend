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
<template>
    <SpPage>
      <div class="zyk_adapay_withdraw">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>分账提现</span>
          </div>
          <div class="content">
            <div class="part1">
              <div style="margin-right: 50px">
                <div style="margin-left: 30px; margin-bottom: 20px; color: #333">
                  <span>可申请提现余额：￥{{ (available_balance / 100) | formatNumMoney }}</span>
                  <span style="margin-left: 30px"
                    >审核中提现余额：￥{{ (pending_balance / 100) | formatNumMoney }}</span
                  >
                  <span style="margin-left: 30px; color: #0079fe; font-weight: bold;"
                    >实际可提现：￥{{ Math.max(0, (available_balance - pending_balance) / 100) | formatNumMoney }}</span
                  >
                </div>
                <div>
                  <SpForm
                    ref="ruleForm"
                    :value="form"
                    :form-list="formList"
                    label-width="100px"
                    :submit="false"
                    @input="val => form = val"
                  />
                </div>
                <div style="margin-top: 20px;">
                  <loading-btn
                    ref="loadingBtn"
                    size="medium"
                    type="primary"
                    text="提现申请"
                    @clickHandle="btnClick"
                  />
                </div>
              </div>
              <div v-if="$store.getters.login_type == 'admin' && auto_draw_cash == 'N'" class="tips">
                <p v-if="$store.getters.login_type == 'admin' && auto_draw_cash == 'N'">
                  *
                  分销员提现佣金选择类型为银行卡时，将从可提现金额进行转账，为避免分销员提现时资金不足导致提现失败，请提现时预留部分资金；
                </p>
                <template v-if="$store.getters.login_type != 'admin' && auto_draw_cash == 'Y'">
                  <p>提现规则：</p>
                  <p>提现将在每月10号进行；</p>
                  <p>当余额大于10000元时可提现;</p>
                  <p>提现类型为 T1 。</p>
                </template>
                <p v-if="auto_draw_cash == 'N'">
                  * 提现操作建议在10:00:00-22:00:00进行，以免影响操作时效。
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
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
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
            label: '提现金额',
            key: 'cash_amt',
            type: 'input',
            required: true,
            width: '300px',
            placeholder: '请输入',
            append: '元',
            component: ({ key }, value) => {
              // 可提现金额 = 可申请提现余额 - 审核中提现余额
              const maxAmount = Math.max(0, (this.available_balance - this.pending_balance) / 100)
              return (
                <div style="display: flex; align-items: center; white-space: nowrap;">
                  <el-input
                    v-model={value[key]}
                    placeholder="请输入"
                    style="width: 300px; flex-shrink: 0;"
                    type="number"
                    min="0"
                    max={maxAmount}
                    onInput={(val) => {
                      // 限制输入金额不能超过实际可提现金额
                      const numVal = parseFloat(val) || 0
                      if (numVal > maxAmount) {
                        value[key] = maxAmount.toFixed(2)
                      }
                    }}
                  >
                    <template slot="append">元</template>
                  </el-input>
                  <span
                    style="margin-left: 12px; color: #0079fe; cursor: pointer; white-space: nowrap; flex-shrink: 0;"
                    onClick={() => this.allHandle()}  // 全部提现
                  >
                    全部提现
                  </span>
                </div>
              )
            }
          },
          {
            label: '提现类型',
            key: 'cash_type',
            type: 'select',
            required: true,
            width: '300px',
            placeholder: '请选择提现类型',
            options: [
            //   { title: 'D0', value: 'D0' },
            //   { title: 'D1', value: 'D1' },
              { title: 'T1', value: 'T1' }
            ]
          },
          {
            label: ' 发票',
            key: 'invoice_url',
            type: 'input',
            required: true,
            width: '300px',
            placeholder: '请上传发票',
            component: ({ key }, value) => {
              return (
                <div>
                  <SpImagePicker 
                    v-model={value[key]} 
                    max={1}
                    size="small"
                  />
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
              message: `提现申请提交成功！提现金额：￥${this.form.cash_amt}元`,
              type: 'success',
              duration: 5000,
              showClose: true
            })
            
            // 显示成功提示框
            this.$confirm('提现申请已提交，请等待审核。您可以在下方列表中查看提现记录。', '提现成功', {
              confirmButtonText: '确定',
              type: 'success',
              showCancelButton: false,
              center: true
            }).then(() => {
              // 用户点击确定后的操作
              console.log('用户确认提现成功提示')
            })
            
            // 重置表单
            this.$refs.ruleForm.resetFields()
            // 刷新列表
            this.$refs.finder.refresh(true)
            // 刷新余额
            await this.getWithdrawBalance()
          } else {
            this.$message.error('提现申请提交失败，请重试')
          }
        } catch (error) {
          console.log('提现失败:', error)
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
          console.error('获取提现余额失败:', error)
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
  