<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-alert
      v-if="form_solo.status == 4"
      :title="$t('0ec7384b.fe3661')"
      type="error"
      show-icon
      center
      :description="form_solo.resp_desc"
      :closable="false"
    />
    <el-divider v-if="form_solo.status == 4" />
    <div class="formClass">
      <el-form ref="form_solo" :model="form_solo" label-width="150px" :rules="rules">
        <el-form-item :label="$t('0ec7384b.44f2bc')">
          <el-button type="success" round size="mini"> {{ $t('0ec7384b.a41061') }} </el-button>
        </el-form-item>
        <el-form-item :label="$t('0ec7384b.ee3562')" prop="solo_name">
          <el-input v-model="form_solo.solo_name" :disabled="disabled" />
        </el-form-item>
        <el-row>
          <el-form-item :label="$t('0ec7384b.10410a')" prop="business_code">
            <el-input v-model="form_solo.business_code" :disabled="disabled" />
          </el-form-item>
          <el-form-item :label="$t('0ec7384b.e0b8cc')" prop="business_code_img">
            <el-upload
              class="avatar-uploader"
              :disabled="disabled"
              action="#"
              :auto-upload="true"
              :show-file-list="false"
              :http-request="
                (ctx) => {
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
        <el-form-item :label="$t('0ec7384b.b23187')" prop="license_start_date">
          <el-date-picker
            v-model="form_solo.license_start_date"
            type="date"
            value-format="yyyyMMdd"
            :placeholder="$t('0ec7384b.2bebdd')"
            style="width: 100%"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item :label="$t('0ec7384b.3e5782')" prop="license_end_date">
          <el-date-picker
            v-model="form_solo.license_end_date"
            type="date"
            value-format="yyyyMMdd"
            :placeholder="$t('0ec7384b.2bebdd')"
            style="width: 100%"
            :disabled="disabled"
            @change="$forceUpdate()"
          />
        </el-form-item>
        <el-form-item :label="$t('0ec7384b.57cb22')" prop="solo_business_address">
          <el-input v-model="form_solo.solo_business_address" :disabled="disabled" />
        </el-form-item>
        <el-form-item :label="$t('0ec7384b.c69339')" prop="solo_reg_address">
          <el-input v-model="form_solo.solo_reg_address" :disabled="disabled" />
        </el-form-item>
        <el-form-item :label="$t('0ec7384b.d5ca28')" prop="solo_fixed_telephone">
          <el-input v-model="form_solo.solo_fixed_telephone" :disabled="disabled" />
        </el-form-item>
        <el-form-item :label="$t('0ec7384b.04228b')" prop="business_scope">
          <el-input v-model="form_solo.business_scope" :disabled="disabled" />
        </el-form-item>
        <el-form-item :label="$t('0ec7384b.2fe17a')" prop="legal_name">
          <el-input v-model="form_solo.legal_name" :disabled="disabled" />
        </el-form-item>
        <el-form-item :label="$t('0ec7384b.7006b1')" prop="legal_id_card_type">
          <el-select
            v-model="form_solo.legal_id_card_type"
            :placeholder="$t('0ec7384b.8d63c3')"
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
        <el-form-item :label="$t('0ec7384b.60a665')" prop="legal_id_card">
          <el-input v-model="form_solo.legal_id_card" :disabled="disabled" />
        </el-form-item>
        <el-form-item :label="$t('0ec7384b.41ecb3')" prop="legal_cert_start_date">
          <el-date-picker
            v-model="form_solo.legal_cert_start_date"
            type="date"
            value-format="yyyyMMdd"
            :placeholder="$t('0ec7384b.2bebdd')"
            style="width: 100%"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item :label="$t('0ec7384b.0bbe28')" prop="legal_cert_end_date">
          <el-date-picker
            v-model="form_solo.legal_cert_end_date"
            type="date"
            value-format="yyyyMMdd"
            :disabled="disabled"
            :placeholder="$t('0ec7384b.2bebdd')"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item :label="$t('0ec7384b.aa4cf4')" prop="legal_card_imgz">
          <el-upload
            class="avatar-uploader"
            action="#"
            :disabled="disabled"
            :auto-upload="true"
            :show-file-list="false"
            :http-request="
              (ctx) => {
                handleSoloChange(ctx, 'legal_card_imgz')
              }
            "
          >
            <img v-if="fileList.legal_card_imgz" :src="fileList.legal_card_imgz" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('0ec7384b.4d5a1a')" prop="legal_card_imgf">
          <el-upload
            class="avatar-uploader"
            action="#"
            :auto-upload="true"
            :disabled="disabled"
            :show-file-list="false"
            :http-request="
              (ctx) => {
                handleSoloChange(ctx, 'legal_card_imgf')
              }
            "
          >
            <img v-if="fileList.legal_card_imgf" :src="fileList.legal_card_imgf" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('0ec7384b.187a35')" prop="legal_mobile">
          <el-input v-model="form_solo.legal_mobile" :disabled="disabled" />
        </el-form-item>
        <el-form-item :label="$t('0ec7384b.7b4e6a')" prop="contact_name">
          <el-input v-model="form_solo.contact_name" :disabled="disabled" />
        </el-form-item>
        <el-form-item :label="$t('0ec7384b.47f8a6')" prop="contact_mobile">
          <el-input v-model="form_solo.contact_mobile" :disabled="disabled" />
        </el-form-item>
        <el-form-item :label="$t('0ec7384b.915143')" prop="contact_email">
          <el-input v-model="form_solo.contact_email" :disabled="disabled" />
        </el-form-item>
        <el-form-item :label="$t('0ec7384b.d98e9d')" prop="bank_acct_num">
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
        <el-form-item :label="$t('0ec7384b.7379c9')" prop="occupation">
          <el-select
            v-model="form_solo.occupation"
            :placeholder="$t('0ec7384b.22cf03')"
            :disabled="disabled"
            @visible-change="(bool) => (isEdit = bool)"
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
          <el-button v-if="!disabled" type="primary" @click="onSoloSubmit">
            {{ $t('0ec7384b.be5fbb') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { i18n } from '@/i18n'
import { upLoadHffile, saveHffile, getHffile } from '@/api/fenzhang'
import areaData from '@/common/hfpayAreaData.json'
import bankData from '@/common/hfpayBankData.json'
import UploadUtil from '@/utils/uploadUtil'
import { vaildateIdCard, isMobile, validEmail } from '@/utils/validate'
export default {
  data() {
    const vaildIdCard = (rule, value, callback) => {
      if (!vaildateIdCard(value)) {
        callback(new Error(i18n.t('0ec7384b.498f58')))
      } else {
        callback()
      }
    }
    const vaildEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error(i18n.t('0ec7384b.7b6234')))
      } else {
        callback()
      }
    }
    const vaildMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error(i18n.t('0ec7384b.03951b')))
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
      vaildIdCard,
      vaildEmail,
      vaildMobile,
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
  computed: {
    rules() {
      const t = this.$t.bind(this)
      return {
        apply_type: [{ required: true, message: t('0ec7384b.44f2bc'), trigger: 'blur' }],
        business_code: [{ required: true, message: t('0ec7384b.324bc5'), trigger: 'blur' }],
        business_code_img: [{ required: true, message: t('0ec7384b.291d78'), trigger: 'change' }],
        solo_name: [{ required: true, message: t('0ec7384b.1a1bd2'), trigger: 'blur' }],
        license_start_date: [{ required: true, message: t('0ec7384b.aa2fb1'), trigger: 'change' }],
        license_end_date: [{ required: true, message: t('0ec7384b.aa2fb1'), trigger: 'change' }],
        legal_name: [{ required: true, message: t('0ec7384b.7ab92b'), trigger: 'blur' }],
        legal_id_card_type: [{ required: true, message: t('0ec7384b.6eaeee'), trigger: 'change' }],
        legal_id_card: [{ required: true, message: t('0ec7384b.f89ac7'), trigger: 'blur' }],
        legal_card_imgz: [{ required: true, message: t('0ec7384b.e46ea7'), trigger: 'change' }],
        legal_card_imgf: [{ required: true, message: t('0ec7384b.43a695'), trigger: 'change' }],
        legal_cert_start_date: [
          { required: true, message: t('0ec7384b.aa2fb1'), trigger: 'change' }
        ],
        legal_cert_end_date: [{ required: true, message: t('0ec7384b.aa2fb1'), trigger: 'change' }],
        legal_mobile: [
          { required: true, message: t('0ec7384b.2f6fb6'), trigger: 'blur' },
          { validator: this.vaildMobile, trigger: 'blur' }
        ],
        contact_name: [{ required: true, message: t('0ec7384b.a69a57'), trigger: 'blur' }],
        contact_mobile: [
          { required: true, message: t('0ec7384b.c72b70'), trigger: 'blur' },
          { validator: this.vaildMobile, trigger: 'blur' }
        ],
        contact_email: [
          { required: true, message: t('0ec7384b.8f3194'), trigger: 'blur' },
          { validator: this.vaildEmail, trigger: 'blur' }
        ],
        bank_acct_num: [{ required: true, message: t('0ec7384b.387c2f'), trigger: 'blur' }],
        bank_acct_num_imgz: [{ required: true, message: t('0ec7384b.53bb25'), trigger: 'change' }],
        bank_acct_num_imgf: [{ required: true, message: t('0ec7384b.03380f'), trigger: 'change' }],
        occupation: [{ required: true, message: t('0ec7384b.708c9d'), trigger: 'change' }],
        solo_business_address: [{ required: true, message: t('0ec7384b.ce6e3d'), trigger: 'blur' }],
        solo_reg_address: [{ required: true, message: t('0ec7384b.97dfa8'), trigger: 'blur' }],
        solo_fixed_telephone: [{ required: true, message: t('0ec7384b.0f197f'), trigger: 'blur' }],
        business_scope: [{ required: true, message: t('0ec7384b.afbeda'), trigger: 'blur' }]
      }
    },
    cardType() {
      return [
        { card_type: '10', label: this.$t('0ec7384b.f33656') },
        { card_type: '11', label: this.$t('0ec7384b.74f7c6') },
        { card_type: '14', label: this.$t('0ec7384b.1861b2') },
        { card_type: '17', label: this.$t('0ec7384b.35e81c') }
      ]
    },
    occupationList() {
      return [
        { occupation_key: '01', label: this.$t('0ec7384b.00d0de') },
        { occupation_key: '02', label: this.$t('0ec7384b.fc0c16') },
        { occupation_key: '03', label: this.$t('0ec7384b.5e566e') },
        { occupation_key: '04', label: this.$t('0ec7384b.8776fc') },
        { occupation_key: '05', label: this.$t('0ec7384b.51ed81') },
        { occupation_key: '06', label: this.$t('0ec7384b.672eb9') },
        { occupation_key: '07', label: this.$t('0ec7384b.11d833') },
        { occupation_key: '08', label: this.$t('0ec7384b.8e8c6b') },
        { occupation_key: '09', label: this.$t('0ec7384b.5f9a8e') },
        { occupation_key: '10', label: this.$t('0ec7384b.faeefc') },
        { occupation_key: '11', label: this.$t('0ec7384b.8b3dce') },
        { occupation_key: '12', label: this.$t('0ec7384b.ad823f') },
        { occupation_key: '13', label: this.$t('0ec7384b.36e2fb') }
      ]
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
      Object.keys(fileList).forEach((key) => {
        fileList[key] = data[`${key}_full_url`]
      })
      this.fileList = fileList
      this.form_solo = data
    },
    onSoloSubmit() {
      this.$refs['form_solo'].validate((valid) => {
        if (valid) {
          let obj = JSON.parse(JSON.stringify(this.form_solo))

          saveHffile(obj).then((res) => {
            this.$message({
              message: this.$t('0ec7384b.3b1083'),
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
          this.$message.error(this.$t('0ec7384b.34e969'))
          return false
        }
        if (file.size / 1024 / 1024 > 5) {
          this.$message.error(this.$t('0ec7384b.50fa12'))
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
      Promise.all([upload.uploadImg(file, file.name), upLoadHffile(params)]).then((res) => {
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
