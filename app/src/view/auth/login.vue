<template>
  <div>
    <div class="log-header">
      <div class="log-container">
        <div class="brand"><img :src="brand" alt="" /></div>
        <div class="log-welcome">欢迎登录</div>
      </div>
    </div>
    <div
      class="log-body"
      :style="{
        backgroundImage: 'url(' + login_bg + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }"
    >
      <div class="log-container">
        <el-tabs
          type="border-card"
          @tab-click="tabChange"
          value="admin"
          style="width: 400px"
          class="login-type-tab"
        >
          <el-tab-pane v-if="system_is_saas == 'true'" name="admin" label="管理员登录(shopexid)">
            <div v-loading="isAuto">
              <iframe
                :src="autoSrc"
                frameborder="0"
                class="login-type-tab-iframe"
                ref="iframe"
                id="iframe"
              >
              </iframe>
            </div>
          </el-tab-pane>

          <el-tab-pane
            v-else-if="system_mode !== 'group'"
            name="admin"
            label="管理员登录(shopexid)"
          >
            <div class="log-img"></div>
            <el-form
              :model="ruleForm1"
              :rules="rules1"
              ref="ruleForm1"
              label-position="left"
              label-width="0px"
              class="login-log-container"
            >
              <h3 class="title">
                <a href="http://yyk.shopex.cn/signup" target="_blank" class="signup">免费注册</a>
              </h3>
              <el-form-item prop="account">
                <el-input
                  type="text"
                  v-model="ruleForm1.account"
                  name="account"
                  auto-complete="off"
                  placeholder="请输入手机号"
                ></el-input>
              </el-form-item>
              <el-form-item prop="checkPass">
                <el-input
                  type="password"
                  v-model="ruleForm1.checkPass"
                  name="password"
                  auto-complete="off"
                  placeholder="密码"
                ></el-input>
              </el-form-item>
              <el-form-item class="log-opr clearfix">
                <el-checkbox v-model="checked" checked class="remember f_l">记住密码</el-checkbox>
                <a href="https://account.shopex.cn/forget?" target="_blank" class="forget-pwd"
                  >忘记密码</a
                >
              </el-form-item>
              <el-form-item style="width: 100%">
                <el-button
                  type="primary"
                  style="width: 100%"
                  @click.native.prevent="handleSubmit"
                  :loading="logining"
                  :disabled="submitDisabled"
                  >登录</el-button
                >
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane
            v-if="system_mode === 'group'"
            name="localadmin"
            label="管理员登录(独立账号)"
          >
            <div class="log-img"></div>
            <el-form
              :model="ruleForm1"
              :rules="rules1"
              ref="ruleForm1"
              label-position="left"
              label-width="0px"
              class="login-log-container"
            >
              <h3 class="title">
                <a href="http://yyk.shopex.cn/signup" target="_blank" class="signup">免费注册</a>
              </h3>
              <el-form-item prop="account">
                <el-input
                  type="text"
                  v-model="ruleForm1.account"
                  name="account"
                  auto-complete="off"
                  placeholder="请输入手机号"
                ></el-input>
              </el-form-item>
              <el-form-item prop="checkPass">
                <el-input
                  type="password"
                  v-model="ruleForm1.checkPass"
                  name="password"
                  auto-complete="off"
                  placeholder="密码"
                ></el-input>
              </el-form-item>
              <el-form-item class="log-opr clearfix">
                <el-checkbox v-model="checked" checked class="remember f_l">记住密码</el-checkbox>
                <a href="https://account.shopex.cn/forget?" target="_blank" class="forget-pwd"
                  >忘记密码</a
                >
              </el-form-item>
              <el-form-item style="width: 100%">
                <el-button
                  type="primary"
                  style="width: 100%"
                  @click.native.prevent="handleSubmit"
                  :loading="logining"
                  :disabled="submitDisabled"
                  >登录</el-button
                >
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane name="staff" label="员工账号登录">
            <div class="log-img"></div>
            <el-form
              :model="ruleForm1"
              :rules="rules1"
              ref="ruleForm1"
              label-position="left"
              label-width="0px"
              class="login-log-container"
            >
              <h3 class="title"></h3>
              <el-form-item prop="account">
                <el-input
                  type="text"
                  v-model="ruleForm1.account"
                  name="account"
                  auto-complete="off"
                  placeholder="手机号码"
                ></el-input>
              </el-form-item>
              <el-form-item prop="checkPass">
                <el-input
                  type="password"
                  v-model="ruleForm1.checkPass"
                  name="password"
                  auto-complete="off"
                  placeholder="密码"
                ></el-input>
              </el-form-item>
              <el-form-item v-if="system_is_saas == 'false'" class="log-opr clearfix title">
                忘记密码，请联系管理员后台重置
              </el-form-item>
              <el-form-item v-if="system_is_saas == 'true'" class="log-opr clearfix">
                <router-link to="/forget" class="forget-pwd">忘记密码</router-link>
              </el-form-item>
              <el-form-item style="width: 100%">
                <el-button
                  type="primary"
                  style="width: 100%"
                  @click.native.prevent="handleSubmit"
                  :loading="logining"
                  :disabled="submitDisabled"
                  >登录</el-button
                >
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="log-footer">
      <span>友情链接：</span>
      <a href="https://mp.weixin.qq.com/cgi-bin/loginpage?t=wxm2-login&lang=zh_CN" target="_blank"
        >微信公众平台</a
      >
      <span>|</span>
      <a href="https://www.alipay.com/" target="_blank">支付宝</a>
      <span>|</span>
      <a href="http://e.qq.com/ads" target="_blank">腾讯社交广告</a>
    </div>
    <div class="beian">
      <template v-if="BEIAN">
        ICP证：<a href="http://www.beian.miit.gov.cn">{{ BEIAN }}</a>
      </template>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { isMobile } from '@/utils/validate'
    const system = process.env.VUE_APP_PRODUCT_MODEL == 'standard' ? 'onex' : 'ecshopx'
    const brand = require(`@/assets/img/${system}/logo.jpg`)
    const login_bg = require(`@/assets/img/${system}/login_bg.jpg`)
// import fetch from '../utils/fetch'
// import { login, getAdminInfo, getAuthorizeUrl, getAuthorizeLogin } from '@/api'
export default {
  data() {
    const validateEmail = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error('请输入正确的合法手机号'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else {
        callback()
      }
    }
    // const system = process.env.VUE_APP_PRODUCT_MODEL == 'standard' ? 'onex' : 'ecshopx'
    // const brand = require(`@/assets/img/${system}/logo.jpg`)
    // const login_bg = require(`@/assets/img/${system}/login_bg.jpg`)
    return {
      isAuto: false,
      isIframe: false,
      autoSrc: '',
      brand,
      login_bg,
      logining: false,
      ruleForm1: {
        account: '',
        checkPass: '',
        loginType: 'admin'
      },
      rules1: {
        account: [{ required: true, trigger: 'blur', validator: validateEmail }],
        checkPass: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      checked: true,
      submitDisabled: false,
      ifWindow: null,
      bool: false
    }
  },
  mounted() {
    if (this.system_is_saas == 'true') {
      this.saasLogin()
    }
    this.$store.dispatch('setLoginType', 'default')
    // this.brand = require('@/assets/img/' + this.companyBrandImg + '/logo.svg')
    // this.login_bg = require('@/assets/img/' + this.companyBrandImg + '/login_bg.jpg')
  },
  methods: {
    ...mapMutations(['SET_TOKEN', 'SET_TOKEN_EXP', 'SET_USERINFO', 'SET_LOGIN_TYPE']),
    async saasLogin() {
      let { code } = this.$route.query
      if (code) {
        let obj = {
          code: code,
          logintype: 'oauthadmin'
        }
        this.isAuto = true
        try {
          const loginRes = await this.$api.login.getAuthorizeLogin(obj)
          const { token } = loginRes.data.data
          if(token) {
            this.loginSuccess(token)
          } else {
            this.submitDisabled = false
            this.$message({
              message: '登录失败，请联系管理员',
              type: 'error',
              duration: 3 * 1000
            })
          }
          // this.setTokenAndGetRoute(loginRes.data.data.token)
        } catch(e) {
          setTimeout(() => {
            window.location.href = `${window.location.origin}/login`
          }, 1500)
        }
      } else {
        const res = await this.$api.login.getAuthorizeUrl()
        this.autoSrc = res.data.data.url
        this.bool = true
      }
    },

    tabChange(e) {
      this.ruleForm1.loginType = e.name
      this.ruleForm1.account = ''
      this.ruleForm1.checkPass = ''
    },

    handleSubmit() {
      this.$refs.ruleForm1.validate(async (valid) => {
        if (valid) {
          this.loading = true
          this.submitDisabled = true
          var params = {
            username: this.ruleForm1.account,
            password: this.ruleForm1.checkPass,
            logintype: this.ruleForm1.loginType
          }
          try {
            const res = await this.$api.auth.login(params)
            const { token } = res.data.data
            if(token) {
              this.loginSuccess(token)
            } else {
              this.submitDisabled = false
              this.$message({
                message: '登录失败，请联系管理员',
                type: 'error',
                duration: 3 * 1000
              })
            }
          } catch (e) {
            this.submitDisabled = false
          }
        } else {
          this.submitDisabled = false
          return false
        }
      })
    },

    async loginSuccess(token) {
      this.SET_TOKEN({ token })
      this.SET_TOKEN_EXP({ exp: new Date().getTime() })
      this.$message({
        message: '登录成功',
        type: 'success'
      })
      const userInfo = await this.$api.login.getAdminInfo()
      this.loading = false
      this.SET_USERINFO(userInfo.data.data)
      this.SET_LOGIN_TYPE({ loginType: 'normal' })
      window.location.href = '/'
    }



    // async setTokenAndGetRoute(token) {
    //   this.$store.dispatch('setToken', token)
    //   this.loading = false
    //   const res = await this.$api.auth.getPermission()

    //   fetch({ url: '/permission', method: 'get' }).then((res) => {
    //     if (res.data.data) {
    //       const url = this.path_prefixes
    //         ? res.data.data[0]['url'] == '/'
    //           ? `/${this.path_prefixes}`
    //           : `${this.path_prefixes}${res.data.data[0]['url']}`
    //         : res.data.data[0]['url']
    //       getAdminInfo().then((info) => {
    //         // console.log(info.data.data.logintype)
    //         // return
    //         const _self = this
    //         this.$message({
    //           message: '登录成功',
    //           type: 'success',
    //           duration: 2 * 1000,
    //           onClose() {
    //             _self.$store.dispatch('setUser', info.data.data)
    //             _self.$store.dispatch('setLoginType', info.data.data.logintype)
    //             _self.$router.push({ path: url })
    //             _self.$router.go(0)
    //           }
    //         })
    //       })
    //       this.$store.dispatch('setMenu', res.data.data)
    //     } else {
    //       this.$message({
    //         message: '当前账号没有权限，请联系管理员',
    //         type: 'error',
    //         duration: 3 * 1000
    //       })
    //       this.submitDisabled = false
    //     }
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
body {
  background: #eaeaea;
}
.log-header {
  padding: 20px 0;
  background: #fff;
}
.brand {
  display: inline-block;
  width: 150px;
  vertical-align: middle;
}
.brand img {
  width: 100%;
  height: auto;
}
.log-welcome {
  display: inline-block;
  padding-left: 24px;
  margin-left: 24px;
  border-left: 1px solid #efefef;
  vertical-align: middle;
}
.log-body {
  padding: 118px 0;
  // background: url(./assets/img/login_bg.jpg) no-repeat center center;
  background-size: cover;
}
.log-img {
  float: left;
  width: 360px;
  padding-top: 5px;
  padding-left: 50px;
}
.log-img img {
  width: 100%;
  height: auto;
}
.log-container {
  width: 900px;
  margin: 0 auto;
}
.log-container::after {
  display: table;
  clear: both;
  content: '';
}
.login-log-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02)*/
  float: right;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  width: 290px;
  padding: 0px 35px 15px 35px;
  background: #fff;
  //border: 1px solid #eaeaea;
  .title {
    margin: 0px auto 35px auto;
    text-align: center;
    color: #505458;
    position: relative;
    font-size: 18px;
  }
  .remember {
    // margin: 0px 0px 35px 0px;
    float: left;
  }
  .log-opr {
    margin-bottom: 10px;
  }
  .signup {
    color: #ff5000;
    font-size: 14px;
    position: absolute;
    right: 0;
    line-height: 27px;
    &:hover {
      text-decoration: underline;
    }
  }
  .forget-pwd {
    float: right;
    &:hover {
      text-decoration: underline;
    }
  }
}
.el-form-item {
  margin-bottom: 30px;
}
.log-footer {
  color: #999;
  text-align: center;
  padding: 30px 0 10px 0;
  a {
    color: #999;
    margin: 0 5px;
    &:hover {
      color: #ff5000;
    }
  }
}
.login-type-tab {
  float: right;
  .login-type-tab-iframe {
    width: 100%;
    height: 320px;
  }
}
.beian {
  padding-bottom: 30px;
  text-align: center;
  font-size: 12px;
}
</style>
<style lang="scss">
.log-body {
  .el-input {
    .el-input__inner {
      height: 38px;
    }
  }
}
</style>
