<template>
  <div class="page-workwechat">
    <el-card
      class="box-card"
      shadow="never"
    >
      <el-form
        :model="form"
        label-width="90px"
        class="demo-ruleForm"
      >
        <el-row>
          <el-col :span="14">
            <el-form-item
              class="first"
              label="企业ID"
            >
              <el-input
                v-model="form.corpid"
                type="age"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <p class="tips">
              <a
                href="https://work.weixin.qq.com/api/doc#90000/90135/90665/corpid"
                target="_blank"
              >您企业主体的认证ID、用于确认企业的唯一性</a>
            </p>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-tabs
      v-model="activeName"
      type="border-card"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="导购小程序"
        name="first"
      >
        <div class="list">
          <div class="title">
            小程序配置
          </div>
          <div class="formBox">
            <el-form
              ref="form"
              label-width="150px"
            >
              <el-card shadow="never">
                <el-form-item label="AppID">
                  <el-input
                    v-model="form.agents.app.appid"
                    style="width: 400px"
                  />
                  <span class="tips">
                    <a
                      href="http://"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      企业微信的小程序AppID，点击跳转说明
                    </a></span>
                </el-form-item>

                <el-form-item label="AgentId">
                  <el-input
                    v-model="form.agents.app.agent_id"
                    style="width: 400px"
                  />
                  <span class="tips">
                    <a
                      href="https://work.weixin.qq.com/api/doc#90000/90135/90665/agentid"
                      target="_blank"
                    >企业微信的小程序agent_id</a></span>
                </el-form-item>

                <el-form-item label="Secret">
                  <el-input
                    v-model="form.agents.app.secret"
                    style="width: 400px"
                  />
                  <span class="tips">
                    <a
                      href="https://work.weixin.qq.com/api/doc#90000/90135/90665/secret"
                      target="_blank"
                    >企业微信的小程序凭证密钥</a></span>
                </el-form-item>

                <el-form-item label="Token">
                  <el-input
                    v-model="form.agents.app.token"
                    style="width: 400px"
                  />
                </el-form-item>
                <el-form-item label="EncodingAESKey">
                  <el-input
                    v-model="form.agents.app.aes_key"
                    style="width: 400px"
                  />
                  <span
                    class="tips"
                  ><a
                    href="https://work.weixin.qq.com/api/doc#90000/90135/90930"
                    target="_blank"
                  >企业微信小程序的加密秘钥</a></span>
                </el-form-item>
              </el-card>
            </el-form>
          </div>
        </div>
        <div class="list">
          <div class="title">
            客户联系配置
          </div>
          <div class="formBox">
            <div class="introduce">
              <p>获取路径：</p>
              <p>1. 在企业微信管理后台 - 「应用管理」- 应用 - 下方的「自建应用」中找到云店小程序</p>
              <p>
                2.
                点击进入应用详情页，点击「Secret」后的「查看」按钮。该Secret会发送到当前登录的管理员账号的企业微信内，管理员在企业微信内复制获取，将获取到的Secret粘贴至此处。
              </p>
            </div>
            <el-form
              ref="form"
              label-width="150px"
            >
              <el-card shadow="never">
                <div class="borderBottom">
                  <el-form-item label="Secret">
                    <el-input
                      v-model="form.agents.customer.secret"
                      style="width: 600px"
                    />
                  </el-form-item>
                </div>
                <div class="introduce-Flex">
                  <div class="subtitle">
                    接受事件服务器配置：
                  </div>
                  <div class="content">
                    <p>设置路径：</p>
                    <p>
                      1. 在企业微信管理后台 - 「应用管理」- 应用 -
                      下方的「自建应用」中找到云店小程序
                    </p>
                    <p>
                      2. 点击进入应用详情页，找到「功能」中的「接收消息」，点击「设置 API
                      接收」，依次复制下方内容填写至对应输入框中。
                    </p>
                  </div>
                </div>

                <el-form-item label="URL">
                  <el-input
                    v-model="form.agents.customer.URL"
                    class="bg-gray"
                    disabled
                  />
                  <span
                    v-clipboard:copy="form.agents.customer.URL"
                    v-clipboard:success="onCopy"
                    class="btn"
                  >复制</span>
                </el-form-item>

                <el-form-item label="Token">
                  <el-input
                    v-model="form.agents.customer.token"
                    disabled
                    class="bg-gray"
                  />
                  <span
                    v-clipboard:copy="form.agents.customer.token"
                    v-clipboard:success="onCopy"
                    class="btn"
                  >复制</span>
                </el-form-item>

                <el-form-item label="EncodingAESKey">
                  <el-input
                    v-model="form.agents.customer.aes_key"
                    disabled
                    class="bg-gray"
                  />
                  <span
                    v-clipboard:copy="form.agents.customer.aes_key"
                    v-clipboard:success="onCopy"
                    class="btn"
                  >复制</span>
                </el-form-item>
              </el-card>
            </el-form>
          </div>
        </div>
        <div class="list">
          <div class="title">
            通讯录配置
          </div>
          <div class="formBox">
            <div class="introduce">
              <p>获取路径：</p>
              <p>1. 在企业微信管理后台 - 「应用管理」- 应用 - 下方的「自建应用」中找到店务工作台</p>
              <p>
                2.
                点击进入应用详情页，点击「Secret」后的「查看」按钮。该Secret会发送到当前登录的管理员账号的企业微信内，管理员在企业微信内复制获取，将获取到的Secret粘贴至此处。
              </p>
              <p>3. 点击同步。</p>
            </div>
            <el-form
              ref="form"
              label-width="150px"
            >
              <el-card shadow="never">
                <el-form-item label="Secret">
                  <el-input
                    v-model="form.agents.report.secret"
                    style="width: 400px"
                  />
                  <span class="tips">企业微信的小程序凭证秘钥</span>
                </el-form-item>
                <el-form-item label="Token">
                  <el-input
                    v-model="form.agents.report.token"
                    style="width: 400px"
                  />
                </el-form-item>
                <el-form-item label="EncodingAESKey">
                  <el-input
                    v-model="form.agents.report.aes_key"
                    style="width: 400px"
                  />

                  <span class="tips"> 企业微信小程序的加密密钥 </span>
                </el-form-item>
              </el-card>
            </el-form>
          </div>
        </div>
        <div class="page-btn">
          <el-button
            type="primary"
            @click="onSubmit"
          >
            保存
          </el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="店务自建应用"
        name="second"
      >
        <div class="list">
          <div class="title">
            通讯录配置
          </div>
          <div class="formBox">
            <div class="introduce">
              <p>获取路径：</p>
              <p>1. 在 企业微信管理后台 -「应用管理」-应用-下方的「自建应用」中找到店务工作台。</p>
              <p>2. 点击进入应用详情页，复制顶部「AgentID」至下方输入框。</p>
              <p>
                3.
                点击进入应用详情页，点击「Secret」后的「查看」按钮。该Secret会发送到当前登录的管理员账号的企业微信内，管理员在企业微信内复制获取，将获取到的Secret粘贴至下方输入框。
              </p>
            </div>
            <el-form
              ref="form"
              label-width="150px"
            >
              <el-card shadow="never">
                <el-form-item label="AgentID">
                  <el-input
                    v-model="form.agents.dianwu.agent_id"
                    style="width: 400px"
                  />
                  <span class="tips"> 企业微信的自建应用凭证 </span>
                </el-form-item>

                <el-form-item
                  label="Secret"
                  class="first"
                >
                  <el-input
                    v-model="form.agents.dianwu.secret"
                    style="width: 400px"
                  />
                  <span class="tips"> 企业微信的自建应用密钥 </span>
                </el-form-item>
              </el-card>
            </el-form>
          </div>
        </div>
        <div class="list">
          <div class="title">
            企业微信自建H5地址
          </div>
          <div class="formBox">
            <div class="introduce">
              <p>操作指南：</p>
              <p>
                1. 在企业微信管理后台 - 「应用管理」- 应用 - 下方的「自建应用」中找到店务工作台。
              </p>
              <p>
                2.
                点击进入应用详情页，点击「应用主页」后的「设置」按钮，并复制下方的url为「网页地址」。
              </p>
              <p>3. 点击确定</p>
            </div>
            <el-form
              ref="form"
              label-width="150px"
            >
              <el-card shadow="never">
                <el-form-item
                  label="URL"
                  class="first"
                >
                  <el-input
                    v-model="form.agents.dianwu.h5_url"
                    disabled
                    class="bg-gray"
                  />
                  <span
                    v-clipboard:copy="form.agents.dianwu.h5_url"
                    v-clipboard:success="onCopy"
                    class="btn"
                  >复制</span>
                </el-form-item>
              </el-card>
            </el-form>
          </div>
        </div>
        <div class="list">
          <div class="title">
            设置可信域名地址
          </div>
          <div class="formBox">
            <div class="introduce">
              <p>操作指南：</p>
              <p>
                1. 在企业微信管理后台 - 「应用管理」- 应用 - 下方的「自建应用」中找到店务工作台。
              </p>
              <p>2. 点击进入应用详情页，点击最下方的「网页授权及JS-SDK」。</p>
              <p>3. 将下方「可信域名」复制至企业微信后台的「可信域名」，并点击申请校验域名。</p>
              <p>4. 点击确定。</p>
            </div>
            <el-form
              ref="form"
              label-width="150px"
            >
              <el-card shadow="never">
                <el-form-item
                  label="可信域名"
                  class="first"
                >
                  <el-input
                    v-model="form.agents.dianwu.h5_host"
                    disabled
                    class="bg-gray"
                  />
                  <span
                    v-clipboard:copy="form.agents.dianwu.h5_host"
                    v-clipboard:success="onCopy"
                    class="btn"
                  >复制</span>
                </el-form-item>
              </el-card>
            </el-form>
          </div>
        </div>
        <div class="list">
          <div class="title">
            申请校验域名
          </div>
          <div class="formBox">
            <div class="introduce">
              <p>操作指南：</p>
              <p>1. 接上方操作，点击企业微信说明中第一步的「下载文件」。</p>
              <p>2. 回到云店后台，点击下方上传文件，选择刚刚下载的文件。</p>
              <p>3. 回到企业微信后台，点击确定。</p>
            </div>
            <el-form
              ref="form"
              label-width="150px"
            >
              <el-card shadow="never">
                <el-form-item
                  label="域名文件"
                  class="first yuming"
                >
                  <div class="line">
                    <div class="filename">
                      <span v-if="form.agents.dianwu.verify_file_name">已上传：</span>{{ form.agents.dianwu.verify_file_name }}
                    </div>
                    <el-upload
                      class="upload-demo"
                      :action="uploadUrl"
                      :headers="uploadHeader"
                      name="file"
                      :show-file-list="false"
                      :on-success="handleUploadSuccess"
                    >
                      <el-button
                        size="small"
                        type="primary"
                        plain
                      >
                        点击上传
                      </el-button>
                    </el-upload>
                  </div>
                </el-form-item>
              </el-card>
            </el-form>
          </div>
        </div>
        <div class="page-btn">
          <el-button
            type="primary"
            @click="onSubmit"
          >
            保存
          </el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import {
  getWorkWechatConfig,
  setWorkWechatConfig,
  getBaseConfig,
  setBaseConfig
} from '@/api/wechat'
import store from '@/store'
import { Message } from 'element-ui'
export default {
  data () {
    return {
      activeName: 'first',
      form: {
        corpid: '', //企业ID
        agents: {
          // 小程序配置
          app: {
            appid: '', //小程序app-id
            agent_id: '', //小程序 agent-id
            secret: '', // 小程序Secret
            token: '', // 小程序Token
            aes_key: '' // 小程序EncodingAESKey
          },
          customer: {
            //客户联系配置
            secret: '', //客户联系Secret

            URL: '', // 新增：
            token: '', //客户联系Token
            aes_key: '' // 客户联系EncodingAESKey
          },
          report: {
            // 通讯录配置
            secret: '', // 通讯录Secret
            token: '', //通讯录Token
            aes_key: '' // 通讯录EncodingAESKey
          },
          dianwu: {
            agent_id: '',
            h5_host: '',
            h5_url: '',
            secret: ''
          }
        }
      },
      part2form: {
        url: '',
        secret: '',
        AgentID: ''
      },
      uploadUrl: process.env.VUE_APP_BASE_API + '/workwechat/domain/verify',
      uploadHeader: { 'Authorization': 'bearer ' + store.getters.token }
    }
  },
  mounted () {
    this.get_DW_Config()
  },
  methods: {
    handleClick (tab, event) {
      // console.log(tab, event);
    },
    onCopy () {
      this.$notify.success({
        message: '复制成功',
        showClose: true
      })
    },
    handleUploadSuccess (response, file, fileList) {
      this.get_DW_Config()
    },
    async get_DW_Config () {
      const result = await getWorkWechatConfig()
      // this.form.corpid = result.data.data.corpid
      // this.form.agents.app = result.data.data.agents.app
      // this.form.agents.customer = result.data.data.agents.customer
      this.form = result.data.data
    },
    async onSubmit () {
      console.log(this.form)
      const result = await setWorkWechatConfig(this.form)
      if (result.status === 200) {
        Message.success('保存成功')
      }
    },
    copyHandle (value) {
      let el = document.getElementById(value)
      el.select()
      document.execCommand('copy')
    }
  }
}
</script>
<style lang="scss">
.page-workwechat {
  padding: 20px;
  a {
    color: #999;
  }
  a:hover {
    color: #459ae9;
    text-decoration: underline;
  }
  .tips {
    margin-left: 50px;
    line-height: 40px;
    color: #999;
    font-size: 12px;
  }
  .el-card__body {
    padding-left: 40px;
  }

  .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
  .el-form-item__label {
    text-align: left;
  }
  .first {
    margin-bottom: 0px;

    &.yuming {
      .line {
        display: flex;
        .filename {
          width: 300px;
          color: #999;
          flex-shrink: 0;
          @include mult-ellipsis(1);
          white-space: nowrap;
          font-size: 14px;
        }
      }
    }
  }

  .list {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .title {
      min-width: 150px;
      margin-right: 40px;
    }
    .formBox {
      flex: 1;
      .introduce {
        font-size: 12px;
        margin-bottom: 22px;
      }
      .borderBottom {
        border-bottom: 1px solid #999;
        .el-form-item {
          margin-bottom: 22px;
        }
      }
      .introduce-Flex {
        margin: 22px 0;
        display: flex;
        font-size: 12px;

        justify-content: space-between;
        .subtitle {
          font-size: 13px;
          // width: 300px;
        }
        .content {
          margin-left: 20px;
          flex: 1;
          color: #999;
        }
      }
      .el-input__suffix {
        right: 1px;
        top: -1px;
        .el-button--mini,
        .el-button--mini.is-round {
          box-sizing: border-box;
          height: 28px;
          width: 80px;
          // padding: 6px 15px;
        }
      }
    }
  }
  .bg-gray {
    width: 500px;
  }
  .btn {
    width: 70px;
    color: #fff;
    background: #409eff;
    padding: 7px 18px;
    border-radius: 6px;
  }
  .page-btn {
    margin-top: 50px;
    margin-bottom: 30px;
    text-align: center;
  }
}
</style>
