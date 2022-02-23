<template>
  <div>
    <div v-if="$route.path.indexOf('policy') === -1">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="微信小程序" name="wechat">
          <el-table :data="dataLists" style="width: 100%" :height="wheight - 200" v-loading="loading" @expand-change="handleExpandChange">
            <el-table-column label="绑定详情" width="80" type="expand" fixed="left">
              <template slot-scope="scope">
                <el-descriptions title="" :column="2" size="'small'" border class="descriptions"  v-if="scope.row.authorizer && scope.row.authorizer.is_direct == 1" >
                  <el-descriptions-item label="小程序名称">
                    {{scope.row.authorizer.nick_name}}
                  </el-descriptions-item>
                  <el-descriptions-item label="小程序Appid">
                    {{scope.row.authorizer.authorizer_appid}}
                  </el-descriptions-item>
                </el-descriptions>
                <el-descriptions title="" :column="2" size="'small'" border class="descriptions"  v-if="scope.row.authorizer && scope.row.authorizer.is_direct == 0" >
                  <el-descriptions-item label="小程序名称">
                    {{scope.row.authorizer.nick_name}}
                  </el-descriptions-item>
                  <el-descriptions-item label="小程序Appid">
                    {{scope.row.authorizer.authorizer_appid}}
                  </el-descriptions-item>
                  <el-descriptions-item label="线上版本">
                    <div>{{ scope.row.authorizer.weapp.release_ver }}</div>
                  </el-descriptions-item>
                  <el-descriptions-item label="本地版本">
                    {{ scope.row.authorizer.weappTemplate.version }}
                    <el-alert size="10px" v-if="scope.row.authorizer.weappTemplate.template_id > scope.row.authorizer.weapp.template_id" title="请更新到最新版本" type="warning" :closable="false"/>
                    <el-alert  v-else title="当前已是最新版本" type="success" :closable="false"/>
                  </el-descriptions-item>
                  <el-descriptions-item label="上架状态">
                    <span v-if="scope.row.authorizer.weapp.release_status == '1'">已上架</span>
                      <span v-else type="gray">未上架</span>
                  </el-descriptions-item>
                  <el-descriptions-item label="审核状态">
                    <span v-if="scope.row.authorizer.weapp.audit_status == '1'">审核失败</span>
                      <!--审核成功并且已经上架则不需要显示-->
                    <span
                      v-else-if="scope.row.authorizer.weapp.audit_status == '0' && scope.row.authorizer.weapp.release_status != '1'"
                      type="success"
                      >审核成功</span>
                    <span v-else-if="scope.row.authorizer.weapp.audit_status == '3'" type="success">待提交</span>
                    <span v-else-if="scope.row.authorizer.weapp.audit_status == '2'" type="primary">审核中</span>
                  </el-descriptions-item>
                  <el-descriptions-item label="审核失败原因" :contentStyle="{'text-align': 'left'}">
                      <span v-if="scope.row.authorizer.weapp.audit_status == '1' && scope.row.authorizer.weapp.reason">
                          <div class="content-item" v-html="scope.row.authorizer.weapp.reason"></div>
                      </span>
                  </el-descriptions-item>
                </el-descriptions>
                <div class="content-center" v-if="scope.row.authorizer && scope.row.authorizer.is_direct == 0" >
                  <el-button type="success" @click="config">配置</el-button>
                  <el-button
                    type="success"
                    v-if="scope.row.authorizer.weappTemplate.template_id > scope.row.authorizer.weapp.template_id"
                    @click="handleAddWxaAction('true')"
                    >仅上传代码</el-button
                  >
                  <el-button
                    type="success"
                    v-if="scope.row.authorizer.weapp.audit_status === 3"
                    @click="handleAddWxaActionSubmitReview"
                    >提交审核</el-button
                  >
                  <el-button
                    type="success"
                    v-if="scope.row.authorizer.weappTemplate.template_id > scope.row.authorizer.weapp.template_id"
                    @click="handleAddWxaAction('false')"
                    >上传代码并提交审核</el-button
                  >
                  <!---  v-if="scope.row.authorizer.weapp.audit_status === 3 || scope.row.authorizer.weapp.audit_status === 2" -->
                  <el-button type="info" v-if="scope.row.authorizer.weapp.audit_status === 2" @click="handleUndocodeaudit"
                    >审核撤回</el-button
                  >
                  <el-button
                    type="warning"
                    v-if="scope.row.authorizer.weapp.audit_status === 0"
                    @click="handleRevertcoderelease"
                    >回退版本</el-button
                  >

                  <el-button type="success" @click="tryRelease">尝试发布</el-button>
                  <el-button type="success" @click="domain">域名</el-button>
                  <el-button v-if="system_is_saas == 'false'" type="success" @click="handleEditTemplate"
                    >编辑模板</el-button
                  >
                  <el-button v-if="system_is_saas == 'false'" type="primary" @click="getdomain"
                    >小程序合法域名</el-button
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="模版名称" width="180"> </el-table-column>
            <el-table-column label="小程序APPID" width="180"> 
              <template slot-scope="scope">
                <span v-if="scope.row.authorizer"> {{scope.row.authorizer.authorizer_appid}}</span>
              </template>
            </el-table-column>
            <el-table-column label="小程序码" width="100"> 
              <template slot-scope="scope">
                <div v-if="scope.row.authorizer && scope.row.authorizer.authorizer_appid"
                  @click="downloadWxaCode(scope.row)"
                >
                <img src="@/assets/img/code.png" alt="" />
              </div>
              </template>
            </el-table-column>
            <el-table-column label="绑定状态" width="80">
              <template slot-scope="scope">
                <span v-if="scope.row.authorizer && scope.row.authorizer.authorizer_appid">
                <el-tag v-if="scope.row.authorizer.is_direct == 1" type="success" size="mini">已绑定直连</el-tag>
                <el-tag v-if="scope.row.authorizer.is_direct == 0" type="success" size="mini">已绑第三方</el-tag>
                </span>
                <el-tag v-else type="gray" size="mini">未绑定</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="key_name" label="模版英文名" width="140"></el-table-column>
            <el-table-column label="绑定操作" width="120" fixed="right">
              <template slot-scope="scope">
                <div v-if="scope.row.authorizer && scope.row.authorizer.authorizer_appid">
                  <el-button-group><el-button  v-if="scope.row.authorizer.is_direct == 1"
                      size="mini" type="text" plain
                      @click="bindUpdateWxapp(scope.row)">更换绑定</el-button
                    >
                    <el-button  v-if="scope.row.authorizer.is_direct == 0"
                      size="mini" type="text" plain
                      @click="handleBind(scope.row)">更换绑定</el-button
                    >
                    <el-button
                      size="mini" type="text" plain
                      @click="downloadTextWxaCode(scope.row)"
                      >体验二维码</el-button
                    ></el-button-group>
                </div>
                <div v-else>
                  <el-button-group><el-button size="mini" type="text" plain @click="handleBind(scope.row)">授权第三方</el-button>
                  <el-button size="mini" type="text" plain @click="bindWxapp(scope.row)">添加直连小程序</el-button></el-button-group>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="其他操作" fixed="right">
              <template slot-scope="scope">
                <span v-if="scope.row.authorizer && scope.row.authorizer.authorizer_appid">
                  <router-link 
                    :to="{ path: matchHidePage('policy/editdashboard'), query: { app_id: scope.row.authorizer.authorizer_appid}}" 
                    style="margin-left: 5px;"
                  >
                    <el-button size="mini" type="text" plain>数据分析</el-button>
                  </router-link>

                  <router-link 
                    :to="{ path: matchHidePage('policy/editsourcemanagement'), query: { app_id: scope.row.authorizer.authorizer_appid}}" 
                    style="margin-left: 5px;"
                  >
                    <el-button size="mini" type="text" plain>千人千码</el-button>
                  </router-link>

                  <router-link 
                    :to="{ path: matchHidePage('policy/noticemessage'), query: { app_id: scope.row.authorizer.authorizer_appid, tmp_name:scope.row.key_name}}" 
                    style="margin-left: 5px;"
                  >
                    <el-button size="mini" type="text" plain>订阅通知</el-button>
                  </router-link>

                  <router-link  v-if="scope.row.authorizer.is_direct == 0"
                    :to="{ path: matchHidePage('policy'), query: { app_id: scope.row.authorizer.authorizer_appid, nick_name: scope.row.authorizer.nick_name}}"
                    style="margin-left: 5px;"
                  >
                    <el-button size="mini" type="text" plain>隐私指引</el-button>
                  </router-link>
                </span>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="total_count > pageLimit" class="content-padded content-center">
            <el-pagination
              layout="prev, pager, next"
              @current-change="handleCurrentChange"
              :total="total_count"
              :page-size="pageLimit"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <router-view></router-view>

    <el-drawer 
      :visible.sync="direct_link_applet" :title="'添加直连小程序'" size="40%">
      <div class="drawer-content">
        <el-form>
          <el-form-item label="appid：">
            <el-col :span="10">
              <el-input placeholder="请输入小程序appid" v-model="directLinkForm.authorizer_appid"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="appsecret：">
            <el-col :span="10">
              <el-input placeholder="请输入小程序appsecret" v-model="directLinkForm.authorizer_appsecret"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="小程序名称：">
            <el-col :span="10">
              <el-input placeholder="请输入小程序名称" v-model="directLinkForm.nick_name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="小程序描述：">
            <el-col :span="10">
              <el-input placeholder="请输入小程序描述" v-model="directLinkForm.signature"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmitWxapp">保 存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>

    <el-dialog :title="getwxcodeTitle" :visible.sync="wxaCodeVisible" width="500px">
      <div class="content-center">
        <img :src="wxaCodeImage" />
      </div>
    </el-dialog>

    <el-dialog title="配置" class="right-dialog" :visible.sync="wxaConfigVisible">
      <el-form ref="configForm" :model="configForm" label-position="left" label-width="180px">
        <div class="section-body">
          <el-form-item label="自动发布：">
            <el-switch
              v-model="configForm.auto_publish"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </el-form-item>
          <el-form-item label="appsecret：">
            <el-col :span="18">
              <el-input
                placeholder="请输入小程序appsecret"
                v-model="configForm.authorizer_appsecret"
                show-password
              ></el-input>
            </el-col>
          </el-form-item>
        </div>
        <div class="section-footer with-border content-center">
          <el-button type="primary" @click="configSave">保 存</el-button>
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
              <div v-for="uploaddomain in domainform.wxDomain.uploaddomain">{{ uploaddomain }}</div>
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
        <el-button type="primary" @click="domainSave">推 送</el-button>
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
              placeholder="例如：yykweishop"
              v-if="weappTemplate.id"
              disabled
              v-model="weappTemplate.key_name"
            ></el-input>
            <el-input
              placeholder="例如：yykweishop"
              v-else
              v-model="weappTemplate.key_name"
            ></el-input>
          </el-form-item>
          <el-form-item class="content-left" label="小程序模板名称">
            <el-input
              placeholder="例如：yykweishop"
              disabled
              v-model="weappTemplate.name"
            ></el-input>
          </el-form-item>
          <el-form-item class="content-left" label="模板id">
            <el-input placeholder="例如：30" v-model="weappTemplate.template_id"></el-input>
          </el-form-item>
          <el-form-item class="content-left" label="模板版本">
            <el-input placeholder="例如：v2.0" v-model="weappTemplate.version"></el-input>
          </el-form-item>
          <el-form-item class="content-center">
            <el-button type="primary" @click="saveTemplate">确定保存</el-button>
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
      ></el-alert>
      <br />
      <el-form label-width="200px" v-loading="domainloading">
        <el-form-item label="request合法域名">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入合法域名"
            v-model="domainData.requestdomain"
            prop="domain.requestdomain"
            :rules="[{ required: true, message: 'request合法域名', trigger: 'blur' }]"
          ></el-input>
        </el-form-item>
        <el-form-item label="socket合法域名">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入合法域名"
            v-model="domainData.wsrequestdomain"
          ></el-input>
        </el-form-item>
        <el-form-item label="uploadFile合法域名">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入合法域名"
            v-model="domainData.uploaddomain"
          ></el-input>
        </el-form-item>
        <el-form-item label="downloadFile合法域名">
          <el-input
            type="textarea"
            :rows="6"
            placeholder="请输入合法域名"
            v-model="domainData.downloaddomain"
          ></el-input>
        </el-form-item>
        <el-form-item label="业务合法域名">
          <el-input
            type="textarea"
            :rows="6"
            placeholder="请输入合法域名"
            v-model="domainData.webviewdomain"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="setdomain">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import sideBar from '@/components/element/sideBar'
import {
  gettemplateweapplist,
  gettemplateweappdetail
} from '@/api/minimanage'
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
  saveTemplate,
  addWxapp
} from '@/api/wxa'
import { getWechatPreAuthUrl } from '@/api/wechat'

export default {
  components: {
    sideBar
  },
  provide() {
    return {
      refresh: this.getDataList
    }
  },
  data() {
    return {
      activeName: 'wechat',
      dataLists: [],
      loading: false,
      pageLimit: 10,
      total_count: 0,
      direct_link_applet: false,
      applet_detail: false,
      params: {},
      authorizerUrl: '',
      detail: {},
      directLinkForm: {
          template_name:'',
          authorizer_appid:'',
          authorizer_appsecret:'',
          signature:'',
          nick_name:'',
      },
      getwxcodeloading: false,
      getwxcodeTitle: "",
      wxaCodeImage:'',
      wxaCodeVisible: false,
      wxaConfigVisible: false,
      wxaDomainVisible: false,
      TemplateEditDialog: false,
      domainloading: false,
      domainDialog: false,
      configForm: {
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
      },
      submitWeappForm: {
      
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  methods: {
    getDataList() {
      this.loading = true
      gettemplateweapplist()
      .then((response) => {
        this.dataLists = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
      .catch((error) => {
        this.loading = false
      })
    },
    handleCurrentChange(page_num) {
      this.params = { page: page_num, pageSize: this.pageLimit }
      this.getDataList()
    },
    reshandleCurrentChange(page_num) {
      let resparams = { page_no: page_num, page_size: this.pageLimit, is_valid: true }
    },
    bindWxapp(data) {
      this.direct_link_applet = true
      this.directLinkForm = {
          template_name: data.key_name,
          authorizer_appid:'',
          authorizer_appsecret:'',
          signature:'',
          nick_name:'',
      }
    },
    bindUpdateWxapp(data) {
      this.direct_link_applet = true
      this.directLinkForm = {
          template_name: data.key_name,
          authorizer_appid: data.authorizer.authorizer_appid,
          authorizer_appsecret: data.authorizer.authorizer_appsecret,
          signature:data.authorizer.signature,
          nick_name:data.authorizer.nick_name,
      }
    },
    handleSubmitWxapp() {
      addWxapp(this.directLinkForm).then((response) => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 2 * 1000
        })
        this.directLinkForm = {}
        this.direct_link_applet = false
        this.getDataList()
      })
    },
    handleBind({key_name}) {
      let params = {
        callback_url: `${this.wxAuthCallbackUrl}auth/wxa?template_name=${key_name}`
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
    showBindDetail(data) {
      this.applet_detail = true
      getWxa(data.authorizer.authorizer_appid).then((response) => {
        this.detail = response.data.data
        this.weappTemplate = this.detail.weappTemplate
        console.log(this.detail)
      })
    },
    downloadWxaCode(rowdata) {
      this.getwxcodeloading = true
      this.getwxcodeTitle = "小程序码"
      let params = { wxaAppId: rowdata.authorizer.authorizer_appid }
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
    downloadTextWxaCode(rowdata) {
      this.getwxcodeTitle = "体验二维码"
      let params = { wxaAppId: rowdata.authorizer.authorizer_appid, is_direct: rowdata.authorizer.is_direct}

      getTestQrcode(params).then((response) => {
        this.wxaCodeImage = response.data.data.base64Image
        this.wxaCodeVisible = true
      })
    },
    config() {
      this.wxaConfigVisible = true
    },
    configSave() {
      let params = this.form
      configSubmitHandle(this.detail.authorizer_appid, params).then((response) => {
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
        wxaAppId: this.detail.authorizer_appid,
        templateName: this.detail.weappTemplate.key_name
        // templateName = this.detail.weappTemplate.key_name
      }
      getDomainList(params).then((res) => {
        console.log(res)
        this.domainform.wxDomain = res.data.data.wxDomain
        this.domainform.localDomain = res.data.data.localDomain
      })
    },
    domainSave() {
      let params = {
        wxaAppId: this.detail.authorizer_appid,
        templateName: this.detail.weappTemplate.key_name
      }
      saveDomain(params).then((response) => {
        this.wxaDomainVisible = false
        this.$message({
          message: '推送成功',
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
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
          this.$message({ message: '保存成功', type: 'success', duration: 2 * 1000 })
        } else {
          this.$message({ message: '保存异常', type: 'error', duration: 2 * 1000 })
        }
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
          undocodeaudit({ wxaAppId: this.detail.authorizer_appid }).then((response) => {
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
          revertcoderelease({ wxaAppId: this.detail.authorizer_appid }).then((response) => {
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
    handleExpandChange(row,expanded){
      this.showBindDetail(row); 
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
    //提交审核
    handleAddWxaActionSubmitReview() {
      this.submitWeappForm.wxaAppId = this.detail.authorizer_appid
      this.submitWeappForm.wxa_name = this.detail.nick_name
      this.submitWeappForm.templateName = this.detail.weapp.template_name
      submitReview(this.submitWeappForm).then((response) => {
        this.$message({
          message: '提交成功，等待微信审核',
          type: 'success',
          duration: 5 * 1000
        })
        this.getWxa()
      })
    },
    //上架小程序, 上传代码，重新提交代码
    handleAddWxaAction(isOnlySummit) {
      console.log("===this.detail==>",this.detail)
      this.submitWeappForm.wxaAppId = this.detail.authorizer_appid
      this.submitWeappForm.wxa_name = this.detail.nick_name
      this.submitWeappForm.templateName = this.detail.weapp ? this.detail.weapp.template_name : this.detail.weapp;
      this.submitWeappForm.is_only_commit = isOnlySummit

      if (isOnlySummit == 'true') {
        this.$confirm('将重新提交小程序, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            submitWxa(this.submitWeappForm).then((response) => {
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
        submitWxa(this.submitWeappForm).then((response) => {
          this.$message({
            message: '上传成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.getWxa()
        })
      }
    }
  },
  mounted() {
    this.params = { page: 1, pageSize: this.pageLimit }
    let resparams = { page_no: 1, page_size: this.pageLimit, is_valid: true }
    this.getDataList()
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
</style>
<style lang="scss">
.drawer-content{
  padding: 5px 20px;
  .descriptions {
    padding: 0 200px;
  }
  .content-center {
    padding-top: 20px;
  }
  .center-top {
    padding-bottom: 10px;
  }
  .content-item {
    flex: 1;
  }
}

</style>
