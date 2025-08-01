<template>
  <div>
    <div class="zyk_page_register_Info_edit">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane name="corp" v-if="info.member_type == 'corp'" label="企业">
          <el-form
            :model="form"
            ref="ruleForm"
            label-width="130px"
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
                    <el-form-item label="企业名称" prop="name">
                      <el-input v-model="form.name" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="营业执照号" prop="social_credit_code">
                      <el-input disabled v-model="form.social_credit_code" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="商户有效日期" prop="social_credit_code_expires">
                      <el-date-picker
                        v-model="form.social_credit_code_expires"
                        type="date"
                        value-format="yyyyMMdd"
                        placeholder="选择日期"
                        style="width: 100%"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="企业电话" prop="telphone">
                      <el-input v-model="form.telphone" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="企业邮箱" prop="email">
                      <el-input v-model="form.email" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="邮编" prop="zip_code">
                      <el-input v-model="form.zip_code" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="所在省市" prop="area">
                      <el-cascader
                        style="width: 100%"
                        v-model="form.area"
                        :options="AllArea"
                        clearable
                        :props="{
                          value: 'value',
                          label: 'title',
                          children: 'cities'
                        }"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="企业地址" prop="address">
                      <el-input v-model="form.address" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item label="经营范围" prop="business_scope">
                      <el-input
                        maxlength="500"
                        show-word-limit
                        v-model="form.business_scope"
                        type="textarea"
                        placeholder="请输入内容"
                        rows="7"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-card>
            <!-- 法人信息 -->
            <el-card class="box-card" shadow="never">
              <div slot="header" class="clearfix">
                <span>法人信息</span>
              </div>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="法人姓名" prop="legal_person">
                    <el-input v-model="form.legal_person" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="法人身份证号码" prop="legal_cert_id">
                    <div class="flex">
                      <el-input v-model="form.legal_cert_id" />
                      <el-tooltip
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
                  <el-form-item label="法人手机号码" prop="legal_mp">
                    <el-input v-model="form.legal_mp" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="法人证件有效期" prop="legal_cert_id_expires">
                    <el-date-picker
                      v-model="form.legal_cert_id_expires"
                      type="date"
                      value-format="yyyyMMdd"
                      placeholder="选择日期"
                      style="width: 100%"
                    />
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
                  <el-form-item label="结算银行账户类型" prop="bank_acct_type">
                    <el-radio-group v-model="form.bank_acct_type">
                      <el-radio label="1">对公</el-radio>
                      <el-radio label="2">对私</el-radio>
                    </el-radio-group>
                    <el-tooltip
                      :style="{ 'margin-left': 30 + 'px' }"
                      content="提现到账银行卡账户类型"
                      placement="top-end"
                      effect="light"
                    >
                      <i class="el-icon-warning-outline" />
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="结算银行卡所属银行" prop="bank_name">
                    <div class="flex">
                      <el-autocomplete
                        style="width: 100%"
                        prefix-icon="el-icon-search"
                        class="inline-input"
                        v-model="form.bank_name"
                        :fetch-suggestions="querySearch"
                        placeholder="请输入选择内容"
                        @select="handleSelectBank"
                      />
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="结算银行卡开户名" prop="card_name">
                    <el-input disabled v-model="form.card_name" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="结算银行卡号" prop="card_no">
                    <el-input v-model="form.card_no" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
            <el-card class="box-card" shadow="never">
              <div slot="header" class="clearfix">
                <span>其他信息</span>
              </div>
              <div class="other_content">
                <el-form-item label="上传附件" prop="attach_file">
                  <el-upload
                    class="upload-demo"
                    drag
                    :show-file-list="false"
                    action=""
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    :http-request="handleUpload"
                    :multiple="false"
                  >
                    <i class="el-icon-upload" />
                    <div v-if="form.attach_file_name">{{ form.attach_file_name }}</div>
                    <div v-else class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  </el-upload>
                </el-form-item>
                <el-form-item>
                  <div class="opload_rules">
                    <p>内容须包括：</p>
                    <p>营业执照：三证合一证件照；</p>
                    <p>法人信息：法人身份证正面照、法人身份证反面照；</p>
                    <p>结算账户信息：开户银行许可证照</p>
                    <p>请确保上传的图片信息清晰、准确、一致性；</p>
                    <p>请压缩为Zip文件进行上传，整包最大限制为8M。</p>
                  </div>
                </el-form-item>
              </div>
            </el-card>

            <el-form-item style="text-align: center; margin: 50px 0; margin-right: 130px">
              <!-- <loading-btn
                ref="loadingBtn"
                size="medium"
                type="primary"
                text="提交审核"
                @clickHandle="submitForm('ruleForm', 'Y', 'loadingBtn')"
              /> -->
              <el-button type="primary" size="medium" @click="submitHandle('ruleForm', 'Y')">
                提交
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!-- 个人 -->
        <el-tab-pane name="person" v-if="info.member_type == 'person'" label="个人">
          <el-form
            ref="personForm"
            :model="personForm"
            label-width="130px"
            class="demo-ruleForm"
            :rules="personRules"
          >
            <!-- 基本信息-->
            <el-card class="box-card" shadow="never">
              <div slot="header" class="clearfix">
                <span>基本信息</span>
              </div>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="用户姓名" prop="user_name">
                    <el-input disabled v-model="personForm.user_name" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="用户手机号码" prop="tel_no">
                    <div class="flex">
                      <el-input disabled v-model="personForm.tel_no" />
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="用户身份证号码" prop="cert_id">
                    <el-input disabled v-model="personForm.cert_id" />
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="8">
                  <el-form-item label="身份证有效日期" prop="date1">
                      <el-date-picker type="date" placeholder="选择日期" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                </el-col> -->
              </el-row>
            </el-card>
            <!-- 结算账户信息 -->
            <el-card class="box-card" shadow="never">
              <div slot="header" class="clearfix">
                <span>结算账户信息</span>
              </div>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="开户人姓名" prop="bank_card_name">
                    <el-input disabled v-model="personForm.bank_card_name" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="银行预留手机号" prop="bank_tel_no">
                    <div class="flex">
                      <el-input v-model="personForm.bank_tel_no" />
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="银行账号" prop="bank_card_id">
                    <el-input v-model="personForm.bank_card_id" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="开户人证件号码" prop="bank_cert_id">
                    <el-input disabled v-model="personForm.bank_cert_id" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
            <el-form-item style="text-align: center; margin: 50px 0; margin-right: 130px">
              <!-- <el-button  type="primary" @click="submitFormPerson('personForm','Y')">审核提交</el-button> -->
              <!-- <loading-btn
                ref="loadingBtn"
                size="medium"
                type="primary"
                text="提交"
                @clickHandle="submitFormPerson('personForm', 'Y', 'loadingBtn')"
              /> -->
              <el-button type="primary" size="medium" @click="submitHandle('personForm', 'Y')">
                提交
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getBankList, createCorp, checkPerson, checkCorp } from '@/api/dealerReInfo'
import areaData from '@/common/area.json'
import ResultCpn from '@/view/base/setting/dealer/cpn/result.vue'
import { MaxRules, requiredRules } from '@/view/base/setting/dealer/tools'
import loadingBtn from '@/components/loading-btn'
export default {
  components: {
    loadingBtn
  },
  props: ['activeName', 'info'],
  data() {
    return {
      // 初始打开tab
      // 填写的类型
      member_type: '',
      allShow: true,
      // 全部地区
      AllArea: areaData,
      processed: '',
      currentStatus: {
        resultStatus: '',
        time: '',
        info: '',
        title: ''
      },
      // 全部银行
      AllBank: [],
      // 选中地区
      area: '',
      form: {
        name: '', //企业名称
        area: '', // 省份编码地区编码
        business_scope: '', //经营范围
        social_credit_code: '', // 统一社会信用码
        social_credit_code_expires: '', //统一社会信用证有效期(1121),
        telphone: '', //企业电话
        zip_code: '', //邮编
        email: '', // 企业邮箱
        legal_person: '', //法人姓名
        legal_cert_id: '', //法人身份证号码
        legal_cert_id_expires: '', // 法人身份证有效期(20220112)
        legal_mp: '', // 法人手机号
        address: '', //企业地址
        attach_file: '', //上传附件
        bank_code: '', // 银行代码
        bank_name: '',
        bank_acct_type: '1', //银行账户类型：1-对公；2-对私
        card_no: '', //银行卡号
        card_name: '', //银行卡对应的户名，若银行账户类型是对公，必须与企业名称一致,
        submit_review: '', //是否提交审核(Y/N)
        isUploadFile: true, // 加这个走formdata格式
        attach_file_name: '',
        confirm_letter_file: '',
        confirm_letter_file_name: ''
      },
      rules: {
        name: requiredRules('企业名称'),
        social_credit_code: [requiredRules('营业执照号'), MaxRules(18)],
        social_credit_code_expires: {
          required: true,
          message: '请选择商户有效期',
          trigger: 'blur'
        },
        area: { type: 'array', required: true, message: '请选择省市', trigger: 'change' },
        address: [requiredRules('企业地址'), MaxRules(60)],
        business_scope: requiredRules('经营范围'),
        legal_person: [requiredRules('法人姓名'), MaxRules(20)],
        legal_cert_id: [requiredRules('法人身份证号'), MaxRules(18)],
        legal_cert_id_expires: { required: true, message: '请选择法人证件有效期', trigger: 'blur' },
        legal_mp: [requiredRules('法人手机号'), MaxRules(11)],
        bank_acct_type: [requiredRules('结算银行账户类型', 'change')],
        bank_name: { required: true, message: '请输入并选择', trigger: 'blur' },
        card_name: [requiredRules('结算银行卡开户名'), MaxRules(20)],
        card_no: [requiredRules('结算银行卡卡号'), MaxRules(40)],
        attach_file: { required: true, message: '请上传', trigger: 'change' },
        confirm_letter_file: { required: true, message: '请上传', trigger: 'change' }
      },
      personForm: {
        user_name: '', //用户姓名
        tel_no: '', // 用户手机号码
        cert_id: '', // 用户身份证号码
        bank_card_name: '', //开户人姓名
        bank_tel_no: '', //银行预留手机号
        bank_card_id: '', //银行账号
        bank_cert_id: '' // 开户人证件号码
      },
      personRules: {
        user_name: [requiredRules('用户姓名'), MaxRules(20)],
        tel_no: [requiredRules('用户手机号码'), MaxRules(11)],
        cert_id: [requiredRules('用户身份证号码'), MaxRules(18)],
        bank_card_name: [requiredRules('开户人姓名'), MaxRules(20)],
        bank_tel_no: [requiredRules('银行预留手机号'), MaxRules(11)],
        bank_card_id: [requiredRules('银行账号'), MaxRules(40)],
        bank_cert_id: [requiredRules('开户人证件号码'), MaxRules(18)]
      },
      isShow_corp: false,
      isShow_person: false,
      type: '',
      id: ''
    }
  },
  mounted() {
    if (this.activeName == 'corp') {
      this.form = this.info
      this.form.area = [this.form.prov_code, this.form.area_code]
    } else {
      this.personForm = this.info
    }
  },
  methods: {
    submitHandle(formName, isSubmit) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (formName == 'ruleForm') {
            this.$confirm(
              '未避免影响提现，请确认结算卡持卡人姓名与法人一致，信息更改需审核，请确认是否提交。',
              '提示消息',
              {
                confirmButtonText: '确定',
                type: 'warning',
                showCancelButton: false
              }
            ).then(() => {
              this.submitForm(formName, isSubmit)
            })
          } else {
            this.$confirm('结算账户信息更改需提交审核，请确认是否提交', '提示消息', {
              confirmButtonText: '确定',
              type: 'warning',
              showCancelButton: false
            }).then(() => {
              this.submitFormPerson(formName, isSubmit)
            })
          }
        } else {
          this.$message.error('请完善您的信息')
        }
      })
    },
    async submitForm(formName, isSubmit) {
      this.form.submit_review = isSubmit
      this.form.isUploadFile = true
      console.log(this.form)

      const result = await this.$api.adapay.accountUpdate(this.form)
      if (result.data.data.status) {
        this.$message.success('提交成功')
        this.$emit('back')
      } else {
        this.$message.error('失败')
      }
    },
    async submitFormPerson(formName, isSubmit) {
      this.personForm.submit_review = isSubmit
      const result = await this.$api.adapay.accountUpdatePerson(this.personForm)
      if (result.data.data.status) {
        this.$message.success('提交成功')
        this.$emit('back')
      } else {
        this.$message.error('失败')
      }
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
        this.$message.error('文件类型应为Zip')
      }
      if (!isLt2M) {
        this.$message.error('上传文件不能超过 8MB!')
      }
      return isZip && isLt2M
    },
    goback() {
      this.$router.back(-1)
    },
    async processedHandle() {
      if (this.member_type == 'corp') {
        const result = await this.$api.adapay.accountQueryCorp()
        this.processed = '未填'
        this.form = result.data.data
        this.form.area = [this.form.prov_code, this.form.area_code]
        console.log(result)
      } else {
        const result = await this.$api.adapay.accountQueryCorp()
        this.processed = '未填'
        this.personForm = result.data.data
        this.activeName = 'person'
        console.log(result)
      }
    },

    // type 判断结果 （获取保存的结果）
    async getResult(id, type, member_type) {
      this.id = id

      if (id && member_type == 'corp') {
        this.activeName = member_type
        this.isShow_person = true
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

        console.log('corp---------', result)
      } else if (id && member_type == 'person') {
        this.isShow_corp = true
        this.activeName = member_type
        const result = await checkPerson(id)

        this.personForm = result.data.data
        console.log('person---------', result)
      } else {
        console.log('增加')
        this.isShow_person = true
        this.isShow_corp = true
        this.activeName = 'corp'
      }
    },
    // 结算所属银行
    async querySearch(queryString, cb) {
      const result = await this.$api.adapay.getBank({
        bank_name: this.form.bank_name
      })
      this.AllBank = result.data.data

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
