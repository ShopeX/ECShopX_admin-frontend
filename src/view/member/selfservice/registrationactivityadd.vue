<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="section section-white page-registrationactivityadd">
    <el-form
      ref="form"
      :model="form"
      label-width="150px"
      label-position="right"
      class="demo-ruleForm"
      :rules="formRules"
    >
      <el-card :header="$t('3aa73191.6ea1fe')" shadow="naver">
        <el-form-item :label="$t('3aa73191.39834b')" prop="activity_name">
          <el-col :span="15">
            <el-input
              v-model.trim="form.activity_name"
              :maxlength="30"
              :placeholder="$t('3aa73191.7528b3')"
            />
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('3aa73191.08256c')" prop="activity_time">
          <el-col :span="10">
            <el-date-picker
              v-model="activity_date"
              type="datetimerange"
              :range-separator="$t('3aa73191.981cbe')"
              :start-placeholder="$t('3aa73191.fc92e9')"
              :end-placeholder="$t('3aa73191.1fa23f')"
              format="yyyy/MM/dd HH:mm:ss"
              value-format="timestamp"
              :default-time="['00:00:00', '23:59:59']"
            />
          </el-col>
          <el-form-item :label="$t('3aa73191.63cd0e')" prop="is_activitytime_show">
            <el-switch
              v-model="is_activitytime_show"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
        </el-form-item>
        <el-form-item :label="$t('3aa73191.90d78c')" prop="areaList">
          <el-col :span="10">
            <el-cascader
              v-model="form.areaList"
              :placeholder="$t('ac2a6290.708c9d')"
              clearable
              :options="regions"
              style="width: 60%"
            />
          </el-col>
          <el-form-item :label="$t('3aa73191.63cd0e')" prop="is_activitycity_show">
            <el-switch
              v-model="is_activitycity_show"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
        </el-form-item>
        <el-form-item :label="$t('3aa73191.9ce624')" prop="place">
          <el-col :span="10">
            <el-input
              v-model.trim="form.place"
              :maxlength="30"
              :placeholder="$t('3aa73191.90a1ac')"
            />
          </el-col>
          <el-form-item :label="$t('3aa73191.63cd0e')" prop="is_activityplace_show">
            <el-switch
              v-model="is_activityplace_show"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
        </el-form-item>
        <el-form-item :label="$t('3aa73191.61a0ec')" prop="address">
          <el-col :span="10">
            <el-input
              v-model.trim="form.address"
              :maxlength="30"
              :placeholder="$t('3aa73191.80d685')"
            />
          </el-col>
          <el-form-item :label="$t('3aa73191.63cd0e')" prop="is_activityaddress_show">
            <el-switch
              v-model="is_activityaddress_show"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
        </el-form-item>
        <el-form-item :label="$t('3aa73191.b1c2ae')" prop="intro">
          <el-col :span="10">
            <el-input
              v-model.trim="form.intro"
              :maxlength="30"
              :placeholder="$t('3aa73191.76c101')"
            />
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('3aa73191.0c3532')" prop="picsList">
          <el-col>
            <!-- <div>
              <imgBox
                :img-url="wximageurl + form.pics"
                inline
                @click="handleActivityPicsChange"
              />
            </div> -->
            <div class="pics-box">
              <ul class="goodspic-wrap">
                <draggable v-model="picsList" :options="dragIssuesOptions">
                  <li
                    v-for="(item, index) in picsList"
                    :key="index"
                    class="goodspic"
                    @mouseenter="picsEnter(index)"
                    @mouseleave="picsLeave"
                  >
                    <img :src="wximageurl + item" />
                    <div class="goodspic-mask" :class="picsCurrent == index ? 'on' : ''">
                      <div class="el-icon-delete" @click="removePicsImg(index)" />
                      <div class="el-icon-rank" />
                    </div>
                  </li>
                </draggable>
              </ul>
              <div class="upload-box" @click="handleActivityPicsChange">
                <i class="el-icon-camera" />
              </div>
            </div>
            <div class="frm-tips">
              {{ $t('3aa73191.db00ef') }}
            </div>
          </el-col>
        </el-form-item>
      </el-card>
      <el-card :header="$t('3aa73191.02a217')" shadow="naver">
        <el-form-item :label="$t('3aa73191.c07abe')" prop="gift_points_switch">
          <el-switch
            v-model="form.gift_points_switch"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item :label="$t('3aa73191.5a28f0')" prop="gift_points">
          <el-col :span="10">
            <el-input
              v-model.trim="form.gift_points"
              :maxlength="30"
              :placeholder="$t('3aa73191.7470c5')"
            />
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('3aa73191.9f1f24')" prop="is_allow_duplicate">
          <el-switch
            v-model="form.is_allow_duplicate"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item :label="$t('3aa73191.31c852')" prop="is_need_check">
          <el-switch
            v-model="form.is_need_check"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item :label="$t('3aa73191.16fc22')" prop="is_offline_verify">
          <el-switch
            v-model="form.is_offline_verify"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item :label="$t('3aa73191.991c49')" prop="is_allow_cancel">
          <el-switch
            v-model="form.is_allow_cancel"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item :label="$t('3aa73191.e234d2')" prop="group_no">
          <el-col :span="10">
            <el-input v-model.trim="form.group_no" :placeholder="$t('3aa73191.8f4500')" />
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('3aa73191.0fb1ea')" prop="is_white_list">
          <el-radio-group v-model="form.is_white_list" @change="whiteListChange">
            <el-radio :label="1">{{ $t('15ecc99b.0a60ac') }}</el-radio>
            <el-radio :label="0">{{ $t('15ecc99b.c9744f') }}</el-radio>
          </el-radio-group>
          <div>{{ $t('3aa73191.6433a7') }}</div>
        </el-form-item>
        <el-form-item v-if="form.is_white_list == 1" :label="$t('3aa73191.0067d7')">
          <el-button type="primary" @click="onShowChange">{{ $t('3aa73191.0067d7') }}</el-button>
          <SpFinder
            v-if="enterprise_list.length > 0"
            ref="finder"
            :no-selection="true"
            :setting="setting"
            :data="enterprise_list"
            url=""
            style="width: 80%"
            :show-pager="false"
          />
        </el-form-item>
        <el-form-item :label="$t('3aa73191.6dbb6f')">
          <el-checkbox-group v-model="memberLevelList">
            <el-checkbox
              v-for="grade in memberGrade"
              :key="grade.grade_id"
              :label="grade.grade_id + ''"
            >
              {{ grade.grade_name }}
            </el-checkbox>
            <el-checkbox
              v-for="vipdata in vipGrade"
              :key="vipdata.lv_type"
              :label="vipdata.lv_type + ''"
            >
              {{ $t('3aa73191.310f84') }}{{ vipdata.grade_name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('3aa73191.eb4307')">
          <el-form-item prop="useAllDistributor">
            <el-radio-group v-model="useAllDistributor" @change="shopTypeChange">
              <el-radio :label="true">{{ $t('3aa73191.87e0ad') }}</el-radio>
              <el-radio :label="false">{{ $t('3aa73191.3640e1') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="!useAllDistributor">
            <el-button type="primary" @click="addDistributorAction">
              {{ $t('3aa73191.afa2e6') }}
            </el-button>
            <SpFinder
              v-if="distributor_list?.length > 0"
              ref="finder"
              :no-selection="true"
              :setting="shopSetting"
              :data="distributor_list"
              url=""
              style="width: 80%"
              :show-pager="false"
            />
          </div>
        </el-form-item>
        <el-form-item :label="$t('3aa73191.b0a4df')" prop="temp_id" :rules="tempIdRules">
          <el-col :span="15">
            <el-select
              v-model="form.temp_id"
              :placeholder="$t('ac2a6290.708c9d')"
              @change="selectTempId"
            >
              <el-option
                v-for="item in temp_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('3aa73191.f6fd53')" prop="join_limit">
          <el-col :span="10">
            <el-input
              v-model.trim="form.join_limit"
              type="number"
              :placeholder="$t('3aa73191.3640d2')"
            />
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('3aa73191.a667e2')" prop="join_tips">
          <el-col :span="10">
            <el-input
              v-model.trim="form.join_tips"
              :placeholder="$t('3aa73191.a667e2')"
              type="textarea"
              :rows="2"
            />
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('3aa73191.81dc8d')" prop="submit_form_tips">
          <el-col :span="10">
            <el-input
              v-model.trim="form.submit_form_tips"
              :placeholder="$t('3aa73191.81dc8d')"
              type="textarea"
              :rows="4"
            />
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('3aa73191.529f73')" prop="is_sms_notice">
          <el-col :span="15">
            <div class="clearfix">
              <el-switch
                v-model="form.is_sms_notice"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
              <el-card v-if="form.is_sms_notice" class="box-card">
                <div class="text item">
                  {{ $t('3aa73191.9ac58c') }}
                </div>
              </el-card>
            </div>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('3aa73191.1decc2')" prop="is_wxapp_notice">
          <el-col :span="15">
            <div class="clearfix">
              <el-switch
                v-model="form.is_wxapp_notice"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
              <el-card v-if="form.is_wxapp_notice" class="box-card">
                <div slot="header" class="clearfix">
                  <span>{{ $t('3aa73191.7f813d') }}</span>
                </div>
                <div class="text item">{{ $t('3aa73191.39834b') }}：{{ form.activity_name }}</div>
                <div class="text item">{{ $t('3aa73191.bfb9ff') }}</div>
              </el-card>
            </div>
          </el-col>
        </el-form-item>
      </el-card>
      <el-card :header="$t('3aa73191.4553b4')" shadow="naver">
        <el-radio-group v-model="mode">
          <el-radio :label="'richText'">{{ $t('3aa73191.e2591e') }}</el-radio>
          <!-- <el-radio :label="'component'"> 组件式 </el-radio> -->
        </el-radio-group>
        <div v-if="mode === 'richText'" style="margin-top: 20px">
          <div>
            <SpRichText v-model="introInfo" />
          </div>
          <!-- <span class="tpl-btn" @click="addImgPreview" style="">
          <i class="el-icon-picture"></i>图片
        </span> -->
        </div>
        <div v-else style="margin-top: 20px">
          <SpIphone>
            <SpDecorate ref="decorateRef" v-model="content" scene="1002" />
          </SpIphone>
          <!-- <richTextEditor
          :data="content"
          :control="['film', 'slider', 'heading', 'writing']"
          @change="handleContent"
        /> -->
          <!-- <imgPicker
          :dialog-visible="thumbDialog"
          :sc-status="isGetThumb"
          :is-most="true"
          @chooseImg="pickThumb"
          @closeImgDialog="closeThumbDialog"
        /> -->
        </div>
      </el-card>
      <div>
        <el-button @click.native="handleCancel">
          {{ pageType === 'edit' ? $t('8da83775.625fb2') : $t('3aa73191.5f4112') }}
        </el-button>
        <el-button v-if="pageType != 'detail'" type="primary" @click="submitAction">
          {{ $t('8da83775.be5fbb') }}
        </el-button>
      </div>
    </el-form>
    <EnterpriseDialog
      :visible.sync="dialogVisible"
      type="edit"
      :dialog-select="enterprise_list"
      @closeDialog="closeDialog"
      @saveEnterprise="saveEnterprise"
    />
    <DistributorSelect
      :store-visible="distributorVisible"
      :is-valid="true"
      :rel-data-ids="distributor_list"
      :get-status="setDistributorStatus"
      return-type="selectRow"
      @chooseStore="chooseDistributorAction"
      @closeStoreDialog="closeDistributorDialogAction"
    />
  </div>
</template>

<script>
import districtOptions from '@/mixins/districtOptions'
import { Message } from 'element-ui'
import {
  regActivityAdd,
  regActivityGet,
  regActivityUpdate,
  getTemplateList
} from '@/api/selfhelpform'
import imgBox from '@/components/element/imgBox'
import { listVipGrade } from '@/api/cardticket'
import { getGradeList } from '@/api/membercard'
import richTextEditor from '@/components/function/richTextEditor'
import EnterpriseDialog from './components/enterpriseDialog'
import { createSetting } from '@shopex-ui/finder'
import DistributorSelect from '@/components/storeListSelect'
import draggable from 'vuedraggable'

export default {
  mixins: [districtOptions],
  components: {
    imgBox,
    richTextEditor,
    EnterpriseDialog,
    DistributorSelect,
    draggable
  },
  inject: ['refresh'],
  data() {
    return {
      activity_date: [],
      form: {
        activity_name: '',
        activity_time: '',
        start_time: '',
        end_time: '',
        join_limit: '', // 提交报名次数
        areaList: [],
        area: '', // 活动城市(省市)
        place: '', // 活动地点
        address: '', // 详情地址
        intro: '', // 活动简介
        pics: '', // 活动轮播图
        gift_points_switch: 1, // 奖励积分开关
        gift_points: '', // 奖励积分
        is_allow_duplicate: 1, // 是否允许重复报名
        is_allow_cancel: 1, // 是否允许取消报名
        is_offline_verify: 0, // 是否线下核销(1或0)
        is_need_check: 1, // 是否需要审核(1或0)
        is_white_list: 0, // 是否自动加入内购白名单(1或0)
        enterprise_ids: [], // 白名单企业ID
        group_no: '', // 活动分组编码
        member_level: '', // 适用会员等级
        distributor_ids: [], // 适用店铺
        join_tips: '', // 活动参与提示信息
        submit_form_tips: '', // 表单填写提示信息
        use_all_distributor: false // 适用店铺
      },
      picsList: [],
      useAllDistributor: false, // 适用店铺
      memberLevelList: [], // 适用会员等级
      regions: [],
      is_activitytime_show: 1, // 活动有效时间-前端是否展示
      is_activitycity_show: 1, // 活动城市-前端是否展示
      is_activityplace_show: 1, // 活动地点-前端是否展示
      is_activityaddress_show: 1, // 详细地址-前端是否展示
      templateParams: {
        page: 1,
        pageSize: 10,
        tem_name: '',
        // tem_type: 'ask_answer_paper',
        is_valid: 1
      },
      temp_options: [],
      vipGrade: [],
      memberGrade: [],
      mode: 'richText',
      introInfo: '', // 富文本
      content: [], // 组件化
      thumbDialog: false,
      isGetThumb: false,
      dialogVisible: false,
      enterprise_list: [], // 企业列表
      distributor_list: [], // 店铺列表
      distributorVisible: false, // 店铺弹窗
      setDistributorStatus: false, // 店铺弹窗状态
      dragIssuesOptions: {
        animation: 300,
        forceFallback: false,
        scroll: true,
        handle: '.el-icon-rank',
        draggable: '.goodspic'
      },
      picsCurrent: -1,
      pageType: ''
    }
  },
  computed: {
    formRules() {
      return {
        activity_name: [{ required: true, message: this.$t('3aa73191.7528b3'), trigger: 'blur' }],
        is_allow_duplicate: [
          { required: true, message: this.$t('ac2a6290.708c9d'), trigger: 'change' }
        ],
        is_need_check: [{ required: true, message: this.$t('ac2a6290.708c9d'), trigger: 'change' }],
        is_offline_verify: [
          { required: true, message: this.$t('ac2a6290.708c9d'), trigger: 'change' }
        ],
        is_allow_cancel: [{ required: true, message: this.$t('ac2a6290.708c9d'), trigger: 'blur' }],
        is_white_list: [{ required: true, message: this.$t('ac2a6290.708c9d'), trigger: 'blur' }],
        join_limit: [{ required: true, message: this.$t('3aa73191.1fbfd9'), trigger: 'blur' }]
      }
    },
    tempIdRules() {
      return [
        {
          required: this.form.temp_id !== '0',
          message: this.$t('3aa73191.23bf6a'),
          trigger: 'blur'
        }
      ]
    },
    shopSetting() {
      return createSetting({
        columns: [
          { name: this.$t('1ad8a87f.b718ad'), key: 'distributor_id' },
          { name: this.$t('3aa73191.d7ec2d'), key: 'name' },
          { name: this.$t('3aa73191.765048'), key: '地址' }
        ],
        actions: [
          {
            name: this.$t('8da83775.2f4aad'),
            key: 'detete',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                const inChecked = this.distributor_list.findIndex((v) => v.id == row.id)
                if (inChecked > -1) {
                  this.distributor_list.splice(inChecked, 1)
                }
              }
            }
          }
        ]
      })
    },
    setting() {
      const VALIDATE_TYPES = [
        { nameKey: 'ac2a6290.a8b0c2', value: '' },
        { nameKey: 'ac2a6290.8098e2', value: 'mobile' },
        { nameKey: 'ac2a6290.bc1f2d', value: 'account' },
        { nameKey: 'ac2a6290.3bc5e6', value: 'email' },
        { nameKey: 'ac2a6290.22b03c', value: 'qr_code' }
      ]
      return createSetting({
        columns: [
          { name: this.$t('3aa73191.5a83cb'), key: 'id' },
          { name: this.$t('3aa73191.f47e27'), key: 'name' },
          {
            name: this.$t('3aa73191.78cbe8'),
            key: 'auth_type',
            formatter: (value, { auth_type }) => {
              const item = VALIDATE_TYPES.find((i) => i.value === auth_type)
              return item ? this.$t(item.nameKey) : ''
            }
          },
          { name: this.$t('3aa73191.53cc55'), key: 'distributor_name' }
        ],
        actions: [
          {
            name: this.$t('8da83775.2f4aad'),
            key: 'detete',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                const inChecked = this.enterprise_list.findIndex((v) => v.id == row.id)
                if (inChecked > -1) {
                  this.enterprise_list.splice(inChecked, 1)
                }
              }
            }
          }
        ]
      })
    }
  },
  mounted() {
    this.getTemplateList()
    if (this.$route.query.id) {
      this.pageType = this.$route.query.type
      let filter = { activity_id: this.$route.query.id }
      regActivityGet(filter).then((res) => {
        this.form = res.data.data
        this.activity_date = [this.form.start_time * 1000, this.form.end_time * 1000]
        this.enterprise_list = this.form.enterprise_list
        this.distributor_list = this.form.distributor_list
        if (this.form.mode == 'component') {
          this.content = this.form.content || []
        } else {
          this.introInfo = this.form.content || ''
        }
        let json = []
        if (this.form.show_fields) {
          json = JSON.parse(this.form.show_fields)
        }
        this.picsList = this.form.pics ? this.form.pics.split(',') : []
        this.is_activitytime_show = json.time
        this.is_activitycity_show = json.city
        this.is_activityplace_show = json.place
        this.is_activityaddress_show = json.address
        this.form.areaList = res.data.data.area ? res.data.data.area.split(',') : []
        this.memberLevelList = res.data.data.member_level
          ? res.data.data.member_level.split(',')
          : []
        if (res.data.data.distributor_list.length == 0) {
          this.useAllDistributor = true
        }
        if (this.form.gift_points) {
          this.form.gift_points_switch = 1
        }
      })
    }
    this.getGradeLevelList()
  },
  methods: {
    getGradeLevelList() {
      listVipGrade().then((response) => {
        if (response != undefined && response.data.data && response.data.data.length > 0) {
          this.vipGrade = response.data.data
        }
      })
      getGradeList().then((response) => {
        if (response != undefined && response.data.data && response.data.data.length > 0) {
          this.memberGrade = response.data.data
        }
      })
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    selectTempId(e) {},
    submitAction() {
      const that = this
      if (that.activity_date.length > 0) {
        this.form.start_time = that.activity_date[0] / 1000
        this.form.end_time = that.activity_date[1] / 1000
      }
      let params = { ...this.form }
      const obj = {
        time: this.is_activitytime_show,
        city: this.is_activitycity_show,
        place: this.is_activityplace_show,
        address: this.is_activityaddress_show
      }
      params['show_fields'] = JSON.stringify(obj)
      params['distributor_ids'] =
        this.distributor_list?.map((item) => item.distributor_id).join(',') || ''
      params['enterprise_ids'] = this.enterprise_list?.map((item) => item.id).join(',') || ''
      params['member_level'] = this.memberLevelList ? this.memberLevelList.join(',') : ''
      // params['use_all_distributor'] = this.useAllDistributor
      params['pics'] = this.picsList.join(',')
      if (this.mode === 'component') {
        params['content'] = this.content
      } else {
        params['content'] = this.introInfo
      }
      params['area'] = this.form.areaList ? this.form.areaList.join(',') : ''

      console.log('submitAction', params)
      delete params.distributor_list
      delete params.enterprise_list
      delete params.areaList
      delete params.updated
      delete params.created
      delete params.member_level_list
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (!this.useAllDistributor && this.distributor_list.length == 0) {
            return this.$message.error(this.$t('3aa73191.06accf'))
          }
          if (this.form.is_white_list && this.enterprise_list.length == 0) {
            return this.$message.error(this.$t('3aa73191.321fa5'))
          }
          if (this.form.activity_id) {
            regActivityUpdate(params).then((res) => {
              if (res.data.data) {
                this.$message({
                  message: this.$t('c831a478.55aa63'),
                  type: 'success',
                  duration: 2 * 1000,
                  onClose() {
                    that.refresh()
                    that.$router.go(-1)
                  }
                })
              }
            })
          } else {
            regActivityAdd(params).then((res) => {
              if (res.data.data) {
                this.$message({
                  message: this.$t('c831a478.3fdaea'),
                  type: 'success',
                  duration: 2 * 1000,
                  onClose() {
                    that.refresh()
                    that.$router.go(-1)
                  }
                })
              }
            })
          }
        } else {
          // this.$message({
          //   type: 'error',
          //   message: '请录入正确的数据'
          // })
          return false
        }
      })
    },
    handleCancel() {
      this.$router.go(-1)
    },
    getTemplateList() {
      this.loading = true
      getTemplateList(this.templateParams).then((response) => {
        response.data.data.list.map((item) => {
          this.temp_options.push({
            label: item.tem_name,
            value: item.id
          })
        })
        this.temp_options.unshift({
          label: this.$t('3aa73191.d81bb2'),
          value: '0'
        })
        this.loading = false
      })
    },
    async handleActivityPicsChange() {
      try {
        const { data } = await this.$picker.image({
          multiple: true,
          num: 20 // 最多选择20张图片
        })

        if (data && data.length > 0) {
          data.forEach((item) => {
            const imgUrl = (item && item.url) || item || ''
            if (imgUrl) {
              // 如果包含 wximageurl，则提取相对路径
              let finalUrl = imgUrl
              if (this.wximageurl && imgUrl.indexOf(this.wximageurl) === 0) {
                finalUrl = imgUrl.replace(this.wximageurl, '')
              }
              this.picsList.push(finalUrl)
            }
          })
        }
      } catch (error) {
        // 用户取消选择时不处理错误
        console.log('图片选择已取消')
      }
    },
    pickThumb: function (arr) {
      if (arr.length != 0) {
        arr.forEach((data) => {
          if (data && data.url !== '') {
            this.thumbDialog = false
            var index = this.$refs.editor.$el.id
            var loc = this.$refs.editor
            var img = new Image()
            img.src = this.wximageurl + data.url
            if (loc.range) {
              loc.range.insertNode(img)
              var referenceNode = loc.range.endContainer
              if (referenceNode.className !== 'content') {
                loc.range.setStartAfter(referenceNode)
              } else {
                loc.range.setStart(loc.range.endContainer, loc.range.endOffset)
              }
            } else {
              loc.$refs.content.appendChild(img)
              loc.focus()
              loc.restoreSelection()
            }
            this.introInfo = loc.$refs.content.innerHTML
          }
        })
      }
    },
    closeThumbDialog: function () {
      this.thumbDialog = false
    },
    handleContent(data) {
      this.content = data
    },
    onShowChange() {
      this.closeDialog(true)
    },
    closeDialog(visible) {
      this.dialogVisible = visible
    },
    saveEnterprise(select) {
      console.log(select)
      this.enterprise_list = select
      this.closeDialog(false)
    },
    shopTypeChange(val) {
      this.useAllDistributor = val
      if (!val) {
        this.distributor_list = []
        this.form.distributor_ids = ''
      }
    },
    addDistributorAction() {
      this.distributorVisible = true
      this.setDistributorStatus = true
    },
    chooseDistributorAction(data) {
      this.distributorVisible = false
      if (!data || data === null || data.length <= 0) {
        this.distributor_list = []
        return
      }
      this.distributor_list = data
    },
    closeDistributorDialogAction() {
      this.distributorVisible = false
    },
    whiteListChange(val) {
      if (!val) {
        this.enterprise_list = []
        this.form.enterprise_id = ''
      }
    },
    picsEnter(index) {
      this.picsCurrent = index
    },
    picsLeave() {
      this.picsCurrent = -1
    },
    removePicsImg: function (index) {
      this.picsList.splice(index, 1)
    }
  }
}
</script>
<style scoped lang="scss">
.page-registrationactivityadd ::v-deep .el-card {
  margin-bottom: 20px;
}
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 1px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}
.box-card {
  width: 480px;
}
.component-block {
  margin-bottom: 20px;
}
.ricktext-con {
  width: calc(100% - 100px);
  display: inline-block;
}
.pics-box {
  overflow: hidden;
  .goodspic-wrap {
    float: left;
    margin-right: 5px;
    overflow: hidden;
    .goodspic {
      position: relative;
      float: left;
      width: 120px;
      height: 120px;
      margin: 0 5px 10px;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
      .goodspic-mask {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.2);
        cursor: pointer;
        &.on {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .iconfont {
          margin: 0 8px;
          font-size: 20px;
          color: #fff;
        }
      }
    }
  }

  .upload-box {
    display: inline-block;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
    border: 1px dashed #ddd;
    border-radius: 8px;
    .iconfont {
      font-size: 30px;
      color: #ccc;
    }
  }
}
</style>
