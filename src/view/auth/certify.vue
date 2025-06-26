<template>
  <SpPage>
    <template>
      <el-alert
        v-if="is_check == '1'"
        :title="certify_status"
        type="success"
        :closable="false"
        center
        show-icon
      />
      <el-alert
        v-if="is_check == '0'"
        :title="'审核状态: ' + certify_status"
        type="warning"
        :closable="false"
        center
        show-icon
      />
      <el-alert
        v-if="is_check == '2'"
        :title="certify_status + ' : ' + form.audit_remark"
        type="error"
        :closable="false"
        center
        show-icon
      />
    </template>

    <el-form ref="form" :model="form" label-width="110px">
      <el-col :span="24" class="group-label">
        <span class="label-title">供应商基础信息</span>
      </el-col>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="供应商名称" required>
            <el-input id="keyword" v-model="form.supplier_name" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系人姓名">
            <el-input id="keyword" v-model="form.contact" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机号" required>
            <el-input id="keyword" v-model="form.mobile" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="营业执照" required>
            <upload-img @changeImg="changeBusinessImg" :list="form.business_license" />
          </el-form-item>
        </el-col>

        <el-col :span="24" class="group-label">
          <span class="label-title">客服配置</span>
          <span class="label-note"><i class="el-icon-warning icon-wr" />配道订单客服信息</span>
        </el-col>

        <el-col :span="24">
          <el-form-item label="企业微信二维码" required>
            <upload-img @changeImg="changeQRImg" :list="form.wechat_qrcode" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客服电话" required>
            <el-input id="keyword" v-model="form.service_tel" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div class="label-note">客服电话，点击可拨打电话咨询</div>
        </el-col>

        <el-col :span="24" class="group-label">
          <span class="label-title">线下对公支付收款账号</span>
          <span class="label-note"
            ><i
              class="el-icon-warning icon-wr"
            />配置线下对公支付收欢很行账号信息，用户平台转账使用确保填写正确</span
          >
        </el-col>

        <el-col :span="8">
          <el-form-item label="收款银行" required>
            <el-input id="keyword" v-model="form.bank_name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="银行卡号" required>
            <el-input id="keyword" v-model="form.bank_account" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item v-if="is_check == '2' || is_check == '-1'">
        <el-button type="primary" size="large" @click="createSupplier"> 提交审核 </el-button>
      </el-form-item>
    </el-form>
  </SpPage>
</template>
<script>
import imgPicker from '@/components/imageselect'
import { getSupplierInfo, createSupplier } from '@/api/supplier'
import uploadImg from './components/uploadImg.vue'
const check_map = {
  0: '待审核',
  1: '审核通过',
  2: '审核失败'
}

export default {
  components: {
    imgPicker,
    uploadImg
  },
  data() {
    return {
      form: {
        audit_remark: '',
        supplier_name: '',
        contact: '',
        mobile: '',
        business_license: [],
        wechat_qrcode: [],
        service_tel: '',
        bank_name: '',
        bank_account: ''
      },
      isGetPics: false,
      picsDialog: false,
      picsCurrent: -1,
      picsOldLen: 0,
      is_check: '-1',
      certify_status: ''
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      const res = await this.$api.supplier.getSupplierInfo()
      if (res.supplier_info && res.supplier_info.id) {
        const {
          supplier_name = '',
          contact = '',
          mobile = '',
          business_license = '',
          wechat_qrcode = '',
          service_tel = '',
          bank_account = '',
          bank_name = '',
          is_check,
          audit_remark = ''
        } = res.supplier_info
        this.$nextTick(() => {
          this.form = {
            ...this.form,
            supplier_name,
            contact,
            mobile,
            business_license: [business_license],
            wechat_qrcode: [wechat_qrcode],
            service_tel,
            bank_name,
            bank_account,
            audit_remark
          }
          this.is_check = is_check
          if (is_check) {
            this.certify_status = check_map[is_check] || ''
          }
        })
      }
    },
    async createSupplier() {
      const {
        supplier_name,
        contact,
        mobile,
        business_license,
        wechat_qrcode,
        service_tel,
        bank_name,
        bank_account
      } = this.form
      const params = {
        supplier_name,
        contact,
        mobile,
        business_license: business_license[0] || '',
        wechat_qrcode: wechat_qrcode[0] || '',
        service_tel,
        bank_name,
        bank_account
      }
      const res = await this.$api.supplier.createSupplier(params)
      if (res && res.id) {
        this.$message({
          message: '提交成功',
          type: 'success'
        })
        this.getList()
      }
    },
    changeBusinessImg(pics) {
      this.form.business_license = pics
    },
    changeQRImg(pics) {
      this.form.wechat_qrcode = pics
    }
  }
}
</script>
<style lang="scss" scoped>
.group-label {
  padding: 20px 0;
  .label-title {
    font-weight: bold;
    font-size: 15px;
  }
  &.certify-status {
    color: #ff5d00;
    text-align: center;
    .label-title {
      font-size: 20px;
    }
  }
}

.label-note {
  color: #ff5d00;
  font-size: 10px;
  line-height: 40px;
  margin-left: 20px;
}
.pics-box .upload-box {
  background: #eeeeee;
  position: relative;
  .placeholder {
    font-size: 12px;
    color: #8c939d;
    position: absolute;
    /* bottom: 100px; */
    left: 0;
    right: 0;
    margin: 0 auto;
    text-align: center;
    top: 90px;
  }
}
</style>
<style lang="scss">
.bm-view {
  width: 100%;
  height: 300px;
}
#qqmap_rslist {
  border-right: 1px solid #e7e7eb;
}
#qqmap_container {
  float: left;
  width: 800px;
  height: 400px;
}
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 148px;
  height: 148px;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 148px;
  height: 148px;
  line-height: 148px;
  text-align: center;
}
.avatar {
  width: 148px;
  height: 148px;
  display: block;
}
.pics-box {
  overflow: hidden;
  .goodspic-wrap {
    float: left;
    margin-right: 5px;
    overflow: hidden;
    .goodspic {
      position: relative;
      float: left;
      width: 146px;
      height: 146px;
      margin: 0 5px 10px;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
      .goodspic-mask {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
        text-align: center;
        line-height: 146px;
        cursor: pointer;
        &.on {
          display: block;
        }
        .icon1 {
          font-size: 20px;
          color: #fff;
        }
      }
    }
  }

  .upload-box {
    float: left;
    width: 146px;
    height: 146px;
    .avatar-uploader-icon {
      width: 100%;
      height: 100%;
      line-height: 146px;
    }
    .avatar-uploader-icon {
      font-size: 38px;
    }
  }
}
</style>
