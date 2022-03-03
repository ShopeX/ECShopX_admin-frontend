<template>
  <div>
    <div class="log-header">
      <div class="log-container">
        <div class="brand">
          <img
            :src="brand"
            alt=""
          >
        </div>
        <div class="log-welcome">
          欢迎登录
        </div>
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
          value="admin"
          style="width: 400px"
          class="login-type-tab"
          @tab-click="tabChange"
        >
          <el-tab-pane
            v-if="system_is_saas == 'true'"
            name="admin"
            label="管理员登录(shopexid)"
          >
            <div v-loading="isAuto">
              <iframe
                id="iframe"
                ref="iframe"
                :src="autoSrc"
                frameborder="0"
                class="login-type-tab-iframe"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane
            v-else-if="system_mode !== 'group'"
            name="admin"
            label="管理员登录(shopexid)"
          >
            <div class="log-img" />
            <el-form
              ref="ruleForm1"
              :model="ruleForm1"
              :rules="rules1"
              label-position="left"
              label-width="0px"
              class="login-log-container"
            >
              <!-- <h3 class="title">
                <a href="http://yyk.shopex.cn/signup" target="_blank" class="signup">免费注册</a>
              </h3> -->
              <el-form-item prop="account">
                <el-input
                  v-model="ruleForm1.account"
                  type="text"
                  name="account"
                  auto-complete="off"
                  placeholder="请输入手机号"
                />
              </el-form-item>
              <el-form-item prop="checkPass">
                <el-input
                  v-model="ruleForm1.checkPass"
                  type="password"
                  name="password"
                  auto-complete="off"
                  placeholder="密码"
                />
              </el-form-item>
              <el-form-item class="log-opr clearfix">
                <el-checkbox
                  v-model="checked"
                  checked
                  class="remember f_l"
                >
                  记住密码
                </el-checkbox>
                <a
                  href="https://account.shopex.cn/forget?"
                  target="_blank"
                  class="forget-pwd"
                >忘记密码</a>
              </el-form-item>
              <el-form-item style="width: 100%">
                <el-button
                  type="primary"
                  style="width: 100%"
                  :loading="logining"
                  :disabled="submitDisabled"
                  @click.native.prevent="handleSubmit1"
                >
                  登录
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane
            v-if="system_mode === 'group'"
            name="localadmin"
            label="管理员登录(独立账号)"
          >
            <div class="log-img" />
            <el-form
              ref="ruleForm1"
              :model="ruleForm1"
              :rules="rules1"
              label-position="left"
              label-width="0px"
              class="login-log-container"
            >
              <!-- <h3 class="title">
                <a href="http://yyk.shopex.cn/signup" target="_blank" class="signup">免费注册</a>
              </h3> -->
              <el-form-item prop="account">
                <el-input
                  v-model="ruleForm1.account"
                  type="text"
                  name="account"
                  auto-complete="off"
                  placeholder="请输入手机号"
                />
              </el-form-item>
              <el-form-item prop="checkPass">
                <el-input
                  v-model="ruleForm1.checkPass"
                  type="password"
                  name="password"
                  auto-complete="off"
                  placeholder="密码"
                />
              </el-form-item>
              <el-form-item class="log-opr clearfix">
                <el-checkbox
                  v-model="checked"
                  checked
                  class="remember f_l"
                >
                  记住密码
                </el-checkbox>
                <a
                  href="https://account.shopex.cn/forget?"
                  target="_blank"
                  class="forget-pwd"
                >忘记密码</a>
              </el-form-item>
              <el-form-item style="width: 100%">
                <el-button
                  type="primary"
                  style="width: 100%"
                  :loading="logining"
                  :disabled="submitDisabled"
                  @click.native.prevent="handleSubmit1"
                >
                  登录
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane
            name="staff"
            label="员工账号登录"
          >
            <div class="log-img" />
            <el-form
              ref="ruleForm1"
              :model="ruleForm1"
              :rules="rules1"
              label-position="left"
              label-width="0px"
              class="login-log-container"
            >
              <h3 class="title" />
              <el-form-item prop="account">
                <el-input
                  v-model="ruleForm1.account"
                  type="text"
                  name="account"
                  auto-complete="off"
                  placeholder="手机号码"
                />
              </el-form-item>
              <el-form-item prop="checkPass">
                <el-input
                  v-model="ruleForm1.checkPass"
                  type="password"
                  name="password"
                  auto-complete="off"
                  placeholder="密码"
                />
              </el-form-item>
              <el-form-item
                v-if="system_is_saas == 'false'"
                class="log-opr clearfix title"
              >
                忘记密码，请联系管理员后台重置
              </el-form-item>
              <el-form-item
                v-if="system_is_saas == 'true'"
                class="log-opr clearfix"
              >
                <router-link
                  to="/forget"
                  class="forget-pwd"
                >
                  忘记密码
                </router-link>
              </el-form-item>
              <el-form-item style="width: 100%">
                <el-button
                  type="primary"
                  style="width: 100%"
                  :loading="logining"
                  :disabled="submitDisabled"
                  @click.native.prevent="handleSubmit1"
                >
                  登录
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="log-footer">
      <span>友情链接：</span>
      <a
        href="https://www.shopex.cn"
        target="_blank"
      >商派</a>
      <span>|</span>
      <a
        href="https://mp.weixin.qq.com"
        target="_blank"
      >微信公众平台</a>
      <span>|</span>
      <a
        href="https://open.weixin.qq.com"
        target="_blank"
      >微信开放平台</a>
    </div>

    <div class="beian">
      <template v-if="BEIAN">
        ICP证：<a href="http://www.beian.miit.gov.cn">{{ BEIAN }}</a>
      </template>
    </div>
  </div>
</template>

<script>
import { isMobile } from '../utils/validate'
import fetch from '../utils/fetch'
import { login, getAdminInfo, getAuthorizeUrl, getAuthorizeLogin } from '../api/login'
import loadRouters from '../router/loadRouters'
export default {
  data () {
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
    return {
      isAuto: false,
      isIframe: false,
      autoSrc: '',
      brand: '',
      login_bg: '',
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
  watch: {},
  mounted () {
    console.log(this.system_is_saas, '$this.system_is_saas')
    // this.ifWindow= this.$refs.iframe.contentWindow

    if (this.system_is_saas == 'true') {
      let { code } = this.$route.query
      if (code) {
        let obj = {
          code: code,
          logintype: 'oauthadmin'
        }
        this.isAuto = true
        getAuthorizeLogin(obj)
          .then((res) => {
            this.setTokenAndGetRoute(res.data.data.token)
          })
          .catch((err) => {
            setTimeout(() => {
              window.location.href = `${window.location.origin}/login`
            }, 1500)
          })
      } else {
        getAuthorizeUrl().then((res) => {
          this.autoSrc = res.data.data.url
          this.bool = true
        })
      }
    }
    this.$store.dispatch('setLoginType', 'default')

    this.brand = require('@/assets/img/' + this.companyBrandImg + '/logo2.jpg')
    this.login_bg = require('@/assets/img/' + this.companyBrandImg + '/login_bg.jpg')
  },
  methods: {
    tabChange (e) {
      this.ruleForm1.loginType = e.name
      this.ruleForm1.account = ''
      this.ruleForm1.checkPass = ''
    },
    handleSubmit1 () {
      this.$refs.ruleForm1.validate((valid) => {
        if (valid) {
          this.loading = true
          this.submitDisabled = true
          var params = {
            username: this.ruleForm1.account,
            password: this.ruleForm1.checkPass,
            logintype: this.ruleForm1.loginType
          }
          login(params)
            .then((response) => {
              this.setTokenAndGetRoute(response.data.data.token)
              this.loading = false
            })
            .catch((error) => {
              this.submitDisabled = false
            })
        } else {
          this.submitDisabled = false
          return false
        }
      })
    },
    setTokenAndGetRoute (token) {
      this.$store.dispatch('setToken', token)
      this.loading = false
      fetch({ url: '/permission', method: 'get' }).then((res) => {
        if (res.data.data) {
          // const url = this.path_prefixes ? (res.data.data[0]['url'] == '/' ? `/${this.path_prefixes}` : `${this.path_prefixes}${res.data.data[0]['url']}`) : res.data.data[0]['url']
          let url = ''
          const _menu = res.data.data
          if (_menu[0].children) {
            if (_menu[0].children[0].children) {
              url = _menu[0].children[0].children[0].url
            } else {
              url = _menu[0].children[0].url
            }
          } else {
            url = _menu[0].url
          }

          getAdminInfo().then((info) => {
            // console.log(info.data.data.logintype)
            // return
            const _self = this
            this.$message({
              message: '登录成功',
              type: 'success',
              duration: 2 * 1000,
              onClose () {
                _self.$store.dispatch('setUser', info.data.data)
                _self.$store.dispatch('setLoginType', info.data.data.logintype)
                _self.$router.push({ path: url })
                _self.$router.go(0)
              }
            })
          })
          console.log('----setmenu----', res.data.data)
          this.$store.dispatch('setMenu', res.data.data)
        } else {
          this.$message({
            message: '当前账号没有权限，请联系管理员',
            type: 'error',
            duration: 3 * 1000
          })
          this.submitDisabled = false
        }
      })
    }
    // iframeLoad(){
    //    if(this.ifWindow.location.href.indexOf('code')!=-1){
    //       this.ifWindow.top.location.href=`${this.ifWindow.location.href}&Bl=1`
    //       this.isIframe=true
    //     }
    //   // .contentWindow.location.href
    //   // iframe.onload = function () {
    //   //  let aaa= iframe.contentWindow
    //   //  let aaa= window.parent.document.getElementById('iframe').contentWindow
    //     // console.log(this,'this.ifWindow');
    //     // console.log(window.parent,'window.parent.');
    //     // window.parent.location.href='https://ecshopx2.shopex123.com/login?code=cx34dd5pcv5trdo7at6f'
    //     // window.parent.location.href
    //     // console.log('页面跳转',window.parent.location.href,_this.ifWindow)
    //     // window.location.href =
    //   // }

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
