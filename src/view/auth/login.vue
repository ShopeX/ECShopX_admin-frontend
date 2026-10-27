<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="login-page">
    <div class="login-page__body">
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
            <h3>{{ $t(title) }}</h3>
            <el-tabs v-if="$route.meta.type == 'admin'" v-model="activeName" class="tab">
              <el-tab-pane :label="$t('73f7fe3a.f45406')" name="first">
                <el-form-item :label="$t('73f7fe3a.7116e7')" prop="account">
                  <el-input v-model="form.account" />
                </el-form-item>
                <el-form-item :label="$t('73f7fe3a.a81052')" prop="checkPass">
                  <el-input v-model="form.checkPass" type="password" />
                </el-form-item>
                <el-form-item v-if="level === 'img_code'" prop="yzm" class="imageyzm">
                  <el-input v-model="form.yzm" type="text" :placeholder="$t('73f7fe3a.983f59')">
                    <img
                      slot="append"
                      :src="imageData"
                      style="width: auto; height: 38px; cursor: pointer"
                      @click="_getImagesCode"
                    />
                  </el-input>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane :label="$t('73f7fe3a.3cf7a7')" name="second">
                <el-form-item :label="$t('73f7fe3a.7116e7')" prop="account">
                  <el-input v-model="form.account" />
                </el-form-item>
                <el-form-item :label="$t('73f7fe3a.a81052')" prop="checkPass">
                  <el-input v-model="form.checkPass" type="password" />
                </el-form-item>
                <el-form-item v-if="level === 'img_code'" prop="yzm" class="imageyzm">
                  <el-input v-model="form.yzm" type="text" :placeholder="$t('73f7fe3a.983f59')">
                    <img
                      slot="append"
                      :src="imageData"
                      style="width: auto; height: 38px; cursor: pointer"
                      @click="_getImagesCode"
                    />
                  </el-input>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
            <div v-else class="tab">
              <el-form-item :label="$t('73f7fe3a.7116e7')" prop="account">
                <el-input v-model="form.account" />
              </el-form-item>
              <el-form-item :label="$t('73f7fe3a.a81052')" prop="checkPass">
                <el-input v-model="form.checkPass" type="password" />
              </el-form-item>
              <el-form-item v-if="level === 'img_code'" prop="yzm" class="imageyzm">
                <el-input v-model="form.yzm" type="text" :placeholder="$t('73f7fe3a.983f59')">
                  <img
                    slot="append"
                    :src="imageData"
                    style="width: auto; height: 38px; cursor: pointer"
                    @click="_getImagesCode"
                  />
                </el-input>
              </el-form-item>
            </div>
            <el-form-item style="margin-top: 40px; margin-bottom: 10px" label-wdith="0px">
              <loadingBtn
                ref="loadingBtn"
                class="btn"
                :text="$t('73f7fe3a.e43613')"
                @clickHandle="fnLogin('form')"
              />
            </el-form-item>
            <p v-if="loginType != 'admin'" class="tip">{{ $t('73f7fe3a.e65366') }}</p>
          </div>
        </el-form>
      </div>
    </div>
    <div class="login-page__footer">
      <span>
        <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">沪ICP备05002918号</a>
      </span>
    </div>
    <el-dialog title="" width="800px" :visible.sync="dialogVisible">
      <div class="agreement-content" v-html="agreementContent" />
      <div slot="footer" class="dialog-footer">
        <el-button plain @click="dialogVisible = false"> {{ $t('73f7fe3a.c08ab9') }} </el-button>
        <el-button type="primary" @click="handleAgreement"> {{ $t('73f7fe3a.7f3a36') }} </el-button>
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
const login_bg_ecshopx = require(`@/assets/imgs/login-b2b2c.jpg`)
const login_bg_free_ecshopx = require(`@/assets/imgs/login-free-ecshopx.jpg`)
import { mapMutations } from 'vuex'
import { requiredRules, MinRules } from '@/utils/validate'
import { decodeJwtPayload, unescape, resolveAppPath } from '@/utils'
import loadingBtn from '@/components/loading-btn'
export default {
  components: {
    loadingBtn
  },
  data() {
    return {
      title: '73f7fe3a.43e95d',
      login_bg: login_bg_ecshopx,
      size: 0,
      activeName: 'first',
      form: {
        account: '',
        checkPass: '',
        yzm: '',
        token: ''
      },
      loginType: 'admin',
      rules: {
        account: [requiredRules(this.$t('73f7fe3a.7116e7'))],
        checkPass: [requiredRules(this.$t('73f7fe3a.a81052')), MinRules(6)]
      },
      dialogVisible: false,
      agreementId: null,
      agreementContent: '',
      level: '',
      imageData: '',
      imageToken: ''
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
    this.init()
    this.$api.login.getAuthorizeLeve().then((res) => {
      this.level = res.level
      if (this.level === 'img_code') {
        this._getImagesCode()
        this.rules.yzm = [{ required: true, message: this.$t('73f7fe3a.d0c06a'), trigger: 'blur' }]
      }
    })
  },
  destroyed() {
    window.removeEventListener('resize', this.fnSize)
  },
  methods: {
    ...mapMutations(['SET_TOKEN', 'SET_TOKEN_EXP', 'SET_USERINFO', 'SET_LOGIN_TYPE']),
    init() {
      this.loginType = this.$route.meta.type
      this.getBgImg()
      this.$store.dispatch('setLoginType', this.loginType)
    },
    _getImagesCode() {
      if (this.checkCode) return
      this.checkCode = true
      this.$api.login.getImageCode({ type: 'login' }).then((res) => {
        let { imageData, imageToken } = res
        this.imageData = imageData
        this.imageToken = imageToken
        this.checkCode = false
      })
    },
    getBgImg() {
      switch (this.VUE_APP_PRODUCT_MODEL) {
        case 'standard':
          this.title = this.getLoginTitle('73f7fe3a.65bb11')
          this.login_bg = login_bg_yundian
          break
        case 'in_purchase':
          this.title = this.getLoginTitle('73f7fe3a.8a3a96')
          this.login_bg = login_bg_inpurchase
          break
        case 'b2c':
        case 'shuyun':
          this.title = this.getLoginTitle('73f7fe3a.12d5e5')
          this.login_bg = login_bg_b2c
          break
        default:
          this.title = this.getLoginTitle('73f7fe3a.43e95d')
          this.login_bg = login_bg_ecshopx
          break
      }
    },
    getLoginTitle(key) {
      const keyMap = {
        supplier: '73f7fe3a.67602b',
        agent: '73f7fe3a.9ec352',
        distributor: '73f7fe3a.5a6369',
        dealer: '73f7fe3a.7dc0b2',
        merchant: '73f7fe3a.dd5a0e'
      }
      return keyMap[this.loginType] || key
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
          if (this.level === 'img_code') {
            params.token = this.imageToken
            params.yzm = this.form.yzm
          }
          try {
            const { token } = await this.$api.auth.login(params)
            if (token) {
              this.loginSuccess(token)
            } else {
              this.$message({
                message: this.$t('73f7fe3a.178268'),
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
        message: this.$t('73f7fe3a.71fa3b'),
        type: 'success'
      })
      const userInfo = await this.$api.login.getAdminInfo()
      const { menu_type } = decodeJwtPayload(token)
      console.log('menu_type', menu_type)
      this.SET_USERINFO(userInfo)
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
      } else if (this.loginType == 'supplier') {
        if (userInfo.supplier_check_status == 1) {
          this.$router.push({ path: '/supplier/order/tradenormalorders' })
        } else {
          this.$router.push({ path: '/supplier/setting/supplier_register' })
        }
      } else {
        window.location.href = resolveAppPath('/')
      }
    }
  }
}
</script>
<style lang="scss">
.login-page {
  height: 100%;
  &__body {
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
  &__footer {
    height: 60px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    line-height: 50px;
    a {
      color: #999;
      font-size: 14px;
    }
  }
}
</style>
