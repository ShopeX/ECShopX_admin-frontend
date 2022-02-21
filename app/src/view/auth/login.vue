<template>
  <div class="login_page">
    <div class="wrap">
      <section
        class="bg"
        :style="{
          backgroundImage: 'url(' + login_bg + ')',
          height: size + 'px',
          width: size + 'px'
        }"
      ></section>

      <section class="content">
        <el-form
          :model="form"
          :rules="rules"
          ref="form"
          label-position="left"
          label-width="100px"
          class="form"
        >
          <div class="box">
            <h3>{{ title }}</h3>
            <el-tabs v-model="activeName" class="tab" v-if="$route.meta.type == 'admin'">
              <el-tab-pane label="管理员账号登录" name="first">
                <el-form-item label="账户" prop="account">
                  <el-input v-model="form.account"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="checkPass">
                  <el-input type="password" v-model="form.checkPass"></el-input>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="员工账号登录" name="second">
                <el-form-item label="账户" prop="account">
                  <el-input v-model="form.account"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="checkPass">
                  <el-input type="password" v-model="form.checkPass"></el-input>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
            <div class="tab" v-else>
              <el-form-item label="账户" prop="account">
                <el-input v-model="form.account"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="checkPass">
                <el-input type="password" v-model="form.checkPass"></el-input>
              </el-form-item>
            </div>
            <el-form-item style="margin-top: 40px; margin-bottom: 10px" label-wdith="0px">
              <loadingBtn class="btn" @clickHandle="fnLogin('form')" ref="loadingBtn" text='登录'/>
            </el-form-item>
            <p v-if="loginType != 'admin'" class="tip">忘记密码，请联系管理员重置</p>
          </div>
        </el-form>
      </section>
    </div>
  </div>
</template>

<script>
const login_bg_admin = require(`@/assets/img/cover/normal.png`)
const login_bg_merchant = require(`@/assets/img/cover/merchant.png`)
const login_bg_shopadmin = require(`@/assets/img/cover/shopadmin.png`)

import { mapMutations } from 'vuex'
import { requiredRules, MinRules } from '@/utils/validate'
import loadingBtn from '@/components/loading-btn'

export default {
  components: {
    loadingBtn
  },
  data() {
    return {
      title: '平台管理中心',
      login_bg: login_bg_admin,
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
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.fnSize())
    this.init()
  },
  destroyed() {
    window.removeEventListener('resize', this.fnSize)
  },
  watch:{
    activeName(val){
      if (val=='second') {
        this.loginType = 'staff'
      }else{
         this.loginType = 'admin'
      }
    }
  },
  methods: {
    ...mapMutations(['SET_TOKEN', 'SET_TOKEN_EXP', 'SET_USERINFO', 'SET_LOGIN_TYPE']),
    init() {

      
      this.loginType = this.$route.meta.type
      console.log(this.loginType)

      switch (this.loginType) {
        case 'distributor':
          this.title = '店铺管理中心'
          this.login_bg = login_bg_shopadmin
          break
        case 'dealer':
          this.title = '经销商管理中心'
          this.login_bg = login_bg_merchant
          break
        case 'merchant':
          this.title = '商户管理中心'
          this.login_bg = login_bg_merchant
          break
      }


      this.$store.dispatch('setLoginType', this.loginType)
    },
    fnSize() {
      this.size = document.body.clientHeight
    },
    fnLogin(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const params = {
            username: this.form.account,
            password: this.form.checkPass,
            logintype: this.loginType
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
            this.$refs['loadingBtn'].closeLoading()
          }
        } else {
          this.$refs['loadingBtn'].closeLoading()
        }
      })
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
      } else if (this.loginType == 'marchant') {
        this.$router.push({ path: '/merchant' })
      } else {
        window.location.href = '/'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login_page {
  .wrap {
    display: flex;
    width: 100vw;
    .bg {
      background-size: cover;
      background-position: left;
      background-repeat: no-repeat;
    }
    .content {
      flex: 1;
      min-width: 500px;
      //   background: palegreen;
      position: relative;

      .box {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -60%);
        min-width: 300px;
        max-width: 600px;
        // padding: 50px;

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
          background: #cb060f;
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
  }
}
</style>

<style lang="scss">
.login_page {
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
  .el-form-item__label{
    color: #888;
  }
  .el-tabs__item {
    color: #999;
    font-size: 16px;
    // &:hover {
    //   color: #000;
    // }
  }
  .el-tabs__item.is-active {
    color: #cb060f;
  }
  .el-tabs__active-bar {
    background-color: #cb060f;
  }
  .el-form-item__content {
    margin-left: 0px !important;
  }
}
</style>