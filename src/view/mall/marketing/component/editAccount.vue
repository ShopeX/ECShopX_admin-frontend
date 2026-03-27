<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <div class="zyk_page_register_Info_edit">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane name="corp" v-if="info.member_type == 'corp'" :label="$t('d5ea25da.04c9e3')">
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
                <span>{{ $t('d5ea25da.54796d') }}</span>
              </div>

              <div class="content">
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item :label="$t('d5ea25da.f47e27')" prop="name">
                      <el-input v-model="form.name" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('d5ea25da.b9bf38')" prop="social_credit_code">
                      <el-input disabled v-model="form.social_credit_code" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('d5ea25da.1fcd91')" prop="social_credit_code_expires">
                      <el-date-picker
                        v-model="form.social_credit_code_expires"
                        type="date"
                        value-format="yyyyMMdd"
                        :placeholder="$t('d5ea25da.2bebdd')"
                        style="width: 100%"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('d5ea25da.3d9d21')" prop="telphone">
                      <el-input v-model="form.telphone" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('d5ea25da.d7c0a1')" prop="email">
                      <el-input v-model="form.email" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('d5ea25da.4d8e09')" prop="zip_code">
                      <el-input v-model="form.zip_code" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('d5ea25da.c63fa8')" prop="area">
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
                    <el-form-item :label="$t('d5ea25da.400147')" prop="address">
                      <el-input v-model="form.address" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item :label="$t('d5ea25da.04228b')" prop="business_scope">
                      <el-input
                        maxlength="500"
                        show-word-limit
                        v-model="form.business_scope"
                        type="textarea"
                        :placeholder="$t('d5ea25da.a11cc7')"
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
                <span>{{ $t('d5ea25da.77d3e2') }}</span>
              </div>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item :label="$t('d5ea25da.2fe17a')" prop="legal_person">
                    <el-input v-model="form.legal_person" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('d5ea25da.1415b3')" prop="legal_cert_id">
                    <div class="flex">
                      <el-input v-model="form.legal_cert_id" />
                      <el-tooltip
                        :content="$t('d5ea25da.43e031')"
                        placement="top-end"
                        effect="light"
                      >
                        <i class="el-icon-warning-outline" />
                      </el-tooltip>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('d5ea25da.187a35')" prop="legal_mp">
                    <el-input v-model="form.legal_mp" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('d5ea25da.a79a87')" prop="legal_cert_id_expires">
                    <el-date-picker
                      v-model="form.legal_cert_id_expires"
                      type="date"
                      value-format="yyyyMMdd"
                      :placeholder="$t('d5ea25da.2bebdd')"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
            <!-- 结算账户信息 -->
            <el-card class="box-card" shadow="never">
              <div slot="header" class="clearfix">
                <span>{{ $t('d5ea25da.99f89b') }}</span>
              </div>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item :label="$t('d5ea25da.32734c')" prop="bank_acct_type">
                    <el-radio-group v-model="form.bank_acct_type">
                      <el-radio label="1">{{ $t('d5ea25da.18ba13') }}</el-radio>
                      <el-radio label="2">{{ $t('d5ea25da.f0bf8a') }}</el-radio>
                    </el-radio-group>
                    <el-tooltip
                      :style="{ 'margin-left': 30 + 'px' }"
                      :content="$t('d5ea25da.8597fb')"
                      placement="top-end"
                      effect="light"
                    >
                      <i class="el-icon-warning-outline" />
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('d5ea25da.0a3e82')" prop="bank_name">
                    <div class="flex">
                      <el-autocomplete
                        style="width: 100%"
                        prefix-icon="el-icon-search"
                        class="inline-input"
                        v-model="form.bank_name"
                        :fetch-suggestions="querySearch"
                        :placeholder="$t('d5ea25da.473e86')"
                        @select="handleSelectBank"
                      />
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('d5ea25da.748b0c')" prop="card_name">
                    <el-input disabled v-model="form.card_name" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('d5ea25da.88174a')" prop="card_no">
                    <el-input v-model="form.card_no" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
            <el-card class="box-card" shadow="never">
              <div slot="header" class="clearfix">
                <span>{{ $t('d5ea25da.febe40') }}</span>
              </div>
              <div class="other_content">
                <el-form-item :label="$t('d5ea25da.0063c5')" prop="attach_file">
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
                    <div v-else class="el-upload__text">
                      {{ $t('d5ea25da.1ef03f') }}<em>{{ $t('d5ea25da.2c808b') }}</em>
                    </div>
                  </el-upload>
                </el-form-item>
                <el-form-item>
                  <div class="opload_rules">
                    <p>{{ $t('d5ea25da.8d7392') }}</p>
                    <p>{{ $t('d5ea25da.3d250f') }}</p>
                    <p>{{ $t('d5ea25da.ba1a9a') }}</p>
                    <p>{{ $t('d5ea25da.07314d') }}</p>
                    <p>{{ $t('d5ea25da.c18816') }}</p>
                    <p>{{ $t('d5ea25da.bb87b2') }}</p>
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
                {{ $t('d5ea25da.939d53') }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!-- 个人 -->
        <el-tab-pane
          name="person"
          v-if="info.member_type == 'person'"
          :label="$t('d5ea25da.6a0e04')"
        >
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
                <span>{{ $t('d5ea25da.9e5ffa') }}</span>
              </div>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item :label="$t('d5ea25da.d5b5b5')" prop="user_name">
                    <el-input disabled v-model="personForm.user_name" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('d5ea25da.dde968')" prop="tel_no">
                    <div class="flex">
                      <el-input disabled v-model="personForm.tel_no" />
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('d5ea25da.a692a6')" prop="cert_id">
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
                <span>{{ $t('d5ea25da.99f89b') }}</span>
              </div>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item :label="$t('d5ea25da.e3f6a6')" prop="bank_card_name">
                    <el-input disabled v-model="personForm.bank_card_name" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('d5ea25da.a0b7da')" prop="bank_tel_no">
                    <div class="flex">
                      <el-input v-model="personForm.bank_tel_no" />
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('d5ea25da.954218')" prop="bank_card_id">
                    <el-input v-model="personForm.bank_card_id" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('d5ea25da.c503f0')" prop="bank_cert_id">
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
                {{ $t('d5ea25da.939d53') }}
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
      personForm: {
        user_name: '', //用户姓名
        tel_no: '', // 用户手机号码
        cert_id: '', // 用户身份证号码
        bank_card_name: '', //开户人姓名
        bank_tel_no: '', //银行预留手机号
        bank_card_id: '', //银行账号
        bank_cert_id: '' // 开户人证件号码
      },
      isShow_corp: false,
      isShow_person: false,
      type: '',
      id: ''
    }
  },
  computed: {
    rules() {
      return {
        name: requiredRules(this.$t('d5ea25da.f47e27')),
        social_credit_code: [requiredRules(this.$t('d5ea25da.b9bf38')), MaxRules(18)],
        social_credit_code_expires: {
          required: true,
          message: this.$t('d5ea25da.947edc'),
          trigger: 'blur'
        },
        area: {
          type: 'array',
          required: true,
          message: this.$t('d5ea25da.b7ef53'),
          trigger: 'change'
        },
        address: [requiredRules(this.$t('d5ea25da.400147')), MaxRules(60)],
        business_scope: requiredRules(this.$t('d5ea25da.04228b')),
        legal_person: [requiredRules(this.$t('d5ea25da.2fe17a')), MaxRules(20)],
        legal_cert_id: [requiredRules(this.$t('d5ea25da.1415b3')), MaxRules(18)],
        legal_cert_id_expires: {
          required: true,
          message: this.$t('d5ea25da.c52f2a'),
          trigger: 'blur'
        },
        legal_mp: [requiredRules(this.$t('d5ea25da.187a35')), MaxRules(11)],
        bank_acct_type: [requiredRules(this.$t('d5ea25da.32734c'), 'change')],
        bank_name: { required: true, message: this.$t('d5ea25da.e184f6'), trigger: 'blur' },
        card_name: [requiredRules(this.$t('d5ea25da.748b0c')), MaxRules(20)],
        card_no: [requiredRules(this.$t('d5ea25da.b5140a')), MaxRules(40)],
        attach_file: { required: true, message: this.$t('d5ea25da.197c4f'), trigger: 'change' },
        confirm_letter_file: {
          required: true,
          message: this.$t('d5ea25da.197c4f'),
          trigger: 'change'
        }
      }
    },
    personRules() {
      return {
        user_name: [requiredRules(this.$t('d5ea25da.d5b5b5')), MaxRules(20)],
        tel_no: [requiredRules(this.$t('d5ea25da.dde968')), MaxRules(11)],
        cert_id: [requiredRules(this.$t('d5ea25da.a692a6')), MaxRules(18)],
        bank_card_name: [requiredRules(this.$t('d5ea25da.e3f6a6')), MaxRules(20)],
        bank_tel_no: [requiredRules(this.$t('d5ea25da.a0b7da')), MaxRules(11)],
        bank_card_id: [requiredRules(this.$t('d5ea25da.954218')), MaxRules(40)],
        bank_cert_id: [requiredRules(this.$t('d5ea25da.c503f0')), MaxRules(18)]
      }
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
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (formName == 'ruleForm') {
            this.$confirm(this.$t('d5ea25da.1b1123'), this.$t('d5ea25da.b38163'), {
              confirmButtonText: this.$t('d5ea25da.38cf16'),
              type: 'warning',
              showCancelButton: false
            }).then(() => {
              this.submitForm(formName, isSubmit)
            })
          } else {
            this.$confirm(this.$t('d5ea25da.1829a9'), this.$t('d5ea25da.b38163'), {
              confirmButtonText: this.$t('d5ea25da.38cf16'),
              type: 'warning',
              showCancelButton: false
            }).then(() => {
              this.submitFormPerson(formName, isSubmit)
            })
          }
        } else {
          this.$message.error(this.$t('d5ea25da.cc0a23'))
        }
      })
    },
    async submitForm(formName, isSubmit) {
      this.form.submit_review = isSubmit
      this.form.isUploadFile = true
      console.log(this.form)

      const result = await this.$api.adapay.accountUpdate(this.form)
      if (result.data.data.status) {
        this.$message.success(this.$t('d5ea25da.23b62e'))
        this.$emit('back')
      } else {
        this.$message.error(this.$t('d5ea25da.acd5cb'))
      }
    },
    async submitFormPerson(formName, isSubmit) {
      this.personForm.submit_review = isSubmit
      const result = await this.$api.adapay.accountUpdatePerson(this.personForm)
      if (result.data.data.status) {
        this.$message.success(this.$t('d5ea25da.23b62e'))
        this.$emit('back')
      } else {
        this.$message.error(this.$t('d5ea25da.acd5cb'))
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
        this.$message.error(this.$t('d5ea25da.644239'))
      }
      if (!isLt2M) {
        this.$message.error(this.$t('d5ea25da.c5f04b'))
      }
      return isZip && isLt2M
    },
    goback() {
      this.$router.back(-1)
    },
    async processedHandle() {
      if (this.member_type == 'corp') {
        const result = await this.$api.adapay.accountQueryCorp()
        this.processed = this.$t('d5ea25da.0e223e')
        this.form = result.data.data
        this.form.area = [this.form.prov_code, this.form.area_code]
        console.log(result)
      } else {
        const result = await this.$api.adapay.accountQueryCorp()
        this.processed = this.$t('d5ea25da.0e223e')
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
        console.log('Add')
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
