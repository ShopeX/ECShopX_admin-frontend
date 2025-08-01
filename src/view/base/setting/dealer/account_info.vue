<template>
  <div class="zyk_page_account_info">
    <el-form
      v-if="processed == '未填'"
      ref="ruleForm"
      :model="form"
      label-width="145px"
      class="demo-ruleForm"
      :rules="rules"
    >
      <!-- 企业信息 -->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>企业信息</span>
        </div>

        <div class="content">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="商户名称" prop="mer_name">
                <el-input v-model="form.mer_name" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商户名简称" prop="mer_short_name">
                <el-input v-model="form.mer_short_name" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="营业执照号" prop="license_code">
                <div class="flex">
                  <el-input v-model="form.license_code" />
                  <el-tooltip
                    :style="{ 'margin-left': 30 + 'px' }"
                    content="如三证合一传三证合一码"
                    placement="top-end"
                    effect="light"
                  >
                    <i class="el-icon-warning-outline" />
                  </el-tooltip>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商户有效日期" prop="mer_start_valid_date_type">
                <div style="width: 100%">
                  <el-tooltip
                    :style="{ 'margin-right': 5 + 'px' }"
                    content="长期有效：设置默认截止时间为2099年"
                    placement="top-end"
                    effect="light"
                  >
                    <i class="el-icon-warning-outline" />
                  </el-tooltip>
                  <el-radio-group
                    v-model="form.mer_start_valid_date_type"
                    @change="dateTypeHandle($event, 'mer')"
                  >
                    <el-radio label="长期"> 长期有效 </el-radio>
                    <el-radio label="短期"> 时间节点 </el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>
            </el-col>
            <el-col v-if="form.mer_start_valid_date_type == '短期'" :span="8">
              <el-form-item prop="mer_valid_date_full" label="商户有效日期">
                <el-date-picker
                  v-model="form.mer_valid_date_full"
                  style="width: 100%"
                  type="daterange"
                  value-format="yyyyMMdd"
                  placeholder="选择日期"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="shortDateHandle($event, 'mer')"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="form.mer_start_valid_date_type == '长期'" :span="8">
              <el-form-item prop="mer_valid_date_start" label="商户有效期开始日期">
                <el-date-picker
                  v-model="form.mer_valid_date_start"
                  style="width: 100%"
                  type="date"
                  placeholder="请选择有效开始日期"
                  value-format="yyyyMMdd"
                  @change="longDateStartHandle($event, 'mer')"
                />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item label="商户类型" prop="entry_mer_type">
                <el-radio-group v-model="form.entry_mer_type" style='width:100%'>
                  <el-radio label="1">企业</el-radio>
                  <el-radio label="2">小微</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col> -->
            <el-col :span="8">
              <el-form-item label="法人/负责人姓名" prop="legal_name">
                <el-input v-model="form.legal_name" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="法人/负责人身份证号" prop="legal_idno">
                <div class="flex">
                  <el-input v-model="form.legal_idno" />
                  <el-tooltip
                    :style="{ 'margin-left': 30 + 'px' }"
                    content="身份证信息字母X需大写"
                    placement="top-end"
                    effect="light"
                  >
                    <i class="el-icon-warning-outline" />
                  </el-tooltip>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="法人/负责人手机号码" prop="legal_mp">
                <el-input v-model="form.legal_mp" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="法人/负责人证件有效期" prop="legal_id_expires_type">
                <el-tooltip
                  :style="{ 'margin-right': 5 + 'px' }"
                  content="长期有效：设置默认截止时间为2099年"
                  placement="top-end"
                  effect="light"
                >
                  <i class="el-icon-warning-outline" />
                </el-tooltip>
                <el-radio-group
                  v-model="form.legal_id_expires_type"
                  @change="dateTypeHandle($event, 'legal')"
                >
                  <el-radio label="长期"> 长期有效 </el-radio>
                  <el-radio label="短期"> 时间节点 </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col v-if="form.legal_id_expires_type == '短期'" :span="8">
              <el-form-item prop="legal_id_expires_full" label="请选择法人/负责人证件有效期">
                <el-date-picker
                  v-model="form.legal_id_expires_full"
                  style="width: 100%"
                  type="daterange"
                  value-format="yyyyMMdd"
                  placeholder="选择日期"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="shortDateHandle($event, 'legal')"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="form.legal_id_expires_type == '长期'" :span="8">
              <el-form-item
                prop="legal_id_expires_start"
                label="请选择法人/负责人证件有效期开始日期"
              >
                <el-date-picker
                  v-model="form.legal_id_expires_start"
                  style="width: 100%"
                  type="date"
                  placeholder="请选择开始日期"
                  value-format="yyyyMMdd"
                  @change="longDateStartHandle($event, 'legal')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="注册手机号" prop="usr_phone">
                <div class="flex">
                  <el-input v-model="form.usr_phone" />
                  <el-tooltip
                    :style="{ 'margin-left': 30 + 'px' }"
                    content="用于登录汇付商户后台"
                    placement="top-end"
                    effect="light"
                  >
                    <i class="el-icon-warning-outline" />
                  </el-tooltip>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="注册地址" prop="reg_addr">
                <el-input v-model="form.reg_addr" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="经营地址" prop="cust_addr">
                <el-input v-model="form.cust_addr" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商户座机电话" prop="cust_tel">
                <div class="flex">
                  <el-input v-model="form.cust_tel" />
                  <el-tooltip
                    :style="{ 'margin-left': 30 + 'px' }"
                    content="地区代码(区号)-电话号码 比如：021-123456"
                    placement="top-end"
                    effect="light"
                  >
                    <i class="el-icon-warning-outline" />
                  </el-tooltip>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <!-- 联系人信息 -->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>联系人信息</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="联系人姓名" prop="cont_name">
              <el-input v-model="form.cont_name" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人手机号" prop="cont_phone">
              <div class="flex">
                <el-input v-model="form.cont_phone" />
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电子邮箱" prop="customer_email">
              <el-input v-model="form.customer_email" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <!-- 结算账户信息 -->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>结算账户信息</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="结算银行卡号" prop="card_id_mask">
              <el-input v-model="form.card_id_mask" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结算银行卡所属银行" prop="bank_code">
              <div class="flex">
                <el-autocomplete
                  v-model="form.bank_name"
                  style="width: 100%"
                  prefix-icon="el-icon-search"
                  class="inline-input"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入选择内容"
                  @select="handleSelectBank"
                />
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结算银行卡开户名" prop="card_name">
              <el-input v-model="form.card_name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结算银行账户类型" prop="bank_acct_type">
              <el-radio-group v-model="form.bank_acct_type">
                <el-radio label="1"> 对公 </el-radio>
                <el-radio label="2"> 对私 </el-radio>
              </el-radio-group>
              <el-tooltip
                :style="{ 'margin-left': 30 + 'px' }"
                content="小微只能是对私"
                placement="top-end"
                effect="light"
              >
                <i class="el-icon-warning-outline" />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结算银行卡开户省市" prop="area">
              <el-cascader
                v-model="form.area"
                style="width: 100%"
                :options="AllArea"
                clearable
                :props="{
                  value: 'value',
                  label: 'title',
                  children: 'cities'
                }"
                @change="areaChange"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <!-- 交易秘钥信息 -->
      <!-- <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>交易秘钥信息</span>
        </div>
        <div class="other_content">
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="商户RSA公钥" prop="bank_acct_type">
                <div class="flex">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 6}"
                    v-model="textarea1">
                  </el-input>
                  <el-tooltip :style="{'margin-left':30+'px'}" content="请确保您上传的RSA公钥的正确性，以免影响交易" placement="right-end" effect="light">
                    <i class="el-icon-warning-outline"></i>
                  </el-tooltip>
                </div>
              </el-form-item>
              </el-col>
            </el-row>
            <el-form-item>
              <el-button type='primary'>生成RSA秘钥</el-button>
              <p class="tips">您可以选择直接生成RSA密钥</p>
            </el-form-item>
        </div>
      </el-card> -->
      <el-form-item style="text-align: center; margin: 50px 0; margin-right: 280px">
        <el-button type="primary" @click="submitForm"> 提交审核 </el-button>
        <!-- <loading-btn
          ref="loadingBtn"
          size="medium"
          type="primary"
          text="审核提交"
          @clickHandle="submitForm('ruleForm', 'loadingBtn')"
        /> -->
      </el-form-item>
    </el-form>
    <Result-cpn
      v-if="processed == '已填'"
      :current-status="currentStatus"
      @nextPage="nextPage"
      @processedHandle="processedHandle"
    />

    <check-box
      :visible="checkBoxConfig.visible"
      :message="checkBoxConfig.message"
      :info="checkBoxConfig.info"
      :is_sms="checkBoxConfig.is_sms"
      @checkBoxConfirmHandle="checkBoxConfirmHandle"
      @checkBoxVisibleHandle="checkBoxVisibleHandle"
    />
  </div>
</template>

<script>
import ResultCpn from './cpn/result.vue'
import areaData from '@/common/area.json'
import loadingBtn from '@/components/loading-btn'
import checkBox from './cpn/checkBox.vue'

import { MaxRules, requiredRules } from './tools'
export default {
  components: {
    ResultCpn,
    loadingBtn,
    checkBox
  },
  data() {
    return {
      // 全部地区
      AllArea: areaData,
      // 全部银行
      AllBank: [],
      All_pro: [],
      processed: '',
      currentStatus: {
        resultStatus: '',
        time: '',
        info: '',
        title: ''
      },
      checkBoxConfig: {
        visible: false,
        message: '请确认信息无误！',
        info: [{ type: 'checkbox', value: '审核结果将有短信提醒发送至注册手机号' }],
        is_sms: true
      },
      props_city: {
        lazy: true,
        label: 'area_name',
        value: 'area_code',
        lazyLoad: async (node, resolve) => {
          const { level } = node
          console.log(level)
          if (level == 1) {
            const { id } = node.data
            const res = await this.getProHandle(id)
            const nodes = res
            nodes.forEach(item => {
              item.leaf = level >= 1
            })
            console.log(nodes)
            resolve(nodes)
          }
        }
      },
      // form: {
      //   'mer_name': '张三',
      //   'mer_short_name': '张三',
      //   'license_code': '2121212121',
      //   'mer_start_valid_date_type': '短期',
      //   'mer_valid_date_full': ['20211130', '20220112'],
      //   'mer_valid_date_start': '',
      //   'mer_start_valid_date': '20211130',
      //   'mer_valid_date': '20220112',
      //   'entry_mer_type': '1',
      //   'legal_name': '张三',
      //   'legal_idno': '140481199602072376',
      //   'legal_mp': '19921909090',
      //   'legal_id_expires_type': '长期',
      //   'legal_id_expires_full': '',
      //   'legal_id_expires_start': '20211215',
      //   'legal_start_cert_id_expires': '20211215',
      //   'legal_id_expires': '20991231',
      //   'usr_phone': '19921909090',
      //   'reg_addr': '12321321',
      //   'cust_addr': '21212121',
      //   'cust_tel': '12321321',
      //   'cont_name': '张三',
      //   'cont_phone': '19921909090',
      //   'customer_email': '19921909090@21.com',
      //   'card_id_mask': '32178378217831287',
      //   'bank_code': '建设银行',
      //   'bank_name': '01050000',
      //   'card_name': '张三',
      //   'bank_acct_type': '2',
      //   'area': ['0013', '1302'],
      //   'prov_code': '0013',
      //   'area_code': '1302'
      // },
      // 选中地区
      form: {
        // 企业信息
        mer_name: '', // 商户名称
        mer_short_name: '', // 商户名简称
        license_code: '', //营业执照号
        mer_start_valid_date_type: '', //商户有效日期type
        mer_valid_date_full: '', //商户有效日期(完整、自有)
        mer_valid_date_start: '', //商户有效日期 （开始）(因为选了长期、自有)

        mer_start_valid_date: '', //商户有效日期 （开始）
        mer_valid_date: '', //商户有效日期 （结束）

        entry_mer_type: '1', // 商户类型
        legal_name: '', // 法人负责人姓名
        legal_idno: '', // 法人负责人身份证
        legal_mp: '', //法人负责人身份证手机

        legal_id_expires_type: '', // 法人/负责人身份证有效期type
        legal_id_expires_full: '', //  法人/负责人身份证有效期 (完整、自有)
        legal_id_expires_start: '', // 开始）(因为选了长期、自有)
        legal_start_cert_id_expires: '', //法人/负责人身份证有效期（始）格式 YYYYMMDD
        legal_id_expires: '', // 法人/负责人身份证有效期（至）格式 YYYYMMDD

        usr_phone: '', //注册手机号
        reg_addr: '', //注册地址
        cust_addr: '', //经营地址
        cust_tel: '', //商户电话（座机）
        // 联系人信息
        cont_name: '', // 联系人姓名
        cont_phone: '', // 联系人手机号
        customer_email: '', // 电子邮箱
        // 结算账户信息
        card_id_mask: '', //结算银行卡号
        bank_code: '', //结算银行卡所属银行
        bank_name: '',
        card_name: '', //结算银行卡开户姓名
        bank_acct_type: '', //结算银行账户类型
        area: '',
        prov_code: '', //结算银行卡省份编码
        area_code: '' // 结算银行卡地区
        //  isUploadFile: true
      },
      rules: {
        mer_name: requiredRules('商户名称'),
        mer_short_name: requiredRules('商户名简称'),
        license_code: [requiredRules('营业执照号'), MaxRules(18)],
        mer_start_valid_date_type: requiredRules('商户有效日期类型', 'change'),
        mer_valid_date_full: requiredRules('商户有效日期', 'change'),
        mer_valid_date_start: requiredRules('商户有效期开始日期', 'change'),
        // entry_mer_type:requiredRules('商户类型','change'),
        legal_name: [requiredRules('法人负责人姓名'), MaxRules(20)],
        legal_idno: [requiredRules('法人负责人身份证号'), MaxRules(18)],
        legal_mp: [requiredRules('法人/负责人手机号码'), MaxRules(11)],
        legal_id_expires_type: requiredRules('法人/负责人身份证有效期类型', 'change'),
        legal_id_expires_full: requiredRules('法人/负责人身份证有效期', 'change'),
        legal_id_expires_start: requiredRules('法人/负责人身份证有效期开始日期', 'change'),

        usr_phone: [requiredRules('注册手机号'), MaxRules(11)],
        reg_addr: [requiredRules('注册地址'), MaxRules(60)],
        cust_addr: [requiredRules('经营地址'), MaxRules(60)],
        cust_tel: [requiredRules('商户电话（座机）'), MaxRules(20)],
        cont_name: [requiredRules('联系人姓名'), MaxRules(20)],
        cont_phone: [requiredRules('联系人手机号'), MaxRules(11)],
        customer_email: [requiredRules('电子邮箱'), MaxRules(40)],
        card_id_mask: [requiredRules('结算银行卡号'), MaxRules(40)],
        bank_code: [requiredRules('结算银行卡所属银行', 'change')],
        card_name: [requiredRules('结算银行卡开户姓名'), MaxRules(20)],
        bank_acct_type: [requiredRules('结算银行账户类型', 'change')],
        area: [requiredRules('结算银行卡开户省市', 'change')]
      },
      // personForm:{
      //   user_name:'王五', //用户姓名
      //   tel_no:'10923459080', // 用户手机号码
      //   cert_id:'123456789987654321', // 用户身份证号码
      //   bank_card_name:'王五',//开户人姓名
      //   bank_tel_no:'10923459080', //银行预留手机号
      //   bank_card_id:'21321321321321', //银行账号
      //   bank_cert_id:'123456789987654321', // 开户人证件号码
      //   submit_review:''//是否提交审核(Y/N)
      // },
      personForm: {
        user_name: '', //用户姓名
        tel_no: '', // 用户手机号码
        cert_id: '', // 用户身份证号码
        bank_card_name: '', //开户人姓名
        bank_tel_no: '', //银行预留手机号
        bank_card_id: '', //银行账号
        bank_cert_id: '', // 开户人证件号码
        submit_review: '' //是否提交审核(Y/N)
      },
      personRules: {
        user_name: { required: true, message: '请输入', trigger: 'blur' },
        tel_no: { required: true, message: '请输入', trigger: 'blur' },
        cert_id: { required: true, message: '请输入', trigger: 'blur' },
        bank_card_name: { required: true, message: '请输入', trigger: 'blur' },
        bank_tel_no: { required: true, message: '请输入', trigger: 'blur' },
        bank_card_id: { required: true, message: '请输入', trigger: 'blur' },
        bank_cert_id: { required: true, message: '请输入', trigger: 'blur' }
      }
    }
  },
  created() {},
  mounted() {
    this.getStepHandle()
    this.getProHandle()

    // this.processedHandle();
    // this.get_city_Handle();
  },
  methods: {
    // 查询开户步骤
    async getStepHandle() {
      const { info } = await this.$api.adapay.getStep()
      const { MerchantEntry } = info
      if (MerchantEntry.length <= 0) {
        this.processed = '未填'
      } else {
        this.processed = '已填'
        this.currentStatus = {
          title: '开户',
          resultStatus: MerchantEntry.status,
          time: MerchantEntry.update_time,
          info: MerchantEntry.error_msg
        }
      }
    },

    // 获取省
    async getProHandle(id) {
      const result = await this.$api.adapay.getPro({ pid: id })
      if (!id) {
        this.All_pro = result
      } else {
        return result
      }
    },

    // 结算所属银行
    async querySearch(queryString, cb) {
      this.AllBank = await this.$api.adapay.getBank({
        bank_name: this.form.bank_name
      })
      var restaurants = this.AllBank.map(item => {
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
      return restaurant => {
        return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    handleSelectBank(val) {
      console.log(val)
      this.form.bank_code = val.bank_code
      this.form.bank_name = val.value
    },
    areaChange(value) {
      console.log(value)
      this.form.area = value
      this.form.prov_code = value[0]
      this.form.area_code = value[1]
    },

    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          if (this.form.bank_acct_type == '2') {
            const res = this.form.legal_name == this.form.card_name
            if (!res) {
              this.$message.error('法人/负责人姓名与结算银行卡开户名要相同')
              return
            }
          }
          this.checkBoxVisibleHandle()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重新填写
    async processedHandle() {
      const { info } = await this.$api.adapay.getStep()
      const { MerchantEntry } = info
      this.form = { ...this.form, ...MerchantEntry }
      const {
        legal_id_expires,
        legal_start_cert_id_expires,
        mer_valid_date,
        mer_start_valid_date,
        area_code,
        prov_code,
        is_sms
      } = this.form
      // 法人证件照有效期
      if (legal_id_expires == '20991231') {
        this.form.legal_id_expires_type = '长期'
        this.form.legal_id_expires_start = legal_start_cert_id_expires
      } else {
        this.form.legal_id_expires_type = '短期'
        this.form.legal_id_expires_full = [legal_start_cert_id_expires, legal_id_expires]
      }
      // 商户有效时间
      if (mer_valid_date == '20991231') {
        this.form.mer_start_valid_date_type = '长期'
        this.form.mer_valid_date_start = mer_start_valid_date
      } else {
        this.form.mer_start_valid_date_type = '短期'
        this.form.mer_valid_date_full = [mer_start_valid_date, mer_valid_date]
      }

      this.form.area = [prov_code, area_code]
      this.checkBoxConfig.is_sms = is_sms

      console.log(this.form)
      this.processed = '未填'
    },
    nextPage() {
      this.$router.push('/applications/adapay/adapay_merchant/pay_setting')
    },
    // 有效日期类型
    dateTypeHandle(value, type) {
      console.log(value, type)
      if (type == 'mer') {
        this.form.mer_valid_date_start = ''
        this.form.mer_start_valid_date = ''
        this.form.mer_valid_date = ''
      } else if (type == 'legal') {
        this.form.legal_id_expires_start = ''
        this.form.legal_start_cert_id_expires = ''
        this.form.legal_id_expires = ''
      }
    },
    /* 商户有效短期日期 */
    shortDateHandle(value, type) {
      console.log(value, type)
      if (type == 'mer') {
        this.form.mer_start_valid_date = value[0]
        this.form.mer_valid_date = value[1]
        this.form.mer_valid_date_full = value
      } else if (type == 'legal') {
        this.form.legal_start_cert_id_expires = value[0]
        this.form.legal_id_expires = value[1]
        this.form.legal_id_expires_full = value
      }
    },
    /* 商户有效长期日期 */
    longDateStartHandle(value, type) {
      if (type == 'mer') {
        this.form.mer_start_valid_date = value
        this.form.mer_valid_date = '20991231'
      } else if (type == 'legal') {
        this.form.legal_start_cert_id_expires = value
        this.form.legal_id_expires = '20991231'
      }
    },
    /* 上传文件验证 */
    validatUpload(file) {
      const MAX_IMG_SIZE = 8
      let isLt2M = file.raw.size / 1024 / 1024 <= MAX_IMG_SIZE
      if (!isLt2M) {
        return `上传图片大小不能超过 ${MAX_IMG_SIZE}MB!`
      }
      return true
    },
    /* ----------------------------------checkBox start----------------------------------- */
    async checkBoxConfirmHandle(data) {
      try {
        const { status } = await this.$api.adapay.accountCreate({ ...this.form, ...data })
        if (status) {
          this.processed = '已填'
          this.currentStatus = {
            resultStatus: 'pending',
            title: '开户',
            time: '',
            info: ''
          }
        }
        console.log(this.$refs)
        this.checkBoxVisibleHandle()
      } catch (error) {
        this.checkBoxVisibleHandle()
      }
    },
    checkBoxVisibleHandle() {
      this.checkBoxConfig.visible = !this.checkBoxConfig.visible
    }
    /* ----------------------------------checkBox  end ----------------------------------- */
  }
}
</script>

<style lang="scss" scoped>
.zyk_page_account_info {
  .flex {
    display: flex;
    align-items: center;
    i {
      margin-left: 10px;
      font-size: 18px;
    }
  }
  .tips {
    font-size: 12px;
    color: #888;
  }
}
</style>

<style lang="scss">
.zyk_page_account_info {
  .clearfix span {
    font-weight: 700;
  }
  label {
    font-size: 12px;
    color: #000;
  }
  .el-row {
    margin-bottom: 0px;
  }
}
</style>
