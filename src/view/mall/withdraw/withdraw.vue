<template>
  <div class="zyk_adapay_withdraw">
    <el-card
      class="box-card"
      shadow="never"
    >
      <div
        slot="header"
        class="clearfix"
      >
        <span>分账提现</span>
      </div>
      <div class="content">
        <div class="part1">
          <div style="margin-right: 50px">
            <div style="margin-left: 30px; margin-bottom: 20px; color: #333">
              <span>可提现金额：￥{{ (cash_balance / 100) | formatNumMoney }}</span>
              <span
                v-if="$store.getters.login_type != 'normal'"
                style="margin-left: 30px"
              >限制额度：￥{{ (cash_limit / 100) | formatNumMoney }}</span>
            </div>
            <el-form
              ref="ruleForm"
              :model="form"
              class="demo-ruleForm"
              label-width="100px"
              :rules="rules"
            >
              <el-form-item
                label="提现金额"
                prop="cash_amt"
              >
                <el-input
                  v-model="form.cash_amt"
                  placeholder="请输入"
                  style="width: 400px"
                >
                  <template slot="append">
                    元
                  </template>
                </el-input>
                <span
                  style="margin-left: 12px; color: #0079fe; cursor: pointer"
                  @click="allHandle"
                >全部提现</span>
              </el-form-item>
              <el-form-item
                label="提现类型"
                prop="cash_type"
              >
                <el-select
                  v-model="form.cash_type"
                  placeholder="请选择提现类型"
                  style="width: 400px"
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
          <div class="tips">
            <p v-if="$store.getters.login_type != 'normal'">
              * 当前可提现金额需大于或等于限制额度才可以进行提现；
            </p>
            <p>* 提现操作请在 10:00:00-22:00:00 进行。</p>
          </div>
        </div>
        <div class="list">
          <SpFinder
            ref="finder"
            :no-selection="true"
            :setting="setting"
            url="/adapay/drawcash/getList"
            :hooks="{
              beforeSearch: beforeSearch
            }"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
// applyForWithdrawal
import setting_ from './finder/setting'
import loadingBtn from '@/components/loading-btn'
export default {
  components: {
    loadingBtn
  },
  data () {
    return {
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
    setting () {
      return setting_(this)
    }
  },
  mounted () {
    this.getConfig()
    console.log(this.$store.getters.login_type)
  },
  methods: {
    btnClick (formName, ref) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            const { status } = await this.$api.adapay.applyForWithdrawal(this.form)
            this.$refs[ref].closeLoading()
            if (status) {
              this.$message.success('提现成功')
              this.$refs[formName].resetFields()
              this.getConfig()
              this.$refs.finder.refresh()
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
    allHandle () {
      this.form.cash_amt = this.cash_balance / 100
    },
    beforeSearch (params) {
      return { ...params }
    },
    async getConfig () {
      const { cash_balance, cash_limit } = await this.$api.adapay.withdrawList()
      this.cash_balance = cash_balance
      this.cash_limit = cash_limit
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
    background: #fff;
  }
}
</style>
