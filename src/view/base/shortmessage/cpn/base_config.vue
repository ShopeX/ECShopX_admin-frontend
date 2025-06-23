<template>
  <SpPage>
  <div class="alisms_baseConfig">
    <tips>
      <p>
        短信服务由阿里云提供，是广大企业客户快速触达手机用户所优选使用的通信能力，国内验证短信秒级触达，到达率最高可达99%。开始使用前您需要<a
          href="https://www.aliyun.com/product/sms?spm=a2c4g.11186623.0.0.659712cdoHMKdV"
          target="_blank"
        >前往阿里云购买服务。</a>
      </p>
    </tips>
    <el-form
      label-width="200px"
      :model="form"
    >
      <section class="card">
        <nav>
          <el-form-item
            label="启用:"
            label-width="60px"
          >
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
          <div class="title">
            基础配置
          </div>
          <div class="info">
            <div class="left">
              <el-form-item label="AccessKey ID：">
                <span>{{ form.accesskey_id }}</span>
              </el-form-item>
              <el-form-item label="AccessKey Secret：">
                <span>{{ form.accesskey_secret }}</span>
              </el-form-item>

              <a
                href="https://help.aliyun.com/document_detail/53045.html"
                target="_blank"
              >如何获取 AccessKey ID 和 AccessKey Secret。</a>
            </div>
            <div class="right">
              <el-button
                type="primary"
                class="btn"
                plain
                @click="fnEdit"
              >
                编辑
              </el-button>
            </div>
          </div>
        </div>
      </section>
      <section
        v-for="item in cardData"
        :key="item.title"
        class="card"
      >
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
              <el-button
                type="primary"
                class="btn"
                plain
                @click="fnGo(item.tabName)"
              >
                {{
                  item.btn
                }}
              </el-button>
            </div>
          </div>
        </div>
      </section>
    </el-form>
    <!-- 添加短信 -->

    <el-dialog
      title="阿里云短信服务基础配置"
      :visible="visible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="140px"
        class="form"
      >
        <el-form-item
          label="AccessKey ID"
          prop="accesskey_id"
        >
          <el-input
            v-model="form.accesskey_id"
            placeholder="阿里云RAM用户的 AccessKey ID"
          />
        </el-form-item>
        <el-form-item
          label="Accesskey Secret"
          prop="accesskey_secret"
        >
          <el-input
            v-model="form.accesskey_secret"
            placeholder="阿里云RAM用户的 Accesskey Secret"
          />
        </el-form-item>
        <a
          href="https://help.aliyun.com/document_detail/53045.html"
          target="_blank"
        >如何获取 AccessKey ID 和 AccessKey Secret。</a>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleClose">取 消</el-button>
        <el-button
          type="primary"
          @click="fnPass('form')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
  </SpPage>
</template>

<script>
import tips from '@/components/tips'
import { getSmsConfig, setSmsConfig, setAlisms } from '@/api/sms'
import { requiredRules } from '@/utils/validate'

export default {
  components: {
    tips
  },
  data () {
    return {
      form: {
        accesskey_id: '',
        accesskey_secret: ''
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
        accesskey_id: [requiredRules('Accesskey ID', 'change')],
        accesskey_secret: [requiredRules('Accesskey secret'), 'change']
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      const result = await getSmsConfig()
      const { accesskey_id, accesskey_secret, template_num, status, sign_num, scene_num } =
        result.data.data
      this.info = { scene_num, sign_num, status, template_num }
      this.form = { accesskey_id, accesskey_secret }
    },
    fnEdit () {
      this.visible = true
    },
    fnPass (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const result = await setSmsConfig(this.form)
          this.$message.success('成功')
          this.handleClose()
          this.init()
        }
      })
    },
    async fnSwitch (status) {
      let message = '关闭阿里云短信后，商派短信将会自动开启。'
      if (status) {
        message = '开启阿里云短信后，商派短信将会自动关闭。'
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
      console.log(status)
    },
    handleClose () {
      this.visible = false
      this.init()
    },
    fnGo (tabName) {
      this.$router.push({ path: `/setting/systemsetting/datamessage/ali_sms/${tabName}` })
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
