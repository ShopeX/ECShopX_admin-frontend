<template>
  <div class="login_page">
    <div
      class="bg"
      :style="{
        backgroundImage: 'url(' + login_bg + ')'
      }"
    />

    <div class="content">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-position="left"
        label-width="100px"
        class="form"
      >
        <div class="box">
          <h3>{{ title }}</h3>
          <el-tabs v-if="$route.meta.type == 'admin'" v-model="activeName" class="tab">
            <el-tab-pane label="管理员账号登录" name="first">
              <el-form-item label="账户" prop="account">
                <el-input v-model="form.account" />
              </el-form-item>
              <el-form-item label="密码" prop="checkPass">
                <el-input v-model="form.checkPass" type="password" />
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="员工账号登录" name="second">
              <el-form-item label="账户" prop="account">
                <el-input v-model="form.account" />
              </el-form-item>
              <el-form-item label="密码" prop="checkPass">
                <el-input v-model="form.checkPass" type="password" />
              </el-form-item>
            </el-tab-pane>
          </el-tabs>

          <div v-else class="tab">
            <el-form-item label="账户" prop="account">
              <el-input v-model="form.account" />
            </el-form-item>
            <el-form-item label="密码" prop="checkPass">
              <el-input v-model="form.checkPass" type="password" />
            </el-form-item>
          </div>

          <el-form-item style="margin-top: 40px; margin-bottom: 10px" label-wdith="0px">
            <loadingBtn ref="loadingBtn" class="btn" text="登 录" @clickHandle="fnLogin('form')" />
          </el-form-item>
          <p v-if="loginType != 'admin'" class="tip">忘记密码，请联系管理员重置</p>
        </div>
      </el-form>
    </div>

    <el-dialog title="" width="800px" :visible.sync="dialogVisible">
      <div class="agreement-content" v-html="agreementContent" />
      <div slot="footer" class="dialog-footer">
        <el-button plain @click="dialogVisible = false"> 取 消 </el-button>
        <el-button type="primary" @click="handleAgreement"> 同 意 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const login_bg_merchant = require(`@/assets/imgs/login-merchant.jpg`)
const login_bg_shopadmin = require(`@/assets/imgs/login-shopadmin.jpg`)

const login_bg_yundian = require(`@/assets/imgs/login-yundian.jpg`)
const login_bg_b2c = require(`@/assets/imgs/login-b2c.jpg`)
const login_bg_inpurchase = require(`@/assets/imgs/login-inpurchase.jpg`)
const login_bg_ecshopx = require(`@/assets/imgs/login-ecshopx.jpg`)
const login_bg_free_ecshopx = require(`@/assets/imgs/login-free-ecshopx.jpg`)

import { mapMutations } from 'vuex'
import { requiredRules, MinRules } from '@/utils/validate'
import { unescape } from '@/utils'
import loadingBtn from '@/components/loading-btn'

export default {
  components: {
    loadingBtn
  },
  data() {
    return {
      title: '平台管理中心',
      login_bg: login_bg_ecshopx,
      size: 0,
      activeName: 'first',
      form: {
        account: '',
        checkPass: ''
      },
      loginType: 'admin',
      rules: {
        account: [requiredRules('账户')],
        checkPass: [requiredRules('密码'), MinRules(6)]
      },
      dialogVisible: false,
      agreementId: null,
      agreementContent: ''
    }
  },
  watch: {
    activeName(val) {
      if (val == 'second') {
        this.loginType = 'staff'
      } else {
        this.loginType = 'admin'
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.fnSize())
    this.SET_VERSION_MODE(this.VUE_APP_PRODUCT_MODEL)
    console.log(this.VUE_APP_PRODUCT_MODEL, '----version----')
    this.init()
  },
  destroyed() {
    window.removeEventListener('resize', this.fnSize)
  },
  methods: {
    ...mapMutations([
      'SET_TOKEN',
      'SET_TOKEN_EXP',
      'SET_USERINFO',
      'SET_LOGIN_TYPE',
      'SET_VERSION_MODE'
    ]),
    init() {
      this.loginType = this.$route.meta.type
      this.getBgImg()
      this.$store.dispatch('setLoginType', this.loginType)
    },
    getBgImg() {
      switch (this.VUE_APP_PRODUCT_MODEL) {
        case 'standard':
          this.title = this.getLoginTitle('云店管理中心')
          this.login_bg = login_bg_yundian
          break
        case 'in_purchase':
          this.title = this.getLoginTitle('内购管理中心')
          this.login_bg = login_bg_inpurchase
          break
        case 'b2c':
          this.title = this.getLoginTitle('官方商城管理中心')
          this.login_bg = login_bg_b2c
          break
        default:
          this.title = this.getLoginTitle('平台管理中心')
          this.login_bg = login_bg_ecshopx
          break
      }
    },
    getLoginTitle(t) {
      let title
      switch (this.loginType) {
        case 'supplier':
          title = '供应商管理中心'
          break
        case 'agent':
          title = '代理商管理中心'
          break
        case 'distributor':
          title = '店铺管理中心'
          break
        case 'dealer':
          title = '经销商管理中心'
          break
        case 'merchant':
          title = '商户管理中心'
          break
        default:
          title = t
          break
      }
      return title
    },
    fnSize() {
      this.size = document.body.clientHeight
    },
    fnLogin(formName, agreement_id) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const params = {
            username: this.form.account,
            password: this.form.checkPass,
            logintype: this.loginType,
            product_model: this.VUE_APP_PRODUCT_MODEL,
            agreement_id
          }
          try {
            const { token } = await this.$api.auth.login(params)

            if (token) {
              this.loginSuccess(token)
            } else {
              this.$message({
                message: '登录失败，请联系管理员',
                type: 'error',
                duration: 3 * 1000
              })
            }
          } catch (e) {
            console.error(e)
            this.$refs['loadingBtn'].closeLoading()
            if (e.data.data.code == 400401) {
              this.getAgreementContent()
              this.dialogVisible = true
            }
          }
        } else {
          this.$refs['loadingBtn'].closeLoading()
        }
      })
    },
    async getAgreementContent() {
      const { agreement_id, content } = await this.$api.auth.getAgreementContent()
      this.agreementId = agreement_id
      this.agreementContent = unescape(content)
    },
    async handleAgreement() {
      this.fnLogin('form', this.agreementId)
      this.dialogVisible = false
    },
    async loginSuccess(token) {
      this.SET_TOKEN({ token })
      this.SET_TOKEN_EXP({ exp: new Date().getTime() })
      this.SET_LOGIN_TYPE({ loginType: this.loginType })
      this.$message({
        message: '登录成功',
        type: 'success'
      })
      const userInfo = await this.$api.login.getAdminInfo()
      let base64Url = token.split('.')[1]
      // const { menu_type } = await this.$api.wechat.getAuthorizerInfo()
      const { menu_type } = JSON.parse(atob(base64Url))
      console.log('menu_type', menu_type)
      this.SET_USERINFO(userInfo)
      this.SET_VERSION_MODE(menu_type)
      if (this.loginType == 'distributor') {
        this.$router.push({ path: '/shopadmin/shoplist' })
      } else if (this.loginType == 'dealer') {
        const isShow = localStorage.getItem('dealer_isShow')
        if (isShow) {
          this.$router.push({
            path: '/dealer/adapay_member/info'
          })
          return
        }
        this.$router.push({ path: '/dealer/index' })
      } else if (this.loginType == 'merchant') {
        this.$router.push({ path: '/merchant' })
      }else if (this.loginType == 'supplier') {
        if (userInfo.supplier_check_status == 1) {
          this.$router.push({ path: '/supplier/order/tradenormalorders' })
        } else {
          this.$router.push({ path: '/supplier/setting/supplier_register' })
        }
      } else {
        window.location.href = '/'
      }
    }
  }
}
</script>

<style lang="scss">
.login_page {
  height: 100%;
  display: flex;
  .bg {
    width: 50%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .content {
    width: 50%;
    height: 100%;
    > form {
      width: 300px;
      margin: 20% auto;
    }
    .box {
      h3 {
        margin-bottom: 40px;
        font-size: 23px;
        color: #888888;
        text-align: center;
      }

      .btn {
        width: 100%;
        padding: 12px;
        height: 40px;
        background: $color-primary;
        border-radius: 40px;
        text-align: center;
        color: #fff;
        cursor: pointer;
        border: none;
      }
      .tip {
        text-align: center;
        font-size: 12px;
        color: #999;
      }
    }
  }

  .el-form {
    .el-tabs__item {
      width: 150px;
    }
    #tab-first {
      padding-right: 43px;
    }
    #tab-second {
      text-align: right;
      padding-left: 53px;
    }
  }

  .el-tabs__header {
    margin: 0 0 40px;
  }
  .el-input__inner {
    border: 0;
    border-bottom: 1px solid #ddd;
    border-radius: 0;
    font-size: 16px;
  }
  .el-tabs__nav-wrap::after {
    background-color: transparent;
  }
  .el-form-item__label {
    color: #888;
  }
  .el-tabs__item {
    color: #999;
    font-size: 16px;
  }
  .el-tabs__item.is-active {
    color: $color-primary;
  }
  .el-tabs__active-bar {
    background-color: $color-primary;
  }
  .el-form-item__content {
    margin-left: 0px !important;
  }
  .content {
    background: #fff;
  }

  input:-webkit-autofill {
    box-shadow: 0 0 0 1000px #fff inset;
  }
}
</style>
