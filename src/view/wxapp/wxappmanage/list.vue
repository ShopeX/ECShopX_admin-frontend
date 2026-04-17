<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div v-if="$route.path.indexOf('policy') === -1">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane :label="$t('8b4e7ee3.439845')" name="miniprogram">
          <el-table
            v-loading="loading"
            :data="tableList"
            style="width: 100%"
            @expand-change="handleExpandChange"
          >
            <el-table-column :label="$t('8b4e7ee3.1bd231')" width="80" type="expand" fixed="left">
              <template slot-scope="scope">
                <el-descriptions
                  v-if="scope.row.authorizer && scope.row.authorizer.is_direct == 1"
                  title=""
                  :column="2"
                  size="'small'"
                  border
                  class="descriptions"
                >
                  <el-descriptions-item :label="$t('8b4e7ee3.d34f1f')">
                    {{ scope.row.authorizer.nick_name }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t('8b4e7ee3.a7db15')">
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
                  <el-descriptions-item :label="$t('8b4e7ee3.d34f1f')">
                    {{ scope.row.authorizer.nick_name }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t('8b4e7ee3.a7db15')">
                    {{ scope.row.authorizer.authorizer_appid }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t('8b4e7ee3.7d0a56')">
                    <div>{{ scope.row.authorizer.weapp.release_ver }}</div>
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t('8b4e7ee3.ba147a')">
                    {{ scope.row.authorizer.weappTemplate.version }}
                    <el-alert
                      v-if="
                        scope.row.authorizer.weappTemplate.template_id >
                        scope.row.authorizer.weapp.template_id
                      "
                      size="10px"
                      :title="$t('8b4e7ee3.4c753a')"
                      type="warning"
                      :closable="false"
                    />
                    <el-alert
                      v-else
                      :title="$t('8b4e7ee3.c8b977')"
                      type="success"
                      :closable="false"
                    />
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t('8b4e7ee3.dc0a7b')">
                    <span v-if="scope.row.authorizer.weapp.release_status == '1'">{{
                      $t('8b4e7ee3.2390fa')
                    }}</span>
                    <span v-else type="gray">{{ $t('8b4e7ee3.25744b') }}</span>
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t('8b4e7ee3.b6d0e9')">
                    <span v-if="scope.row.authorizer.weapp.audit_status == '1'">{{
                      $t('8b4e7ee3.fe3661')
                    }}</span>
                    <!--审核成功并且已经上架则不需要显示-->
                    <span
                      v-else-if="
                        scope.row.authorizer.weapp.audit_status == '0' &&
                        scope.row.authorizer.weapp.release_status != '1'
                      "
                      type="success"
                      >{{ $t('8b4e7ee3.94129a') }}</span
                    >
                    <span
                      v-else-if="scope.row.authorizer.weapp.audit_status == '3'"
                      type="success"
                      >{{ $t('8b4e7ee3.a9c09d') }}</span
                    >
                    <span
                      v-else-if="scope.row.authorizer.weapp.audit_status == '2'"
                      type="primary"
                      >{{ $t('8b4e7ee3.b720a6') }}</span
                    >
                  </el-descriptions-item>
                  <el-descriptions-item
                    :label="$t('8b4e7ee3.ec85ac')"
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
                  <el-button type="success" @click="config">{{ $t('8b4e7ee3.224e2c') }}</el-button>
                  <el-button
                    v-if="
                      scope.row.authorizer.weappTemplate.template_id >
                      scope.row.authorizer.weapp.template_id
                    "
                    type="success"
                    @click="handleAddWxaAction('true')"
                  >
                    {{ $t('8b4e7ee3.c9e918') }}
                  </el-button>
                  <el-button
                    v-if="scope.row.authorizer.weapp.audit_status === 3"
                    type="success"
                    @click="handleAddWxaActionSubmitReview"
                  >
                    {{ $t('8b4e7ee3.646db0') }}
                  </el-button>
                  <el-button
                    v-if="
                      scope.row.authorizer.weappTemplate.template_id >
                      scope.row.authorizer.weapp.template_id
                    "
                    type="success"
                    @click="handleAddWxaAction('false')"
                  >
                    {{ $t('8b4e7ee3.cef0e0') }}
                  </el-button>
                  <el-button
                    v-else-if="scope.row.authorizer.weapp.audit_status == '1'"
                    type="success"
                    @click="handleAddWxaAction('false')"
                  >
                    {{ $t('8b4e7ee3.240a55') }}
                  </el-button>

                  <!---  v-if="scope.row.authorizer.weapp.audit_status === 3 || scope.row.authorizer.weapp.audit_status === 2" -->
                  <el-button
                    v-if="scope.row.authorizer.weapp.audit_status === 2"
                    type="info"
                    @click="handleUndocodeaudit"
                  >
                    {{ $t('8b4e7ee3.71bb0e') }}
                  </el-button>
                  <el-button
                    v-if="scope.row.authorizer.weapp.audit_status === 0"
                    type="warning"
                    @click="handleRevertcoderelease"
                  >
                    {{ $t('8b4e7ee3.8e3b19') }}
                  </el-button>

                  <el-button type="success" @click="tryRelease">
                    {{ $t('8b4e7ee3.c4a378') }}
                  </el-button>
                  <el-button type="success" @click="domain">{{ $t('8b4e7ee3.190980') }}</el-button>
                  <el-button
                    v-if="system_is_saas == 'false'"
                    type="success"
                    @click="handleEditTemplate"
                  >
                    {{ $t('8b4e7ee3.c6aa35') }}
                  </el-button>
                  <el-button v-if="system_is_saas == 'false'" type="primary" @click="getdomain">
                    {{ $t('8b4e7ee3.cec2be') }}
                  </el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" :label="$t('8b4e7ee3.abc839')" width="180" />
            <el-table-column :label="$t('8b4e7ee3.d70fe9')" width="180">
              <template slot-scope="scope">
                <span v-if="scope.row.authorizer">
                  {{ scope.row.authorizer.authorizer_appid }}</span
                >
              </template>
            </el-table-column>
            <el-table-column :label="$t('8b4e7ee3.b85b43')" width="100">
              <template slot-scope="scope">
                <div
                  v-if="scope.row.authorizer && scope.row.authorizer.authorizer_appid"
                  @click="downloadWxaCode(scope.row)"
                >
                  <img src="@/assets/img/code.png" alt="" />
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('8b4e7ee3.217079')" width="80">
              <template slot-scope="scope">
                <span v-if="scope.row.authorizer && scope.row.authorizer.authorizer_appid">
                  <el-tag v-if="scope.row.authorizer.is_direct == 1" type="success" size="mini">{{
                    $t('8b4e7ee3.485291')
                  }}</el-tag>
                  <el-tag v-if="scope.row.authorizer.is_direct == 0" type="success" size="mini">{{
                    $t('8b4e7ee3.1bdae8')
                  }}</el-tag>
                </span>
                <el-tag v-else type="gray" size="mini">{{ $t('8b4e7ee3.906ad1') }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="key_name" :label="$t('8b4e7ee3.b8ec7f')" width="140" />
            <el-table-column :label="$t('8b4e7ee3.5a9d35')" fixed="left">
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
                      {{ $t('8b4e7ee3.db22ba') }}
                    </el-button>
                    <el-button
                      v-if="scope.row.authorizer.is_direct == 0"
                      size="mini"
                      type="text"
                      plain
                      @click="handleBind(scope.row)"
                    >
                      {{ $t('8b4e7ee3.db22ba') }}
                    </el-button>
                    <el-button
                      size="mini"
                      type="text"
                      plain
                      @click="downloadTextWxaCode(scope.row)"
                    >
                      {{ $t('8b4e7ee3.b330d1') }}
                    </el-button>
                  </el-button-group>
                </div>
                <div v-else>
                  <el-button-group>
                    <el-button size="mini" type="text" plain @click="handleBind(scope.row)">
                      {{ $t('8b4e7ee3.faa1d4') }}
                    </el-button>
                    <el-button
                      size="mini"
                      type="text"
                      plain
                      @click="bindWxapp('miniprogram', scope.row)"
                    >
                      {{ $t('8b4e7ee3.512e5d') }}
                    </el-button>
                  </el-button-group>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('8b4e7ee3.6d872e')" fixed="left">
              <template slot-scope="scope">
                <span v-if="scope.row.authorizer && scope.row.authorizer.authorizer_appid">
                  <router-link
                    :to="{
                      path: '/setting/system-config/data-analysis',
                      query: { app_id: scope.row.authorizer.authorizer_appid }
                    }"
                    style="margin-left: 5px"
                  >
                    <el-button size="mini" type="text" plain>{{ $t('8b4e7ee3.6450d8') }}</el-button>
                  </router-link>

                  <router-link
                    :to="{
                      path: '/setting/system-config/different-codes',
                      query: { app_id: scope.row.authorizer.authorizer_appid }
                    }"
                    style="margin-left: 5px"
                  >
                    <el-button size="mini" type="text" plain>{{ $t('8b4e7ee3.21058f') }}</el-button>
                  </router-link>

                  <router-link
                    :to="{
                      path: '/setting/system-config/message-template',
                      query: {
                        app_id: scope.row.authorizer.authorizer_appid,
                        tmp_name: scope.row.key_name
                      }
                    }"
                    style="margin-left: 5px"
                  >
                    <el-button size="mini" type="text" plain>{{ $t('8b4e7ee3.c910fb') }}</el-button>
                  </router-link>

                  <router-link
                    v-if="scope.row.authorizer.is_direct == 0"
                    :to="{
                      path: matchRoutePath('policy'),
                      query: {
                        app_id: scope.row.authorizer.authorizer_appid,
                        nick_name: scope.row.authorizer.nick_name
                      }
                    }"
                    style="margin-left: 5px"
                  >
                    <el-button size="mini" type="text" plain>{{ $t('8b4e7ee3.c05def') }}</el-button>
                  </router-link>
                </span>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="page.total_count > pageLimit" class="mt-4 text-right">
            <el-pagination
              layout="prev, pager, next"
              :total="page.total_count"
              :page-size="pageLimit"
              @current-change="onCurrentChange"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('8b4e7ee3.61b01f')" name="offiaccount">
          <el-table v-loading="loading" :data="authorizerData" style="width: 100%" :height="-200">
            <el-table-column prop="nick_name" :label="$t('8b4e7ee3.c56782')" width="180" />
            <el-table-column prop="authorizer_appid" :label="$t('8b4e7ee3.4063a9')" width="180" />
            <el-table-column :label="$t('8b4e7ee3.22b03c')" width="100">
              <template slot-scope="scope">
                <div
                  v-if="scope.row.authorizer_appid"
                  @click="downloadOffiaccountCode(scope.row.authorizer_appid)"
                >
                  <img src="@/assets/img/code.png" alt="" />
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('8b4e7ee3.217079')" width="80">
              <template slot-scope="scope">
                <span v-if="scope.row.authorizer_appid">
                  <el-tag v-if="scope.row.is_direct == 1" type="success" size="mini">{{
                    $t('8b4e7ee3.485291')
                  }}</el-tag>
                  <el-tag v-if="scope.row.is_direct == 0" type="success" size="mini">{{
                    $t('8b4e7ee3.1bdae8')
                  }}</el-tag>
                </span>
                <el-tag v-else type="gray" size="mini">{{ $t('8b4e7ee3.906ad1') }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('8b4e7ee3.5a9d35')" fixed="left">
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
                      {{ $t('8b4e7ee3.db22ba') }}
                    </el-button>
                    <el-button
                      v-if="scope.row.is_direct == 0"
                      size="mini"
                      type="text"
                      plain
                      @click="handleBindOffiaccount"
                    >
                      {{ $t('8b4e7ee3.af3ef9') }}
                    </el-button>
                  </el-button-group>
                </div>
                <div v-else>
                  <el-button-group>
                    <el-button size="mini" type="text" plain @click="handleBindOffiaccount">
                      {{ $t('8b4e7ee3.faa1d4') }}
                    </el-button>
                    <el-button
                      size="mini"
                      type="text"
                      plain
                      @click="bindWxapp('offiaccount', scope.row)"
                    >
                      {{ $t('8b4e7ee3.5c118f') }}
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

    <el-drawer :visible.sync="direct_link_applet" :title="$t(directLinkFormLabel.title)" size="40%">
      <div class="drawer-content">
        <el-form>
          <el-form-item :label="$t(directLinkFormLabel.appid[0])">
            <el-col :span="10">
              <el-input
                v-model="directLinkForm.authorizer_appid"
                :placeholder="$t(directLinkFormLabel.appid[1])"
              />
            </el-col>
          </el-form-item>
          <el-form-item :label="$t(directLinkFormLabel.appsecret[0])">
            <el-col :span="10">
              <el-input
                v-model="directLinkForm.authorizer_appsecret"
                :placeholder="$t(directLinkFormLabel.appsecret[1])"
              />
            </el-col>
          </el-form-item>
          <el-form-item :label="$t(directLinkFormLabel.nick_name[0])">
            <el-col :span="10">
              <el-input
                v-model="directLinkForm.nick_name"
                :placeholder="$t(directLinkFormLabel.nick_name[1])"
              />
            </el-col>
          </el-form-item>
          <el-form-item :label="$t(directLinkFormLabel.signature[0])">
            <el-col :span="10">
              <el-input
                v-model="directLinkForm.signature"
                :placeholder="$t(directLinkFormLabel.signature[1])"
              />
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmitWxapp(directLinkForm.bind_type)">
              {{ $t('8b4e7ee3.be5fbb') }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>

    <el-dialog :title="getwxcodeTitle" :visible.sync="wxaCodeVisible" width="500px">
      <div class="content-center">
        <img :src="wxaCodeImage" />
      </div>
    </el-dialog>

    <el-dialog :title="$t('8b4e7ee3.224e2c')" class="right-dialog" :visible.sync="wxaConfigVisible">
      <el-form ref="configForm" :model="configForm" label-position="left" label-width="180px">
        <div class="section-body">
          <el-form-item :label="$t('8b4e7ee3.778a32')">
            <el-switch v-model="configForm.auto_publish" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item label="appsecret：">
            <el-col :span="18">
              <el-input
                v-model="configForm.authorizer_appsecret"
                :placeholder="$t('8b4e7ee3.ede01a')"
                show-password
              />
            </el-col>
          </el-form-item>
        </div>
        <div class="section-footer with-border content-center">
          <el-button type="primary" @click="configSave">{{ $t('8b4e7ee3.be5fbb') }}</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog :title="$t('8b4e7ee3.190980')" class="right-dialog" :visible.sync="wxaDomainVisible">
      <p class="frm-tips">
        {{ $t('8b4e7ee3.08b0a3') }}
      </p>
      <el-form label-width="160px" size="mini">
        <el-collapse accordion>
          <el-collapse-item :title="$t('8b4e7ee3.000854')" name="1">
            <el-form-item :label="$t('8b4e7ee3.d6838c')">
              <div v-for="requestdomain in domainform.wxDomain.requestdomain">
                {{ requestdomain }}
              </div>
            </el-form-item>
            <el-form-item :label="$t('8b4e7ee3.f0fbad')">
              <div v-for="wsrequestdomain in domainform.wxDomain.wsrequestdomain">
                {{ wsrequestdomain }}
              </div>
            </el-form-item>
            <el-form-item :label="$t('8b4e7ee3.32ce31')">
              <div v-for="uploaddomain in domainform.wxDomain.uploaddomain">
                {{ uploaddomain }}
              </div>
            </el-form-item>
            <el-form-item :label="$t('8b4e7ee3.87fd72')">
              <div v-for="downloaddomain in domainform.wxDomain.downloaddomain">
                {{ downloaddomain }}
              </div>
            </el-form-item>
            <el-form-item :label="$t('8b4e7ee3.935eba')">
              <div v-for="webviewdomain in domainform.wxDomain.webviewdomain">
                {{ webviewdomain }}
              </div>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>

        <el-collapse accordion>
          <el-collapse-item :title="$t('8b4e7ee3.a6a9a0')" name="2">
            <el-form-item :label="$t('8b4e7ee3.d6838c')">
              <div v-for="requestdomain in domainform.localDomain.requestdomain">
                {{ requestdomain }}
              </div>
            </el-form-item>
            <el-form-item :label="$t('8b4e7ee3.f0fbad')">
              <div v-for="wsrequestdomain in domainform.localDomain.wsrequestdomain">
                {{ wsrequestdomain }}
              </div>
            </el-form-item>
            <el-form-item :label="$t('8b4e7ee3.32ce31')">
              <div v-for="uploaddomain in domainform.localDomain.uploaddomain">
                {{ uploaddomain }}
              </div>
            </el-form-item>
            <el-form-item :label="$t('8b4e7ee3.87fd72')">
              <div v-for="downloaddomain in domainform.localDomain.downloaddomain">
                {{ downloaddomain }}
              </div>
            </el-form-item>
            <el-form-item :label="$t('8b4e7ee3.935eba')">
              <div v-for="webviewdomain in domainform.localDomain.webviewdomain">
                {{ webviewdomain }}
              </div>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <div class="section-footer with-border content-center">
        <el-button type="primary" @click="domainSave">{{ $t('8b4e7ee3.6f36dc') }}</el-button>
      </div>
    </el-dialog>

    <!--编辑模板-->
    <el-dialog
      :title="$t('8b4e7ee3.c6aa35')"
      width="60%"
      :visible.sync="TemplateEditDialog"
      :before-close="handleCancelLabelsDialog"
    >
      <template>
        <el-form ref="form" :model="weappTemplate" class="demo-ruleForm" label-width="200px">
          <el-form-item
            class="content-left"
            :label="$t('8b4e7ee3.9b3bf3')"
            prop="key_name"
            :rules="[{ required: true, message: $t('8b4e7ee3.dc34dd'), trigger: 'blur' }]"
          >
            <el-input
              v-if="weappTemplate.id"
              v-model="weappTemplate.key_name"
              :placeholder="$t('8b4e7ee3.05b056')"
              disabled
            />
            <el-input
              v-else
              v-model="weappTemplate.key_name"
              :placeholder="$t('8b4e7ee3.05b056')"
            />
          </el-form-item>
          <el-form-item class="content-left" :label="$t('8b4e7ee3.a83ca1')">
            <el-input v-model="weappTemplate.name" :placeholder="$t('8b4e7ee3.05b056')" disabled />
          </el-form-item>
          <el-form-item class="content-left" :label="$t('8b4e7ee3.162795')">
            <el-input v-model="weappTemplate.template_id" :placeholder="$t('8b4e7ee3.8c804d')" />
          </el-form-item>
          <el-form-item class="content-left" :label="$t('8b4e7ee3.554773')">
            <el-input v-model="weappTemplate.version" :placeholder="$t('8b4e7ee3.c7f359')" />
          </el-form-item>
          <el-form-item class="content-center">
            <el-button type="primary" @click="saveTemplate">{{ $t('8b4e7ee3.b75381') }}</el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-dialog>

    <!--    设置小程序合法域名-->
    <el-dialog :title="$t('8b4e7ee3.2db6d5')" width="60%" :visible.sync="domainDialog">
      <el-alert
        :title="$t('8b4e7ee3.35a81a')"
        description="mmbiz.qpic.cn,wx.qlogo.cn"
        type="info"
        show-icon
        :closable="false"
      />
      <br />
      <el-form v-loading="domainloading" label-width="200px">
        <el-form-item :label="$t('8b4e7ee3.f554f2')">
          <el-input
            v-model="domainData.requestdomain"
            type="textarea"
            :rows="3"
            :placeholder="$t('8b4e7ee3.445694')"
            prop="domain.requestdomain"
            :rules="[{ required: true, message: $t('8b4e7ee3.f554f2'), trigger: 'blur' }]"
          />
        </el-form-item>
        <el-form-item :label="$t('8b4e7ee3.0885a7')">
          <el-input
            v-model="domainData.wsrequestdomain"
            type="textarea"
            :rows="3"
            :placeholder="$t('8b4e7ee3.445694')"
          />
        </el-form-item>
        <el-form-item :label="$t('8b4e7ee3.fe5685')">
          <el-input
            v-model="domainData.uploaddomain"
            type="textarea"
            :rows="3"
            :placeholder="$t('8b4e7ee3.445694')"
          />
        </el-form-item>
        <el-form-item :label="$t('8b4e7ee3.41a6be')">
          <el-input
            v-model="domainData.downloaddomain"
            type="textarea"
            :rows="6"
            :placeholder="$t('8b4e7ee3.445694')"
          />
        </el-form-item>
        <el-form-item :label="$t('8b4e7ee3.0e758a')">
          <el-input
            v-model="domainData.webviewdomain"
            type="textarea"
            :rows="6"
            :placeholder="$t('8b4e7ee3.445694')"
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="setdomain">{{ $t('8b4e7ee3.38cf16') }}</el-button>
      </span>
    </el-dialog>
  </SpPage>
</template>
<script>
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
  mixins: [mixin, pageMixin],
  provide() {
    return {
      refresh: this.fetchList
    }
  },
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
        title: '8b4e7ee3.a9f432',
        appid: { 0: '8b4e7ee3.a8bfed', 1: '8b4e7ee3.f14601' },
        appsecret: { 0: '8b4e7ee3.2b1bc0', 1: '8b4e7ee3.ede01a' },
        signature: { 0: '8b4e7ee3.d50394', 1: '8b4e7ee3.7efb18' },
        nick_name: { 0: '8b4e7ee3.79e85e', 1: '8b4e7ee3.7437cc' }
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
        { name: '微信小程序', activeName: 'miniprogram' }
        // { name: '微信服务号', activeName: 'offiaccount' }
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
          message: this.$t('8b4e7ee3.69be67'),
          type: 'success',
          duration: 2 * 1000
        })
        this.directLinkForm = {}
        this.direct_link_applet = false
        this.fetchList()
      })
    },
    setdirectLinkFormLabel(bind_type) {
      if (bind_type == 'offiaccount') {
        this.directLinkFormLabel = {
          title: '8b4e7ee3.d5049d',
          appid: { 0: '8b4e7ee3.e4c284', 1: '8b4e7ee3.a40cc9' },
          appsecret: { 0: '8b4e7ee3.9e6a33', 1: '8b4e7ee3.78247c' },
          signature: { 0: '8b4e7ee3.4debb8', 1: '8b4e7ee3.310c2f' },
          nick_name: { 0: '8b4e7ee3.f11771', 1: '8b4e7ee3.2b00df' }
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
          message: this.$t('8b4e7ee3.1d2592'),
          type: 'error',
          duration: 5 * 1000
        })
      }
    },
    showBindDetail(data) {
      if (data.authorizer.authorizer_appid) {
        this.applet_detail = true
        getWxa(data.authorizer.authorizer_appid).then((response) => {
          this.detail = response.data.data
          this.weappTemplate = this.detail.weappTemplate
          this.configForm.auto_publish = response.data.data.auto_publish
          this.configForm.authorizer_appsecret = response.data.data.authorizer_appsecret
          console.log(this.detail)
        })
      } else {
        this.$message({ message: this.$t('8b4e7ee3.22e524') })
      }
    },
    downloadWxaCode(rowdata) {
      this.getwxcodeloading = true
      this.getwxcodeTitle = this.$t('8b4e7ee3.b85b43')
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
      this.getwxcodeTitle = this.$t('8b4e7ee3.b330d1')
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
      this.getwxcodeTitle = this.$t('8b4e7ee3.22c7ae')
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
          message: this.$t('8b4e7ee3.a6d385'),
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
          message: this.$t('8b4e7ee3.3aefb5'),
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
          this.$message({
            message: this.$t('8b4e7ee3.3b1083'),
            type: 'success',
            duration: 2 * 1000
          })
        } else {
          this.$message({ message: this.$t('8b4e7ee3.ece8fd'), type: 'error', duration: 2 * 1000 })
        }
      })
    },
    // 撤销审核
    handleUndocodeaudit() {
      this.$confirm(this.$t('8b4e7ee3.2980fc'), this.$t('8b4e7ee3.02d981'), {
        confirmButtonText: this.$t('8b4e7ee3.38cf16'),
        cancelButtonText: this.$t('8b4e7ee3.625fb2'),
        type: 'warning'
      })
        .then(() => {
          undocodeaudit({ wxaAppId: this.detail.authorizer_appid }).then((response) => {
            this.$message({
              message: this.$t('8b4e7ee3.8e05b0'),
              type: 'success',
              duration: 2 * 1000
            })
            this.getWxa()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('8b4e7ee3.2111cc')
          })
        })
    },
    // 回退版本
    handleRevertcoderelease() {
      this.$confirm(this.$t('8b4e7ee3.47323e'), this.$t('8b4e7ee3.02d981'), {
        confirmButtonText: this.$t('8b4e7ee3.38cf16'),
        cancelButtonText: this.$t('8b4e7ee3.625fb2'),
        type: 'warning'
      })
        .then(() => {
          revertcoderelease({ wxaAppId: this.detail.authorizer_appid }).then((response) => {
            this.$message({
              message: this.$t('8b4e7ee3.742b8f'),
              type: 'success',
              duration: 2 * 1000
            })
            this.getWxa()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('8b4e7ee3.2111cc')
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
          message: this.$t('8b4e7ee3.d3ae9f'),
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
        this.$confirm(this.$t('8b4e7ee3.34138b'), this.$t('8b4e7ee3.02d981'), {
          confirmButtonText: this.$t('8b4e7ee3.38cf16'),
          cancelButtonText: this.$t('8b4e7ee3.625fb2'),
          type: 'warning'
        })
          .then(() => {
            submitWxa(this.submitWeappForm).then((response) => {
              this.$message({
                message: this.$t('8b4e7ee3.cd764b'),
                type: 'success',
                duration: 5 * 1000
              })
              this.getWxa()
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: this.$t('8b4e7ee3.2111cc')
            })
          })
      } else {
        submitWxa(this.submitWeappForm).then((response) => {
          this.$message({
            message: this.$t('8b4e7ee3.a7699b'),
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
