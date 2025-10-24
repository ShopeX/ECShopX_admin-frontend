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
                <span>可提现金额：￥{{ (cash_balance / 100) | formatNumMoney }}</span>
                <span v-if="$store.getters.login_type != 'admin'" style="margin-left: 30px"
                  >暂冻金额：￥{{ (cash_limit / 100) | formatNumMoney }}</span
                >
              </div>
              <el-form
                v-if="auto_draw_cash == 'N'"
                ref="ruleForm"
                :model="form"
                class="demo-ruleForm"
                label-width="100px"
                :rules="rules"
              >
                <el-form-item label="提现金额" prop="cash_amt">
                  <el-input
                    v-model="form.cash_amt"
                    placeholder="请输入"
                    style="width: 300px"
                    type="number"
                    min="0"
                  >
                    <template slot="append">元</template>
                  </el-input>
                  <span
                    style="margin-left: 12px; color: #0079fe; cursor: pointer"
                    @click="allHandle"
                    >全部提现</span
                  >
                </el-form-item>
                <el-form-item label="提现类型" prop="cash_type">
                  <el-select
                    v-model="form.cash_type"
                    placeholder="请选择提现类型"
                    style="width: 300px"
                  >
                    <el-option value="D0" />
                    <el-option value="D1" />
                    <el-option value="T1" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <loading-btn
                    ref="loadingBtn"
                    size="medium"
                    type="primary"
                    text="确认提现"
                    @clickHandle="btnClick('ruleForm', 'loadingBtn')"
                  />
                  <!-- <el-button  type="primary" size="medium" @click="btnClick('ruleForm')">确认提现</el-button> -->
                </el-form-item>
              </el-form>
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
              url="/adapay/drawcash/getList"
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
export default {
  components: {
    loadingBtn
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
        cash_type: ''
      },
      cash_balance: 0,
      cash_limit: 0,
      rules: {
        cash_amt: [{ required: true, message: '请输入', trigger: 'blur' }],
        cash_type: [{ required: true, message: '请选择', trigger: 'change' }]
      }
    }
  },
  computed: {
    setting() {
      return setting_(this)
    }
  },
  mounted() {
    console.log(this.$store.getters.login_type)
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
    btnClick(formName, ref) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            const { status } = await this.$api.adapay.applyForWithdrawal(this.form)
            this.$refs[ref].closeLoading()
            if (status) {
              this.$message.success('提现成功')
              this.$refs[formName].resetFields()
              this.$refs.finder.refresh(true)
            } else {
              this.$message.error('提现失败')
            }
            console.log(result)
          } catch (error) {
            this.$refs[ref].closeLoading()
            return
          }
        } else {
          this.$refs[ref].closeLoading()
          console.log('error submit!!')
          return false
        }
      })
    },
    allHandle() {
      this.form.cash_amt = this.cash_balance / 100
    },
    beforeSearch(params) {
      params.begin_time = this.begin_time
      params.end_time = this.end_time

      return params
    },
    afterSearch({ data }) {
      const { search_options = {}, cash_balance = 0, cash_limit = 0, auto_draw_cash } = data.data
      this.auto_draw_cash = auto_draw_cash
      this.search_options = search_options.status
      this.cash_balance = cash_balance
      this.cash_limit = cash_limit
    }
    // async getConfig() {
    //   const result = await this.$api.adapay.withdrawList()
    //   const { cash_balance, cash_limit } = result.data.data
    //   this.cash_balance = cash_balance
    //   this.cash_limit = cash_limit
    // }
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
