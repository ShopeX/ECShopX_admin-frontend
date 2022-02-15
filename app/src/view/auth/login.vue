<template>
  <div class="login_page">
    <div class="wrap">
      <section
        class="bg"
        :style="{
          backgroundImage: 'url(' + login_bg + ')',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
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
          label-width="50px"
          class="form"
        >
          <div class="box">
            <h3>平台管理中心</h3>
            <el-tabs v-model="activeName" class="tab">
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
              <el-form-item style="margin-top: 40px">
                <!-- <div class="btn" @click="fnLogin('form')">登录</div> -->
                <loadingBtn class="btn" @clickHandle="fnLogin('form')" ref="loadingBtn" />
              </el-form-item>
            </el-tabs>
          </div>
        </el-form>
      </section>
    </div>
  </div>
</template>

<script>
const login_bg = require('@/assets/img/cover/normal.png')
import { requiredRules, MinRules } from '@/utils/validate'
import loadingBtn from '@/components/loading-btn'
import { mapMutations } from 'vuex'
export default {
  components: {
    loadingBtn
  },
  data() {
    return {
      login_bg,
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
    this.$store.dispatch('setLoginType', 'default')
  },
  destroyed() {
    window.removeEventListener('resize', this.fnSize)
  },
  methods: {
    ...mapMutations(['SET_TOKEN', 'SET_TOKEN_EXP', 'SET_USERINFO', 'SET_LOGIN_TYPE']),
    fnSize() {
      this.size = document.body.clientHeight
    },
    fnLogin(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let obj = {
            username: this.form.account,
            password: this.form.checkPass,
            logintype: this.loginType
          }
          try {
            const res = await this.$api.auth.login(obj)
            const { token } = res.data.data
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
  }
}
</script>

<style lang="scss" scoped>
.login_page {
  .wrap {
    display: flex;
    width: 100vw;
    .bg {
      //   width: 55%;
      //   height: auto;
      //   min-height: 768px;
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
        min-width: 500px;
        max-width: 600px;
        padding: 50px;

        h3 {
          margin-bottom: 40px;
          font-size: 23px;
          color: #888888;
          text-align: center;
        }
        .tab {
          .btn {
            width: 100%;
            background: #cb060f;
            border-radius: 40px;
            text-align: center;
            color: #fff;
            cursor: pointer;
            border: none;
          }
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
  .el-tabs__item {
    color: #999;
    &:hover {
      color: #000;
    }
  }
  .el-tabs__item.is-active {
    color: #cb060f;
  }
  .el-tabs__active-bar {
    background-color: #cb060f;
  }
  .tab {
    .el-form-item__content {
      margin-left: 0px !important;
    }
  }
}
</style>