<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div class="zyk_adapay_withdraw">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>{{ $t('7f31cab4.b96522') }}</span>
        </div>
        <div class="content">
          <div class="part1">
            <div style="margin-right: 50px">
              <div style="margin-left: 30px; margin-bottom: 20px; color: #333">
                <span
                  >{{ $t('7f31cab4.e2201a') }}：￥{{ (cash_balance / 100) | formatNumMoney }}</span
                >
                <span v-if="$store.getters.login_type != 'admin'" style="margin-left: 30px"
                  >{{ $t('7f31cab4.3b757d') }}：￥{{ (cash_limit / 100) | formatNumMoney }}</span
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
                <el-form-item :label="$t('7f31cab4.292a28')" prop="cash_amt">
                  <el-input
                    v-model="form.cash_amt"
                    :placeholder="$t('7f31cab4.02cc4f')"
                    style="width: 300px"
                    type="number"
                    min="0"
                  >
                    <template slot="append">{{ $t('7f31cab4.c16655') }}</template>
                  </el-input>
                  <span
                    style="margin-left: 12px; color: #0079fe; cursor: pointer"
                    @click="allHandle"
                    >{{ $t('7f31cab4.5eb161') }}</span
                  >
                </el-form-item>
                <el-form-item :label="$t('7f31cab4.79b414')" prop="cash_type">
                  <el-select
                    v-model="form.cash_type"
                    :placeholder="$t('7f31cab4.88c618')"
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
                    :text="$t('7f31cab4.6b9c3d')"
                    @clickHandle="btnClick('ruleForm', 'loadingBtn')"
                  />
                  <!-- <el-button  type="primary" size="medium" @click="btnClick('ruleForm')">确认提现</el-button> -->
                </el-form-item>
              </el-form>
            </div>
            <div v-if="$store.getters.login_type == 'admin' && auto_draw_cash == 'N'" class="tips">
              <p v-if="$store.getters.login_type == 'admin' && auto_draw_cash == 'N'">
                * {{ $t('7f31cab4.aae577') }}
              </p>
              <template v-if="$store.getters.login_type != 'admin' && auto_draw_cash == 'Y'">
                <p>{{ $t('7f31cab4.c67e72') }}</p>
                <p>{{ $t('7f31cab4.2f5c36') }}</p>
                <p>{{ $t('7f31cab4.f0bb50') }}</p>
                <p>{{ $t('7f31cab4.aa4888') }}</p>
              </template>
              <p v-if="auto_draw_cash == 'N'">* {{ $t('7f31cab4.56ee17') }}</p>
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
                  :start-placeholder="$t('7f31cab4.b44c0f')"
                  :end-placeholder="$t('7f31cab4.1d468b')"
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
import { i18n } from '@/i18n'

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
        cash_amt: [{ required: true, message: i18n.t('7f31cab4.02cc4f'), trigger: 'blur' }],
        cash_type: [{ required: true, message: i18n.t('7f31cab4.708c9d'), trigger: 'change' }]
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
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            const { status } = await this.$api.adapay.applyForWithdrawal(this.form)
            this.$refs[ref].closeLoading()
            if (status) {
              this.$message.success(this.$t('7f31cab4.dca060'))
              this.$refs[formName].resetFields()
              this.$refs.finder.refresh(true)
            } else {
              this.$message.error(this.$t('7f31cab4.f285c5'))
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
