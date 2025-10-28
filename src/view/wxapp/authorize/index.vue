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
    <div v-if="$route.path.indexOf('policy') === -1">
      <section v-loading="loading" class="section section-white content-padded-b">
        <div v-if="wxapp_id && detail && detail.weapp && detail.weappTemplate">
          <div class="content-center">
            <div v-if="detail.head_img">
              <img class="app-img" :src="wximageurl + detail.head_img" height="60">
            </div>
            <div v-else>
              <i class="iconfont icon-image fa-3x" aria-hidden="true" />
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
              <div class="label">模板</div>
              <div class="content">
                <div class="content-item">
                  {{ detail.weappTemplate.name }}
                </div>
                <div>线上版本：{{ detail.weapp.release_ver }}</div>
              </div>
            </li>
            <li class="info-item">
              <div class="label">版本</div>
              <div class="content">
                <div class="content-item">
                  {{ detail.weappTemplate.version }}
                </div>
                <div>
                  <div v-if="detail.weappTemplate.template_id > detail.weapp.template_id">
                    请更新到最新版本
                  </div>
                  <div v-else>当前已是最新版本</div>
                </div>
              </div>
            </li>
            <li class="info-item">
              <div class="label">上架状态</div>
              <div class="content">
                <div class="content-item">
                  <span v-if="detail.weapp.release_status == '1'">已上架</span>
                  <span v-else type="gray">未上架</span>
                </div>
              </div>
            </li>
            <li v-if="detail.weapp.release_status != '1'" class="info-item">
              <div class="label">审核状态</div>
              <div class="content">
                <div class="content-item">
                  <span v-if="detail.weapp.audit_status == '1'">审核失败</span>
                  <!--审核成功并且已经上架则不需要显示-->
                  <span
                    v-else-if="
                      detail.weapp.audit_status == '0' && detail.weapp.release_status != '1'
                    "
                    type="success"
                    >审核成功</span
                  >
                  <span v-else-if="detail.weapp.audit_status == '3'" type="success">待提交</span>
                  <span v-else-if="detail.weapp.audit_status == '2'" type="primary">审核中</span>
                </div>
              </div>
            </li>
            <li v-if="detail.weapp.audit_status == '1' && detail.weapp.reason" class="info-item">
              <div class="label">审核失败原因</div>
              <div class="content">
                <div class="content-item" v-html="detail.weapp.reason" />
              </div>
            </li>
          </ul>
          <div class="content-center">
            <el-button type="success" @click="config"> 配置 </el-button>
            <!--<el-checkbox v-model="form.params.autoPublish" @change="configSave">自动发布</el-checkbox>-->
            <el-button
              v-if="detail.weappTemplate.template_id > detail.weapp.template_id"
              type="success"
              @click="handleAddWxaAction"
            >
              上传代码
            </el-button>
            <!-- <el-button type="success" v-if="detail.weappTemplate.template_id > detail.weapp.template_id" @click="handleAddWxaActionSubmitReview">上传代码</el-button> -->
            <el-button
              v-if="detail.weapp.audit_status === 3"
              type="success"
              @click="handleAddWxaActionSubmitReview"
            >
              提交审核
            </el-button>
            <el-button
              v-else-if="isForceUpdate || detail.weapp.audit_status === 1"
              type="success"
              @click="handleAddWxaAction"
            >
              重新提交
            </el-button>
            <el-button
              v-if="detail.weapp.audit_status === 2"
              type="info"
              @click="handleUndocodeaudit"
            >
              审核撤回
            </el-button>
            <el-button
              v-if="detail.weapp.audit_status === 0"
              type="warning"
              @click="handleRevertcoderelease"
            >
              回退版本
            </el-button>
            <!--只有在审核中才需要查看体验二维码-->
            <el-button
              v-if="detail.weapp.audit_status === 3 || detail.weapp.audit_status === 2"
              type="info"
              @click="downloadTextWxaCode"
            >
              体验二维码
            </el-button>
            <el-button type="success" @click="tryRelease"> 尝试发布 </el-button>
            <el-button type="primary" @click="handleBind"> 更新授权 </el-button>
            <el-button type="success" @click="domain"> 域名 </el-button>
            <el-button v-if="system_is_saas == 'false'" type="success" @click="handleEditTemplate">
              编辑模板
            </el-button>
            <el-button v-if="system_is_saas == 'false'" type="primary" @click="getdomain">
              小程序合法域名
            </el-button>
            <router-link
              :to="`/wxapp/manage/editauthorize/policy?app_id=${detail.authorizer_appid}&nick_name=${detail.nick_name}`"
              style="margin-left: 5px"
            >
              <el-button type="success"> 用户隐私保护指引 </el-button>
            </router-link>
          </div>
        </div>
        <div v-else class="content-center no-bind">
          <div>
            <i class="iconfont icon-info-circle" style="font-size: 70px" />
          </div>
          <div class="content-padded">未绑定小程序</div>
          <el-button type="primary" @click="handleBind"> 授权小程序 </el-button>
        </div>
      </section>
      <el-dialog title="小程序码" :visible.sync="wxaCodeVisible">
        <div class="content-center">
          <img :src="wxaCodeImage">
        </div>
      </el-dialog>
      <el-dialog title="配置" class="right-dialog" :visible.sync="wxaConfigVisible">
        <el-form ref="form" :model="form" label-position="left" label-width="180px">
          <div class="section-body">
            <el-form-item label="自动发布：">
              <el-switch v-model="form.auto_publish" :active-value="1" :inactive-value="0" />
            </el-form-item>
            <el-form-item label="appsecret：">
              <el-col :span="18">
                <el-input
                  v-model="form.authorizer_appsecret"
                  placeholder="请输入小程序appsecret"
                  show-password
                />
              </el-col>
            </el-form-item>
          </div>
          <div class="section-footer with-border content-center">
            <el-button type="primary" @click="configSave"> 保 存 </el-button>
          </div>
        </el-form>
      </el-dialog>

      <el-dialog title="域名" class="right-dialog" :visible.sync="wxaDomainVisible">
        <p class="frm-tips">
          对比当前小程序域名和本地实际配置的域名，判断小程序域名是否一致，否则可能导致小程序报错，因为域名不在白名单内
        </p>
        <el-form label-width="160px" size="mini">
          <el-collapse accordion>
            <el-collapse-item title="当前小程序域名" name="1">
              <el-form-item label="request合法域名:">
                <div v-for="requestdomain in domainform.wxDomain.requestdomain">
                  {{ requestdomain }}
                </div>
              </el-form-item>
              <el-form-item label="socket合法域名:">
                <div v-for="wsrequestdomain in domainform.wxDomain.wsrequestdomain">
                  {{ wsrequestdomain }}
                </div>
              </el-form-item>
              <el-form-item label="uploadFile合法域名:">
                <div v-for="uploaddomain in domainform.wxDomain.uploaddomain">
                  {{ uploaddomain }}
                </div>
              </el-form-item>
              <el-form-item label="downloadFile合法域名:">
                <div v-for="downloaddomain in domainform.wxDomain.downloaddomain">
                  {{ downloaddomain }}
                </div>
              </el-form-item>
              <el-form-item label="业务域名:">
                <div v-for="webviewdomain in domainform.wxDomain.webviewdomain">
                  {{ webviewdomain }}
                </div>
              </el-form-item>
            </el-collapse-item>
          </el-collapse>

          <el-collapse accordion>
            <el-collapse-item title="本地配置的域名" name="2">
              <el-form-item label="request合法域名:">
                <div v-for="requestdomain in domainform.localDomain.requestdomain">
                  {{ requestdomain }}
                </div>
              </el-form-item>
              <el-form-item label="socket合法域名:">
                <div v-for="wsrequestdomain in domainform.localDomain.wsrequestdomain">
                  {{ wsrequestdomain }}
                </div>
              </el-form-item>
              <el-form-item label="uploadFile合法域名:">
                <div v-for="uploaddomain in domainform.localDomain.uploaddomain">
                  {{ uploaddomain }}
                </div>
              </el-form-item>
              <el-form-item label="downloadFile合法域名:">
                <div v-for="downloaddomain in domainform.localDomain.downloaddomain">
                  {{ downloaddomain }}
                </div>
              </el-form-item>
              <el-form-item label="业务域名:">
                <div v-for="webviewdomain in domainform.localDomain.webviewdomain">
                  {{ webviewdomain }}
                </div>
              </el-form-item>
            </el-collapse-item>
          </el-collapse>
        </el-form>
        <div class="section-footer with-border content-center">
          <el-button type="primary" @click="domainSave"> 推 送 </el-button>
        </div>
      </el-dialog>

      <!--编辑模板-->
      <el-dialog
        title="编辑模板"
        width="60%"
        :visible.sync="TemplateEditDialog"
        :before-close="handleCancelLabelsDialog"
      >
        <template>
          <el-form ref="form" :model="weappTemplate" class="demo-ruleForm" label-width="200px">
            <el-form-item
              class="content-left"
              label="小程序唯一标示(英文)"
              prop="key_name"
              :rules="[{ required: true, message: '请输入英文标识', trigger: 'blur' }]"
            >
              <el-input
                v-if="weappTemplate.id"
                v-model="weappTemplate.key_name"
                placeholder="例如：yykweishop"
                disabled
              />
              <el-input v-else v-model="weappTemplate.key_name" placeholder="例如：yykweishop" />
            </el-form-item>
            <el-form-item class="content-left" label="小程序模板名称">
              <el-input v-model="weappTemplate.name" placeholder="例如：yykweishop" disabled />
            </el-form-item>
            <el-form-item class="content-left" label="模板id">
              <el-input v-model="weappTemplate.template_id" placeholder="例如：30" />
            </el-form-item>
            <el-form-item class="content-left" label="模板版本">
              <el-input v-model="weappTemplate.version" placeholder="例如：v2.0" />
            </el-form-item>
            <el-form-item class="content-center">
              <el-button type="primary" @click="saveTemplate"> 确定保存 </el-button>
            </el-form-item>
          </el-form>
        </template>
      </el-dialog>

      <!--    设置小程序合法域名-->
      <el-dialog title="设置小程序合法域名" width="60%" :visible.sync="domainDialog">
        <el-alert
          title="请添加每个域名后回车"
          description="mmbiz.qpic.cn,wx.qlogo.cn"
          type="info"
          show-icon
          :closable="false"
        />
        <br>
        <el-form v-loading="domainloading" label-width="200px">
          <el-form-item label="request合法域名">
            <el-input
              v-model="domainData.requestdomain"
              type="textarea"
              :rows="3"
              placeholder="请输入合法域名"
              prop="domain.requestdomain"
              :rules="[{ required: true, message: 'request合法域名', trigger: 'blur' }]"
            />
          </el-form-item>
          <el-form-item label="socket合法域名">
            <el-input
              v-model="domainData.wsrequestdomain"
              type="textarea"
              :rows="3"
              placeholder="请输入合法域名"
            />
          </el-form-item>
          <el-form-item label="uploadFile合法域名">
            <el-input
              v-model="domainData.uploaddomain"
              type="textarea"
              :rows="3"
              placeholder="请输入合法域名"
            />
          </el-form-item>
          <el-form-item label="downloadFile合法域名">
            <el-input
              v-model="domainData.downloaddomain"
              type="textarea"
              :rows="6"
              placeholder="请输入合法域名"
            />
          </el-form-item>
          <el-form-item label="业务合法域名">
            <el-input
              v-model="domainData.webviewdomain"
              type="textarea"
              :rows="6"
              placeholder="请输入合法域名"
            />
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button type="primary" @click="setdomain">确 定</el-button>
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
      submitWxa(params).then(response => {
        this.$message({
          message: '上传代码成功',
          type: 'success',
          duration: 5 * 1000
        })
        getWxa(this.$route.query.wxapp_id).then(response => {
          this.detail = response.data.data
          this.$store.dispatch('setWxappId', this.$route.query.wxapp_id)
          this.$router.push({ path: this.matchInternalRoute('editauthorize') })
        })
      })
    } else {
      if (this.wxapp_id) {
        this.loading = true
        getWxa(this.wxapp_id).then(response => {
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
      saveTemplate(data).then(response => {
        this.TemplateEditDialog = false
      })
    },
    // 获取小程序域名（全局）
    getdomain() {
      this.domainDialog = true
      this.domainloading = true
      getdomain().then(res => {
        this.domainData = res.data.data
        this.domainloading = false
      })
    },
    // 设置小程序域名
    setdomain() {
      setdomain({ domain: this.domainData }).then(res => {
        if (res.data.data.status === true) {
          this.domainDialog = false
          this.$message({ message: '保存成功', type: 'success', duration: 2 * 1000 })
        } else {
          this.$message({ message: '保存异常', type: 'error', duration: 2 * 1000 })
        }
      })
    },
    handleBind() {
      let params = {
        callback_url: this.wxAuthCallbackUrl + 'auth/wxa'
      }
      getWechatPreAuthUrl(params).then(response => {
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
      getWxa(this.wxapp_id).then(response => {
        this.detail = response.data.data
        this.loading = false
      })
    },
    // 撤销审核
    handleUndocodeaudit() {
      this.$confirm(
        '单个帐号每天审核撤回次数最多不超过1次，一个月不超过10次, 是否撤销审核?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          undocodeaudit({ wxaAppId: this.detail.authorizer_appid }).then(response => {
            this.$message({
              message: '撤销成功',
              type: 'success',
              duration: 2 * 1000
            })
            this.getWxa()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // 回退版本
    handleRevertcoderelease() {
      this.$confirm('回退到上一个小程序版本, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          revertcoderelease({ wxaAppId: this.detail.authorizer_appid }).then(response => {
            this.$message({
              message: '回退成功',
              type: 'success',
              duration: 2 * 1000
            })
            this.getWxa()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    handleAddWxaActionOnliCode() {
      this.submitWeappForm.wxaAppId = this.detail.authorizer_appid
      this.submitWeappForm.wxa_name = this.detail.nick_name
      this.submitWeappForm.templateName = this.detail.weapp.template_name
      submitOnlyCode(this.submitWeappForm).then(response => {
        this.$message({
          message: '上传代码成功，可查看体验版',
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
      submitReview(this.submitWeappForm).then(response => {
        this.$message({
          message: '提交成功，等待微信审核',
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
        this.$confirm('将重新提交小程序, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            submitWxa(this.submitWeappForm).then(response => {
              this.$message({
                message: '上传并提交成功，等待微信审核',
                type: 'success',
                duration: 5 * 1000
              })
              this.getWxa()
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      } else {
        submitWxa(this.submitWeappForm).then(response => {
          this.$message({
            message: '上传并提交成功，等待微信审核',
            type: 'success',
            duration: 5 * 1000
          })
          this.getWxa()
        })
      }
    },
    downloadTextWxaCode() {
      let params = { wxaAppId: this.detail.authorizer_appid }
      getTestQrcode(params).then(response => {
        this.wxaCodeImage = response.data.data.base64Image
        this.wxaCodeVisible = true
      })
    },
    tryRelease() {
      let params = { wxaAppId: this.detail.authorizer_appid }
      tryRelease(params).then(response => {
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
        .then(response => {
          this.wxaCodeImage = response.data.data.base64Image
          this.wxaCodeVisible = true
          this.getwxcodeloading = false
        })
        .catch(error => {
          this.getwxcodeloading = false
        })
    },
    config() {
      this.wxaConfigVisible = true
    },
    configSave() {
      let params = this.form
      configSubmitHandle(this.wxapp_id, params).then(response => {
        this.wxaConfigVisible = false
        this.$message({
          message: '配置成功',
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
      getDomainList(params).then(res => {
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
      saveDomain(params).then(response => {
        this.wxaDomainVisible = false
        this.$message({
          message: '推送成功',
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
