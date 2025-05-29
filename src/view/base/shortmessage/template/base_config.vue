<template>
  <div class="alisms_baseConfig">
    <el-form label-width="200px" :model="form">
      <section class="card">
        <nav>
          <el-form-item label="启用:" label-width="60px">
            <el-switch
              v-model="info.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              style="margin-left: 40px; margin-right: 20px"
              @change="fnSwitch"
            />
            <span v-if="info.status">已启用</span>
            <span v-else>未启用</span>
          </el-form-item>
        </nav>
        <div class="content">
          <div class="title">基础配置</div>
          <div class="info">
            <div class="left">
              <el-form-item label="用户名：">
                <span>{{ form.username }}</span>
              </el-form-item>
              <el-form-item label="账号：">
                <span>{{ form.account }}</span>
              </el-form-item>
              <el-form-item label="密码：">
                <span>{{ form.password }}</span>
              </el-form-item>
              <el-form-item label="短信发送密码：">
                <span>{{ form.sms_password }}</span>
              </el-form-item>
            </div>
            <div class="right">
              <el-button type="primary" class="btn" plain @click="fnEdit"> 编辑 </el-button>
            </div>
          </div>
        </div>
      </section>
      <section v-for="item in cardData" :key="item.title" class="card">
        <div class="content">
          <div class="title">
            {{ item.title }}
          </div>
          <div class="info">
            <div class="left">
              <el-form-item :label="item.info">
                <span>{{ info[item.label] || 0 }}</span>
              </el-form-item>
            </div>
            <div class="right">
              <el-button type="primary" class="btn" plain @click="fnGo(item.tabName)">
                {{ item.btn }}
              </el-button>
            </div>
          </div>
        </div>
      </section>
    </el-form>
    <!-- 添加短信 -->

    <el-dialog
      title="标品短信服务基础配置"
      :visible="visible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="140px" class="form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="form.account" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            placeholder="请输入密码"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="短信发送密码" prop="sms_password">
          <el-input
            v-model="form.sms_password"
            placeholder="请输入短信发送密码"
            type="password"
            show-password
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="fnPass('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getSmsConfig, setSmsConfig, setAlisms } from '@/api/tempSms.js'
import { requiredRules } from '@/utils/validate'

export default {
  data() {
    return {
      form: {
        username: '',
        account: '',
        password: '',
        sms_password: ''
      },
      cardData: [
        {
          title: '自动发送短信',
          info: '自动发送短信场景 (个)：',
          btn: '管理短信',
          label: 'scene_num',
          tabName: 'send_sms'
        },
        {
          title: '短信签名',
          info: '已有短信签名 (个)：',
          btn: '管理签名',
          label: 'sign_num',
          tabName: 'sms_signatures'
        },
        {
          title: '短信模板',
          info: '已有短信模板 (个)：',
          btn: '管理模板',
          label: 'template_num',
          tabName: 'sms_template'
        }
      ],
      info: {
        scene_num: '',
        sign_num: '',
        status: '',
        template_num: ''
      },
      visible: false,
      rules: {
        username: [requiredRules('username', 'change')],
        account: [requiredRules('account'), 'change'],
        sms_password: [requiredRules('sms_password'), 'change'],
        password: [requiredRules('password'), 'change']
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const result = await getSmsConfig()
      const {
        username,
        account,
        sms_password,
        password,
        template_num,
        status,
        sign_num,
        scene_num
      } = result.data.data
      this.info = { scene_num, sign_num, status, template_num }
      this.form = { username, account, password, sms_password }
    },
    fnEdit() {
      this.visible = true
    },
    fnPass(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const result = await setSmsConfig(this.form)
          this.$message.success('成功')
          this.handleClose()
          this.init()
        }
      })
    },
    async fnSwitch(status) {
      console.log(status)
      let message = '关闭短信后，商派短信将会自动开启。'
      if (status) {
        message = '开启短信后，商派短信将会自动关闭。'
        this.$confirm(message, '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            const result = await setAlisms({ status })
            this.$message.success('成功')
            this.init()
          })
          .catch(() => {
            this.info.status = !status
          })
      } else {
        this.$confirm(message, '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            const result = await setAlisms({ status })
            this.$message.success('成功')
            this.init()
          })
          .catch(() => {
            this.info.status = !status
          })
      }
    },
    handleClose() {
      this.visible = false
      this.init()
    },
    fnGo(tabName) {
      console.log(`setting/datamessage/tmp_sms/${tabName}`)

      this.$router.push({ path: `/setting/datamessage/tmp_sms/${tabName}` })
    }
  }
}
</script>

<style lang="scss" scoped>
.alisms_baseConfig {
  padding-bottom: 50px;
  .card {
    padding: 24px;
    margin: 20px 3px 20px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    // box-shadow:-5px 0px 0px #333;
    nav {
      margin-bottom: 20px;
    }
    .content {
      .title {
        position: relative;
        color: #000;
        &::before {
          content: '';
          display: block;
          position: absolute;
          width: 5px;
          left: -8px;
          top: 4px;
          bottom: 4px;
          background: #1480e3;
        }
      }
      .info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .right {
          .btn {
            margin-right: 50px;
            padding: 8px 30px;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.alisms_baseConfig {
  .form {
    width: 85%;
    .el-form-item {
      margin-bottom: 22px;
    }
  }
  .el-form-item__label {
    color: #000;
  }
  .el-form-item {
    margin-bottom: 4px;
  }
  .el-dialog {
    min-width: 600px;
    .el-dialog__body {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
