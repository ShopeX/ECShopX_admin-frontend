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
  <div class="section section-white page-registrationactivityadd">
    <el-form
      ref="form"
      :model="form"
      label-width="150px"
      label-position="right"
      class="demo-ruleForm"
      :rules="rules"
    >
      <el-card header="基础信息" shadow="naver">
        <el-form-item label="活动名称" prop="activity_name">
          <el-col :span="15">
            <el-input
              v-model.trim="form.activity_name"
              :maxlength="30"
              placeholder="请输入活动名称"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="活动有效时间" prop="activity_time">
          <el-col :span="10">
            <el-date-picker
              v-model="activity_date"
              type="datetimerange"
              range-separator="至"
              start-placeholder="生效时间"
              end-placeholder="过期时间"
              format="yyyy/MM/dd HH:mm:ss"
              value-format="timestamp"
              :default-time="['00:00:00', '23:59:59']"
            />
          </el-col>
          <el-form-item label="前端是否展示" prop="is_activitytime_show">
            <el-switch
              v-model="is_activitytime_show"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
        </el-form-item>
        <el-form-item label="活动城市" prop="areaList">
          <el-col :span="10">
            <el-cascader
              v-model="form.areaList"
              placeholder="请选择"
              clearable
              :options="regions"
              style="width: 60%"
            />
          </el-col>
          <el-form-item label="前端是否展示" prop="is_activitycity_show">
            <el-switch
              v-model="is_activitycity_show"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
        </el-form-item>
        <el-form-item label="活动地点" prop="place">
          <el-col :span="10">
            <el-input v-model.trim="form.place" :maxlength="30" placeholder="请输入活动地点" />
          </el-col>
          <el-form-item label="前端是否展示" prop="is_activityplace_show">
            <el-switch
              v-model="is_activityplace_show"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-col :span="10">
            <el-input v-model.trim="form.address" :maxlength="30" placeholder="请输入详细地址" />
          </el-col>
          <el-form-item label="前端是否展示" prop="is_activityaddress_show">
            <el-switch
              v-model="is_activityaddress_show"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
        </el-form-item>
        <el-form-item label="列表活动简介" prop="intro">
          <el-col :span="10">
            <el-input v-model.trim="form.intro" :maxlength="30" placeholder="请输入列表活动简介" />
          </el-col>
        </el-form-item>
        <el-form-item label="活动轮播图" prop="picsList">
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
                    <img :src="wximageurl + item">
                    <div class="goodspic-mask" :class="picsCurrent == index ? 'on' : ''">
                      <div class="iconfont icon-trash-alt" @click="removePicsImg(index)" />
                      <div class="iconfont icon-arrows-alt" />
                    </div>
                  </li>
                </draggable>
              </ul>
              <div class="upload-box" @click="handleActivityPicsChange">
                <i class="iconfont icon-camera" />
              </div>
            </div>
            <div class="frm-tips">
              建议尺寸:750*750，文件格式为：png、jpeg、bmp、 jpg大小不超
              2M，小程序卡片分享与报名活动列表取详情第一张图展示
            </div>
            <imgPicker
              :dialog-visible="activityPicsDialog"
              :sc-status="isGetActivityImage"
              :is-most="true"
              @chooseImg="chooseActivityImg"
              @closeImgDialog="closeImgDialog"
            />
          </el-col>
        </el-form-item>
      </el-card>
      <el-card header="活动规则" shadow="naver">
        <el-form-item label="获取积分" prop="gift_points_switch">
          <el-switch
            v-model="form.gift_points_switch"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="获取积分值" prop="gift_points">
          <el-col :span="10">
            <el-input
              v-model.trim="form.gift_points"
              :maxlength="30"
              placeholder="请输入奖励积分"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="可重复报名" prop="is_allow_duplicate">
          <el-switch
            v-model="form.is_allow_duplicate"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="是否审核" prop="is_need_check">
          <el-switch
            v-model="form.is_need_check"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="线下核销" prop="is_offline_verify">
          <el-switch
            v-model="form.is_offline_verify"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="允许取消报名" prop="is_allow_cancel">
          <el-switch
            v-model="form.is_allow_cancel"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="活动群组编号" prop="group_no">
          <el-col :span="10">
            <el-input v-model.trim="form.group_no" placeholder="请输入活动群组编号" />
          </el-col>
        </el-form-item>
        <el-form-item label="进内购企业白名单" prop="is_white_list">
          <el-radio-group v-model="form.is_white_list" @change="whiteListChange">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
          <div>开启后报名人员名单进入店铺企业员工白名单</div>
        </el-form-item>
        <el-form-item v-if="form.is_white_list == 1" label="选择企业">
          <el-button type="primary" @click="onShowChange"> 选择企业 </el-button>
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
        <el-form-item label="适用会员">
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
              付费{{ vipdata.grade_name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="适用店铺">
          <el-form-item prop="useAllDistributor">
            <el-radio-group v-model="useAllDistributor" @change="shopTypeChange">
              <el-radio :label="true"> 全部店铺适用 </el-radio>
              <el-radio :label="false"> 指定店铺适用 </el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="!useAllDistributor">
            <el-button type="primary" @click="addDistributorAction"> 选择店铺 </el-button>
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
        <el-form-item
          label="选择报名问卷模板"
          prop="temp_id"
          :rules="{
            required: form.temp_id == '0' ? false : true,
            message: '请选择报名问卷模板',
            trigger: 'blur'
          }"
        >
          <el-col :span="15">
            <el-select v-model="form.temp_id" placeholder="请选择" @change="selectTempId">
              <el-option
                v-for="item in temp_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="提交报名人数" prop="join_limit">
          <el-col :span="10">
            <el-input v-model.trim="form.join_limit" type="number" placeholder="人数" />
          </el-col>
        </el-form-item>
        <el-form-item label="报名结束语" prop="join_tips">
          <el-col :span="10">
            <el-input
              v-model.trim="form.join_tips"
              placeholder="报名结束语"
              type="textarea"
              :rows="2"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="报名结束语说明" prop="submit_form_tips">
          <el-col :span="10">
            <el-input
              v-model.trim="form.submit_form_tips"
              placeholder="报名结束语说明"
              type="textarea"
              :rows="4"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="是否开启短信通知" prop="is_sms_notice">
          <el-col :span="15">
            <div class="clearfix">
              <el-switch
                v-model="form.is_sms_notice"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
              <el-card v-if="form.is_sms_notice" class="box-card">
                <div class="text item">
                  您参与的"活动名称"活动，已经"审核结果"(允许参与 或 已拒绝)
                </div>
              </el-card>
            </div>
          </el-col>
        </el-form-item>
        <el-form-item label="是否开启小程序通知" prop="is_wxapp_notice">
          <el-col :span="15">
            <div class="clearfix">
              <el-switch
                v-model="form.is_wxapp_notice"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
              <el-card v-if="form.is_wxapp_notice" class="box-card">
                <div slot="header" class="clearfix">
                  <span>报名结果通知</span>
                </div>
                <div class="text item">活动名称：{{ form.activity_name }}</div>
                <div class="text item">报名结果：报名已通过(或 报名被拒绝)</div>
              </el-card>
            </div>
          </el-col>
        </el-form-item>
      </el-card>
      <el-card header="活动详情" shadow="naver">
        <el-radio-group v-model="mode">
          <el-radio :label="'richText'"> 富文本 </el-radio>
          <!-- <el-radio :label="'component'"> 组件式 </el-radio> -->
        </el-radio-group>
        <div v-if="mode === 'richText'" style="margin-top: 20px">
          <div>
            <SpRichText v-model="introInfo" />
          </div>
          <!-- <span class="tpl-btn" @click="addImgPreview" style="">
          <i class="iconfont icon-image"></i>图片
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
          {{ pageType === 'edit' ? '取消' : '返回' }}
        </el-button>
        <el-button v-if="pageType != 'detail'" type="primary" @click="submitAction">
          保存
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
import { Message } from 'element-ui'
import {
  regActivityAdd,
  regActivityGet,
  regActivityUpdate,
  getTemplateList
} from '@/api/selfhelpform'
import imgPicker from '@/components/imageselect'
import imgBox from '@/components/element/imgBox'
import district from '@/common/district.json'
import { listVipGrade } from '@/api/cardticket'
import { getGradeList } from '@/api/membercard'
import richTextEditor from '@/components/function/richTextEditor'
import EnterpriseDialog from './components/enterpriseDialog'
import { createSetting } from '@shopex/finder'
import DistributorSelect from '@/components/storeListSelect'
import draggable from 'vuedraggable'

export default {
  components: {
    imgPicker,
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
      regions: district,
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
      activityPicsDialog: false,
      isGetActivityImage: false,
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
        handle: '.icon-arrows-alt',
        draggable: '.goodspic'
      },
      picsCurrent: -1,
      pageType: '',
      rules: {
        activity_name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        is_allow_duplicate: [{ required: true, message: '请选择', trigger: 'change' }],
        is_need_check: [{ required: true, message: '请选择', trigger: 'change' }],
        is_offline_verify: [{ required: true, message: '请选择', trigger: 'change' }],
        is_allow_cancel: [{ required: true, message: '请选择', trigger: 'blur' }],
        is_white_list: [{ required: true, message: '请选择', trigger: 'blur' }],
        join_limit: [{ required: true, message: '请输入报名次数', trigger: 'blur' }]
      }
    }
  },
  computed: {
    shopSetting() {
      return createSetting({
        columns: [
          { name: 'ID', key: 'distributor_id' },
          { name: '名称', key: 'name' },
          { name: 'address', key: '地址' }
        ],
        actions: [
          {
            name: '删除',
            key: 'detete',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                const inChecked = this.distributor_list.findIndex(v => v.id == row.id)
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
      return createSetting({
        columns: [
          { name: '企业ID', key: 'id' },
          { name: '企业名称', key: 'name' },
          {
            name: '登录类型',
            key: 'auth_type',
            formatter: (value, { auth_type }, col) => {
              const VALIDATE_TYPES = [
                { name: '全部', value: '' },
                { name: '手机号', value: 'mobile' },
                { name: '账号密码', value: 'account' },
                { name: '邮箱', value: 'email' },
                { name: '二维码', value: 'qr_code' }
              ]
              const authType = VALIDATE_TYPES.find(item => item.value == auth_type)?.name
              return authType
            }
          },
          { name: '来源店铺', key: 'distributor_name' }
        ],
        actions: [
          {
            name: '删除',
            key: 'detete',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                const inChecked = this.enterprise_list.findIndex(v => v.id == row.id)
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
      regActivityGet(filter).then(res => {
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
      listVipGrade().then(response => {
        if (response != undefined && response.data.data && response.data.data.length > 0) {
          this.vipGrade = response.data.data
        }
      })
      getGradeList().then(response => {
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
        this.distributor_list?.map(item => item.distributor_id).join(',') || ''
      params['enterprise_ids'] = this.enterprise_list?.map(item => item.id).join(',') || ''
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
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (!this.useAllDistributor && this.distributor_list.length == 0) {
            return this.$message.error('请选择店铺')
          }
          if (this.form.is_white_list && this.enterprise_list.length == 0) {
            return this.$message.error('请选择企业')
          }
          if (this.form.activity_id) {
            regActivityUpdate(params).then(res => {
              if (res.data.data) {
                this.$message({
                  message: '更新成功',
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
            regActivityAdd(params).then(res => {
              if (res.data.data) {
                this.$message({
                  message: '添加成功',
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
      getTemplateList(this.templateParams).then(response => {
        response.data.data.list.map(item => {
          this.temp_options.push({
            label: item.tem_name,
            value: item.id
          })
        })
        this.temp_options.unshift({
          label: '无',
          value: '0'
        })
        this.loading = false
      })
    },
    chooseActivityImg(data) {
      if (data.length > 0) {
        data.forEach(data => {
          if (data && data.url !== '') {
            this.picsList.push(data.url)
          }
        })
      }
      this.activityPicsDialog = false
    },
    closeImgDialog() {
      this.activityPicsDialog = false
    },
    handleActivityPicsChange() {
      this.activityPicsDialog = true
      this.isGetActivityImage = true
    },
    pickThumb: function (arr) {
      if (arr.length != 0) {
        arr.forEach(data => {
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
