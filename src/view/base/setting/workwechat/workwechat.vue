<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="page-workwechat">
    <el-card class="box-card" shadow="never">
      <el-form :model="form" label-width="90px" class="demo-ruleForm">
        <el-row>
          <el-col :span="14">
            <el-form-item class="first" :label="$t('e748f88a.5a83cb')">
              <el-input v-model="form.corpid" type="age" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <p class="tips">
              <a
                href="https://work.weixin.qq.com/api/doc#90000/90135/90665/corpid"
                target="_blank"
                >{{ $t('e748f88a.7f796e') }}</a
              >
            </p>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane :label="$t('e748f88a.02eb82')" name="first">
        <div class="list">
          <div class="title">{{ $t('e748f88a.701fa5') }}</div>
          <div class="formBox">
            <el-form ref="form" label-width="150px">
              <el-card shadow="never">
                <el-form-item label="AppID">
                  <el-input v-model="form.agents.app.appid" style="width: 400px" />
                  <span class="tips">
                    <a href="http://" target="_blank" rel="noopener noreferrer">
                      {{ $t('e748f88a.91ce6c') }}
                    </a></span
                  >
                </el-form-item>

                <el-form-item label="AgentId">
                  <el-input v-model="form.agents.app.agent_id" style="width: 400px" />
                  <span class="tips">
                    <a
                      href="https://work.weixin.qq.com/api/doc#90000/90135/90665/agentid"
                      target="_blank"
                      >{{ $t('e748f88a.ea3558') }}</a
                    ></span
                  >
                </el-form-item>

                <el-form-item label="Secret">
                  <el-input v-model="form.agents.app.secret" style="width: 400px" />
                  <span class="tips">
                    <a
                      href="https://work.weixin.qq.com/api/doc#90000/90135/90665/secret"
                      target="_blank"
                      >{{ $t('e748f88a.2464ad') }}</a
                    ></span
                  >
                </el-form-item>

                <el-form-item label="Token">
                  <el-input v-model="form.agents.app.token" style="width: 400px" />
                </el-form-item>
                <el-form-item label="EncodingAESKey">
                  <el-input v-model="form.agents.app.aes_key" style="width: 400px" />
                  <span class="tips"
                    ><a
                      href="https://work.weixin.qq.com/api/doc#90000/90135/90930"
                      target="_blank"
                      >{{ $t('e748f88a.b904a0') }}</a
                    ></span
                  >
                </el-form-item>
              </el-card>
            </el-form>
          </div>
        </div>
        <div class="list">
          <div class="title">{{ $t('e748f88a.770cf3') }}</div>
          <div class="formBox">
            <div class="introduce">
              <p>{{ $t('e748f88a.18fdcb') }}</p>
              <p>{{ $t('e748f88a.25b4c7') }}</p>
              <p>{{ $t('e748f88a.0541c6') }}</p>
            </div>
            <el-form ref="form" label-width="150px">
              <el-card shadow="never">
                <div class="borderBottom">
                  <el-form-item label="Secret">
                    <el-input v-model="form.agents.customer.secret" style="width: 600px" />
                  </el-form-item>
                </div>
                <div class="introduce-Flex">
                  <div class="subtitle">{{ $t('e748f88a.fd50cb') }}</div>
                  <div class="content">
                    <p>{{ $t('e748f88a.614e37') }}</p>
                    <p>{{ $t('e748f88a.25b4c7') }}</p>
                    <p>{{ $t('e748f88a.2d18bf') }}</p>
                  </div>
                </div>

                <el-form-item label="URL">
                  <el-input v-model="form.agents.customer.URL" class="bg-gray" disabled />
                  <span
                    v-clipboard:copy="form.agents.customer.URL"
                    v-clipboard:success="onCopy"
                    class="btn"
                    >{{ $t('e748f88a.79d3ab') }}</span
                  >
                </el-form-item>

                <el-form-item label="Token">
                  <el-input v-model="form.agents.customer.token" disabled class="bg-gray" />
                  <span
                    v-clipboard:copy="form.agents.customer.token"
                    v-clipboard:success="onCopy"
                    class="btn"
                    >{{ $t('e748f88a.79d3ab') }}</span
                  >
                </el-form-item>

                <el-form-item label="EncodingAESKey">
                  <el-input v-model="form.agents.customer.aes_key" disabled class="bg-gray" />
                  <span
                    v-clipboard:copy="form.agents.customer.aes_key"
                    v-clipboard:success="onCopy"
                    class="btn"
                    >{{ $t('e748f88a.79d3ab') }}</span
                  >
                </el-form-item>
              </el-card>
            </el-form>
          </div>
        </div>
        <div class="list">
          <div class="title">{{ $t('e748f88a.3794da') }}</div>
          <div class="formBox">
            <div class="introduce">
              <p>{{ $t('e748f88a.18fdcb') }}</p>
              <p>{{ $t('e748f88a.e04191') }}</p>
              <p>{{ $t('e748f88a.0541c6') }}</p>
              <p>{{ $t('e748f88a.03ee44') }}</p>
            </div>
            <el-form ref="form" label-width="150px">
              <el-card shadow="never">
                <el-form-item label="Secret">
                  <el-input v-model="form.agents.report.secret" style="width: 400px" />
                  <span class="tips">{{ $t('e748f88a.61554d') }}</span>
                </el-form-item>
                <el-form-item label="Token">
                  <el-input v-model="form.agents.report.token" style="width: 400px" />
                </el-form-item>
                <el-form-item label="EncodingAESKey">
                  <el-input v-model="form.agents.report.aes_key" style="width: 400px" />

                  <span class="tips">{{ $t('e748f88a.e27d12') }}</span>
                </el-form-item>
              </el-card>
            </el-form>
          </div>
        </div>
        <div class="page-btn">
          <el-button type="primary" @click="onSubmit">{{ $t('e748f88a.be5fbb') }}</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('e748f88a.56db7b')" name="second">
        <div class="list">
          <div class="title">{{ $t('e748f88a.3794da') }}</div>
          <div class="formBox">
            <div class="introduce">
              <p>{{ $t('e748f88a.18fdcb') }}</p>
              <p>{{ $t('e748f88a.e662e0') }}</p>
              <p>{{ $t('e748f88a.f7a07a') }}</p>
              <p>{{ $t('e748f88a.dd308f') }}</p>
            </div>
            <el-form ref="form" label-width="150px">
              <el-card shadow="never">
                <el-form-item label="AgentID">
                  <el-input v-model="form.agents.dianwu.agent_id" style="width: 400px" />
                  <span class="tips">{{ $t('e748f88a.45511c') }}</span>
                </el-form-item>

                <el-form-item label="Secret" class="first">
                  <el-input v-model="form.agents.dianwu.secret" style="width: 400px" />
                  <span class="tips">{{ $t('e748f88a.60e2ba') }}</span>
                </el-form-item>
              </el-card>
            </el-form>
          </div>
        </div>
        <div class="list">
          <div class="title">{{ $t('e748f88a.8a9827') }}</div>
          <div class="formBox">
            <div class="introduce">
              <p>{{ $t('e748f88a.3ffbfe') }}</p>
              <p>{{ $t('e748f88a.e03b7b') }}</p>
              <p>{{ $t('e748f88a.1313fe') }}</p>
              <p>{{ $t('e748f88a.5e2009') }}</p>
            </div>
            <el-form ref="form" label-width="150px">
              <el-card shadow="never">
                <el-form-item label="URL" class="first">
                  <el-input v-model="form.agents.dianwu.h5_url" disabled class="bg-gray" />
                  <span
                    v-clipboard:copy="form.agents.dianwu.h5_url"
                    v-clipboard:success="onCopy"
                    class="btn"
                    >{{ $t('e748f88a.79d3ab') }}</span
                  >
                </el-form-item>
              </el-card>
            </el-form>
          </div>
        </div>
        <div class="list">
          <div class="title">{{ $t('e748f88a.b74740') }}</div>
          <div class="formBox">
            <div class="introduce">
              <p>{{ $t('e748f88a.3ffbfe') }}</p>
              <p>{{ $t('e748f88a.e03b7b') }}</p>
              <p>{{ $t('e748f88a.8dca50') }}</p>
              <p>{{ $t('e748f88a.88530e') }}</p>
              <p>{{ $t('e748f88a.28882c') }}</p>
            </div>
            <el-form ref="form" label-width="150px">
              <el-card shadow="never">
                <el-form-item :label="$t('e748f88a.2db568')" class="first">
                  <el-input v-model="form.agents.dianwu.h5_host" disabled class="bg-gray" />
                  <span
                    v-clipboard:copy="form.agents.dianwu.h5_host"
                    v-clipboard:success="onCopy"
                    class="btn"
                    >{{ $t('e748f88a.79d3ab') }}</span
                  >
                </el-form-item>
              </el-card>
            </el-form>
          </div>
        </div>
        <div class="list">
          <div class="title">{{ $t('e748f88a.350b47') }}</div>
          <div class="formBox">
            <div class="introduce">
              <p>{{ $t('e748f88a.3ffbfe') }}</p>
              <p>{{ $t('e748f88a.a7bdf1') }}</p>
              <p>{{ $t('e748f88a.d4a8a8') }}</p>
              <p>{{ $t('e748f88a.e59a7d') }}</p>
            </div>
            <el-form ref="form" label-width="150px">
              <el-card shadow="never">
                <el-form-item :label="$t('e748f88a.2f860e')" class="first yuming">
                  <div class="line">
                    <div class="filename">
                      <span v-if="form.agents.dianwu.verify_file_name">{{
                        $t('e748f88a.669c86')
                      }}</span
                      >{{ form.agents.dianwu.verify_file_name }}
                    </div>
                    <el-upload
                      class="upload-demo"
                      :action="uploadUrl"
                      :headers="uploadHeader"
                      name="file"
                      :show-file-list="false"
                      :on-success="handleUploadSuccess"
                    >
                      <el-button size="small" type="primary" plain>
                        {{ $t('e748f88a.2c808b') }}
                      </el-button>
                    </el-upload>
                  </div>
                </el-form-item>
              </el-card>
            </el-form>
          </div>
        </div>
        <div class="page-btn">
          <el-button type="primary" @click="onSubmit">{{ $t('e748f88a.be5fbb') }}</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('e748f88a.a56156')" name="third">
        <div class="list">
          <div class="title">{{ $t('e748f88a.80d2ca') }}</div>
          <div class="formBox">
            <el-form ref="form" label-width="150px">
              <el-card shadow="never">
                <el-form-item :label="$t('e748f88a.6a37ea')">
                  <SpImagePicker v-model="form.avatar_url" />
                  <div class="tips">{{ $t('e748f88a.0f1410') }}</div>
                </el-form-item>
                <el-form-item :label="$t('e748f88a.8fe9a8')">
                  <SpImagePicker v-model="form.bg_avatar_url" />
                  <div class="tips">{{ $t('e748f88a.4b1f0b') }}</div>
                </el-form-item>
              </el-card>
            </el-form>
          </div>
        </div>
        <div class="page-btn">
          <el-button type="primary" @click="onSubmit"> {{ $t('e748f88a.be5fbb') }} </el-button>
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
  data() {
    return {
      activeName: 'first',
      form: {
        corpid: '', //企业ID
        avatar_url: '', // 导购服务头像图
        bg_avatar_url: '', // 添加导购背景图
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
      uploadHeader: { Authorization: 'bearer ' + store.getters.token }
    }
  },
  mounted() {
    this.get_DW_Config()
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    onCopy() {
      this.$notify.success({
        message: this.$t('e748f88a.20a495'),
        showClose: true
      })
    },
    handleUploadSuccess(response, file, fileList) {
      this.get_DW_Config()
    },
    async get_DW_Config() {
      const result = await getWorkWechatConfig()
      // this.form.corpid = result.data.data.corpid
      // this.form.agents.app = result.data.data.agents.app
      // this.form.agents.customer = result.data.data.agents.customer
      this.form = result.data.data
    },
    async onSubmit() {
      console.log(this.form)
      const result = await setWorkWechatConfig(this.form)
      if (result.status === 200) {
        Message.success(this.$t('e748f88a.3b1083'))
      }
    },
    copyHandle(value) {
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
          @include multi-ellipsis(1);
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
