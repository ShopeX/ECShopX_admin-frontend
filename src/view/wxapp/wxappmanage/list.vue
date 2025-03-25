<template>
  <div>
    <div v-if="$route.path.indexOf('policy') === -1">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="微信小程序" name="miniprogram">
          <el-table
            v-loading="loading"
            :data="tableList"
            style="width: 100%"
            :height="wheight - 200"
            @expand-change="handleExpandChange"
          >
            <el-table-column label="绑定详情" width="80" type="expand" fixed="left">
              <template slot-scope="scope">
                <el-descriptions
                  v-if="scope.row.authorizer && scope.row.authorizer.is_direct == 1"
                  title=""
                  :column="2"
                  size="'small'"
                  border
                  class="descriptions"
                >
                  <el-descriptions-item label="小程序名称">
                    {{ scope.row.authorizer.nick_name }}
                  </el-descriptions-item>
                  <el-descriptions-item label="小程序Appid">
                    {{ scope.row.authorizer.authorizer_appid }}
                  </el-descriptions-item>
                </el-descriptions>
                <el-descriptions
                  v-if="scope.row.authorizer && scope.row.authorizer.is_direct == 0"
                  title=""
                  :column="2"
                  size="'small'"
                  border
                  class="descriptions"
                >
                  <el-descriptions-item label="小程序名称">
                    {{ scope.row.authorizer.nick_name }}
                  </el-descriptions-item>
                  <el-descriptions-item label="小程序Appid">
                    {{ scope.row.authorizer.authorizer_appid }}
                  </el-descriptions-item>
                  <el-descriptions-item label="线上版本">
                    <div>{{ scope.row.authorizer.weapp.release_ver }}</div>
                  </el-descriptions-item>
                  <el-descriptions-item label="本地版本">
                    {{ scope.row.authorizer.weappTemplate.version }}
                    <el-alert
                      v-if="
                        scope.row.authorizer.weappTemplate.template_id >
                        scope.row.authorizer.weapp.template_id
                      "
                      size="10px"
                      title="请更新到最新版本"
                      type="warning"
                      :closable="false"
                    />
                    <el-alert v-else title="当前已是最新版本" type="success" :closable="false" />
                  </el-descriptions-item>
                  <el-descriptions-item label="上架状态">
                    <span v-if="scope.row.authorizer.weapp.release_status == '1'">已上架</span>
                    <span v-else type="gray">未上架</span>
                  </el-descriptions-item>
                  <el-descriptions-item label="审核状态">
                    <span v-if="scope.row.authorizer.weapp.audit_status == '1'">审核失败</span>
                    <!--审核成功并且已经上架则不需要显示-->
                    <span
                      v-else-if="
                        scope.row.authorizer.weapp.audit_status == '0' &&
                        scope.row.authorizer.weapp.release_status != '1'
                      "
                      type="success"
                      >审核成功</span
                    >
                    <span v-else-if="scope.row.authorizer.weapp.audit_status == '3'" type="success"
                      >待提交</span
                    >
                    <span v-else-if="scope.row.authorizer.weapp.audit_status == '2'" type="primary"
                      >审核中</span
                    >
                  </el-descriptions-item>
                  <el-descriptions-item
                    label="审核失败原因"
                    :content-style="{ 'text-align': 'left' }"
                  >
                    <span
                      v-if="
                        scope.row.authorizer.weapp.audit_status == '1' &&
                        scope.row.authorizer.weapp.reason
                      "
                    >
                      <div class="content-item" v-html="scope.row.authorizer.weapp.reason" />
                    </span>
                  </el-descriptions-item>
                </el-descriptions>
                <div
                  v-if="scope.row.authorizer && scope.row.authorizer.is_direct == 0"
                  class="content-center"
                >
                  <el-button type="success" @click="config"> 配置 </el-button>
                  <el-button
                    v-if="
                      scope.row.authorizer.weappTemplate.template_id >
                      scope.row.authorizer.weapp.template_id
                    "
                    type="success"
                    @click="handleAddWxaAction('true')"
                  >
                    仅上传代码
                  </el-button>
                  <el-button
                    v-if="scope.row.authorizer.weapp.audit_status === 3"
                    type="success"
                    @click="handleAddWxaActionSubmitReview"
                  >
                    提交审核
                  </el-button>
                  <el-button
                    v-if="
                      scope.row.authorizer.weappTemplate.template_id >
                      scope.row.authorizer.weapp.template_id
                    "
                    type="success"
                    @click="handleAddWxaAction('false')"
                  >
                    上传代码并提交审核
                  </el-button>
                  <el-button
                    v-else-if="scope.row.authorizer.weapp.audit_status == '1'"
                    type="success"
                    @click="handleAddWxaAction('false')"
                  >
                    重新提审
                  </el-button>

                  <!---  v-if="scope.row.authorizer.weapp.audit_status === 3 || scope.row.authorizer.weapp.audit_status === 2" -->
                  <el-button
                    v-if="scope.row.authorizer.weapp.audit_status === 2"
                    type="info"
                    @click="handleUndocodeaudit"
                  >
                    审核撤回
                  </el-button>
                  <el-button
                    v-if="scope.row.authorizer.weapp.audit_status === 0"
                    type="warning"
                    @click="handleRevertcoderelease"
                  >
                    回退版本
                  </el-button>

                  <el-button type="success" @click="tryRelease"> 尝试发布 </el-button>
                  <el-button type="success" @click="domain"> 域名 </el-button>
                  <el-button
                    v-if="system_is_saas == 'false'"
                    type="success"
                    @click="handleEditTemplate"
                  >
                    编辑模板
                  </el-button>
                  <el-button v-if="system_is_saas == 'false'" type="primary" @click="getdomain">
                    小程序合法域名
                  </el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="模版名称" width="180" />
            <el-table-column label="小程序APPID" width="180">
              <template slot-scope="scope">
                <span v-if="scope.row.authorizer">
                  {{ scope.row.authorizer.authorizer_appid }}</span
                >
              </template>
            </el-table-column>
            <el-table-column label="小程序码" width="100">
              <template slot-scope="scope">
                <div
                  v-if="scope.row.authorizer && scope.row.authorizer.authorizer_appid"
                  @click="downloadWxaCode(scope.row)"
                >
                  <img src="@/assets/img/code.png" alt="">
                </div>
              </template>
            </el-table-column>
            <el-table-column label="绑定状态" width="80">
              <template slot-scope="scope">
                <span v-if="scope.row.authorizer && scope.row.authorizer.authorizer_appid">
                  <el-tag v-if="scope.row.authorizer.is_direct == 1" type="success" size="mini"
                    >已绑定直连</el-tag
                  >
                  <el-tag v-if="scope.row.authorizer.is_direct == 0" type="success" size="mini"
                    >已绑第三方</el-tag
                  >
                </span>
                <el-tag v-else type="gray" size="mini"> 未绑定 </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="key_name" label="模版英文名" width="140" />
            <el-table-column label="绑定操作" fixed="right">
              <template slot-scope="scope">
                <div v-if="scope.row.authorizer && scope.row.authorizer.authorizer_appid">
                  <el-button-group>
                    <el-button
                      v-if="scope.row.authorizer.is_direct == 1"
                      size="mini"
                      type="text"
                      plain
                      @click="bindUpdateWxapp('miniprogram', scope.row)"
                    >
                      更换绑定
                    </el-button>
                    <el-button
                      v-if="scope.row.authorizer.is_direct == 0"
                      size="mini"
                      type="text"
                      plain
                      @click="handleBind(scope.row)"
                    >
                      更换绑定
                    </el-button>
                    <el-button
                      size="mini"
                      type="text"
                      plain
                      @click="downloadTextWxaCode(scope.row)"
                    >
                      体验二维码
                    </el-button>
                  </el-button-group>
                </div>
                <div v-else>
                  <el-button-group>
                    <el-button size="mini" type="text" plain @click="handleBind(scope.row)">
                      授权第三方
                    </el-button>
                    <el-button
                      size="mini"
                      type="text"
                      plain
                      @click="bindWxapp('miniprogram', scope.row)"
                    >
                      添加直连小程序
                    </el-button>
                  </el-button-group>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="其他操作" fixed="right">
              <template slot-scope="scope">
                <span v-if="scope.row.authorizer && scope.row.authorizer.authorizer_appid">
                  <router-link
                    :to="{
                      path: '/wxapp/manage/editdashboard',
                      query: { app_id: scope.row.authorizer.authorizer_appid }
                    }"
                    style="margin-left: 5px"
                  >
                    <el-button size="mini" type="text" plain>数据分析</el-button>
                  </router-link>

                  <router-link
                    :to="{
                      path: '/wxapp/manage/editsourcemanagement',
                      query: { app_id: scope.row.authorizer.authorizer_appid }
                    }"
                    style="margin-left: 5px"
                  >
                    <el-button size="mini" type="text" plain>千人千码</el-button>
                  </router-link>

                  <router-link
                    :to="{
                      path: '/wxapp/manage/noticemessage',
                      query: {
                        app_id: scope.row.authorizer.authorizer_appid,
                        tmp_name: scope.row.key_name
                      }
                    }"
                    style="margin-left: 5px"
                  >
                    <el-button size="mini" type="text" plain>订阅通知</el-button>
                  </router-link>

                  <router-link
                    v-if="scope.row.authorizer.is_direct == 0"
                    :to="{
                      path: matchHidePage('policy'),
                      query: {
                        app_id: scope.row.authorizer.authorizer_appid,
                        nick_name: scope.row.authorizer.nick_name
                      }
                    }"
                    style="margin-left: 5px"
                  >
                    <el-button size="mini" type="text" plain>隐私指引</el-button>
                  </router-link>
                </span>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="page.total_count > pageLimit" class="content-padded content-center">
            <el-pagination
              layout="prev, pager, next"
              :total="page.total_count"
              :page-size="pageLimit"
              @current-change="onCurrentChange"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="微信服务号" name="offiaccount">
          <el-table
            v-loading="loading"
            :data="authorizerData"
            style="width: 100%"
            :height="wheight - 200"
          >
            <el-table-column prop="nick_name" label="公众号昵称" width="180" />
            <el-table-column prop="authorizer_appid" label="公众号APPID" width="180" />
            <el-table-column label="二维码" width="100">
              <template slot-scope="scope">
                <div
                  v-if="scope.row.authorizer_appid"
                  @click="downloadOffiaccountCode(scope.row.authorizer_appid)"
                >
                  <img src="@/assets/img/code.png" alt="">
                </div>
              </template>
            </el-table-column>
            <el-table-column label="绑定状态" width="80">
              <template slot-scope="scope">
                <span v-if="scope.row.authorizer_appid">
                  <el-tag v-if="scope.row.is_direct == 1" type="success" size="mini"
                    >已绑定直连</el-tag
                  >
                  <el-tag v-if="scope.row.is_direct == 0" type="success" size="mini"
                    >已绑第三方</el-tag
                  >
                </span>
                <el-tag v-else type="gray" size="mini"> 未绑定 </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="绑定操作" fixed="right">
              <template slot-scope="scope">
                <div v-if="scope.row.authorizer_appid">
                  <el-button-group>
                    <el-button
                      v-if="scope.row.is_direct == 1"
                      size="mini"
                      type="text"
                      plain
                      @click="bindUpdateWxapp('offiaccount', scope.row)"
                    >
                      更换绑定
                    </el-button>
                    <el-button
                      v-if="scope.row.is_direct == 0"
                      size="mini"
                      type="text"
                      plain
                      @click="handleBindOffiaccount"
                    >
                      更新授权
                    </el-button>
                  </el-button-group>
                </div>
                <div v-else>
                  <el-button-group>
                    <el-button size="mini" type="text" plain @click="handleBindOffiaccount">
                      授权第三方
                    </el-button>
                    <el-button
                      size="mini"
                      type="text"
                      plain
                      @click="bindWxapp('offiaccount', scope.row)"
                    >
                      添加直连公众号
                    </el-button>
                  </el-button-group>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <router-view />

    <el-drawer :visible.sync="direct_link_applet" :title="directLinkFormLabel.title" size="40%">
      <div class="drawer-content">
        <el-form>
          <el-form-item :label="directLinkFormLabel.appid[0]">
            <el-col :span="10">
              <el-input
                v-model="directLinkForm.authorizer_appid"
                :placeholder="directLinkFormLabel.appid[1]"
              />
            </el-col>
          </el-form-item>
          <el-form-item :label="directLinkFormLabel.appsecret[0]">
            <el-col :span="10">
              <el-input
                v-model="directLinkForm.authorizer_appsecret"
                :placeholder="directLinkFormLabel.appsecret[1]"
              />
            </el-col>
          </el-form-item>
          <el-form-item :label="directLinkFormLabel.nick_name[0]">
            <el-col :span="10">
              <el-input
                v-model="directLinkForm.nick_name"
                :placeholder="directLinkFormLabel.nick_name[1]"
              />
            </el-col>
          </el-form-item>
          <el-form-item :label="directLinkFormLabel.signature[0]">
            <el-col :span="10">
              <el-input
                v-model="directLinkForm.signature"
                :placeholder="directLinkFormLabel.signature[1]"
              />
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmitWxapp(directLinkForm.bind_type)">
              保 存
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>

    <el-dialog :title="getwxcodeTitle" :visible.sync="wxaCodeVisible" width="500px">
      <div class="content-center">
        <img :src="wxaCodeImage">
      </div>
    </el-dialog>

    <el-dialog title="配置" class="right-dialog" :visible.sync="wxaConfigVisible">
      <el-form ref="configForm" :model="configForm" label-position="left" label-width="180px">
        <div class="section-body">
          <el-form-item label="自动发布：">
            <el-switch v-model="configForm.auto_publish" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item label="appsecret：">
            <el-col :span="18">
              <el-input
                v-model="configForm.authorizer_appsecret"
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
</template>
<script>
import { mapGetters } from 'vuex'
import sideBar from '@/components/element/sideBar'
import {
  getWxa,
  submitWxa,
  getCodeUnlimit,
  getTestQrcode,
  tryRelease,
  revertcoderelease,
  undocodeaudit,
  configSubmitHandle,
  submitReview,
  getDomainList,
  saveDomain,
  setdomain,
  getdomain,
  saveTemplate,
  addWxapp
} from '@/api/wxa'
import { getWechatPreAuthUrl, getAuthorizerInfo, getOffiaccountCodeForever } from '@/api/wechat'
import mixin, { pageMixin } from '@/mixins'
export default {
  components: {
    sideBar
  },
  provide() {
    return {
      refresh: this.getDataList
    }
  },
  mixins: [mixin, pageMixin],
  data() {
    return {
      activeName: 'miniprogram',
      loading: false,
      pageLimit: 10,
      direct_link_applet: false,
      applet_detail: false,
      params: {},
      authorizerUrl: '',
      detail: {},
      directLinkForm: {
        bind_type: 'miniprogram',
        template_name: '',
        authorizer_appid: '',
        authorizer_appsecret: '',
        signature: '',
        nick_name: ''
      },
      directLinkFormLabel: {
        title: '配置直连小程序',
        appid: { 0: '小程序APPID：', 1: '请输入小程序appid' },
        appsecret: { 0: '小程序APPSECRET：', 1: '请输入小程序appsecret' },
        signature: { 0: '小程序描述：', 1: '请输入小程序描述' },
        nick_name: { 0: '小程序名称：', 1: '请输入小程序名称' }
      },
      getwxcodeloading: false,
      getwxcodeTitle: '',
      wxaCodeImage: '',
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
      submitWeappForm: {},
      tabList: [
        { name: '微信小程序', activeName: 'miniprogram' },
        { name: '微信服务号', activeName: 'offiaccount' }
      ],
      authorizerData: [
        {
          name: '-',
          alias: '-',
          authorizer_appid: '',
          business_info: [],
          func_info: '-',
          head_img: '-',
          miniprograminfo: [],
          nick_name: '服务号',
          principal_name: '-',
          qrcode_url: '-',
          service_type_info: 2,
          signature: '服务号',
          user_name: '-',
          verify_type_info: -1
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.params = { page: 1, pageSize: this.pageLimit }
    this.fetchList()
  },
  methods: {
    async fetchList() {
      this.loading = true
      const { list, total_count } = await this.$api.minimanage.gettemplateweapplist()

      this.tableList = list
      this.page.total_count = total_count
      this.loading = false
    },
    bindWxapp(bind_type, data) {
      this.direct_link_applet = true
      this.directLinkForm = {
        bind_type: bind_type,
        template_name: data.key_name,
        authorizer_appid: '',
        authorizer_appsecret: '',
        signature: '',
        nick_name: ''
      }
      this.setdirectLinkFormLabel(bind_type)
    },
    bindUpdateWxapp(bind_type, data) {
      this.direct_link_applet = true
      if (bind_type == 'miniprogram') {
        this.directLinkForm = {
          bind_type: bind_type,
          template_name: data.key_name,
          authorizer_appid: data.authorizer.authorizer_appid,
          authorizer_appsecret: data.authorizer.authorizer_appsecret,
          signature: data.authorizer.signature,
          nick_name: data.authorizer.nick_name
        }
      }
      if (bind_type == 'offiaccount') {
        this.directLinkForm = {
          bind_type: bind_type,
          authorizer_appid: data.authorizer_appid,
          authorizer_appsecret: data.authorizer_appsecret,
          signature: data.signature,
          nick_name: data.nick_name
        }
      }
      this.setdirectLinkFormLabel(bind_type)
    },
    handleSubmitWxapp(bind_type) {
      this.directLinkForm.bind_type = bind_type
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
    setdirectLinkFormLabel(bind_type) {
      if (bind_type == 'offiaccount') {
        this.directLinkFormLabel = {
          title: '配置直连公众号',
          appid: { 0: '公众号APPID：', 1: '请输入公众号appid' },
          appsecret: { 0: '公众号APPSECRET：', 1: '请输入公众号appsecret' },
          signature: { 0: '公众号描述：', 1: '请输入公众号描述' },
          nick_name: { 0: '公众号名称：', 1: '请输入公众号名称' }
        }
      }
    },
    handleBind({ key_name }) {
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
    handleBindOffiaccount() {
      if (this.url) {
        var metadata = document.getElementsByTagName('meta')
        for (var i = 0; i < metadata.length; i++) {
          if (metadata[i]['name'] == 'referrer') {
            metadata[i]['content'] = 'default'
          }
        }
        window.open(this.url, '_blank')
      } else {
        this.$message({
          message: '请确认已经配置好第三方开放平台',
          type: 'error',
          duration: 5 * 1000
        })
      }
    },
    showBindDetail(data) {
      this.applet_detail = true
      getWxa(data.authorizer.authorizer_appid).then((response) => {
        this.detail = response.data.data
        this.weappTemplate = this.detail.weappTemplate
        this.configForm.auto_publish = response.data.data.auto_publish
        this.configForm.authorizer_appsecret = response.data.data.authorizer_appsecret
        console.log(this.detail)
      })
    },
    downloadWxaCode(rowdata) {
      this.getwxcodeloading = true
      this.getwxcodeTitle = '小程序码'
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
      this.getwxcodeTitle = '体验二维码'
      let params = {
        wxaAppId: rowdata.authorizer.authorizer_appid,
        is_direct: rowdata.authorizer.is_direct
      }

      getTestQrcode(params).then((response) => {
        this.wxaCodeImage = response.data.data.base64Image
        this.wxaCodeVisible = true
      })
    },
    downloadOffiaccountCode(authorizer_appid) {
      this.getwxcodeloading = true
      this.getwxcodeTitle = '服务号二维码'
      let params = { authorizer_appid: authorizer_appid, is_base64: true }
      getOffiaccountCodeForever(params)
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
      let params = this.configForm
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
    handleExpandChange(row, expanded) {
      this.showBindDetail(row)
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
      console.log('===this.detail==>', this.detail)
      this.submitWeappForm.wxaAppId = this.detail.authorizer_appid
      this.submitWeappForm.wxa_name = this.detail.nick_name
      this.submitWeappForm.templateName = this.detail.weapp
        ? this.detail.weapp.template_name
        : this.detail.weapp
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
    },
    handleClick() {
      if (this.activeName === 'miniprogram') {
      } else if (this.activeName === 'offiaccount') {
        this.getUrl()
        getAuthorizerInfo().then((response) => {
          if (response.data.data.authorizer_appid) {
            this.authorizerData = []
            this.authorizerData.push(response.data.data)
          }
          console.log(this.authorizerData)
        })
      }
    },
    getUrl: function () {
      // 获取服务号授权url
      let params = {
        callback_url: this.wxAuthCallbackUrl + 'auth/woa'
      }
      getWechatPreAuthUrl(params).then((response) => {
        this.url = response.data.data.url
      })
    }
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
.drawer-content {
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
