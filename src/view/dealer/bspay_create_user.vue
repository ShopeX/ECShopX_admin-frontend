<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div v-if="processed == '未填'" class="zyk_page_register_Info_edit">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane v-if="user_type == 'ent' || allShow" name="ent" :label="$t('3ec151aa.04c9e3')">
          <el-form
            ref="ruleForm"
            :model="form"
            label-width="130px"
            class="demo-ruleForm"
            :rules="rules"
          >
            <!-- 企业信息 -->
            <el-card class="box-card" shadow="never">
              <div slot="header" class="clearfix">
                <span>{{ $t('3ec151aa.54796d') }}</span>
              </div>

              <div class="content">
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item :label="$t('3ec151aa.f47e27')" prop="reg_name">
                      <el-input v-model="form.reg_name" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('3ec151aa.25c0bd')" prop="license_code">
                      <el-input v-model="form.license_code" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('3ec151aa.590847')" prop="license_begin_date">
                      <el-date-picker
                        v-model="form.license_begin_date"
                        type="date"
                        value-format="yyyyMMdd"
                        :placeholder="$t('3ec151aa.2bebdd')"
                        style="width: 100%"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('3ec151aa.0202dc')" prop="license_validity_type">
                      <el-switch
                        v-model="form.license_validity_type"
                        :active-value="1"
                        :inactive-value="0"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col v-if="form.license_validity_type != 1" :span="8">
                    <el-form-item :label="$t('3ec151aa.c857f2')" prop="license_end_date">
                      <el-date-picker
                        v-model="form.license_end_date"
                        type="date"
                        value-format="yyyyMMdd"
                        :placeholder="$t('3ec151aa.2bebdd')"
                        style="width: 100%"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('3ec151aa.e069d9')" prop="regionList">
                      <!-- <el-cascader
                        v-model="form.license_regions_id"
                        placeholder="住所地区"
                        :options="regions"
                        :props="{
                          checkStrictly: true
                        }"
                        @change="RegionChangeSearch"
                      /> -->
                      <el-cascader
                        v-model="form.license_regions_id"
                        style="width: 100%"
                        :options="regionsThird"
                        clearable
                        :props="{
                          value: 'area_code',
                          label: 'area_name'
                          // children: 'cities'
                        }"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('3ec151aa.a80b29')" prop="reg_detail">
                      <el-input v-model="form.reg_detail" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-card>
            <!-- 法人信息 -->
            <el-card class="box-card" shadow="never">
              <div slot="header" class="clearfix">
                <span>{{ $t('3ec151aa.77d3e2') }}</span>
              </div>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item :label="$t('3ec151aa.60d045')" prop="legal_name">
                    <el-input v-model="form.legal_name" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('3ec151aa.84e0cb')" prop="legal_cert_no">
                    <div class="flex">
                      <el-input v-model="form.legal_cert_no" />
                      <el-tooltip
                        :content="$t('3ec151aa.a1480c')"
                        placement="top-end"
                        effect="light"
                      >
                        <i class="el-icon-warning-outline" />
                      </el-tooltip>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('3ec151aa.a71128')" prop="legal_cert_begin_date">
                    <el-date-picker
                      v-model="form.legal_cert_begin_date"
                      type="date"
                      value-format="yyyyMMdd"
                      :placeholder="$t('3ec151aa.2bebdd')"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('3ec151aa.15ed38')" prop="legal_cert_validity_type">
                    <el-switch
                      v-model="form.legal_cert_validity_type"
                      :active-value="1"
                      :inactive-value="0"
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="form.legal_cert_validity_type != 1" :span="8">
                  <el-form-item :label="$t('3ec151aa.4301ec')" prop="legal_cert_end_date">
                    <el-date-picker
                      v-model="form.legal_cert_end_date"
                      type="date"
                      value-format="yyyyMMdd"
                      :placeholder="$t('3ec151aa.2bebdd')"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="8">
                  <el-form-item label="联系人姓名" prop="contact_name">
                    <el-input v-model="form.contact_name" />
                  </el-form-item>
                </el-col> -->
                <el-col :span="8">
                  <el-form-item :label="$t('3ec151aa.8098e2')" prop="contact_mobile">
                    <el-input v-model="form.contact_mobile" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('3ec151aa.b5a728')" prop="ent_type">
                    <div class="flex">
                      <el-select v-model="form.ent_type" :placeholder="$t('3ec151aa.708c9d')">
                        <el-option
                          v-for="(item, index) in ent_type_options"
                          :key="index"
                          :label="item"
                          :value="index"
                        />
                      </el-select>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
            <!-- 结算账户信息 -->
            <el-card class="box-card" shadow="never">
              <div slot="header" class="clearfix">
                <span>{{ $t('3ec151aa.99f89b') }}</span>
              </div>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item :label="$t('3ec151aa.32734c')" prop="card_type">
                    <el-radio-group v-model="form.card_type">
                      <el-radio label="0">{{ $t('3ec151aa.18ba13') }}</el-radio>
                      <el-radio label="1">{{ $t('3ec151aa.7aa562') }}</el-radio>
                      <!-- <el-radio label="2">对私非法人</el-radio> -->
                    </el-radio-group>
                  </el-form-item>
                </el-col>

                <!-- <el-col :span="8">
                  <el-form-item v-if="form.card_type == 0" label="开户名" prop="card_name">
                    <el-input v-model="form.card_name" />
                  </el-form-item>
                  <el-form-item v-if="form.card_type == 1" label="持卡人姓名" prop="card_name">
                    <el-input v-model="form.card_name" />
                  </el-form-item>
                </el-col> -->
                <el-col :span="8">
                  <el-form-item :label="$t('3ec151aa.d98e9d')" prop="card_no">
                    <el-input v-model="form.card_no" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('3ec151aa.3d9865')" prop="card_regions_id">
                    <el-cascader
                      v-model="form.card_regions_id"
                      style="width: 100%"
                      :options="regions"
                      clearable
                      :props="{
                        value: 'area_code',
                        label: 'area_name'
                        // children: 'cities'
                      }"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    v-if="form.card_type == 0"
                    :label="$t('3ec151aa.fb4d4e')"
                    prop="branch_code"
                    required
                  >
                    <el-input v-model="form.branch_code" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    v-if="form.card_type == 0"
                    :label="$t('3ec151aa.80c6d8')"
                    prop="branch_name"
                  >
                    <el-input v-model="form.branch_name" />
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="8">
                  <el-form-item v-if="form.card_type == 1" label="持卡人身份证号" prop="cert_no">
                    <el-input v-model="form.cert_no" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item v-if="form.card_type == 1" label="持卡人身份证开始" prop="cert_begin_date">
                    <el-date-picker
                      v-model="form.cert_begin_date"
                      type="date"
                      value-format="yyyyMMdd"
                      placeholder="选择日期"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item v-if="form.card_type == 1" label="有效期是否为长期" prop="cert_validity_type">
                    <el-switch
                      v-model="form.cert_validity_type"
                      active-value="1"
                      inactive-value="0"
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="form.cert_validity_type != 1 && form.card_type == 1" :span="8">
                  <el-form-item label="持卡人身份证结束" prop="cert_end_date">
                    <el-date-picker
                      v-model="form.cert_end_date"
                      type="date"
                      value-format="yyyyMMdd"
                      placeholder="选择日期"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col> -->
                <el-col :span="8">
                  <el-form-item :label="$t('3ec151aa.534a1d')" prop="mp">
                    <el-input v-model="form.mp" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
          </el-form>
        </el-tab-pane>
        <!-- 个人 -->
        <el-tab-pane
          v-if="user_type == 'indv' || allShow"
          name="indv"
          :label="$t('3ec151aa.6a0e04')"
        >
          <el-form
            ref="indvForm"
            :model="indvForm"
            label-width="130px"
            class="demo-ruleForm"
            :rules="indvRules"
          >
            <!-- 基本信息-->
            <el-card class="box-card" shadow="never">
              <div slot="header" class="clearfix">
                <span>{{ $t('3ec151aa.9e5ffa') }}</span>
              </div>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item :label="$t('3ec151aa.60d045')" prop="name">
                    <el-input v-model="indvForm.name" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('3ec151aa.84e0cb')" prop="cert_no">
                    <div class="flex">
                      <el-input v-model="indvForm.cert_no" />
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('3ec151aa.a71128')" prop="cert_begin_date">
                    <el-date-picker
                      v-model="indvForm.cert_begin_date"
                      type="date"
                      value-format="yyyyMMdd"
                      :placeholder="$t('3ec151aa.2bebdd')"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('3ec151aa.15ed38')" prop="cert_validity_type">
                    <el-switch
                      v-model="indvForm.cert_validity_type"
                      :active-value="1"
                      :inactive-value="0"
                    />
                  </el-form-item>
                </el-col>
                <el-col v-if="indvForm.cert_validity_type != 1" :span="8">
                  <el-form-item :label="$t('3ec151aa.4301ec')" prop="cert_end_date">
                    <el-date-picker
                      v-model="indvForm.cert_end_date"
                      type="date"
                      value-format="yyyyMMdd"
                      :placeholder="$t('3ec151aa.2bebdd')"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('3ec151aa.8098e2')" prop="mobile_no">
                    <div class="flex">
                      <el-input v-model="indvForm.mobile_no" />
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
            <!-- 结算账户信息 -->
            <el-card class="box-card" shadow="never">
              <div slot="header" class="clearfix">
                <span>{{ $t('3ec151aa.99f89b') }}</span>
              </div>
              <el-row :gutter="20">
                <!-- <el-col :span="8">
                  <el-form-item label="持卡人姓名" prop="card_name">
                    <el-input v-model="indvForm.card_name" />
                  </el-form-item>
                </el-col> -->
                <el-col :span="8">
                  <el-form-item :label="$t('3ec151aa.d98e9d')" prop="card_no">
                    <el-input v-model="indvForm.card_no" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('3ec151aa.a0b7da')" prop="mp">
                    <div class="flex">
                      <el-input v-model="indvForm.mp" />
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('3ec151aa.3d9865')" prop="card_regions_id">
                    <el-cascader
                      v-model="indvForm.card_regions_id"
                      style="width: 100%"
                      :options="regions"
                      clearable
                      :props="{
                        value: 'area_code',
                        label: 'area_name'
                      }"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
            <el-form-item style="text-align: center; margin: 50px 0; margin-right: 130px" />
          </el-form>
        </el-tab-pane>
        <div style="text-align: center; margin: 50px 0">
          <loading-btn
            ref="loadingBtn"
            size="medium"
            type="primary"
            :text="$t('3ec151aa.646db0')"
            @clickHandle="submit"
          />
        </div>
      </el-tabs>
    </div>
    <Result-cpn
      v-if="processed == '已填'"
      :current-status="currentStatus"
      @processedHandle="processedHandle"
    />
  </SpPage>
</template>

<script>
import {
  getBankList,
  createCorp,
  createPerson,
  updateCorp,
  updatePerson,
  checkPerson,
  checkCorp
} from '@/api/dealerReInfo'
import areaData from '@/common/area.json'
import ResultCpn from '@/view/base/setting/dealer/cpn/bspay_result.vue'
import { MaxRules, requiredRules } from '@/view/base/setting/dealer/tools'
import loadingBtn from '@/components/loading-btn'
import { getRegionNameById } from '@/utils'
// import district from '../../../common/district.json'
export default {
  components: {
    ResultCpn,
    loadingBtn
  },
  data() {
    return {
      // 初始打开tab
      activeName: 'ent',
      // 填写的类型
      user_type: '',
      ent_type_options: [],
      allShow: true,
      // 全部地区
      // AllArea: areaData,
      regions: [], // 二级地区
      regionsThird: [], // 三级地区
      processed: '',
      currentStatus: {
        resultStatus: '',
        time: '',
        info: '',
        title: ''
      },
      form: {
        reg_name: '', //企业名称
        license_code: '', //营业执照编号
        license_regions_id: [], // 省市区编码地区编码
        // license_validity_type: 0, // 营业执照有效期类型 1:长期有效 0:非长期有效；
        license_begin_date: '', //营业执照有效期起始日期
        license_end_date: '', //营业执照有效期结束日期
        reg_detail: '', //注册地址(详细信息)
        legal_name: '', // 法人姓名
        legal_cert_no: '', // 法人身份证号码
        // legal_cert_validity_type: 0, // 法人身份证有效期类型 1:长期有效 0:非长期有效；
        legal_cert_begin_date: '', // 法人身份证有效期起始时间
        legal_cert_end_date: '', // 法人身份证有效期结束时间
        contact_name: '', // 联系人姓名
        contact_mobile: '', // 联系人手机
        ent_type: '', // 公司类型
        card_type: '0', //银行账户类型：0：对公，1：对私法人；
        // card_name: '', //银行卡对应的户名，若银行账户类型是对公，必须与企业名称一致,
        card_no: '', //银行卡号
        card_regions_id: '', // 银行卡开户省市id
        branch_code: '', // 支行联行号
        branch_name: '', // 支行名称
        // cert_no: '',// 持卡人身份证号必填
        // cert_validity_type: 0,// 持卡人身份证有效期类型
        // cert_begin_date: '',// 持卡人身份证有效期起始日期
        // cert_end_date: '',// 持卡人身份证有效期截止日期
        mp: '' // 银行卡绑定手机号
      },
      rules: {
        reg_name: requiredRules('企业名称'),
        license_code: [requiredRules('统一社会信用代码'), MaxRules(18)],
        license_begin_date: {
          required: true,
          message: '请选择成立日期',
          trigger: 'blur'
        },
        license_regions_id: {
          type: 'array',
          required: true,
          message: '请选择住所省市区',
          trigger: 'change'
        },
        reg_detail: [requiredRules('住所详细地址'), MaxRules(60)],
        legal_name: [requiredRules('姓名'), MaxRules(20)],
        legal_cert_no: [requiredRules('身份证号'), MaxRules(18)],
        legal_cert_begin_date: {
          required: true,
          message: '请选择身份证开始有效期',
          trigger: 'blur'
        },
        // contact_name: [requiredRules('联系人姓名'), MaxRules(20)],
        contact_mobile: [requiredRules('手机号'), MaxRules(11)],
        ent_type: requiredRules('企业类型'),
        card_type: [requiredRules('结算银行账户类型', 'change')],
        // card_name: [requiredRules('结算银行卡开户名'), MaxRules(20)],
        card_no: [requiredRules('银行卡号'), MaxRules(40)],
        card_regions_id: {
          type: 'array',
          required: true,
          message: '请选择开户行所在省市',
          trigger: 'change'
        },
        branch_code: requiredRules('支行联行号'),
        // cert_no: [requiredRules('持卡人身份证号'), MaxRules(18)],
        // cert_begin_date: {
        //   required: true,
        //   message: '请选择持卡人身份证开始有效期',
        //   trigger: 'blur'
        // },
        mp: [requiredRules('银行绑定手机号'), MaxRules(11)],
        branch_name: [requiredRules('支行名称'), MaxRules(60)]
      },
      indvForm: {
        name: '', //用户姓名
        cert_no: '', // 用户身份证号码
        cert_validity_type: 0, // 用户身份证有效期类型 1:长期有效 0:非长期有效
        cert_begin_date: '',
        cert_end_date: '',
        mobile_no: '', // 用户手机号码
        card_no: '', //持卡人银行卡号
        card_regions_id: '', //开户行所在省市
        mp: '' // 银行卡预留手机号
      },
      indvRules: {
        name: [requiredRules('姓名'), MaxRules(20)],
        cert_no: [requiredRules('身份证号码'), MaxRules(18)],
        cert_begin_date: {
          required: true,
          message: '请选择持卡人身份证开始有效期',
          trigger: 'blur'
        },
        mobile_no: [requiredRules('手机号'), MaxRules(11)],
        card_no: [requiredRules('银行卡号'), MaxRules(40)],
        card_regions_id: {
          type: 'array',
          required: true,
          message: '请选择省市',
          trigger: 'change'
        },
        mp: [requiredRules('银行预留手机号'), MaxRules(11)]
      },
      isShow_ent: false,
      isShow_indv: false,
      type: '',
      id: ''
    }
  },
  async created() {
    const resThird = await this.$api.bspay.getRegionsThird()
    // const res = await this.$api.common.getAddress()
    this.regionsThird = resThird

    const res = await this.$api.bspay.getRegions()
    // const res = await this.$api.common.getAddress()
    this.regions = res
  },
  mounted() {
    this.queryUserStatus()
  },
  methods: {
    async queryUserStatus() {
      const { audit_state, update_time, audit_desc, user_type, ent_type_options } =
        await this.$api.bspay.userStatus()
      switch (audit_state) {
        case 'D': //待提交
          this.processed = '未填'
          break
        case 'A': // 待审核
          this.processed = '已填'
          break
        case 'B': // 审核失败
          this.processed = '已填'
          this.currentStatus = {
            resultStatus: 'failed',
            time: update_time,
            info: audit_desc,
            title: this.$t('3ec151aa.a7cd73')
          }
          break
        case 'C': // 开户成功
          this.processed = '已填'
          this.currentStatus = {
            resultStatus: 'netin',
            time: update_time,
            info: audit_desc,
            title: this.$t('3ec151aa.a7cd73')
          }
          break
      }
      if (audit_state != 'D') {
        this.allShow = false
      }
      this.user_type = user_type
      this.ent_type_options = ent_type_options
    },
    RegionChangeSearch(value) {
      var vals = this.getCascaderObj(value, this.regionsThird)
      console.log(1, vals)
    },

    getCascaderObj(val, opt) {
      return val.map(function (value, index, array) {
        for (var itm of opt) {
          if (itm.value === value) {
            opt = itm.children
            return itm
          }
        }
        return null
      })
    },
    submit() {
      if (this.activeName == 'ent') {
        this.submitForm('Y', 'loadingBtn')
      } else {
        this.submitFormPerson('Y', 'loadingBtn')
      }
    },
    submitForm(isSubmit, ref) {
      this.form.submit_review = isSubmit
      this.form.isUploadFile = true
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          if (this.form.id) {
            // 更新
            const { status } = await this.$api.bspay.modifyUserEnt(this.form)
            if (status) {
              this.$message.success(this.$t('3ec151aa.23b62e'))
              this.currentStatus = {
                resultStatus: 'pending',
                time: '',
                info: '',
                title: this.$t('3ec151aa.a7cd73')
              }
              this.processed = '已填'
            } else {
              this.$message.error(this.$t('3ec151aa.acd5cb'))
            }
          } else {
            console.log('this.form:', this.form)
            // 创建
            try {
              const { status } = await this.$api.bspay.createUserEnt(this.form)
              if (status) {
                this.$message.success(this.$t('3ec151aa.23b62e'))
                this.currentStatus = {
                  resultStatus: 'pending',
                  time: '',
                  info: '',
                  title: this.$t('3ec151aa.a7cd73')
                }
                this.processed = '已填'
                this.$refs[ref].closeLoading()
              }
            } catch (error) {
              this.$refs[ref].closeLoading()
            }
          }
        } else {
          this.$message.error(this.$t('3ec151aa.42ef0e'))
          this.$refs.loadingBtn.loading = false

          // return false
        }
      })
    },
    submitFormPerson(isSubmit, ref) {
      this.indvForm.submit_review = isSubmit
      this.$refs['indvForm'].validate(async (valid) => {
        if (valid) {
          console.log(this.indvForm)
          if (this.indvForm.id) {
            // 更新
            try {
              const { status } = await this.$api.bspay.modifyUserIndv(this.indvForm)
              if (status) {
                this.$message.success(this.$t('3ec151aa.23b62e'))
                this.currentStatus = {
                  resultStatus: 'pending',
                  time: '',
                  info: '',
                  title: this.$t('3ec151aa.a7cd73')
                }
                this.processed = '已填'
              }
              this.$refs[ref].closeLoading()
            } catch (error) {
              this.$refs[ref].closeLoading()
              return
            }
          } else {
            try {
              const { status } = await this.$api.bspay.createUserIndv(this.indvForm)
              if (status) {
                this.$message.success(this.$t('3ec151aa.23b62e'))
                this.currentStatus = {
                  resultStatus: 'pending',
                  time: '',
                  info: '',
                  title: this.$t('3ec151aa.a7cd73')
                }
                this.processed = '已填'
                this.$refs[ref].closeLoading()
              }
            } catch (error) {
              this.$refs[ref].closeLoading()
            }
          }
        } else {
          this.$message.error(this.$t('3ec151aa.e08d23'))
          this.$refs[ref].closeLoading()

          return false
        }
      })
    },
    handleAvatarSuccess(file) {
      console.log(file)
    },
    handleUpload: function (file) {
      this.form.attach_file_name = file.file.name
      this.form.attach_file = file.file
    },
    beforeAvatarUpload(file) {
      console.log(file)
      const isZip = file.type === 'application/zip' || file.type === 'application/x-zip-compressed'
      const isLt2M = file.size / 1024 / 1024 < 8
      if (!isZip) {
        this.$message.error(this.$t('3ec151aa.644239'))
      }
      if (!isLt2M) {
        this.$message.error(this.$t('3ec151aa.c5f04b'))
      }
      return isZip && isLt2M
    },
    goback() {
      this.$router.back(-1)
    },
    async processedHandle() {
      if (this.user_type == 'ent') {
        this.form = await this.$api.bspay.getUserEnt()
        this.processed = '未填'
        if (this.form.license_validity_type != null && this.form.license_validity_type !== '') {
          this.form.license_validity_type = Number(this.form.license_validity_type)
        }
        if (
          this.form.legal_cert_validity_type != null &&
          this.form.legal_cert_validity_type !== ''
        ) {
          this.form.legal_cert_validity_type = Number(this.form.legal_cert_validity_type)
        }
        this.form.license_regions_id = [
          this.form.reg_prov_id,
          this.form.reg_area_id,
          this.form.reg_district_id
        ]
        this.form.card_regions_id = [this.form.prov_id, this.form.area_id]
        if (!this.form.branch_code && this.form.bank_code) {
          this.form.branch_code = this.form.bank_code
        }
        console.log('ent---------', this.form)
      } else {
        this.indvForm = await this.$api.bspay.getUserIndv()
        this.processed = '未填'
        this.activeName = 'indv'
        if (this.indvForm.cert_validity_type != null && this.indvForm.cert_validity_type !== '') {
          this.indvForm.cert_validity_type = Number(this.indvForm.cert_validity_type)
        }
        this.indvForm.card_regions_id = [this.indvForm.prov_id, this.indvForm.area_id]
        console.log('indv---------', this.indvForm)
      }
    },

    // type 判断结果 （获取保存的结果）
    async getResult(id, type, user_type) {
      this.id = id

      if (id && user_type == 'ent') {
        this.activeName = user_type
        this.isShow_indv = true
        const result = await checkCorp(id)
        this.form = result.data.data

        const {
          area_code,
          prov_code,
          social_credit_code_expires,
          legal_cert_id_expires,
          attach_file_name,
          confirm_letter_file_name,
          bank_code,
          bank_name
        } = result.data.data
        this.form.area = [prov_code, area_code]
        this.form.attach_file_name = attach_file_name
        this.form.confirm_letter_file_name = confirm_letter_file_name

        console.log('ent---------', result)
      } else if (id && user_type == 'indv') {
        this.isShow_ent = true
        this.activeName = user_type
        const result = await checkPerson(id)

        this.indvForm = result.data.data
        console.log('indv---------', result)
      } else {
        console.log('增加')
        this.isShow_indv = true
        this.isShow_ent = true
        this.activeName = 'ent'
      }
    },
    // 结算所属银行
    async querySearch(queryString, cb) {
      this.AllBank = await this.$api.adapay.getBank({
        bank_name: this.form.bank_name
      })

      var restaurants = this.AllBank.map((item) => {
        return {
          value: item.bank_name,
          bank_code: item.bank_code,
          id: item.id
        }
      })
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      //调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    async get_bank() {
      const result = await getBankList()
      this.AllBank = result.data.data
    },
    handleSelectBank(val) {
      console.log(val)
      this.form.bank_code = val.bank_code
      this.form.bank_name = val.value
    }
  }
}
</script>

<style lang="scss" scoped>
.zyk_page_register_Info_edit {
  .flex {
    display: flex;
    align-items: center;
    i {
      margin-left: 10px;
      font-size: 18px;
    }
  }
  .other_content {
    display: flex;
    align-items: flex-start;
    justify-content: left;
    position: relative;
    .opload_rules {
      min-width: 400px;
      padding: 20px;
      font-size: 13px;
      color: #888;
      background: #f5f5f5;

      p {
        line-height: 32px;
      }
    }
  }
}
</style>

<style lang="scss">
.zyk_page_register_Info_edit {
  span {
    font-weight: 700;
  }
  padding-bottom: 100px;
  label {
    font-size: 12px;
    color: #000;
  }
  input {
    height: 30px;
    line-height: 30px;
  }
  .el-row {
    margin-bottom: 0px;
  }
}
</style>
