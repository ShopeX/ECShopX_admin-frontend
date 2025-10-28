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
  <div>
    <el-alert
      v-if="form_solo.status == 4"
      title="审核失败"
      type="error"
      show-icon
      center
      :description="form_solo.resp_desc"
      :closable="false"
    />
    <el-divider v-if="form_solo.status == 4" />
    <div class="formClass">
      <el-form ref="form_solo" :model="form_solo" label-width="150px" :rules="rules">
        <el-form-item label="账号认证类型">
          <el-button type="success" round size="mini"> 个体户 </el-button>
        </el-form-item>
        <el-form-item label="个体户名称" prop="solo_name">
          <el-input v-model="form_solo.solo_name" :disabled="disabled" />
        </el-form-item>
        <el-row>
          <el-form-item
            label="营业执照注册号"
            prop="business_code"
            :rules="[{ required: true, message: '请填写营业执照注册号', trigger: 'blur' }]"
          >
            <el-input v-model="form_solo.business_code" :disabled="disabled" />
          </el-form-item>
          <el-form-item
            label="营业执照"
            prop="business_code_img"
            :rules="[{ required: true, message: '请上传营业执照', trigger: 'change' }]"
          >
            <el-upload
              class="avatar-uploader"
              :disabled="disabled"
              action="#"
              :auto-upload="true"
              :show-file-list="false"
              :http-request="
                ctx => {
                  handleSoloChange(ctx, 'business_code_img')
                }
              "
            >
              <img
                v-if="fileList.business_code_img"
                :src="fileList.business_code_img"
                class="avatar"
              >
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
        </el-row>
        <el-form-item label="营业执照起始日期" prop="license_start_date">
          <el-date-picker
            v-model="form_solo.license_start_date"
            type="date"
            value-format="yyyyMMdd"
            placeholder="选择日期"
            style="width: 100%"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item label="营业执照结束日期" prop="license_end_date">
          <el-date-picker
            v-model="form_solo.license_end_date"
            type="date"
            value-format="yyyyMMdd"
            placeholder="选择日期"
            style="width: 100%"
            :disabled="disabled"
            @change="$forceUpdate()"
          />
        </el-form-item>
        <el-form-item label="个体户经营地址" prop="solo_business_address">
          <el-input v-model="form_solo.solo_business_address" :disabled="disabled" />
        </el-form-item>
        <el-form-item label="个体户注册地址" prop="solo_reg_address">
          <el-input v-model="form_solo.solo_reg_address" :disabled="disabled" />
        </el-form-item>
        <el-form-item label="个体户固定电话" prop="solo_fixed_telephone">
          <el-input v-model="form_solo.solo_fixed_telephone" :disabled="disabled" />
        </el-form-item>
        <el-form-item label="经营范围" prop="business_scope">
          <el-input v-model="form_solo.business_scope" :disabled="disabled" />
        </el-form-item>
        <el-form-item label="法人姓名" prop="legal_name">
          <el-input v-model="form_solo.legal_name" :disabled="disabled" />
        </el-form-item>
        <el-form-item label="法人证件类型" prop="legal_id_card_type">
          <el-select
            v-model="form_solo.legal_id_card_type"
            placeholder="选择法人代表证件类"
            :disabled="disabled"
            @visible-change="bool => (isEdit = bool)"
          >
            <el-option
              v-for="item in cardType"
              :key="item.card_type"
              :label="item.label"
              :value="item.card_type"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="法人证件号码" prop="legal_id_card">
          <el-input v-model="form_solo.legal_id_card" :disabled="disabled" />
        </el-form-item>
        <el-form-item label="法人证件起始日期" prop="legal_cert_start_date">
          <el-date-picker
            v-model="form_solo.legal_cert_start_date"
            type="date"
            value-format="yyyyMMdd"
            placeholder="选择日期"
            style="width: 100%"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item label="法人证件结束日期" prop="legal_cert_end_date">
          <el-date-picker
            v-model="form_solo.legal_cert_end_date"
            type="date"
            value-format="yyyyMMdd"
            :disabled="disabled"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="法人证件正面" prop="legal_card_imgz">
          <el-upload
            class="avatar-uploader"
            action="#"
            :disabled="disabled"
            :auto-upload="true"
            :show-file-list="false"
            :http-request="
              ctx => {
                handleSoloChange(ctx, 'legal_card_imgz')
              }
            "
          >
            <img v-if="fileList.legal_card_imgz" :src="fileList.legal_card_imgz" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="法人证件反面" prop="legal_card_imgf">
          <el-upload
            class="avatar-uploader"
            action="#"
            :auto-upload="true"
            :disabled="disabled"
            :show-file-list="false"
            :http-request="
              ctx => {
                handleSoloChange(ctx, 'legal_card_imgf')
              }
            "
          >
            <img v-if="fileList.legal_card_imgf" :src="fileList.legal_card_imgf" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="法人手机号码" prop="legal_mobile">
          <el-input v-model="form_solo.legal_mobile" :disabled="disabled" />
        </el-form-item>
        <el-form-item label="企业联系人姓名" prop="contact_name">
          <el-input v-model="form_solo.contact_name" :disabled="disabled" />
        </el-form-item>
        <el-form-item label="企业联系人手机号" prop="contact_mobile">
          <el-input v-model="form_solo.contact_mobile" :disabled="disabled" />
        </el-form-item>
        <el-form-item label="企业联系人邮箱" prop="contact_email">
          <el-input v-model="form_solo.contact_email" :disabled="disabled" />
        </el-form-item>
        <el-form-item label="银行卡号" prop="bank_acct_num">
          <el-input v-model="form_solo.bank_acct_num" :disabled="disabled" />
        </el-form-item>
        <!-- <el-form-item label="银行卡正面" prop="bank_acct_num_imgz">
          <el-upload
            class="avatar-uploader"
            action="#"
            :disabled="disabled"
            :auto-upload="true"
            :show-file-list="false"
            :http-request="
              (ctx) => {
                handleSoloChange(ctx, 'bank_acct_num_imgz')
              }
            "
          >
            <img v-if="fileList.bank_acct_num_imgz" :src="fileList.bank_acct_num_imgz" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item> -->
        <!-- <el-form-item label="银行卡反面" prop="bank_acct_num_imgf">
          <el-upload
            class="avatar-uploader"
            action="#"
            :auto-upload="true"
            :disabled="disabled"
            :show-file-list="false"
            :http-request="
              (ctx) => {
                handleSoloChange(ctx, 'bank_acct_num_imgf')
              }
            "
          >
            <img v-if="fileList.bank_acct_num_imgf" :src="fileList.bank_acct_num_imgf" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item> -->
        <el-form-item label="职业" prop="occupation">
          <el-select
            v-model="form_solo.occupation"
            placeholder="选择职业"
            :disabled="disabled"
            @visible-change="bool => (isEdit = bool)"
          >
            <el-option
              v-for="item in occupationList"
              :key="item.occupation_key"
              :label="item.label"
              :value="item.occupation_key"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="企业联系人证件号" prop="contact_cert_num">
          <el-input v-model="form_solo.contact_cert_num" :disabled="disabled"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="开户许可证核准号" prop="open_license_no">
          <el-input v-model="form_solo.open_license_no" :disabled="disabled"></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button v-if="!disabled" type="primary" @click="onSoloSubmit"> 保存 </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { upLoadHffile, saveHffile, getHffile } from '@/api/fenzhang'
import areaData from '@/common/hfpayAreaData.json'
import bankData from '@/common/hfpayBankData.json'
import UploadUtil from '@/utils/uploadUtil'
import { vaildateIdCard, isMobile, validEmail } from '@/utils/validate'
export default {
  data() {
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
          card_type: '10',
          label: '身份证'
        },
        {
          card_type: '11',
          label: '护照'
        },
        {
          card_type: '14',
          label: '回乡证'
        },
        {
          card_type: '17',
          label: '台胞证'
        }
      ],
      occupationList: [
        {
          occupation_key: '01',
          label: '国家机关、党群机关、企事业单位负责人'
        },
        {
          occupation_key: '02',
          label: '金融业从业人员'
        },
        {
          occupation_key: '03',
          label: '房地产业从业人员'
        },
        {
          occupation_key: '04',
          label: '商贸从业人员'
        },
        {
          occupation_key: '05',
          label: '自由职业者'
        },
        {
          occupation_key: '06',
          label: '科教文从业人员 '
        },
        {
          occupation_key: '07',
          label: '制造业从业人员'
        },
        {
          occupation_key: '08',
          label: '卫生行业从业人员'
        },
        {
          occupation_key: '09',
          label: 'IT业从业人员'
        },
        {
          occupation_key: '10',
          label: '农林牧渔劳动者'
        },
        {
          occupation_key: '11',
          label: '生产工作、运输工作和部分体力劳动者'
        },
        {
          occupation_key: '12',
          label: '退休人员'
        },
        {
          occupation_key: '13',
          label: '不便分类的其他劳动者'
        }
      ],
      form_solo: {
        apply_type: '2',
        solo_name: '',
        business_code: '',
        business_code_img: '',
        business_code_img_local: '',
        license_start_date: '', // 营业证照起始日期，精确到年月日
        license_end_date: '',
        solo_business_address: '',
        solo_fixed_telephone: '',
        solo_reg_address: '',
        business_scope: '',
        legal_name: '',
        legal_id_card_type: '',
        legal_id_card: '',
        legal_card_imgz: '',
        legal_card_imgz_local: '',
        legal_card_imgf: '',
        legal_card_imgf_local: '',
        legal_cert_start_date: '',
        legal_cert_end_date: '',
        legal_mobile: '',
        contact_name: '',
        contact_mobile: '',
        contact_email: '',
        occupation: '',
        bank_acct_num: '',
        bank_acct_num_imgz: '',
        bank_acct_num_imgz_local: '',
        bank_acct_num_imgf: '',
        bank_acct_num_imgf_local: '',
        contact_cert_num: '',
        open_license_no: ''
      },
      rules: {
        apply_type: [{ required: true, message: '账号认证类型', trigger: 'blur' }],
        solo_name: [{ required: true, message: '请填写个体户名称', trigger: 'blur' }],
        license_start_date: [{ required: true, message: '请选择日期', trigger: 'change' }],
        license_end_date: [{ required: true, message: '请选择日期', trigger: 'change' }],
        legal_name: [{ required: true, message: '请填写法人代表姓名', trigger: 'blur' }],
        legal_id_card_type: [
          { required: true, message: '请选择法人代表证件类型', trigger: 'change' }
        ],
        legal_id_card: [{ required: true, message: '请填写法人代表证件号码', trigger: 'blur' }],
        legal_card_imgz: [{ required: true, message: '请上传证件正面', trigger: 'change' }],
        legal_card_imgf: [{ required: true, message: '请上传证件反面', trigger: 'change' }],
        legal_cert_start_date: [{ required: true, message: '请选择日期', trigger: 'change' }],
        legal_cert_end_date: [{ required: true, message: '请选择日期', trigger: 'change' }],
        legal_mobile: [
          { required: true, message: '请填写法人代表手机号码', trigger: 'blur' },
          { validator: vaildMobile, trigger: 'blur' }
        ],
        contact_name: [{ required: true, message: '请填写企业联系人姓名', trigger: 'blur' }],
        contact_mobile: [
          { required: true, message: '请填写企业联系人手机', trigger: 'blur' },
          { validator: vaildMobile, trigger: 'blur' }
        ],
        contact_email: [
          { required: true, message: '请填写企业联系人邮箱', trigger: 'blur' },
          { validator: vaildEmail, trigger: 'blur' }
        ],
        bank_acct_num: [{ required: true, message: '请填写开户银行账号', trigger: 'blur' }],
        bank_acct_num_imgz: [{ required: true, message: '请上传银行卡正面', trigger: 'change' }],
        bank_acct_num_imgf: [{ required: true, message: '请上传银行卡反面', trigger: 'change' }],
        occupation: [{ required: true, message: '请选择', trigger: 'change' }],
        solo_business_address: [
          { required: true, message: '请填写个体户经营地址', trigger: 'blur' }
        ],
        solo_reg_address: [{ required: true, message: '请填写个体户注册地址', trigger: 'blur' }],
        solo_fixed_telephone: [
          { required: true, message: '请填写个体户固定电话', trigger: 'blur' }
        ],
        business_scope: [{ required: true, message: '请填写经营范围', trigger: 'blur' }]
      },
      fileList: {
        business_code_img: '',
        legal_card_imgz: '',
        legal_card_imgf: '',
        bank_acct_num_imgz: '',
        bank_acct_num_imgf: ''
      },
      imgType: {
        business_code_img: '1',
        legal_card_imgz: '4',
        legal_card_imgf: '10',
        bank_acct_num_imgz: '14',
        bank_acct_num_imgf: '15'
      }
    }
  },
  mounted() {
    let { id, type } = this.$route.query
    this.form_solo.distributor_id = id
    let disabled = type == 0 ? true : false
    this.disabled = disabled
    this.$forceUpdate()
    this.getSoloData()
  },
  methods: {
    async getSoloData() {
      let distributor_id = this.form_solo.distributor_id
      let apply_type = this.form_solo.apply_type
      let res = await getHffile({ distributor_id, apply_type })
      if (res.data.data.length == 0) {
        return
      }
      let { data } = res
      data = data.data
      delete data.user_id
      delete data.user_cust_id
      delete data.acct_id
      delete data.created_at
      delete data.updated_at
      let fileList = JSON.parse(JSON.stringify(this.fileList))
      Object.keys(fileList).forEach(key => {
        fileList[key] = data[`${key}_full_url`]
      })
      this.fileList = fileList
      this.form_solo = data
    },
    onSoloSubmit() {
      this.$refs['form_solo'].validate(valid => {
        if (valid) {
          let obj = JSON.parse(JSON.stringify(this.form_solo))

          saveHffile(obj).then(res => {
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
    handleSoloChange(ctx, type) {
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
        trans_type: '4',
        file: file,
        attach_type: this.imgType[type]
      }
      const upload = new UploadUtil()
      // 上传
      Promise.all([upload.uploadImg(file, file.name), upLoadHffile(params)]).then(res => {
        this.fileList[type] = URL.createObjectURL(file)
        let { data } = res[1]
        let { key } = res[0]
        this.form_solo[type] = data.data.attach_no
        this.form_solo[`${type}_local`] = key
        ctx.onSuccess()
      })
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
