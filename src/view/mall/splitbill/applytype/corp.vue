<template>
  <div>
    <el-alert
      v-if="form.status == 4"
      title="审核失败"
      type="error"
      show-icon
      center
      :description="form.resp_desc"
      :closable="false"
    />
    <el-divider v-if="form.status == 4" />
    <div class="formClass">
      <el-form
        ref="form"
        :model="form"
        label-width="150px"
        :rules="rules"
      >
        <el-form-item label="账号认证类型">
          <el-button
            type="success"
            round
            size="mini"
          >
            企业
          </el-button>
        </el-form-item>
        <el-form-item
          label="企业名称"
          prop="corp_name"
        >
          <el-input
            v-model="form.corp_name"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item
          label="证照类型"
          prop="corp_license_type"
        >
          <el-radio-group
            v-model="form.corp_license_type"
            :disabled="disabled"
          >
            <el-radio label="2">
              三证合一
            </el-radio>
            <el-radio label="1">
              普通证照
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row v-show="form.corp_license_type == 1">
          <el-form-item
            label="营业执照注册号"
            prop="business_code"
            :rules="
              form.corp_license_type == 1
                ? [{ required: true, message: '请填写营业执照注册号', trigger: 'blur' }]
                : []
            "
          >
            <el-input
              v-model="form.business_code"
              :disabled="disabled"
            />
          </el-form-item>
          <el-form-item
            label="营业执照注册"
            prop="business_code_img"
            :rules="
              form.corp_license_type == 1
                ? [{ required: true, message: '请上传营业执照注册', trigger: 'change' }]
                : []
            "
          >
            <el-upload
              class="avatar-uploader"
              :disabled="disabled"
              action="#"
              :auto-upload="true"
              :show-file-list="false"
              :http-request="
                (ctx) => {
                  handleChange(ctx, 'business_code_img')
                }
              "
            >
              <img
                v-if="fileList.business_code_img"
                :src="fileList.business_code_img"
                class="avatar"
              >
              <i
                v-else
                class="el-icon-plus avatar-uploader-icon"
              />
            </el-upload>
          </el-form-item>
          <el-form-item
            label="组织机构代码"
            prop="institution_code"
            :rules="
              form.corp_license_type == 1
                ? [{ required: true, message: '请填写组织机构代码', trigger: 'blur' }]
                : []
            "
          >
            <el-input
              v-model="form.institution_code"
              :disabled="disabled"
            />
          </el-form-item>
          <el-form-item
            label="组织机构代码"
            prop="institution_code_img"
            :rules="
              form.corp_license_type == 1
                ? [{ required: true, message: '请上传组织机构代码', trigger: 'change' }]
                : []
            "
          >
            <el-upload
              class="avatar-uploader"
              :disabled="disabled"
              action="#"
              :auto-upload="true"
              :show-file-list="false"
              :http-request="
                (ctx) => {
                  handleChange(ctx, 'institution_code_img')
                }
              "
            >
              <img
                v-if="fileList.institution_code_img"
                :src="fileList.institution_code_img"
                class="avatar"
              >
              <i
                v-else
                class="el-icon-plus avatar-uploader-icon"
              />
            </el-upload>
          </el-form-item>
          <el-form-item
            label="税务登记证号"
            prop="tax_code"
            :rules="
              form.corp_license_type == 1
                ? [{ required: true, message: '请填写税务登记证号', trigger: 'blur' }]
                : []
            "
          >
            <el-input
              v-model="form.tax_code"
              :disabled="disabled"
            />
          </el-form-item>
          <el-form-item
            label="税务登记证号"
            prop="tax_code_img"
            :rules="
              form.corp_license_type == 1
                ? [{ required: true, message: '请上传税务登记证号', trigger: 'change' }]
                : []
            "
          >
            <el-upload
              class="avatar-uploader"
              :disabled="disabled"
              action="#"
              :auto-upload="true"
              :show-file-list="false"
              :http-request="
                (ctx) => {
                  handleChange(ctx, 'tax_code_img')
                }
              "
            >
              <img
                v-if="fileList.tax_code_img"
                :src="fileList.tax_code_img"
                class="avatar"
              >
              <i
                v-else
                class="el-icon-plus avatar-uploader-icon"
              />
            </el-upload>
          </el-form-item>
        </el-row>
        <el-row v-show="form.corp_license_type != 1">
          <el-form-item
            label="统一社会信用代码"
            prop="social_credit_code"
            :rules="
              form.corp_license_type != 1
                ? [{ required: true, message: '请填写统一社会信用代码', trigger: 'blur' }]
                : []
            "
          >
            <el-input
              v-model="form.social_credit_code"
              :disabled="disabled"
            />
          </el-form-item>
          <el-form-item
            label="统一社会信用代码"
            prop="social_credit_code_img"
            :rules="
              form.corp_license_type != 1
                ? [{ required: true, message: '请上传统一社会信用代码', trigger: 'change' }]
                : []
            "
          >
            <el-upload
              class="avatar-uploader"
              action="#"
              :disabled="disabled"
              :auto-upload="true"
              :show-file-list="false"
              :http-request="
                (ctx) => {
                  handleChange(ctx, 'social_credit_code_img')
                }
              "
            >
              <img
                v-if="fileList.social_credit_code_img"
                :src="fileList.social_credit_code_img"
                class="avatar"
              >
              <i
                v-else
                class="el-icon-plus avatar-uploader-icon"
              />
            </el-upload>
          </el-form-item>
        </el-row>
        <el-form-item
          label="营业执照起始日期"
          prop="license_start_date"
        >
          <el-date-picker
            v-model="form.license_start_date"
            type="date"
            value-format="yyyyMMdd"
            placeholder="选择日期"
            style="width: 100%"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item
          label="营业执照到期日期"
          prop="license_end_date"
        >
          <el-date-picker
            v-model="form.license_end_date"
            type="date"
            value-format="yyyyMMdd"
            placeholder="选择日期"
            style="width: 100%"
            :disabled="disabled"
            @change="$forceUpdate()"
          />
        </el-form-item>
        <el-form-item
          label="股东名称"
          prop="controlling_shareholder_cust_name"
        >
          <el-input
            v-model="form.controlling_shareholder_cust_name"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item
          label="股东证件类型"
          prop="controlling_shareholder_id_card_type"
        >
          <el-select
            v-model="form.controlling_shareholder_id_card_type"
            placeholder="选择股东证件类型"
            :disabled="disabled"
            @visible-change="(bool) => (isEdit = bool)"
          >
            <el-option
              v-for="item in cardType"
              :key="item.card_type"
              :label="item.label"
              :value="item.card_type"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="股东证件号码"
          prop="controlling_shareholder_id_card"
        >
          <el-input
            v-model="form.controlling_shareholder_id_card"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item
          label="法人代表姓名"
          prop="legal_name"
        >
          <el-input
            v-model="form.legal_name"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item
          label="法人代表证件类型"
          prop="legal_id_card_type"
        >
          <el-select
            v-model="form.legal_id_card_type"
            placeholder="选择法人代表证件类"
            :disabled="disabled"
            @visible-change="(bool) => (isEdit = bool)"
          >
            <el-option
              v-for="item in cardType"
              :key="item.card_type"
              :label="item.label"
              :value="item.card_type"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="法人代表证件号码"
          prop="legal_id_card"
        >
          <el-input
            v-model="form.legal_id_card"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item
          label="法人证件起始日期"
          prop="legal_cert_start_date"
        >
          <el-date-picker
            v-model="form.legal_cert_start_date"
            type="date"
            value-format="yyyyMMdd"
            placeholder="选择日期"
            style="width: 100%"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item
          label="法人证件结束日期"
          prop="legal_cert_end_date"
        >
          <el-date-picker
            v-model="form.legal_cert_end_date"
            type="date"
            value-format="yyyyMMdd"
            :disabled="disabled"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item
          label="法人代表手机号码"
          prop="legal_mobile"
        >
          <el-input
            v-model="form.legal_mobile"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item
          label="法人证件正面"
          prop="legal_card_imgz"
        >
          <el-upload
            class="avatar-uploader"
            action="#"
            :disabled="disabled"
            :auto-upload="true"
            :show-file-list="false"
            :http-request="
              (ctx) => {
                handleChange(ctx, 'legal_card_imgz')
              }
            "
          >
            <img
              v-if="fileList.legal_card_imgz"
              :src="fileList.legal_card_imgz"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            />
          </el-upload>
        </el-form-item>
        <el-form-item
          label="法人证件反面"
          prop="legal_card_imgf"
        >
          <el-upload
            class="avatar-uploader"
            action="#"
            :auto-upload="true"
            :disabled="disabled"
            :show-file-list="false"
            :http-request="
              (ctx) => {
                handleChange(ctx, 'legal_card_imgf')
              }
            "
          >
            <img
              v-if="fileList.legal_card_imgf"
              :src="fileList.legal_card_imgf"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            />
          </el-upload>
        </el-form-item>
        <el-form-item
          label="企业联系人姓名"
          prop="contact_name"
        >
          <el-input
            v-model="form.contact_name"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item
          label="企业联系人手机"
          prop="contact_mobile"
        >
          <el-input
            v-model="form.contact_mobile"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item
          label="企业联系人邮箱"
          prop="contact_email"
        >
          <el-input
            v-model="form.contact_email"
            :disabled="disabled"
          />
        </el-form-item>

        <el-form-item
          label="开户银行"
          prop="bank_id"
        >
          <el-select
            v-model="form.bank_id"
            placeholder="请选择开户银行"
            :disabled="disabled"
            style="width: 100%"
            filterable
          >
            <el-option
              v-for="i in bankData"
              :key="i.bank_code"
              :label="i.bank_name"
              :value="i.bank_code"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="开户银行支行名称"
          prop="bank_branch"
        >
          <el-input
            v-model="form.bank_branch"
            :disabled="disabled"
          />
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="开户行省市信息"
              prop="area"
            >
              <el-cascader
                v-model="form.area"
                :disabled="disabled"
                style="width: 100%"
                :options="areaData"
                clearable
                :props="{
                  value: 'prov_code',
                  label: 'prov_name',
                  children: 'child'
                }"
                @change="areaChange"
              />
            </el-form-item>
            <!-- <el-form-item label="开户行省市信息" prop="bank_prov">
              <el-select
                v-model="form.bank_prov"
                placeholder="请选择"
                :disabled="disabled"
                style="width:100%"
                @visible-change="(bool) => (isEdit = bool)"
              >
                <el-option
                  v-for="i in areaData"
                  :label="i.prov_name"
                  :value="i.prov_code"
                  :key="i.prov_code"
                ></el-option>
              </el-select>
            </el-form-item> -->
          </el-col>
          <!-- <el-col :span="9">
            <el-form-item label prop="bank_area" label-width="10px">
              <el-select
                :disabled="disabled"
                v-model="form.bank_area"
                placeholder="请选择"
                style="width:100%"
              >
                <el-option
                  v-for="i in cityData"
                  :label="i.area_name"
                  :value="i.area_code"
                  :key="i.area_code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
        </el-row>

        <el-form-item
          label="开户银行账号名称"
          prop="bank_acct_name"
        >
          <el-input
            v-model="form.bank_acct_name"
            :disabled="disabled"
          />
        </el-form-item>

        <el-form-item
          label="开户银行账号"
          prop="bank_acct_num"
        >
          <el-input
            v-model="form.bank_acct_num"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item
          label="开户银行许可证"
          prop="bank_acct_img"
        >
          <el-upload
            class="avatar-uploader"
            action="#"
            :auto-upload="true"
            :disabled="disabled"
            :show-file-list="false"
            :http-request="
              (ctx) => {
                handleChange(ctx, 'bank_acct_img')
              }
            "
          >
            <img
              v-if="fileList.bank_acct_img"
              :src="fileList.bank_acct_img"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            />
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="!disabled"
            type="primary"
            @click="onSubmit"
          >
            保存
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { upLoadHffile, saveHffile, getHffile } from '@/api/fenzhang'
import areaData from '@/common/hfpayAreaData2.json'
import bankData from '@/common/hfpayBankData.json'
import UploadUtil from '@/utils/uploadUtil'
import { vaildateIdCard, isMobile, validEmail } from '@/utils/validate'
export default {
  data () {
    let vaildIdCard = (rule, value, callback) => {
      if (!vaildateIdCard(value)) {
        callback(new Error('请填写正确的身份证号码'))
      } else {
        callback()
      }
    }
    let vaildEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('请填写正确的邮箱地址'))
      } else {
        callback()
      }
    }
    let vaildMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error('请填写正确的手机号码'))
      } else {
        callback()
      }
    }
    return {
      areaData,
      bankData,
      cityData: [],
      disabled: false,
      isEdit: false,
      cardType: [
        {
          'card_type': '10',
          'label': '身份证'
        },
        {
          'card_type': '11',
          'label': '护照'
        },
        {
          'card_type': '14',
          'label': '回乡证'
        },
        {
          'card_type': '17',
          'label': '台胞证'
        }
      ],
      form: {
        area: '',
        apply_type: '1',
        corp_name: '',
        corp_license_type: '2',
        business_code: '',
        business_code_img: '',
        business_code_img_local: '',
        institution_code: '',
        institution_code_img: '',
        institution_code_img_local: '',
        tax_code: '',
        tax_code_img: '',
        tax_code_img_local: '',
        social_credit_code: '',
        social_credit_code_img: '',
        social_credit_code_img_local: '',
        license_start_date: '', // 营业证照起始日期，精确到年月日
        license_end_date: '',
        controlling_shareholder_cust_name: '',
        controlling_shareholder_id_card_type: '',
        controlling_shareholder_id_card: '',
        legal_name: '',
        legal_id_card_type: '',
        legal_id_card: '',
        legal_cert_start_date: '',
        legal_cert_end_date: '',
        legal_mobile: '',
        legal_card_imgz: '',
        legal_card_imgz_local: '',
        legal_card_imgf: '',
        legal_card_imgf_local: '',
        contact_name: '',
        contact_mobile: '',
        contact_email: '',
        bank_id: '',
        bank_branch: '',
        bank_prov: '',
        bank_area: '',
        bank_acct_name: '',
        bank_acct_num: '',
        bank_acct_img: '',
        bank_acct_img_local: ''
      },
      rules: {
        apply_type: [{ required: true, message: '账号认证类型', trigger: 'blur' }],
        corp_name: [{ required: true, message: '请填写企业名称', trigger: 'blur' }],
        corp_license_type: [{ required: true, message: '请选择证照类型', trigger: 'blur' }],
        license_start_date: [{ required: true, message: '请选择日期', trigger: 'change' }],
        license_end_date: [{ required: true, message: '请选择日期', trigger: 'change' }],
        controlling_shareholder_cust_name: [
          { required: true, message: '请填写股东名称', trigger: 'blur' }
        ],
        controlling_shareholder_id_card_type: [
          { required: true, message: '请选择股东证件类型', trigger: 'change' }
        ],
        controlling_shareholder_id_card: [
          { required: true, message: '请填写股东证件号码', trigger: 'blur' }
        ],
        legal_name: [{ required: true, message: '请填写法人代表姓名', trigger: 'blur' }],
        legal_id_card_type: [
          { required: true, message: '请选择法人代表证件类型', trigger: 'change' }
        ],
        legal_id_card: [{ required: true, message: '请填写法人代表证件号码', trigger: 'blur' }],
        legal_cert_start_date: [{ required: true, message: '请选择日期', trigger: 'change' }],
        legal_cert_end_date: [{ required: true, message: '请选择日期', trigger: 'change' }],
        legal_mobile: [
          { required: true, message: '请填写法人代表手机号码', trigger: 'blur' },
          { validator: vaildMobile, trigger: 'blur' }
        ],
        legal_card_imgz: [{ required: true, message: '请上传证件正面', trigger: 'change' }],
        legal_card_imgf: [{ required: true, message: '请上传证件反面', trigger: 'change' }],
        bank_acct_img: [{ required: true, message: '请上传开户银行许可证', trigger: 'change' }],
        contact_name: [{ required: true, message: '请填写企业联系人姓名', trigger: 'blur' }],
        contact_mobile: [
          { required: true, message: '请填写企业联系人手机', trigger: 'blur' },
          { validator: vaildMobile, trigger: 'blur' }
        ],
        contact_email: [
          { required: true, message: '请填写企业联系人邮箱', trigger: 'blur' },
          { validator: vaildEmail, trigger: 'blur' }
        ],
        bank_id: [{ required: true, message: '请选择开户银行', trigger: 'change' }],
        bank_branch: [{ required: true, message: '请填写开户银行支行名称', trigger: 'blur' }],
        bank_prov: [{ required: true, message: '请选择省市', trigger: 'change' }],
        bank_area: [{ required: true, message: '请选择地区', trigger: 'change' }],
        bank_acct_name: [{ required: true, message: '请填写开户银行账号名称', trigger: 'blur' }],
        bank_acct_num: [{ required: true, message: '请填写开户银行账号', trigger: 'blur' }],
        area: [{ required: true, message: '请选择地区', trigger: 'change' }]
      },
      fileList: {
        tax_code_img: '',
        institution_code_img: '',
        business_code_img: '',
        social_credit_code_img: '',
        legal_card_imgz: '',
        legal_card_imgf: '',
        bank_acct_img: ''
      },
      imgType: {
        tax_code_img: '3',
        institution_code_img: '2',
        business_code_img: '1',
        social_credit_code_img: '6',
        legal_card_imgz: '4',
        legal_card_imgf: '10',
        bank_acct_img: '5'
      }
    }
  },
  mounted () {
    let { id, type } = this.$route.query
    this.form.distributor_id = id
    let disabled = type == 0 ? true : false
    this.disabled = disabled
    this.$forceUpdate()
    this.getData()
  },
  methods: {
    async getData () {
      let distributor_id = this.form.distributor_id
      let apply_type = this.form.apply_type
      let res = await getHffile({ distributor_id, apply_type })
      let { data } = res
      data = data.data
      if (data.length === 0) {
        return
      }
      delete data.user_id
      delete data.user_cust_id
      delete data.acct_id
      delete data.created_at
      delete data.updated_at
      let fileList = JSON.parse(JSON.stringify(this.fileList))
      Object.keys(fileList).forEach((key) => {
        fileList[key] = data[`${key}_full_url`]
      })
      this.fileList = fileList

      this.form = data
      this.form.bank_prov = data.bank_prov
      this.form.bank_area = data.bank_area
      this.form.area = [this.form.bank_prov, this.form.bank_area]
    },
    onSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let obj = JSON.parse(JSON.stringify(this.form))
          saveHffile(obj).then((res) => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            setTimeout(() => {
              this.$router.go(-1)
            }, 500)
          })
        } else {
          return false
        }
      })
    },

    handleChange (ctx, type) {
      let { file } = ctx
      if (file) {
        if (file.type != 'image/jpeg' && file.type != 'image/png') {
          this.$message.error('上传图片只能是 JPG 或者 PNG 格式!')
          return false
        }
        if (file.size / 1024 / 1024 > 5) {
          this.$message.error('上传图片大小不能超过 5MB!')
          return false
        }
      }
      let params = {
        isUploadFile: true,
        trans_type: '3',
        file: file,
        attach_type: this.imgType[type]
      }
      const upload = new UploadUtil()
      // 上传
      Promise.all([upload.uploadImg(file, file.name), upLoadHffile(params)]).then((res) => {
        this.fileList[type] = URL.createObjectURL(file)
        let { data } = res[1]
        let { key } = res[0]
        this.form[type] = data.data.attach_no
        this.form[`${type}_local`] = key
        ctx.onSuccess()
      })
    },
    areaChange (value) {
      // console.log(value);
      // this.form.area = value
      this.form.bank_prov = value[0]
      this.form.bank_area = value[1]
    }
  }
}
</script>
<style lang="scss" scoped>
.formClass {
  width: 600px;
  margin: 0 auto;
}
.el-row {
  margin-bottom: 0px !important;
}

.avatar-uploader {
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  &:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }
}
.avatar {
  width: 148px;
  height: 148px;
  display: block;
}
</style>
