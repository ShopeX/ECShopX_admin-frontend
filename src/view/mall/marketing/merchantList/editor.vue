<template>
  <div class="MerchantsEditor">
    <h5>选择商家类型</h5>
    <el-divider></el-divider>
    <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
      form.settled_type == 'enterprise' ? '企业' : '个体户'
    }}</span>
    <el-select
      v-else
      v-model="form.settled_type"
      placeholder="请选择"
      :disabled="disabled || editDisabled"
    >
      <el-option label="企业" value="enterprise"></el-option>
      <el-option label="个体户" value="soletrader"></el-option>
    </el-select>
    <el-divider></el-divider>
    <el-form :model="form" :rules="rules" ref="form" label-width="130px" v-if="form.settled_type">
      <!-- 企业信息 -->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span class="theme">企业信息</span>
        </div>
        <section>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item
                :label="form.settled_type == 'enterprise' ? '企业全称' : '商户名称'"
                prop="merchant_name"
              >
                <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                  form.merchant_name
                }}</span>
                <el-input
                  v-else
                  :disabled="disabled || editDisabled"
                  v-model="form.merchant_name"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="统一社会信用代码" prop="social_credit_code_id">
                <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                  form.social_credit_code_id
                }}</span>
                <el-input
                  v-else
                  :disabled="disabled || editDisabled"
                  v-model="form.social_credit_code_id"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所在省市区" prop="regions_id">
                <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                  form.regions.join('/')
                }}</span>
                <el-cascader
                  v-else
                  style="width: 100%"
                  v-model="form.regions_id"
                  :options="AreaJson"
                  clearable
                  :props="{ value: 'value', label: 'label', children: 'children' }"
                  @change="regionChange"
                  :disabled="disabled"
                >
                </el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="详细地址" prop="address">
                <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                  form.address
                }}</span>
                <el-input v-else v-model="form.address" :disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :label="form.settled_type == 'enterprise' ? '法人姓名' : '负责人姓名'"
                prop="legal_name"
              >
                <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                  form.legal_name
                }}</span>
                <el-input
                  v-else
                  v-model="form.legal_name"
                  :disabled="disabled || editDisabled"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :label="form.settled_type == 'enterprise' ? '法人身份证号' : '负责人身份证号'"
                prop="legal_cert_id"
              >
                <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                  form.legal_cert_id
                }}</span>
                <el-input
                  v-else
                  v-model="form.legal_cert_id"
                  :disabled="disabled || editDisabled"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :label="form.settled_type == 'enterprise' ? '法人手机号' : '负责人手机号'"
                prop="legal_mobile"
              >
                <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                  form.legal_mobile
                }}</span>
                <el-input v-else v-model="form.legal_mobile" :disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系邮箱" prop="email">
                <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                  form.email
                }}</span>
                <el-input v-else v-model="form.email" :disabled="disabled"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </section>
      </el-card>
      <!-- 结算信息 -->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span class="theme">结算账户信息 </span>
          <span style="fons-size: 10px; color: #999">
            （结算银行卡姓名要与{{
              form.settled_type == 'enterprise' ? '法人' : '负责人'
            }}姓名一致）</span
          >
        </div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="结算银行账户类型" prop="bank_acct_type">
              <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                form.bank_acct_type == '1' ? '对公' : '对私'
              }}</span>
              <template v-else>
                <el-radio-group v-model="form.bank_acct_type" :disabled="disabled || editDisabled">
                  <el-radio label="1">对公</el-radio>
                  <el-radio label="2">对私</el-radio>
                </el-radio-group>
                <el-tooltip
                  :style="{ 'margin-left': 30 + 'px' }"
                  content="提现到账银行卡账户类型"
                  placement="top-end"
                  effect="light"
                >
                  <i class="el-icon-warning-outline"></i>
                </el-tooltip>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.bank_acct_type == '2'">
            <el-form-item label="银行预留手机号" prop="bank_mobile">
              <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                form.bank_mobile
              }}</span>
              <el-input
                v-else
                v-model="form.bank_mobile"
                :disabled="disabled || editDisabled"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-else>
            <el-form-item label="结算银行卡所属银行" prop="bank_name">
              <div class="flex">
                <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                  form.bank_name
                }}</span>
                <el-autocomplete
                  v-else
                  :disabled="disabled || editDisabled"
                  style="width: 100%"
                  prefix-icon="el-icon-search"
                  class="inline-input"
                  v-model="form.bank_name"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入选择内容"
                  @select="handleSelectBank"
                ></el-autocomplete>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结算银行卡号" prop="card_id_mask">
              <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                form.card_id_mask
              }}</span>
              <el-input
                v-else
                v-model="form.card_id_mask"
                :disabled="disabled || editDisabled"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <!-- 入驻信息 -->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span class="theme">入驻信息 </span>
        </div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="商户类型" prop="merchant_type">
              <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                form.merchant_type_parent_name
              }}</span>
              <el-select
                v-else
                v-model="form.merchant_type"
                placeholder="请选择"
                style="width: 100%"
                :disabled="disabled"
                @change="merchantType_change"
              >
                <el-option
                  v-for="item in MerchantsType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="经营范围" prop="merchant_type_id">
              <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                form.merchant_type_name
              }}</span>
              <el-select
                v-else
                v-model="form.merchant_type_id"
                placeholder="请选择"
                style="width: 100%"
                :disabled="disabled"
              >
                <el-option
                  v-for="item in WorkingGroupList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审核商品" prop="audit_goods">
              <span v-if="$route.query.type == 'detail'">{{
                form.audit_goods == 'true' ? '是' : '否'
              }}</span>
              <el-select
                v-else
                v-model="form.audit_goods"
                style="width: 60%"
                placeholder="请选择"
                :disabled="$route.query.type == 'verify' ? verifyDisabled : disabled"
              >
                <el-option label="是" value="true"></el-option>
                <el-option label="否" value="false"></el-option>
              </el-select>
              <el-tooltip
                :style="{ 'margin-left': 30 + 'px' }"
                content="商户上架商品是否通过平台审核"
                placement="top-end"
                effect="light"
              >
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <!-- 证照信息 -->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span class="theme">证照信息 </span>
        </div>
        <div class="wrap">
          <el-form-item prop="license_url" label-width="30px">
            <div class="upload-box" @click="handleImgPicker('license_url')">
              <img class="avatar" v-if="form.license_url" :src="form.license_url" />
              <i v-else slot="default" class="el-icon-plus"></i>
            </div>
            <p><span style="color: red">*</span> 营业执照</p>
          </el-form-item>
          <el-form-item prop="legal_certid_front_url" label-width="30px">
            <div class="upload-box" @click="handleImgPicker('legal_certid_front_url')">
              <img
                class="avatar"
                v-if="form.legal_certid_front_url"
                :src="form.legal_certid_front_url"
              />
              <i v-else slot="default" class="el-icon-plus"></i>
            </div>
            <p>
              <span style="color: red">*</span>
              {{ form.settled_type == 'enterprise' ? '法人' : '负责人' }}手持身份证正面
            </p>
          </el-form-item>
          <el-form-item prop="legal_cert_id_back_url" label-width="30px">
            <div class="upload-box" @click="handleImgPicker('legal_cert_id_back_url')">
              <img
                class="avatar"
                v-if="form.legal_cert_id_back_url"
                :src="form.legal_cert_id_back_url"
              />
              <i v-else slot="default" class="el-icon-plus"></i>
            </div>
            <p>
              <span style="color: red">*</span>
              {{ form.settled_type == 'enterprise' ? '法人' : '负责人' }}手持身份证反面
            </p>
          </el-form-item>
          <el-form-item prop="bank_card_front_url" label-width="30px">
            <div class="upload-box" @click="handleImgPicker('bank_card_front_url')">
              <img class="avatar" v-if="form.bank_card_front_url" :src="form.bank_card_front_url" />
              <i v-else slot="default" class="el-icon-plus"></i>
            </div>
            <p><span style="color: red">*</span> 结算银行卡正面照</p>
          </el-form-item>
          <el-form-item prop="contract_url" label-width="30px">
            <div class="upload-box" @click="handleImgPicker('contract_url')">
              <img class="avatar" v-if="form.contract_url" :src="form.contract_url" />
              <i v-else slot="default" class="el-icon-plus"></i>
            </div>
            <p>合同</p>
          </el-form-item>
        </div>
      </el-card>
      <!-- 账号信息 -->
      <el-card
        class="box-card"
        shadow="never"
        v-if="$route.query.type == 'add' && $store.getters.login_type != 'merchant'"
      >
        <div slot="header" class="clearfix">
          <span class="theme">账号信息 </span>
        </div>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="生成账号" prop="createAccount">
              <el-tooltip
                :style="{ 'margin-right': 30 + 'px' }"
                content="商户网址、账号密码、店铺网址将发送至此手机号上，且商户账号为此号码"
                placement="top-end"
                effect="light"
              >
                <i class="el-icon-warning-outline"></i>
              </el-tooltip>
              <el-radio-group v-model="form.createAccount" :disabled="disabled">
                <el-radio label="1"
                  >{{ form.settled_type == 'enterprise' ? '法人' : '负责人' }}手机号</el-radio
                >
                <el-radio label="2">其他</el-radio>
              </el-radio-group>
              <template v-if="form.createAccount == '2'">
                <el-form-item prop="mobile">
                  <el-input
                    placeholder="请填写手机号"
                    v-model="form.mobile"
                    :disabled="disabled"
                    style="width: 300px"
                  ></el-input>
                </el-form-item>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="短信发送时间" prop="settled_succ_sendsms">
              <el-radio-group v-model="form.settled_succ_sendsms" :disabled="disabled">
                <el-radio label="1">立即发送</el-radio>
                <el-radio label="2">商家H5确认入驻协议后</el-radio>
              </el-radio-group>
              <label v-if="form.settled_succ_sendsms == 2" class="h5_link">
                <span>{{ h5url }}</span>
                <a v-clipboard:copy="h5url" v-clipboard:success="onCopy"> 复制链接</a>
              </label>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <!-- 审核详情 -->
      <template v-if="audit_status && audit_status != '1'">
        <p>
          <span :class="['audit_status', audit_status == '2' ? 'success' : 'fail']"></span
          >{{ (audit_status == '2' && '通过') || (audit_status == '3' && '拒绝') }}
        </p>
        <p>审批备注: {{ audit_memo || '-' }}</p>
      </template>

      <!-- 按钮 -->
      <template
        v-if="
          $route.query.type == 'edit' ||
          ($route.query.type == 'add' && $store.getters.login_type != 'merchant')
        "
      >
        <el-form-item label-width="0px" style="text-align: center; margin-top: 60px">
          <el-button type="primary" style="padding: 10px 50px" @click="submitFn('form')"
            >保存</el-button
          >
        </el-form-item>
      </template>
      <template v-if="$route.query.type == 'verify'">
        <el-form-item label-width="0px" style="text-align: center; margin-top: 60px">
          <template v-if="audit_status == '1'">
            <el-button
              type="success"
              style="padding: 10px 50px"
              :disabled="datapass_block != 0"
              @click="fnPass"
              >通过</el-button
            >
            <el-button
              type="danger"
              style="padding: 10px 50px"
              :disabled="datapass_block != 0"
              @click="fnReject"
              >驳回</el-button
            >
          </template>
          <template v-else>
            <el-button type="info" style="padding: 10px 50px">已审批</el-button>
          </template>
        </el-form-item>
      </template>
    </el-form>
    <!-- 图片选择 -->
    <imgPicker
      :dialog-visible="imgDialog"
      :sc-status="isGetImage"
      @chooseImg="pickImg"
      @closeImgDialog="closeImgDialog"
    ></imgPicker>
    <check-box
      ref="checkbox"
      :visible="checkBoxConfig.visible"
      :message="checkBoxConfig.message"
      :is_idea="checkBoxConfig.is_idea"
      @checkBoxVisibleHandle="checkBoxVisibleHandle"
      @checkBoxConfirmHandle="checkBoxConfirmHandle"
    ></check-box>
  </div>
</template>

<script>
import { MaxRules, requiredRules } from '@/view/base/setting/dealer/tools'
import {
  getShopConfig,
  addTheBusinessman,
  getTheMerchant,
  merchantsInDetail,
  setCheckTheEntryOfMerchants,
  getTheMerchantInfo,
  getArea,
  getMerchantsType
} from '@/api/mall/marketing.js'
import imgPicker from '@/components/imageselect'
import checkBox from '@/view/base/setting/dealer/cpn/checkBox.vue'

export default {
  props: ['props_type'],
  data() {
    return {
      isEditCheckBox: false, //编辑状态是否弹窗 离开页面丢失数据
      checkBoxConfig: {
        visible: false,
        message: '',
        is_idea: true
      },
      h5url: '',
      currentCheckBoxStatus: '',
      // 审批相关
      audit_status: '',
      audit_memo: '',
      // ---------
      AreaJson: [],
      MerchantsType: [],
      WorkingGroupList: [],
      sort_order_by: 'asc',
      pickerImgType: '',
      disabled: false,
      editDisabled: false,
      verifyDisabled: false,
      // 图片选择
      imgDialog: false,
      isGetImage: false,
      // 脱敏
      datapass_block: 0,
      // form: {
      //   settled_type: 'enterprise',
      //   merchant_name:'张三的烧饼店',
      //   social_credit_code_id:'888898981209876543',
      //   regions_id:['140000','140100','140107'],
      //   regions:[],
      //   address:'张村',
      //   legal_name:'张三',
      //   legal_cert_id:'343672981078223457',
      //   legal_mobile:'13909098888',
      //   email:'111@qq.com',
      //   // 结算信息
      //   bank_acct_type:'1',
      //   bank_name:'上海闵行上银村镇银行',
      //   bank_mobile:'13909098888',
      //   card_id_mask:'343672981078223457',
      //   // 入驻信息
      //   merchant_type:'',
      //   merchant_type_id:'6',
      //   audit_goods:'true',
      //   // 证照信息
      //   license_url:"http://bbctest.aixue7.com/platform_develop/image/1/2021/12/16/b88a6bb01f3c5e34186f6e34ff120931kBaR0tsJbdL98htZIjoEfl3XJA6EPssU",
      //   legal_certid_front_url:"http://bbctest.aixue7.com/platform_develop/image/1/2021/12/16/b88a6bb01f3c5e34186f6e34ff1209315al9PCCnCwJvqhQteYPwZQ0fs6IYyB7g",
      //   legal_cert_id_back_url:"http://bbctest.aixue7.com/platform_develop/image/1/2021/12/16/b88a6bb01f3c5e34186f6e34ff12093158TnMCm9r4DdEOOaYOoyV7UvzQG1xr0t",
      //   bank_card_front_url:"http://bbctest.aixue7.com/platform_develop/image/1/2021/12/16/fb85f3523c2b1eecf9f1951348eb71aa8y1TKHdzE7AxmVrsFsopw2azEIicWVtP",
      //   contract_url:"http://bbctest.aixue7.com/platform_develop/image/1/2021/12/16/fb85f3523c2b1eecf9f1951348eb71aaUu6NzsGLwIGz0h1SuXfhgXI1jhQ0YV5g",
      //   // 账号信息
      //   createAccount:'1',
      //   mobile:'',
      //   settled_succ_sendsms:'2',// 1:立即 2:商家H5确认入驻协议后

      // },
      form: {
        settled_type: '',
        merchant_name: '',
        regions_id: [],
        regions: [],
        social_credit_code_id: '',
        address: '',
        legal_name: '',
        legal_cert_id: '',
        legal_mobile: '',
        email: '',
        // 结算信息
        bank_acct_type: '1',
        bank_name: '',
        bank_mobile: '',
        card_id_mask: '',
        // 入驻信息
        merchant_type: '',
        merchant_type_id: '',
        audit_goods: 'true',
        // 证照信息
        license_url: '',
        legal_certid_front_url: '',
        legal_cert_id_back_url: '',
        bank_card_front_url: '',
        contract_url: '',
        // 账号信息
        createAccount: '1',
        mobile: '',
        settled_succ_sendsms: '', // 1:立即 2:商家H5确认入驻协议后
        id: '', // 会多返回一个ID 作为当前id
        // 会回显时需要
        merchant_type_parent_name: '',
        merchant_type_name: ''
      },
      rules: {
        merchant_name: [requiredRules('企业全称')],
        social_credit_code_id: [requiredRules('统一社会信用代码'), MaxRules(18)],
        regions_id: [requiredRules('所在省市区', 'change')],
        address: [requiredRules('详细地址')],
        legal_name: [requiredRules('法人姓名')],
        legal_cert_id: [requiredRules('法人身份证号'), MaxRules(18)],
        legal_mobile: [requiredRules('法人手机号'), MaxRules(11)],
        bank_acct_type: requiredRules('结算银行账户类型', 'change'),
        bank_name: requiredRules('结算银行卡所属银行', 'change'),
        bank_mobile: [requiredRules('银行预留手机号'), MaxRules('11')],
        card_id_mask: [requiredRules('结算银行卡号'), MaxRules('19')],
        merchant_type: [requiredRules('商户类型', 'change')],
        merchant_type_id: [requiredRules('经营类型', 'change')],
        audit_goods: requiredRules('是否审核商品', 'change'),
        license_url: requiredRules('营业执照', 'change'),
        legal_certid_front_url: requiredRules('法人手持身份证正面', 'change'),
        legal_cert_id_back_url: requiredRules('法人手持身份证反面', 'change'),
        bank_card_front_url: requiredRules('结算银行卡正面照', 'change'),
        createAccount: requiredRules('生成账号', 'change'),
        mobile: requiredRules('手机号'),
        settled_succ_sendsms: requiredRules('短信发送时间', 'change')
      }
    }
  },
  watch: {
    'form.merchant_type': {
      handler(value) {
        if (this.MerchantsType.length > 0) {
          this.getWorkingGroupList(value)
        }
        console.log(value)
      }
    },
    MerchantsType: {
      handler() {
        if (this.form.merchant_type) {
          this.getWorkingGroupList(this.form.merchant_type)
        }
      }
    },
    'form.legal_mobile'(value) {
      if (value && this.form.createAccount == '1') {
        this.form.mobile = value
      } else {
        this.form.mobile = ''
      }
    },
    'form.createAccount': {
      immediate: true,
      handler(val) {
        if (val == '1' && this.form.legal_mobile) {
          this.form.mobile = this.form.legal_mobile
        } else {
          this.form.mobile = ''
        }
      }
    }
  },
  mounted() {
    this.getMerchantsTypeList()
    this.getAreaList()
    this.init()
    this.getConfig()
  },
  methods: {
    async getConfig() {
      const result = await getShopConfig()
      this.h5url = result.data.data.h5url
    },
    onCopy() {
      this.$notify({
        message: '复制成功',
        type: 'success'
      })
    },
    async init() {
      if (this.$store.getters.login_type == 'merchant') {
        const result = await getTheMerchantInfo()
        this.disabled = true
        this.resultHandler(result)
        console.log('商户端')
        this.$route.query.type = 'detail'
        return
      }

      const { type, merchantId } = this.$route.query
      if (type == 'edit' || type == 'detail') {
        let action = 'edit'
        if (type == 'detail') {
          this.disabled = true
          action = 'detail'
        } else {
          this.editDisabled = true
        }
        const result = await getTheMerchant({ action }, merchantId)
        this.resultHandler(result)
      } else if (type == 'verify') {
        this.disabled = true
        const result = await merchantsInDetail(merchantId)
        this.resultHandler(result)
      }
    },
    resultHandler(result) {
      const {
        settled_type,
        merchant_name,
        regions_id,
        address,
        province,
        city,
        area,
        social_credit_code_id,
        legal_name,
        legal_cert_id,
        legal_mobile,
        email,
        bank_acct_type,
        bank_name,
        bank_mobile,
        card_id_mask,
        merchant_type_id,
        audit_goods,
        license_url,
        legal_certid_front_url,
        legal_cert_id_back_url,
        bank_card_front_url,
        contract_url,
        merchant_type_parent_id,
        audit_status,
        id,
        datapass_block,
        audit_memo,
        merchant_type_name,
        merchant_type_parent_name
      } = result.data.data
      this.form = {
        settled_type,
        merchant_name,
        address,
        social_credit_code_id,
        legal_name,
        legal_cert_id,
        legal_mobile,
        email,
        bank_acct_type,
        bank_name,
        bank_mobile,
        card_id_mask,
        merchant_type_id,
        license_url,
        legal_certid_front_url,
        legal_cert_id_back_url,
        bank_card_front_url,
        contract_url,
        audit_goods: JSON.stringify(audit_goods),
        regions_id: JSON.parse(regions_id),
        regions: [province, city, area],
        merchant_type: merchant_type_parent_id,
        id,
        merchant_type_parent_name,
        merchant_type_name
      }
      this.datapass_block = datapass_block
      this.audit_status = audit_status
      this.audit_memo = audit_memo
    },
    submitFn(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { type, merchantId } = this.$route.query
          const result = await addTheBusinessman(this.form, type == 'edit' ? merchantId : null)
          if (result.data.data.status) {
            this.$message.success('保存成功')
            this.isEditCheckBox = true
            this.$router.go(-1)
          }
          console.log(result)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    fnPass() {
      this.checkBoxConfig.visible = true
      this.checkBoxConfig.message = this.checkBoxMessage('通过')
      this.currentCheckBoxStatus = true
    },
    fnReject() {
      this.checkBoxConfig.visible = true
      this.checkBoxConfig.message = this.checkBoxMessage('驳回')
      this.currentCheckBoxStatus = false
    },
    /* -------------------------checkbox------------------------- */
    async checkBoxConfirmHandle(data) {
      console.log(data)
      console.log(this.form)
      const obj = {
        id: this.form.id,
        audit_status: this.currentCheckBoxStatus ? '2' : '3',
        audit_memo: data.comments,
        audit_goods: this.form.audit_goods ? '1' : '0'
      }
      const result = await setCheckTheEntryOfMerchants(obj)
      if (result.data.data.status) {
        this.$message.success('审批成功')
        this.checkBoxVisibleHandle()
        this.init()
      }
    },
    checkBoxVisibleHandle() {
      this.currentCheckBoxStatus = ''
      this.checkBoxConfig.visible = false
    },
    /* -------------------------checkbox------------------------- */

    /* -------------------------图片选择------------------------- */
    pickImg({ url }) {
      if (url && this.pickerImgType) {
        const that = this.form
        that[this.pickerImgType] = url
        this.imgDialog = false
      }
    },
    closeImgDialog() {
      this.imgDialog = false
      this.isGetImage = false
    },
    handleImgPicker(pickerImgType) {
      if (!this.disabled) {
        this.pickerImgType = pickerImgType
        this.imgDialog = true
        this.isGetImage = true
      }
    },
    /* -------------------------图片选择------------------------- */

    // 获取商户类型及经营范围
    async getMerchantsTypeList() {
      const result = await getMerchantsType()
      this.MerchantsType = result.data.data
    },
    async getWorkingGroupList(id) {
      const result = await getMerchantsType({ parent_id: id })
      this.WorkingGroupList = (result.data.data.length > 0 && result.data.data) || []
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
    handleSelectBank(val) {
      console.log(val)
      this.form.bank_code = val.bank_code
      this.form.bank_name = val.value
    },
    merchantType_change(val) {
      this.form.merchant_type = val
      this.form.merchant_type_id = ''
      // this.getWorkingGroupList(val)
      // console.log(val);
    },
    regionChange(value) {
      console.log(value)
      var vals = this.getCascaderObj(value, this.AreaJson)
      if (vals.length > 0) {
        this.form.regions = [vals[0].label, vals[1].label, vals[2].label]
      } else {
        this.form.regions = []
      }
      console.log(this.form.regions)
    },
    getCascaderObj(val, opt) {
      return val.map(function (value) {
        for (var itm of opt) {
          if (itm.value === value) {
            opt = itm.children
            return itm
          }
        }
        return null
      })
    },
    checkBoxMessage(status) {
      return `请确认是否${status} 【${this.form.merchant_name}】 的入驻申请，<br/>最终审核结果将有短信提醒发送至其注册手机号<br/>（短信费用将在短信余额中扣除）。`
    },
    async getAreaList() {
      const result = await getArea()
      this.AreaJson = result.data.data
    }
  },
  components: {
    imgPicker,
    checkBox
  },
  beforeRouteLeave(to, from, next) {
    const { type } = this.$route.query
    console.log(to, type)
    if (type == 'add' || (type == 'edit' && !this.isEditCheckBox)) {
      this.$confirm('确定要离开当前页面，您将丢失已编辑的数据？！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then((res) => {
          next()
        })
        .catch(() => {
          next(false)
        })
    } else {
      next()
    }
  }
}
</script>

<style lang="scss" scoped>
.MerchantsEditor {
  .upload-box {
    width: 150px;
    height: 150px;
    align-items: center;
    display: flex;
    border: 2px dashed #ccc;
    justify-content: center;
    border-radius: 5px;
    cursor: pointer;
    i {
      font-size: 40px;
      color: #999;
    }
    img {
      max-width: 100%;
      max-height: 140px;
    }
    &:hover {
      border-color: #409eff;
    }
  }
  .audit_status {
    display: inline-block;
    width: 5px;
    height: 5px;
    margin-bottom: 3px;
    margin-right: 10px;
    border-radius: 50%;
    &.success {
      background: #67c23a;
    }
    &.fail {
      background: red;
    }
  }
  .h5_link {
    color: grey;
    margin-left: 20px;
  }
}
</style>

<style lang="scss">
.MerchantsEditor {
  padding-bottom: 50px;
  .theme {
    font-size: 15px;
    font-weight: 700;
  }
  .el-form-item__label {
    font-size: 12px;
    font-weight: 700;
  }
  .wrap {
    .el-form-item {
      float: left;
      margin-right: 30px;
      p {
        text-align: center;
        font-size: 12px;
      }
    }
    .row {
      text-align: center;
    }
  }
}
</style>