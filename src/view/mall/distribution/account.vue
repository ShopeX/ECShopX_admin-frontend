<template>
  <el-card class="box-card">
    <div
      slot="header"
      class="clearfix"
    >
      <span>充值</span>
    </div>
    <div class="content">
      <div class="account">
        <p>
          <span>账户可用余额</span> <span>{{ account }} 元</span>
        </p>
        <el-form
          ref="numberValidateForm"
          :rules="rules"
          :model="numberValidateForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item
            class="item"
            label="充值金额"
            prop="money"
          >
            <el-input
              v-model="numberValidateForm.money"
              type="money"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item class="formItem">
            <el-button
              class="btn"
              @click="submitForm('numberValidateForm')"
            >
              确定充值
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-card>
</template>

<script>
import { get_DD_Account, getRechargeURL } from '@/api/account.js'
import { Message } from 'element-ui'
export default {
  data () {
    return {
      account: 1000,
      numberValidateForm: {
        money: null
      },
      rules: {
        money: [
          { required: true, message: '充值金额不能为空', trigger: 'blur' },
          { validator: this.validateMoney, trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.getAccount()
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const amount = {
            amount: Number(this.numberValidateForm.money)
          }
          try {
            const { data } = await getRechargeURL(amount)
            window.location.href = data.data.link
            // 清空不会触发验证
            this.$refs[formName].resetFields()
          } catch (err) {
            Message.error('充值失败')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async getAccount () {
      const result = await get_DD_Account()
      console.log(result)
      if (result.status == 200) {
        console.log(result.data.data.deliverBalance)
        this.account = result.data.data.deliverBalance
      }
    },

    validateMoney (rule, value, callback) {
      const reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
      if (!Number(value)) {
        callback(new Error('请输入正确的数字'))
      } else {
        if (!reg.test(value)) {
          callback(new Error('请输入正确的金额，最多保留两位小数'))
        } else if (Number(value) > 10000) {
          callback(new Error('每次充值不得超过10000元'))
        } else {
          callback()
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  width: 100%;
  padding: 0 50px;
}
.account {
  width: 300px;
  padding: 30px 0;
  box-sizing: border-box;
  margin-right: 100px;
  p {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    padding-bottom: 24px;
    span:nth-child(2) {
      font-size: 18px;
      color: #000;
      line-height: 20px;
    }
  }

  .formItem {
    margin: 0 auto;
    margin-top: 50px;
  }
  .btn {
    width: 120px;
    background: $primary_active;
    color: #fff;
  }
}
</style>

<style lang="scss">
.account {
  // 输入框
  .el-input {
    position: relative;
    &::after {
      content: '元';
      position: absolute;
      right: 0.5%;
      top: 8%;
      padding: 3px 10px;
      height: 28px;
      line-height: 30px;
      background-color: rgb(244, 244, 244);
    }
  }
  .el-input__inner {
    border-radius: 0px;
    height: 36px;
    line-height: 36px;
    padding: 3px 30px 3px 10px;
    // input提示框字体样式修改
    ::placeholder {
      font-size: 16px;
      font-weight: 400;
    }
  }
  .btn {
    height: 40px;
    line-height: 40px;
    padding: 0;
  }
}
</style>
