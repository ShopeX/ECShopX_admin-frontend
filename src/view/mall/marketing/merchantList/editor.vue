<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage class="MerchantsEditor">
    <h5>{{ $t('e8e4e935.e9b5ee') }}</h5>
    <el-divider />
    <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
      form.settled_type == 'enterprise' ? $t('e8e4e935.04c9e3') : $t('e8e4e935.a41061')
    }}</span>
    <el-select
      v-else
      v-model="form.settled_type"
      :placeholder="$t('e8e4e935.708c9d')"
      :disabled="disabled || editDisabled"
    >
      <el-option :label="$t('e8e4e935.04c9e3')" value="enterprise" />
      <el-option :label="$t('e8e4e935.a41061')" value="soletrader" />
    </el-select>
    <el-divider />
    <el-form v-if="form.settled_type" ref="form" :model="form" :rules="rules" label-width="130px">
      <!-- 企业信息 -->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span class="theme">{{ $t('e8e4e935.54796d') }}</span>
        </div>
        <section>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item
                :label="
                  form.settled_type == 'enterprise' ? $t('e8e4e935.0b66da') : $t('e8e4e935.e6f169')
                "
                prop="merchant_name"
              >
                <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                  form.merchant_name
                }}</span>
                <el-input
                  v-else
                  v-model="form.merchant_name"
                  :disabled="disabled || editDisabled"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('e8e4e935.25c0bd')" prop="social_credit_code_id">
                <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                  form.social_credit_code_id
                }}</span>
                <el-input
                  v-else
                  v-model="form.social_credit_code_id"
                  :disabled="disabled || editDisabled"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('e8e4e935.8c74f2')" prop="regions_id">
                <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                  form.regions.join('/')
                }}</span>
                <el-cascader
                  v-else
                  v-model="form.regions_id"
                  style="width: 100%"
                  :options="AreaJson"
                  clearable
                  :props="{ value: 'value', label: 'label', children: 'children' }"
                  :disabled="disabled"
                  @change="regionChange"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('e8e4e935.61a0ec')" prop="address">
                <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                  form.address
                }}</span>
                <el-input v-else v-model="form.address" :disabled="disabled" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :label="
                  form.settled_type == 'enterprise' ? $t('e8e4e935.2fe17a') : $t('e8e4e935.610859')
                "
                prop="legal_name"
              >
                <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                  form.legal_name
                }}</span>
                <el-input v-else v-model="form.legal_name" :disabled="disabled" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :label="
                  form.settled_type == 'enterprise' ? $t('e8e4e935.e8b4af') : $t('e8e4e935.cb32ae')
                "
                prop="legal_cert_id"
              >
                <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                  form.legal_cert_id
                }}</span>
                <el-input v-else v-model="form.legal_cert_id" :disabled="disabled" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :label="
                  form.settled_type == 'enterprise' ? $t('e8e4e935.f50f83') : $t('e8e4e935.8de58d')
                "
                prop="legal_mobile"
              >
                <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                  form.legal_mobile
                }}</span>
                <el-input v-else v-model="form.legal_mobile" :disabled="disabled" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('e8e4e935.a6695e')" prop="email">
                <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                  form.email
                }}</span>
                <el-input v-else v-model="form.email" :disabled="disabled" />
              </el-form-item>
            </el-col>
          </el-row>
        </section>
      </el-card>
      <!-- 结算信息 -->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span class="theme">{{ $t('e8e4e935.99f89b') }} </span>
          <span style="fons-size: 10px; color: #999">
            （{{ $t('e8e4e935.618c5d')
            }}{{ form.settled_type == 'enterprise' ? $t('e8e4e935.e1a437') : $t('e8e4e935.b29725')
            }}{{ $t('e8e4e935.5e9df0') }}）</span
          >
        </div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="$t('e8e4e935.32734c')" prop="bank_acct_type">
              <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                form.bank_acct_type == '1' ? $t('e8e4e935.18ba13') : $t('e8e4e935.f0bf8a')
              }}</span>
              <template v-else>
                <el-radio-group v-model="form.bank_acct_type" :disabled="disabled">
                  <el-radio label="1"> {{ $t('e8e4e935.18ba13') }} </el-radio>
                  <el-radio label="2"> {{ $t('e8e4e935.f0bf8a') }} </el-radio>
                </el-radio-group>
                <el-tooltip
                  :style="{ 'margin-left': 30 + 'px' }"
                  :content="$t('e8e4e935.8597fb')"
                  placement="top-end"
                  effect="light"
                >
                  <i class="el-icon-warning-outline" />
                </el-tooltip>
              </template>
            </el-form-item>
          </el-col>
          <el-col v-if="form.bank_acct_type == '2'" :span="8">
            <el-form-item :label="$t('e8e4e935.a0b7da')" prop="bank_mobile">
              <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                form.bank_mobile
              }}</span>
              <el-input v-else v-model="form.bank_mobile" :disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col v-else :span="8">
            <el-form-item :label="$t('e8e4e935.0a3e82')" prop="bank_name">
              <div class="flex">
                <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                  form.bank_name
                }}</span>
                <el-autocomplete
                  v-else
                  v-model="form.bank_name"
                  :disabled="disabled"
                  style="width: 100%"
                  prefix-icon="el-icon-search"
                  class="inline-input"
                  :fetch-suggestions="querySearch"
                  :placeholder="$t('e8e4e935.473e86')"
                  @select="handleSelectBank"
                />
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('e8e4e935.88174a')" prop="card_id_mask">
              <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                form.card_id_mask
              }}</span>
              <el-input v-else v-model="form.card_id_mask" :disabled="disabled" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <!-- 入驻信息 -->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span class="theme">{{ $t('e8e4e935.e48700') }} </span>
        </div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="$t('e8e4e935.4709c8')" prop="merchant_type">
              <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                form.merchant_type_parent_name
              }}</span>
              <el-select
                v-else
                v-model="form.merchant_type"
                :placeholder="$t('e8e4e935.708c9d')"
                style="width: 100%"
                :disabled="disabled"
                @change="merchantType_change"
              >
                <el-option
                  v-for="item in MerchantsType"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('e8e4e935.04228b')" prop="merchant_type_id">
              <span v-if="$route.query.type == 'detail' || $route.query.type == 'verify'">{{
                form.merchant_type_name
              }}</span>
              <el-select
                v-else
                v-model="form.merchant_type_id"
                :placeholder="$t('e8e4e935.708c9d')"
                style="width: 100%"
                :disabled="disabled"
              >
                <el-option
                  v-for="item in WorkingGroupList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('e8e4e935.48f0ee')" prop="audit_goods">
              <span v-if="$route.query.type == 'detail'">{{
                form.audit_goods == 'true' ? $t('e8e4e935.0a60ac') : $t('e8e4e935.c9744f')
              }}</span>
              <el-select
                v-else
                v-model="form.audit_goods"
                style="width: 60%"
                :placeholder="$t('e8e4e935.708c9d')"
                :disabled="$route.query.type == 'verify' ? verifyDisabled : disabled"
              >
                <el-option :label="$t('e8e4e935.0a60ac')" value="true" />
                <el-option :label="$t('e8e4e935.c9744f')" value="false" />
              </el-select>
              <el-tooltip
                :style="{ 'margin-left': 30 + 'px' }"
                :content="$t('e8e4e935.403026')"
                placement="top-end"
                effect="light"
              >
                <i class="el-icon-warning-outline" />
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <!-- 证照信息 -->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span class="theme">{{ $t('e8e4e935.8f14f8') }} </span>
        </div>
        <div class="wrap">
          <el-form-item prop="license_url" label-width="30px">
            <div class="upload-box" @click="handleImgPicker('license_url')">
              <img v-if="form.license_url" class="avatar" :src="form.license_url">
              <i v-else slot="default" class="el-icon-plus" />
            </div>
            <p><span style="color: red">*</span> {{ $t('e8e4e935.e0b8cc') }}</p>
          </el-form-item>
          <el-form-item prop="legal_certid_front_url" label-width="30px">
            <div class="upload-box" @click="handleImgPicker('legal_certid_front_url')">
              <img
                v-if="form.legal_certid_front_url"
                class="avatar"
                :src="form.legal_certid_front_url"
              >
              <i v-else slot="default" class="el-icon-plus" />
            </div>
            <p>
              <span style="color: red">*</span>
              {{ form.settled_type == 'enterprise' ? $t('e8e4e935.e1a437') : $t('e8e4e935.b29725')
              }}{{ $t('e8e4e935.c4a042') }}
            </p>
          </el-form-item>
          <el-form-item prop="legal_cert_id_back_url" label-width="30px">
            <div class="upload-box" @click="handleImgPicker('legal_cert_id_back_url')">
              <img
                v-if="form.legal_cert_id_back_url"
                class="avatar"
                :src="form.legal_cert_id_back_url"
              >
              <i v-else slot="default" class="el-icon-plus" />
            </div>
            <p>
              <span style="color: red">*</span>
              {{ form.settled_type == 'enterprise' ? $t('e8e4e935.e1a437') : $t('e8e4e935.b29725')
              }}{{ $t('e8e4e935.267438') }}
            </p>
          </el-form-item>
          <el-form-item prop="bank_card_front_url" label-width="30px">
            <div class="upload-box" @click="handleImgPicker('bank_card_front_url')">
              <img v-if="form.bank_card_front_url" class="avatar" :src="form.bank_card_front_url">
              <i v-else slot="default" class="el-icon-plus" />
            </div>
            <p>{{ $t('e8e4e935.a7a1aa') }}</p>
          </el-form-item>
          <el-form-item prop="contract_url" label-width="30px">
            <div class="upload-box" @click="handleImgPicker('contract_url')">
              <img v-if="form.contract_url" class="avatar" :src="form.contract_url">
              <i v-else slot="default" class="el-icon-plus" />
            </div>
            <p>{{ $t('e8e4e935.f5dc10') }}</p>
          </el-form-item>
        </div>
      </el-card>
      <!-- 账号信息 -->
      <el-card
        v-if="$route.query.type == 'add' && $store.getters.login_type != 'merchant'"
        class="box-card"
        shadow="never"
      >
        <div slot="header" class="clearfix">
          <span class="theme">{{ $t('e8e4e935.53cab4') }} </span>
        </div>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label="$t('e8e4e935.c41aeb')" prop="createAccount">
              <el-tooltip
                :style="{ 'margin-right': 30 + 'px' }"
                :content="$t('e8e4e935.f5dfab')"
                placement="top-end"
                effect="light"
              >
                <i class="el-icon-warning-outline" />
              </el-tooltip>
              <el-radio-group v-model="form.createAccount" :disabled="disabled">
                <el-radio label="1">
                  {{
                    form.settled_type == 'enterprise'
                      ? $t('e8e4e935.e1a437')
                      : $t('e8e4e935.b29725')
                  }}{{ $t('e8e4e935.8098e2') }}
                </el-radio>
                <el-radio label="2"> {{ $t('e8e4e935.0d98c7') }} </el-radio>
              </el-radio-group>
              <template v-if="form.createAccount == '2'">
                <el-form-item prop="mobile">
                  <el-input
                    v-model="form.mobile"
                    :placeholder="$t('e8e4e935.2628fc')"
                    :disabled="disabled"
                    style="width: 300px"
                  />
                </el-form-item>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('e8e4e935.11d8b6')" prop="settled_succ_sendsms">
              <el-radio-group v-model="form.settled_succ_sendsms" :disabled="disabled">
                <el-radio label="1"> {{ $t('e8e4e935.1176c5') }} </el-radio>
                <el-radio label="2"> {{ $t('e8e4e935.ec3a35') }} </el-radio>
              </el-radio-group>
              <label v-if="form.settled_succ_sendsms == 2" class="h5_link">
                <span>{{ h5url }}</span>
                <a v-clipboard:copy="h5url" v-clipboard:success="onCopy">
                  {{ $t('e8e4e935.879058') }}</a
                >
              </label>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <!-- 审核详情 -->
      <template v-if="audit_status && audit_status != '1'">
        <p>
          <span :class="['audit_status', audit_status == '2' ? 'success' : 'fail']" />{{
            (audit_status == '2' && $t('e8e4e935.23c1f3')) ||
            (audit_status == '3' && $t('e8e4e935.7173f8'))
          }}
        </p>
        <p>{{ $t('e8e4e935.4985b0') }}: {{ audit_memo || '-' }}</p>
      </template>

      <!-- 按钮 -->
      <template
        v-if="
          $route.query.type == 'edit' ||
          ($route.query.type == 'add' && $store.getters.login_type != 'merchant')
        "
      >
        <el-form-item label-width="0px" style="text-align: center; margin-top: 60px">
          <el-button type="primary" style="padding: 10px 50px" @click="submitFn('form')">
            {{ $t('e8e4e935.be5fbb') }}
          </el-button>
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
            >
              {{ $t('e8e4e935.23c1f3') }}
            </el-button>
            <el-button
              type="danger"
              style="padding: 10px 50px"
              :disabled="datapass_block != 0"
              @click="fnReject"
            >
              {{ $t('e8e4e935.325254') }}
            </el-button>
          </template>
          <template v-else>
            <el-button type="info" style="padding: 10px 50px">
              {{ $t('e8e4e935.618acb') }}
            </el-button>
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
    />
    <check-box
      ref="checkbox"
      :visible="checkBoxConfig.visible"
      :message="checkBoxConfig.message"
      :is_idea="checkBoxConfig.is_idea"
      @checkBoxVisibleHandle="checkBoxVisibleHandle"
      @checkBoxConfirmHandle="checkBoxConfirmHandle"
    />
    <InfoTipModal
      :visible.sync="infoTipVisible"
      :title="$t('e8e4e935.463e67')"
      width="33%"
      :username="tip.username"
      :password="tip.password"
      @getInfo="getInfo"
    />
  </SpPage>
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
import InfoTipModal from '../component/InfoTipModal.vue'
import checkBox from '@/view/base/setting/dealer/cpn/checkBox.vue'

export default {
  components: {
    imgPicker,
    checkBox,
    InfoTipModal
  },
  props: ['props_type'],
  data() {
    return {
      tip: {
        username: '',
        password: ''
      },
      infoTipVisible: false,
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
        bank_acct_type: '',
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
      }
    }
  },
  computed: {
    rules() {
      return {
        merchant_name: [requiredRules(this.$t('e8e4e935.0b66da'))],
        social_credit_code_id: [requiredRules(this.$t('e8e4e935.25c0bd')), MaxRules(18)],
        regions_id: [requiredRules(this.$t('e8e4e935.8c74f2'), 'change')],
        address: [requiredRules(this.$t('e8e4e935.61a0ec'))],
        legal_name: [requiredRules(this.$t('e8e4e935.2fe17a'))],
        legal_cert_id: [requiredRules(this.$t('e8e4e935.e8b4af')), MaxRules(18)],
        legal_mobile: [requiredRules(this.$t('e8e4e935.f50f83')), MaxRules(11)],
        bank_mobile: [MaxRules('11')],
        card_id_mask: [MaxRules('19')],
        merchant_type: [requiredRules(this.$t('e8e4e935.4709c8'), 'change')],
        merchant_type_id: [requiredRules(this.$t('e8e4e935.15151f'), 'change')],
        audit_goods: requiredRules(this.$t('e8e4e935.be5d9e'), 'change'),
        license_url: requiredRules(this.$t('e8e4e935.e0b8cc'), 'change'),
        legal_certid_front_url: requiredRules(this.$t('e8e4e935.4161c3'), 'change'),
        legal_cert_id_back_url: requiredRules(this.$t('e8e4e935.845be5'), 'change'),
        createAccount: requiredRules(this.$t('e8e4e935.c41aeb'), 'change'),
        mobile: requiredRules(this.$t('e8e4e935.8098e2')),
        settled_succ_sendsms: requiredRules(this.$t('e8e4e935.11d8b6'), 'change')
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
        message: this.$t('e8e4e935.20a495'),
        type: 'success'
      })
    },
    async init() {
      if (this.$store.getters.login_type == 'merchant') {
        const result = await getTheMerchantInfo()
        this.disabled = true
        this.resultHandler(result)
        console.log('Merchant')
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
    async getInfo() {
      const result = await addTheBusinessman(this.form, null)
      if (result.data.data.mobile && result.data.data.password) {
        this.tip = {
          username: result.data.data.mobile,
          password: result.data.data.password
        }
      }
    },
    submitFn(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { type, merchantId } = this.$route.query
          const result = await addTheBusinessman(this.form, type == 'edit' ? merchantId : null)
          if (result.data.data.status) {
            this.$message.success(this.$t('e8e4e935.3b1083'))
            this.isEditCheckBox = true
            this.$router.go(-1)
          }

          if (type === 'add' && result.data.data.mobile && result.data.data.password) {
            this.$message.success(this.$t('e8e4e935.3b1083'))
            this.infoTipVisible = true
            this.isEditCheckBox = true
            this.tip = {
              username: result.data.data.mobile,
              password: result.data.data.password
            }
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
      this.checkBoxConfig.message = this.checkBoxMessage(this.$t('e8e4e935.23c1f3'))
      this.currentCheckBoxStatus = true
    },
    fnReject() {
      this.checkBoxConfig.visible = true
      this.checkBoxConfig.message = this.checkBoxMessage(this.$t('e8e4e935.325254'))
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
        this.$message.success(this.$t('e8e4e935.6e6732'))
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
      return this.$t('e8e4e935.605550', {
        status,
        name: this.form.merchant_name
      })
    },
    async getAreaList() {
      const result = await getArea()
      this.AreaJson = result.data.data
    }
  },
  beforeRouteLeave(to, from, next) {
    const { type } = this.$route.query
    console.log(to, type)
    if (type == 'add' || (type == 'edit' && !this.isEditCheckBox)) {
      this.$confirm(this.$t('e8e4e935.3ba67c'), this.$t('e8e4e935.02d981'), {
        confirmButtonText: this.$t('e8e4e935.38cf16'),
        cancelButtonText: this.$t('e8e4e935.625fb2'),
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
