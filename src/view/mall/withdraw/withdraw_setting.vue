<template>
  <div class="zyk_adapay_withdraw_setting">
    <el-card
      class="box-card"
      shadow="never"
    >
      <div
        slot="header"
        class="clearfix"
      >
        <span>提现设置</span>
      </div>
      <div class="content">
        <el-form
          ref="ruleForm"
          :model="form"
          class="demo-ruleForm"
          label-width="100px"
          :rules="rules"
        >
          <!-- <el-form-item label="是否支持自动提现" prop="moeny" label-width="140px">
            <el-radio-group v-model="form.flag">
              <el-radio label="yes" >是</el-radio>
              <el-radio label="no">否</el-radio>
            </el-radio-group>
          </el-form-item> -->
          <div
            v-if="form.flag == 'yes'"
            class="rules"
          >
            <el-form-item
              label="提现规则"
              prop="type"
            >
              <el-radio-group v-model="form.rules">
                <el-radio label="month">
                  每月提取时间
                </el-radio>
                <el-radio label="day">
                  每日提取时间
                </el-radio>
                <el-radio label="filter">
                  当可提现余额大于 X 元，可提现
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.rules == 'month'">
              <el-date-picker
                v-model="form.value1"
                type="date"
                format="dd"
                value-format="dd"
                placeholder="请选择每月提取时间"
              />
            </el-form-item>
            <el-form-item v-if="form.rules == 'day'">
              <el-time-picker
                v-model="form.value2"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="请选择每日提取时间"
              />
            </el-form-item>
            <el-form-item v-if="form.rules == 'filter'">
              <el-input
                v-model="input2"
                placeholder="请输入"
                style="width: 300px"
              >
                <template slot="append">
                  元
                </template>
              </el-input>
              <span class="tips">（设置实际提现金额需大于可提现余额的50%）</span>
            </el-form-item>

            <el-form-item
              label="提现金额"
              prop="type"
            >
              <el-input
                v-model="input2"
                style="width: 400px"
              >
                <template slot="append">
                  元
                </template>
              </el-input>
            </el-form-item>
            <el-form-item
              label="提现类型"
              prop="type"
            >
              <el-select
                v-model="form.region"
                placeholder="请选择活动区域"
                style="width: 400px"
              >
                <el-option
                  label="区域一"
                  value="shanghai"
                />
                <el-option
                  label="区域二"
                  value="beijing"
                />
              </el-select>
            </el-form-item>
          </div>
          <div
            v-else
            class="rules"
          >
            <el-form-item
              label="子商户每日限定提现额度"
              label-width="200px"
              prop="draw_limit"
            >
              <el-input
                v-model="form.draw_limit"
                placeholder="请输入"
                style="width: 300px"
              >
                <template slot="append">
                  元
                </template>
              </el-input>
            </el-form-item>
            <p class="tips">
              子商户可提现金额需大于或等于限制额度才可以进行提现，超出提大现限额的金额，禁用子商户后该项设置对其无作用
            </p>
          </div>
          <el-form-item style="text-align: center; margin-top: 50px; margin-right: 130px">
            <el-button
              type="info"
              size="medium"
              @click="getConfig"
            >
              取消
            </el-button>
            <!-- <el-button type="primary" size="medium" v-debounce:ruleForm="confirm">确认</el-button> -->

            <loading-btn
              ref="loadingBtn"
              size="medium"
              type="primary"
              text="确认"
              @clickHandle="confirm('ruleForm', 'loadingBtn')"
            />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import loadingBtn from '@/components/loading-btn'
export default {
  components: {
    loadingBtn
  },
  data () {
    return {
      form: {
        flag: 'no',
        value1: '',
        value2: '',
        draw_limit: ''
      },
      rules: {
        moeny: [{ required: true, message: '请输入', trigger: 'blur' }],
        type: [{ required: true, message: '请输入', trigger: 'blur' }],
        draw_limit: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.getConfig()
  },
  methods: {
    async getConfig () {
      const { draw_limit } = await this.$api.adapay.getChildWithdraw()
      this.form.draw_limit = draw_limit / 100 || ''
    },
    confirm (formName, ref) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { status } = await this.$api.adapay.setChildWithdraw(this.form)
          if (status) {
            this.$message.success('设置成功')
            this.$refs[ref].closeLoading()
            this.getConfig()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.zyk_adapay_withdraw_setting {
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
  .rules {
    padding: 30px;
    background: #f5f5f5;
    .tips {
      font-size: 12px;
      color: #999;
    }
  }
}
</style>
<style lang="scss">
.zyk_adapay_withdraw_setting {
}
</style>
