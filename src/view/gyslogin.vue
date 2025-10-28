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
  <div>
    <div class="log-header">
      <div class="log-container">
        <div class="brand">
          <img :src="brand" alt="">
        </div>
        <div class="log-welcome">欢迎登录供应商端</div>
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
        <el-tabs type="border-card" value="admin" style="width: 400px" class="login-type-tab">
          <el-tab-pane name="admin" label="应商端账号登录">
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
              <el-form-item class="log-opr clearfix title">
                忘记密码，请联系管理员后台重置
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
      <a href="https://www.shopex.cn" target="_blank">商派</a>
      <span>|</span>
      <a href="https://mp.weixin.qq.com" target="_blank">微信公众平台</a>
      <span>|</span>
      <a href="https://open.weixin.qq.com" target="_blank">微信开放平台</a>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { isMobile } from '../utils/validate'
import { fetch } from './request'
import { login, getAdminInfo } from '../api/login'
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
    return {
      brand: '',
      login_bg: '',
      logining: false,
      ruleForm1: {
        account: '',
        checkPass: '',
        loginType: 'distributor'
      },
      rules1: {
        account: [{ required: true, trigger: 'blur', validator: validateEmail }],
        checkPass: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      checked: true,
      submitDisabled: false
    }
  },
  mounted() {
    console.log('-----4')
    this.$store.dispatch('setLoginType', 'distributor')
    this.brand = require('@/assets/img/yyk/logo1.svg')
    this.login_bg = require('@/assets/img/yyk/login_bg.jpg')
  },
  methods: {
    handleSubmit1() {
      this.$store.dispatch('setLoginType', 'distributor')
      setTimeout(function () {}, 200)

      const _self = this
      this.$refs.ruleForm1.validate(valid => {
        if (valid) {
          this.loading = true
          this.submitDisabled = true
          var params = {
            username: this.ruleForm1.account,
            password: this.ruleForm1.checkPass,
            logintype: 'distributor'
          }
          login(params)
            .then(response => {
              this.$store.dispatch('setToken', response.data.data.token)

              this.loading = false
              fetch({ url: '/permission', method: 'get' }).then(res => {
                if (res.data.data) {
                  this.$store.dispatch('setMenu', res.data.data)
                  getAdminInfo().then(info => {
                    this.$message({
                      message: '登录成功',
                      type: 'success',
                      duration: 2 * 1000,
                      onClose() {
                        if (res.data.data.length == 1) {
                          _self.$router.push({ path: res.data.data[0]['url'] })
                          _self.$router.go(0)
                        } else {
                          _self.$store.dispatch('setUser', info.data.data)
                          _self.$router.push({
                            path: _self.path_prefixes
                              ? `/${_self.path_prefixes}/shopadmin/shoplist`
                              : '/shopadmin/shoplist'
                          })
                        }
                      }
                    })
                  })
                } else {
                  this.$message({
                    message: '当前账号没有权限，请联系管理员',
                    type: 'error',
                    duration: 3 * 1000
                  })
                  this.submitDisabled = false
                }
              })

              this.$router.push({
                path: this.path_prefixes
                  ? `/${this.path_prefixes}/shopadmin/shoplist`
                  : '/shopadmin/shoplist'
              })
            })
            .catch(() => {
              Message({ message: '用户名或密码错误', type: 'error', duration: 3 * 1000 })
              this.submitDisabled = false
            })
        } else {
          this.submitDisabled = false
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
body {
  background: #fff;
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
  margin-top: 30px;
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
