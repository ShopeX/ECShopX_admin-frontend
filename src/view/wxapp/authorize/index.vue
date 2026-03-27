<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <div v-if="$route.path.indexOf('policy') === -1">
      <section v-loading="loading" class="section section-white content-padded-b">
        <div v-if="wxapp_id && detail && detail.weapp && detail.weappTemplate">
          <div class="content-center">
            <div v-if="detail.head_img">
              <img class="app-img" :src="wximageurl + detail.head_img" height="60">
            </div>
            <div v-else>
              <i class="el-icon-picture fa-3x" aria-hidden="true" />
            </div>
            <div v-if="detail.nick_name" class="app-name">
              {{ detail.nick_name }}
            </div>
            <div class="demo">
              <div
                v-if="detail.weapp.release_status == '1' && detail.weapp.release_ver"
                class="demo-qrcode"
                @click="downloadWxaCode"
              >
                <img src="@/assets/img/code.png" alt="">
              </div>
            </div>
          </div>
          <ul class="info-list">
            <li class="info-item">
              <div class="label">{{ $t('324626d5.59cf15') }}</div>
              <div class="content">
                <div class="content-item">
                  {{ detail.weappTemplate.name }}
                </div>
                <div>{{ $t('324626d5.28ea5c') }}{{ detail.weapp.release_ver }}</div>
              </div>
            </li>
            <li class="info-item">
              <div class="label">{{ $t('324626d5.fe2df0') }}</div>
              <div class="content">
                <div class="content-item">
                  {{ detail.weappTemplate.version }}
                </div>
                <div>
                  <div v-if="detail.weappTemplate.template_id > detail.weapp.template_id">
                    {{ $t('324626d5.4c753a') }}
                  </div>
                  <div v-else>{{ $t('324626d5.c8b977') }}</div>
                </div>
              </div>
            </li>
            <li class="info-item">
              <div class="label">{{ $t('324626d5.dc0a7b') }}</div>
              <div class="content">
                <div class="content-item">
                  <span v-if="detail.weapp.release_status == '1'">{{ $t('324626d5.2390fa') }}</span>
                  <span v-else type="gray">{{ $t('324626d5.25744b') }}</span>
                </div>
              </div>
            </li>
            <li v-if="detail.weapp.release_status != '1'" class="info-item">
              <div class="label">{{ $t('324626d5.b6d0e9') }}</div>
              <div class="content">
                <div class="content-item">
                  <span v-if="detail.weapp.audit_status == '1'">{{ $t('324626d5.fe3661') }}</span>
                  <!--审核成功并且已经上架则不需要显示-->
                  <span
                    v-else-if="
                      detail.weapp.audit_status == '0' && detail.weapp.release_status != '1'
                    "
                    type="success"
                    >{{ $t('324626d5.94129a') }}</span
                  >
                  <span v-else-if="detail.weapp.audit_status == '3'" type="success">{{
                    $t('324626d5.a9c09d')
                  }}</span>
                  <span v-else-if="detail.weapp.audit_status == '2'" type="primary">{{
                    $t('324626d5.b720a6')
                  }}</span>
                </div>
              </div>
            </li>
            <li v-if="detail.weapp.audit_status == '1' && detail.weapp.reason" class="info-item">
              <div class="label">{{ $t('324626d5.ec85ac') }}</div>
              <div class="content">
                <div class="content-item" v-html="detail.weapp.reason" />
              </div>
            </li>
          </ul>
          <div class="content-center">
            <el-button type="success" @click="config">{{ $t('324626d5.224e2c') }}</el-button>
            <!--<el-checkbox v-model="form.params.autoPublish" @change="configSave">自动发布</el-checkbox>-->
            <el-button
              v-if="detail.weappTemplate.template_id > detail.weapp.template_id"
              type="success"
              @click="handleAddWxaAction"
            >
              {{ $t('324626d5.9725db') }}
            </el-button>
            <!-- <el-button type="success" v-if="detail.weappTemplate.template_id > detail.weapp.template_id" @click="handleAddWxaActionSubmitReview">上传代码</el-button> -->
            <el-button
              v-if="detail.weapp.audit_status === 3"
              type="success"
              @click="handleAddWxaActionSubmitReview"
            >
              {{ $t('324626d5.646db0') }}
            </el-button>
            <el-button
              v-else-if="isForceUpdate || detail.weapp.audit_status === 1"
              type="success"
              @click="handleAddWxaAction"
            >
              {{ $t('324626d5.ece899') }}
            </el-button>
            <el-button
              v-if="detail.weapp.audit_status === 2"
              type="info"
              @click="handleUndocodeaudit"
            >
              {{ $t('324626d5.71bb0e') }}
            </el-button>
            <el-button
              v-if="detail.weapp.audit_status === 0"
              type="warning"
              @click="handleRevertcoderelease"
            >
              {{ $t('324626d5.8e3b19') }}
            </el-button>
            <!--只有在审核中才需要查看体验二维码-->
            <el-button
              v-if="detail.weapp.audit_status === 3 || detail.weapp.audit_status === 2"
              type="info"
              @click="downloadTextWxaCode"
            >
              {{ $t('324626d5.b330d1') }}
            </el-button>
            <el-button type="success" @click="tryRelease">{{ $t('324626d5.c4a378') }}</el-button>
            <el-button type="primary" @click="handleBind">{{ $t('324626d5.af3ef9') }}</el-button>
            <el-button type="success" @click="domain">{{ $t('324626d5.190980') }}</el-button>
            <el-button v-if="system_is_saas == 'false'" type="success" @click="handleEditTemplate">
              {{ $t('324626d5.c6aa35') }}
            </el-button>
            <el-button v-if="system_is_saas == 'false'" type="primary" @click="getdomain">
              {{ $t('324626d5.cec2be') }}
            </el-button>
            <router-link
              :to="`/wxapp/manage/editauthorize/policy?app_id=${detail.authorizer_appid}&nick_name=${detail.nick_name}`"
              style="margin-left: 5px"
            >
              <el-button type="success">{{ $t('324626d5.d8c536') }}</el-button>
            </router-link>
          </div>
        </div>
        <div v-else class="content-center no-bind">
          <div>
            <i class="iconfont icon-info-circle" style="font-size: 70px" />
          </div>
          <div class="content-padded">{{ $t('324626d5.6a7b6f') }}</div>
          <el-button type="primary" @click="handleBind">{{ $t('324626d5.d7a8d8') }}</el-button>
        </div>
      </section>
      <el-dialog :title="$t('324626d5.b85b43')" :visible.sync="wxaCodeVisible">
        <div class="content-center">
          <img :src="wxaCodeImage">
        </div>
      </el-dialog>
      <el-dialog
        :title="$t('324626d5.224e2c')"
        class="right-dialog"
        :visible.sync="wxaConfigVisible"
      >
        <el-form ref="form" :model="form" label-position="left" label-width="180px">
          <div class="section-body">
            <el-form-item :label="$t('324626d5.778a32')">
              <el-switch v-model="form.auto_publish" :active-value="1" :inactive-value="0" />
            </el-form-item>
            <el-form-item :label="$t('324626d5.bfb460')">
              <el-col :span="18">
                <el-input
                  v-model="form.authorizer_appsecret"
                  :placeholder="$t('324626d5.ede01a')"
                  show-password
                />
              </el-col>
            </el-form-item>
          </div>
          <div class="section-footer with-border content-center">
            <el-button type="primary" @click="configSave">{{ $t('324626d5.56df61') }}</el-button>
          </div>
        </el-form>
      </el-dialog>

      <el-dialog
        :title="$t('324626d5.190980')"
        class="right-dialog"
        :visible.sync="wxaDomainVisible"
      >
        <p class="frm-tips">
          {{ $t('324626d5.08b0a3') }}
        </p>
        <el-form label-width="160px" size="mini">
          <el-collapse accordion>
            <el-collapse-item :title="$t('324626d5.000854')" name="1">
              <el-form-item :label="$t('324626d5.d6838c')">
                <div v-for="requestdomain in domainform.wxDomain.requestdomain">
                  {{ requestdomain }}
                </div>
              </el-form-item>
              <el-form-item :label="$t('324626d5.f0fbad')">
                <div v-for="wsrequestdomain in domainform.wxDomain.wsrequestdomain">
                  {{ wsrequestdomain }}
                </div>
              </el-form-item>
              <el-form-item :label="$t('324626d5.32ce31')">
                <div v-for="uploaddomain in domainform.wxDomain.uploaddomain">
                  {{ uploaddomain }}
                </div>
              </el-form-item>
              <el-form-item :label="$t('324626d5.87fd72')">
                <div v-for="downloaddomain in domainform.wxDomain.downloaddomain">
                  {{ downloaddomain }}
                </div>
              </el-form-item>
              <el-form-item :label="$t('324626d5.935eba')">
                <div v-for="webviewdomain in domainform.wxDomain.webviewdomain">
                  {{ webviewdomain }}
                </div>
              </el-form-item>
            </el-collapse-item>
          </el-collapse>

          <el-collapse accordion>
            <el-collapse-item :title="$t('324626d5.a6a9a0')" name="2">
              <el-form-item :label="$t('324626d5.d6838c')">
                <div v-for="requestdomain in domainform.localDomain.requestdomain">
                  {{ requestdomain }}
                </div>
              </el-form-item>
              <el-form-item :label="$t('324626d5.f0fbad')">
                <div v-for="wsrequestdomain in domainform.localDomain.wsrequestdomain">
                  {{ wsrequestdomain }}
                </div>
              </el-form-item>
              <el-form-item :label="$t('324626d5.32ce31')">
                <div v-for="uploaddomain in domainform.localDomain.uploaddomain">
                  {{ uploaddomain }}
                </div>
              </el-form-item>
              <el-form-item :label="$t('324626d5.87fd72')">
                <div v-for="downloaddomain in domainform.localDomain.downloaddomain">
                  {{ downloaddomain }}
                </div>
              </el-form-item>
              <el-form-item :label="$t('324626d5.935eba')">
                <div v-for="webviewdomain in domainform.localDomain.webviewdomain">
                  {{ webviewdomain }}
                </div>
              </el-form-item>
            </el-collapse-item>
          </el-collapse>
        </el-form>
        <div class="section-footer with-border content-center">
          <el-button type="primary" @click="domainSave">{{ $t('324626d5.abaacf') }}</el-button>
        </div>
      </el-dialog>

      <!--编辑模板-->
      <el-dialog
        :title="$t('324626d5.c6aa35')"
        width="60%"
        :visible.sync="TemplateEditDialog"
        :before-close="handleCancelLabelsDialog"
      >
        <template>
          <el-form ref="form" :model="weappTemplate" class="demo-ruleForm" label-width="200px">
            <el-form-item
              class="content-left"
              :label="$t('324626d5.9b3bf3')"
              prop="key_name"
              :rules="[{ required: true, message: this.$t('324626d5.dc34dd'), trigger: 'blur' }]"
            >
              <el-input
                v-if="weappTemplate.id"
                v-model="weappTemplate.key_name"
                :placeholder="$t('324626d5.05b056')"
                disabled
              />
              <el-input
                v-else
                v-model="weappTemplate.key_name"
                :placeholder="$t('324626d5.05b056')"
              />
            </el-form-item>
            <el-form-item class="content-left" :label="$t('324626d5.a83ca1')">
              <el-input
                v-model="weappTemplate.name"
                :placeholder="$t('324626d5.05b056')"
                disabled
              />
            </el-form-item>
            <el-form-item class="content-left" :label="$t('324626d5.162795')">
              <el-input v-model="weappTemplate.template_id" :placeholder="$t('324626d5.8c804d')" />
            </el-form-item>
            <el-form-item class="content-left" :label="$t('324626d5.554773')">
              <el-input v-model="weappTemplate.version" :placeholder="$t('324626d5.c7f359')" />
            </el-form-item>
            <el-form-item class="content-center">
              <el-button type="primary" @click="saveTemplate">
{{
                $t('324626d5.b75381')
              }}
</el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-dialog>

      <!--    设置小程序合法域名-->
      <el-dialog :title="$t('324626d5.2db6d5')" width="60%" :visible.sync="domainDialog">
        <el-alert
          :title="$t('324626d5.35a81a')"
          description="mmbiz.qpic.cn,wx.qlogo.cn"
          type="info"
          show-icon
          :closable="false"
        />
        <br>
        <el-form v-loading="domainloading" label-width="200px">
          <el-form-item :label="$t('324626d5.f554f2')">
            <el-input
              v-model="domainData.requestdomain"
              type="textarea"
              :rows="3"
              :placeholder="$t('324626d5.445694')"
              prop="domain.requestdomain"
              :rules="[{ required: true, message: this.$t('324626d5.f554f2'), trigger: 'blur' }]"
            />
          </el-form-item>
          <el-form-item :label="$t('324626d5.0885a7')">
            <el-input
              v-model="domainData.wsrequestdomain"
              type="textarea"
              :rows="3"
              :placeholder="$t('324626d5.445694')"
            />
          </el-form-item>
          <el-form-item :label="$t('324626d5.fe5685')">
            <el-input
              v-model="domainData.uploaddomain"
              type="textarea"
              :rows="3"
              :placeholder="$t('324626d5.445694')"
            />
          </el-form-item>
          <el-form-item :label="$t('324626d5.41a6be')">
            <el-input
              v-model="domainData.downloaddomain"
              type="textarea"
              :rows="6"
              :placeholder="$t('324626d5.445694')"
            />
          </el-form-item>
          <el-form-item :label="$t('324626d5.0e758a')">
            <el-input
              v-model="domainData.webviewdomain"
              type="textarea"
              :rows="6"
              :placeholder="$t('324626d5.445694')"
            />
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button type="primary" @click="setdomain">{{ $t('324626d5.aa7527') }}</el-button>
        </span>
      </el-dialog>
    </div>
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getWechatPreAuthUrl } from '../../../api/wechat'
import {
  getWxa,
  submitWxa,
  getCodeUnlimit,
  getTestQrcode,
  tryRelease,
  revertcoderelease,
  undocodeaudit,
  configSubmitHandle,
  submitOnlyCode,
  submitReview,
  getDomainList,
  saveDomain,
  setdomain,
  getdomain,
  saveTemplate
} from '../../../api/wxa'
export default {
  data() {
    return {
      domainDialog: false,
      domainloading: false,
      TemplateEditDialog: false,
      isForceUpdate: false,
      wxaCodeVisible: false,
      wxaConfigVisible: false,
      wxaDomainVisible: false,
      loading: false,
      getwxcodeloading: false,
      authorizerUrl: '',
      wxaCodeImage: '',
      templateName: '',
      submitWeappForm: {
        wxaAppId: '',
        templateName: '',
        wxa_name: ''
      },
      detail: {},
      form: {
        auto_publish: 0,
        authorizer_appsecret: ''
      },
      domainform: {
        wxDomain: {
          requestdomain: [],
          wsrequestdomain: [],
          uploaddomain: [],
          downloaddomain: [],
          webviewdomain: []
        },
        localDomain: {
          requestdomain: [],
          wsrequestdomain: [],
          uploaddomain: [],
          downloaddomain: [],
          webviewdomain: []
        }
      },
      // 模板数据
      weappTemplate: {
        id: '',
        key_name: '',
        name: '',
        tag: '',
        template_id: '',
        template_id_2: '',
        version: '',
        description: '',
        is_disabled: false
      },
      // 小程序合法域名,全局的
      domainData: {
        requestdomain: '',
        wsrequestdomain: '',
        uploaddomain: '',
        downloaddomain: '',
        webviewdomain: ''
      }
    }
  },
  computed: {
    ...mapGetters(['wxapp_id', 'template_name'])
  },
  mounted() {
    console.log('是否saas1111', this.system_is_saas)
    if (!this.wxapp_id && this.$route.query && this.$route.query.newBind) {
      let params = {
        wxaAppId: this.$route.query.wxapp_id,
        wxa_name: this.$route.query.nick_name,
        templateName: this.template_name
      }
      submitWxa(params).then((response) => {
        this.$message({
          message: this.$t('324626d5.cfb4ab'),
          type: 'success',
          duration: 5 * 1000
        })
        getWxa(this.$route.query.wxapp_id).then((response) => {
          this.detail = response.data.data
          this.$store.dispatch('setWxappId', this.$route.query.wxapp_id)
          this.$router.push({ path: this.matchInternalRoute('editauthorize') })
        })
      })
    } else {
      if (this.wxapp_id) {
        this.loading = true
        getWxa(this.wxapp_id).then((response) => {
          this.detail = response.data.data
          this.weappTemplate = response.data.data.weappTemplate
          this.form.auto_publish = response.data.data.auto_publish
          this.form.authorizer_appsecret = response.data.data.authorizer_appsecret
          this.loading = false
        })
      }
    }
  },
  methods: {
    // 编辑模板
    handleEditTemplate() {
      // 编辑商品弹框
      this.TemplateEditDialog = true
      this.isEdit = true
    },
    handleCancelLabelsDialog() {
      this.TemplateEditDialog = false
    },
    // 保存小程序模板
    saveTemplate() {
      let data = {
        id: this.weappTemplate.id,
        template_id: this.weappTemplate.template_id,
        version: this.weappTemplate.version
      }
      saveTemplate(data).then((response) => {
        this.TemplateEditDialog = false
      })
    },
    // 获取小程序域名（全局）
    getdomain() {
      this.domainDialog = true
      this.domainloading = true
      getdomain().then((res) => {
        this.domainData = res.data.data
        this.domainloading = false
      })
    },
    // 设置小程序域名
    setdomain() {
      setdomain({ domain: this.domainData }).then((res) => {
        if (res.data.data.status === true) {
          this.domainDialog = false
          this.$message({
            message: this.$t('324626d5.3b1083'),
            type: 'success',
            duration: 2 * 1000
          })
        } else {
          this.$message({ message: this.$t('324626d5.ece8fd'), type: 'error', duration: 2 * 1000 })
        }
      })
    },
    handleBind() {
      let params = {
        callback_url: this.wxAuthCallbackUrl + 'auth/wxa'
      }
      getWechatPreAuthUrl(params).then((response) => {
        this.authorizerUrl = response.data.data.url
        var metadata = document.getElementsByTagName('meta')
        for (var i = 0; i < metadata.length; i++) {
          if (metadata[i]['name'] == 'referrer') {
            metadata[i]['content'] = 'default'
          }
        }
        window.open(this.authorizerUrl, '_self')
      })
    },
    getWxa() {
      this.loading = true
      getWxa(this.wxapp_id).then((response) => {
        this.detail = response.data.data
        this.loading = false
      })
    },
    // 撤销审核
    handleUndocodeaudit() {
      this.$confirm(this.$t('324626d5.2980fc'), this.$t('324626d5.02d981'), {
        confirmButtonText: this.$t('324626d5.38cf16'),
        cancelButtonText: this.$t('324626d5.625fb2'),
        type: 'warning'
      })
        .then(() => {
          undocodeaudit({ wxaAppId: this.detail.authorizer_appid }).then((response) => {
            this.$message({
              message: this.$t('324626d5.8e05b0'),
              type: 'success',
              duration: 2 * 1000
            })
            this.getWxa()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('324626d5.2111cc')
          })
        })
    },
    // 回退版本
    handleRevertcoderelease() {
      this.$confirm(this.$t('324626d5.47323e'), this.$t('324626d5.02d981'), {
        confirmButtonText: this.$t('324626d5.38cf16'),
        cancelButtonText: this.$t('324626d5.625fb2'),
        type: 'warning'
      })
        .then(() => {
          revertcoderelease({ wxaAppId: this.detail.authorizer_appid }).then((response) => {
            this.$message({
              message: this.$t('324626d5.742b8f'),
              type: 'success',
              duration: 2 * 1000
            })
            this.getWxa()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('324626d5.2111cc')
          })
        })
    },
    handleAddWxaActionOnliCode() {
      this.submitWeappForm.wxaAppId = this.detail.authorizer_appid
      this.submitWeappForm.wxa_name = this.detail.nick_name
      this.submitWeappForm.templateName = this.detail.weapp.template_name
      submitOnlyCode(this.submitWeappForm).then((response) => {
        this.$message({
          message: this.$t('324626d5.16f184'),
          type: 'success',
          duration: 5 * 1000
        })
        this.getWxa()
      })
    },
    handleAddWxaActionSubmitReview() {
      this.submitWeappForm.wxaAppId = this.detail.authorizer_appid
      this.submitWeappForm.wxa_name = this.detail.nick_name
      this.submitWeappForm.templateName = this.detail.weapp.template_name
      submitReview(this.submitWeappForm).then((response) => {
        this.$message({
          message: this.$t('324626d5.d3ae9f'),
          type: 'success',
          duration: 5 * 1000
        })
        this.getWxa()
      })
    },
    // 上架小程序
    handleAddWxaAction(type) {
      this.submitWeappForm.wxaAppId = this.detail.authorizer_appid
      this.submitWeappForm.wxa_name = this.detail.nick_name
      this.submitWeappForm.templateName = this.detail.weapp.template_name

      if (this.isForceUpdate) {
        this.$confirm(this.$t('324626d5.34138b'), this.$t('324626d5.02d981'), {
          confirmButtonText: this.$t('324626d5.38cf16'),
          cancelButtonText: this.$t('324626d5.625fb2'),
          type: 'warning'
        })
          .then(() => {
            submitWxa(this.submitWeappForm).then((response) => {
              this.$message({
                message: this.$t('324626d5.cd764b'),
                type: 'success',
                duration: 5 * 1000
              })
              this.getWxa()
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: this.$t('324626d5.2111cc')
            })
          })
      } else {
        submitWxa(this.submitWeappForm).then((response) => {
          this.$message({
            message: this.$t('324626d5.cd764b'),
            type: 'success',
            duration: 5 * 1000
          })
          this.getWxa()
        })
      }
    },
    downloadTextWxaCode() {
      let params = { wxaAppId: this.detail.authorizer_appid }
      getTestQrcode(params).then((response) => {
        this.wxaCodeImage = response.data.data.base64Image
        this.wxaCodeVisible = true
      })
    },
    tryRelease() {
      let params = { wxaAppId: this.detail.authorizer_appid }
      tryRelease(params).then((response) => {
        this.$message({
          message: response.data.data.message,
          type: 'success',
          duration: 5 * 1000
        })
        this.getWxa()
      })
    },
    downloadWxaCode() {
      this.getwxcodeloading = true
      let params = { wxaAppId: this.detail.authorizer_appid }
      getCodeUnlimit(params)
        .then((response) => {
          this.wxaCodeImage = response.data.data.base64Image
          this.wxaCodeVisible = true
          this.getwxcodeloading = false
        })
        .catch((error) => {
          this.getwxcodeloading = false
        })
    },
    config() {
      this.wxaConfigVisible = true
    },
    configSave() {
      let params = this.form
      configSubmitHandle(this.wxapp_id, params).then((response) => {
        this.wxaConfigVisible = false
        this.$message({
          message: this.$t('324626d5.a6d385'),
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    domain() {
      this.wxaDomainVisible = true
      let params = {
        wxaAppId: this.wxapp_id,
        templateName: this.template_name
        // templateName = this.template_name
      }
      getDomainList(params).then((res) => {
        console.log(res)
        this.domainform.wxDomain = res.data.data.wxDomain
        this.domainform.localDomain = res.data.data.localDomain
      })
    },
    domainSave() {
      let params = {
        wxaAppId: this.wxapp_id,
        templateName: this.template_name
      }
      saveDomain(params).then((response) => {
        this.wxaDomainVisible = false
        this.$message({
          message: this.$t('324626d5.3aefb5'),
          type: 'success',
          duration: 5 * 1000
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.app-img {
  width: 90px;
  height: auto;
  margin: 10px;
}
.app-name {
  font-size: 20px;
  font-weight: 500;
}
.info-list {
  padding: 30px 0;
  .info-item {
    font-size: 14px;
    .label {
      width: 100px;
      height: 50px;
      line-height: 50px;
      float: left;
      color: #ccc;
    }
    .content {
      display: flex;
      align-items: center;
      height: 50px;
      margin-left: 120px;
      border-bottom: 1px solid #efefef;
      .content-item {
        flex: 1;
      }
    }
  }
}
.demo {
  padding: 30px;
}
.demo-qrcode {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  margin: 0 auto;
  transition: all 0.3s ease;
  transform: scale(1);
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
  }
  img {
    display: block;
    width: 70%;
    height: 70%;
  }
}
.no-bind {
  color: #ccc;
}
</style>
