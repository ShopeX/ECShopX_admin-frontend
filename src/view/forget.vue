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
        <div class="log-welcome">找回密码</div>
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
          <div class="log-img" />
          <el-form
            ref="ruleForm"
            :model="ruleForm"
            :rules="rules"
            label-position="left"
            label-width="0px"
            class="login-log-container"
          >
            <h3 class="title">
              <router-link
                :to="path_prefixes ? '/' + path_prefixes + '/login' : '/login'"
                class="signup"
              >
                返回登录
              </router-link>
            </h3>
            <el-form-item prop="account">
              <el-input
                v-model="ruleForm.account"
                type="text"
                name="account"
                auto-complete="new-account"
                placeholder="请输入手机号"
              />
            </el-form-item>
            <el-form-item class="imageyzm" prop="yzm">
              <el-input
                v-model="yzm"
                type="text"
                name="yzm"
                auto-complete="new-yzm"
                placeholder="图片验证码"
              >
                <img
                  slot="append"
                  :src="yzmcode"
                  style="width: auto; height: 38px; cursor: pointer"
                  @click="getImageCode"
                >
              </el-input>
            </el-form-item>
            <el-form-item class="smscode" prop="code">
              <el-input
                v-model="ruleForm.code"
                type="text"
                name="code"
                autocomplete="new-code"
                placeholder="请输入手机6位验证码"
              >
                <el-button slot="append" :disabled="yzmbutton" @click="sendSmsCode">
                  {{ yzmcontent }}
                </el-button>
              </el-input>
            </el-form-item>
            <el-form-item prop="newpassword">
              <el-input
                v-model="ruleForm.newpassword"
                type="password"
                name="newpassword"
                auto-complete="new-password"
                placeholder="密码"
                show-password
              />
            </el-form-item>
            <el-form-item style="width: 100%">
              <el-button
                type="primary"
                style="width: 100%"
                :loading="logining"
                :disabled="submitDisabled"
                @click.native.prevent="handleResetPassword"
              >
                修改密码
              </el-button>
            </el-form-item>
          </el-form>
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
import { getImageCode, getSmsCode, resetPassword } from '../api/login'

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
    const validateCode = (rule, value, callback) => {
      if (value.length != 6) {
        callback(new Error('请输入手机6位验证码'))
      } else {
        callback()
      }
    }
    return {
      brand: '',
      login_bg: '',
      logining: false,
      yzmcode: '',
      yzm: '',
      yzmbutton: false,
      yzmTotalTime: 60,
      yzmcontent: '发送验证码',
      ruleForm: {
        account: '',
        code: '',
        newpassword: ''
      },
      smsData: {
        token: '',
        yzm: '',
        mobile: ''
      },
      rules: {
        account: [{ required: true, trigger: 'blur', validator: validateEmail }],
        newpassword: [{ required: true, trigger: 'blur', validator: validatePass }],
        code: [{ required: true, trigger: 'blur', validator: validateCode }]
      },
      checked: true,
      submitDisabled: false
    }
  },
  watch: {
    yzm(val) {
      if (val.length == 4) {
        this.smsData.yzm = val
        this.smsData.mobile = this.ruleForm.account
      }
    }
  },
  mounted() {
    console.log('-----5')
    this.$store.dispatch('setLoginType', 'staff')
    this.brand = require('@/assets/img/' + this.companyBrandImg + '/logo.svg')
    this.login_bg = require('@/assets/img/' + this.companyBrandImg + '/login_bg.jpg')
    this.getImageCode()
  },
  methods: {
    getSmsCode() {
      getSmsCode(this.smsData)
        .then(response => {
          if (response.data.data.status == true) {
            Message({ message: '验证码发送成功', type: 'success', duration: 2 * 1000 })
            this.countDown()
          } else {
            Message({ message: '验证码发送失败，请重试', type: 'error', duration: 2 * 1000 })
            this.yzmbutton = false
          }
        })
        .catch(error => {
          this.yzmbutton = false
        })
    },
    getImageCode() {
      getImageCode().then(response => {
        this.yzmcode = response.data.data.imageData
        this.smsData.token = response.data.data.imageToken
      })
    },
    handleResetPassword() {
      const loginPath = this.path_prefixes ? `/${this.path_prefixes}/login` : '/login'
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          resetPassword(this.ruleForm).then(response => {
            Message({ message: response.data.data.message, type: 'success', duration: 2 * 1000 })
            this.$router.push({ path: loginPath })
          })
        } else {
          return false
        }
      })
    },
    sendSmsCode() {
      if (this.yzm.length == 4) {
        this.yzmbutton = true
        this.getSmsCode()
      }
    },
    countDown() {
      if (!this.yzmbutton) return //改动的是这两行代码
      this.yzmcontent = this.yzmTotalTime + 's后重新发送'
      let clock = window.setInterval(() => {
        this.yzmTotalTime--
        this.yzmcontent = this.yzmTotalTime + 's后重新发送'
        if (this.yzmTotalTime < 0) {
          window.clearInterval(clock)
          this.yzmcontent = '重新发送验证码'
          this.yzmTotalTime = 60
          this.yzmbutton = false //这里重新开启
        }
      }, 1000)
    }
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
  padding: 30px 0;
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

.imageyzm .el-input-group__append {
  background: initial;
  padding: initial;
  border: none;
  color: initial;
}

.smscode .el-button.is-disabled,
.el-button.is-disabled:focus,
.el-button.is-disabled:hover {
  color: initial;
  cursor: not-allowed;
  background-image: initial;
  background-color: initial;
  border-color: #dcdfe6;
}
</style>
