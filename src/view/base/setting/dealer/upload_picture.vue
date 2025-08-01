<template>
  <div class="zyk_upload_picture">
    <el-form
      v-if="processed == '未填'"
      ref="ruleForm"
      :model="form"
      class="demo-ruleForm"
      :rules="rules"
    >
      <!-- 企业信息 -->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span
            >企业信息（图片必须JPG/PNG/JPEG等类型的文件，大小在1M以内（文件名中不能使用字符/、、:、*、?、”、&lt;、
            &gt;）</span
          >
        </div>
        <div class="content">
          <div class="wrap">
            <el-form-item prop="social_credit_code_url">
              <image-upload type="01" @successHandle="successHandle" />
              <img
                v-if="form.social_credit_code_url"
                :src="form.social_credit_code_url"
                class="avatar"
              >
              <div class="row">
                <span>* 三证合一码</span>
                <el-tooltip
                  :style="{ 'margin-left': 10 + 'px' }"
                  content="企业商户必传，小微商户不传"
                  placement="right-end"
                  effect="light"
                >
                  <i class="el-icon-warning-outline" />
                </el-tooltip>
              </div>
            </el-form-item>
            <el-form-item prop="legal_certId_front_url">
              <image-upload type="02" @successHandle="successHandle" />
              <img
                v-if="form.legal_certId_front_url"
                :src="form.legal_certId_front_url"
                class="avatar"
              >
              <span>* 法人/小微负责人身份证正面</span>
            </el-form-item>
            <el-form-item prop="legal_cert_id_back_url">
              <image-upload type="03" @successHandle="successHandle" />
              <img
                v-if="form.legal_cert_id_back_url"
                :src="form.legal_cert_id_back_url"
                class="avatar"
              >
              <span>* 法人/小微负责人身份证反面</span>
            </el-form-item>

            <el-form-item prop="store_url">
              <image-upload type="04" @successHandle="successHandle" />
              <img v-if="form.store_url" :src="form.store_url" class="avatar">
              <div class="row">
                <span>门店</span>
                <el-tooltip
                  :style="{ 'margin-left': 10 + 'px' }"
                  content="若入驻的费率类型为线下时必传"
                  placement="right-end"
                  effect="light"
                >
                  <i class="el-icon-warning-outline" />
                </el-tooltip>
              </div>
            </el-form-item>

            <el-form-item prop="cert_front_image_url">
              <image-upload type="06" @successHandle="successHandle" />
              <img
                v-if="form.cert_front_image_url"
                :src="form.cert_front_image_url"
                class="avatar"
              >
              <div class="row">
                <span>股东身份证正面</span>
              </div>
            </el-form-item>

            <el-form-item prop="cert_back_image_url">
              <image-upload type="07" @successHandle="successHandle" />
              <img v-if="form.cert_back_image_url" :src="form.cert_back_image_url" class="avatar">
              <div class="row">
                <span>股东身份证反面</span>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-card>
      <!-- 结算卡图片信息 -->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span
            >结算卡图片信息（图片必须JPG/PNG/JPEG等类型的文件，大小在1M以内（文件名中不能使用字符/、、:、*、?、”、&lt;、
            &gt;）</span
          >
        </div>
        <div class="content">
          <div class="wrap">
            <el-form-item prop="account_opening_permit_url">
              <image-upload type="05" @successHandle="successHandle" />
              <img
                v-if="form.account_opening_permit_url"
                :src="form.account_opening_permit_url"
                class="avatar"
              >
              <div class="row" style="margin-top: 10px; line-height: 20px">
                <span>* 开户许可证/小微负责人<br>银行卡正面照</span>
              </div>
            </el-form-item>

            <el-form-item prop="settle_account_certificate_url">
              <image-upload type="08" @successHandle="successHandle" />
              <img
                v-if="form.settle_account_certificate_url"
                :src="form.settle_account_certificate_url"
                class="avatar"
              >
              <div class="row">
                <span>结算账号开户证明</span>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-card>
      <!-- 其他图片信息 -->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span
            >其他图片信息（图片必须JPG/PNG/JPEG等类型的文件，大小在1M以内（文件名中不能使用字符/、、:、*、?、”、&lt;、
            &gt;））</span
          >
        </div>
        <div class="content">
          <div class="wrap">
            <el-form-item prop="web_pic_url">
              <image-upload type="09" @successHandle="successHandle" />
              <img v-if="form.web_pic_url" :src="form.web_pic_url" class="avatar">
              <div class="row">
                <span>网站截图</span>
              </div>
            </el-form-item>

            <el-form-item prop="industry_qualify_doc_license_url">
              <image-upload type="10" @successHandle="successHandle" />
              <img
                v-if="form.industry_qualify_doc_license_url"
                :src="form.industry_qualify_doc_license_url"
                class="avatar"
              >
              <div class="row">
                <span>行业资质文件</span>
                <el-tooltip
                  :style="{ 'margin-left': 10 + 'px' }"
                  content="特殊行业需上传（如：游戏类、直播类、小说图书类）"
                  placement="right-end"
                  effect="light"
                >
                  <i class="el-icon-warning-outline" />
                </el-tooltip>
              </div>
            </el-form-item>

            <el-form-item prop="icp_registration_license_url">
              <image-upload type="11" @successHandle="successHandle" />
              <img
                v-if="form.icp_registration_license_url"
                :src="form.icp_registration_license_url"
                class="avatar"
              >
              <span>ICP备案许可证明/许可证编码</span>
            </el-form-item>

            <el-form-item prop="lease_contract_url">
              <image-upload type="12" @successHandle="successHandle" />
              <img v-if="form.lease_contract_url" :src="form.lease_contract_url" class="avatar">
              <div class="row">
                <span>租赁合同</span>
                <el-tooltip
                  :style="{ 'margin-left': 10 + 'px' }"
                  content="如经营场所照片无法体现经营内容时上传"
                  placement="right-end"
                  effect="light"
                >
                  <i class="el-icon-warning-outline" />
                </el-tooltip>
              </div>
            </el-form-item>

            <el-form-item prop="transaction_test_record_url">
              <image-upload type="13" @successHandle="successHandle" />
              <img
                v-if="form.transaction_test_record_url"
                :src="form.transaction_test_record_url"
                class="avatar"
              >
              <div class="row">
                <span>交易测试记录</span>
                <el-tooltip
                  :style="{ 'margin-left': 10 + 'px' }"
                  content="商户在业务网址或商城地址上测试的交易记录截图"
                  placement="right-end"
                  effect="light"
                >
                  <i class="el-icon-warning-outline" />
                </el-tooltip>
              </div>
            </el-form-item>

            <el-form-item prop="buss_support_materials_url">
              <image-upload type="14" @successHandle="successHandle" />
              <img
                v-if="form.buss_support_materials_url"
                :src="form.buss_support_materials_url"
                class="avatar"
              >
              <div class="row">
                <span>业务场景证明材料</span>
                <el-tooltip
                  :style="{ 'margin-left': 10 + 'px' }"
                  content="如经营场所照片无法体现经营内容时上传"
                  placement="right-end"
                  effect="light"
                >
                  <i class="el-icon-warning-outline" />
                </el-tooltip>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-card>
      <!-- 其他信息填写 -->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>其他信息</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="商城地址" prop="business_add" label-width="100px">
              <el-input v-model="form.business_add" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="股东身份证姓名" prop="cert_name" label-width="100px">
              <el-input v-model="form.cert_name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="股东身份证号" prop="cert_id" label-width="100px">
              <div class="flex">
                <el-input v-model="form.cert_id" placeholder="" />
                <el-tooltip content="身份证信息字母X需大写" placement="top-end" effect="light">
                  <i class="el-icon-warning-outline" />
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              label="行业资质文件类型"
              prop="industry_qualify_doc_type"
              label-width="140px"
            >
              <el-select v-model="form.industry_qualify_doc_type" placeholder="请选择活动区域">
                <el-option label="无" value="" />
                <el-option label="游戏类" value="1" />
                <el-option label="直播类" value="2" />
                <el-option label="小说图书类" value="3" />
                <el-option label="其他" value="4" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <el-form-item style="text-align: center; margin: 50px 0; margin-right: 130px">
        <el-button type="primary" @click="submitForm('ruleForm')"> 提交审核 </el-button>
        <!-- <loading-btn
          ref="loadingBtn"
          size="medium"
          type="primary"
          text="提交审核"
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
import imageUpload from '@/components/imageUpload'
import loadingBtn from '@/components/loading-btn'
import checkBox from './cpn/checkBox.vue'
export default {
  components: {
    ResultCpn,
    imageUpload,
    loadingBtn,
    checkBox
  },
  data() {
    return {
      isGetImage: false,
      imgDialog: false,
      pickerImgType: '',
      resultStatus: '',
      processed: '',
      checkBoxConfig: {
        visible: false,
        message: '请确认信息无误！',
        info: [{ type: 'checkbox', value: '审核结果将有短信提醒发送至注册手机号' }],
        is_sms: true
      },
      currentStatus: {
        resultStatus: '',
        time: '',
        info: '',
        title: ''
      },
      form: {
        social_credit_code_url: '', //三证合一码
        legal_certId_front_url: '', //法人/小微负责人身份证正面
        legal_cert_id_back_url: '', //法人/小微负责人身份证反面
        store_url: '', //门店
        cert_front_image_url: '', // 股东身份证正面
        cert_back_image_url: '', //股东身份证反面

        account_opening_permit_url: '', //开户许可证/小微负责人银行卡正面照
        settle_account_certificate_url: '', //结算账号开户证明

        web_pic_url: '', //网站截图
        industry_qualify_doc_license_url: '', //行业资质文件
        icp_registration_license_url: '', //ICP备案许可证明/许可证编码
        lease_contract_url: '', //租赁合同
        transaction_test_record_url: '', //交易测试记录
        buss_support_materials_url: '', //业务场景证明材料

        business_add: '', //商城地址
        cert_name: '', // 股东身份证姓名
        cert_id: '', // 股东身份证号
        industry_qualify_doc_type: '' //
      },
      apiData: {},
      rules: {
        social_credit_code_url: { required: true, message: '请选择', trigger: 'change' },
        legal_certId_front_url: { required: true, message: '请选择', trigger: 'change' },
        legal_cert_id_back_url: { required: true, message: '请选择', trigger: 'change' },
        account_opening_permit_url: { required: true, message: '请选择', trigger: 'change' }
      }
    }
  },
  mounted() {
    this.getStepHandle()
  },
  methods: {
    // 查询开户步骤
    async getStepHandle() {
      const { info } = await this.$api.adapay.getStep()
      const { SubmitLicense } = info
      if (SubmitLicense.length <= 0) {
        this.processed = '未填'
      } else {
        this.processed = '已填'
        if (SubmitLicense.audit_status == 'P') {
          this.currentStatus = {
            resultStatus: 'succeeded',
            time: SubmitLicense.update_time,
            info: '',
            title: '证照信息'
          }
        } else if (SubmitLicense.audit_status == 'R') {
          this.currentStatus = {
            resultStatus: 'failed',
            time: SubmitLicense.update_time,
            info: SubmitLicense.audit_desc,
            title: '证照信息'
          }
        }
      }
    },
    handleImgPicker(pickerImgType) {
      this.pickerImgType = pickerImgType
      this.imgDialog = true
      this.isGetImage = true
    },
    closeImgDialog() {
      this.imgDialog = false
      this.isGetImage = false
    },
    successHandle(data) {
      const { tem_url, file_url, file_type } = data
      switch (file_type) {
        case '01':
          this.form.social_credit_code_url = tem_url
          this.apiData.social_credit_code_url = file_url
          break
        case '02':
          this.form.legal_certId_front_url = tem_url
          this.apiData.legal_certId_front_url = file_url
          break
        case '03':
          this.form.legal_cert_id_back_url = tem_url
          this.apiData.legal_cert_id_back_url = file_url
          break
        case '04':
          this.form.store_url = tem_url
          this.apiData.store_url = file_url
          break
        case '05':
          this.form.account_opening_permit_url = tem_url
          this.apiData.account_opening_permit_url = file_url
          break
        case '06':
          this.form.cert_front_image_url = tem_url
          this.apiData.cert_front_image_url = file_url
          break
        case '07':
          this.form.cert_back_image_url = tem_url
          this.apiData.cert_back_image_url = file_url
          break
        case '08':
          this.form.settle_account_certificate_url = tem_url
          this.apiData.settle_account_certificate_url = file_url
          break
        case '09':
          this.form.web_pic_url = tem_url
          this.apiData.web_pic_url = file_url
          break
        case '10':
          this.form.industry_qualify_doc_license_url = tem_url
          this.apiData.industry_qualify_doc_license_url = file_url
          break
        case '11':
          this.form.icp_registration_license_url = tem_url
          this.apiData.icp_registration_license_url = file_url
          break
        case '12':
          this.form.lease_contract_url = tem_url
          this.apiData.lease_contract_url = file_url
          break
        case '13':
          this.form.transaction_test_record_url = tem_url
          this.apiData.transaction_test_record_url = file_url
          break
        case '14':
          this.form.buss_support_materials_url = tem_url
          this.apiData.buss_support_materials_url = file_url
          break
      }
      this.$message.success('上传成功')
    },
    submitForm() {
      this.$refs['ruleForm'].validate(async valid => {
        if (valid) {
          this.checkBoxVisibleHandle()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /* ----------------------------------checkBox start----------------------------------- */
    async checkBoxConfirmHandle(data) {
      try {
        const { status } = await this.$api.adapay.submitPhoto({
          ...this.apiData,
          business_add: this.form.business_add,
          cert_name: this.form.cert_name,
          cert_id: this.form.cert_id,
          industry_qualify_doc_type: this.form.industry_qualify_doc_type,
          ...data
        })

        if (status) {
          this.processed = '已填'
          this.currentStatus = {
            resultStatus: 'pending',
            time: '',
            info: '',
            title: '证照信息'
          }
        }
        this.checkBoxVisibleHandle()
      } catch (error) {
        this.checkBoxVisibleHandle()
        return
      }
    },
    checkBoxVisibleHandle() {
      this.checkBoxConfig.visible = !this.checkBoxConfig.visible
    },
    /* ----------------------------------checkBox  end ----------------------------------- */
    nextPage() {
      this.$router.push('/applications/adapay/adapay_merchant/pay_setting')
    },
    // 重新填写
    async processedHandle() {
      const { info } = await this.$api.adapay.getStep()
      const { SubmitLicense } = info

      this.form = { ...this.form, ...SubmitLicense }
      console.log(this.form)
      this.apiData = { ...this.form.file_dir }
      delete this.form.file_dir
      this.processed = '未填'
    }
  }
}
</script>

<style lang="scss" scoped>
.zyk_upload_picture {
  padding-bottom: 50px;
  .flex {
    width: 100%;
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
  .avatar {
    width: 130px;
    height: auto;
    position: absolute;
    top: 10px;
    left: 5px;
    pointer-events: none;
  }
}
</style>

<style lang="scss">
.zyk_upload_picture {
  .wrap {
    .el-form-item {
      float: left;
      margin-right: 30px;
      span {
        text-align: center;
        font-size: 12px;
      }
    }
    .row {
      text-align: center;
    }
  }

  .clearfix span {
    font-weight: 700;
  }
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
