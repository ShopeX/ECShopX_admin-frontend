<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <template>
      <el-alert
        v-if="is_check == '1'"
        :title="$t(certify_status)"
        type="success"
        :closable="false"
        center
        show-icon
      />
      <el-alert
        v-if="is_check == '0'"
        :title="$t('5dc91b41.ea1d7f') + $t(certify_status)"
        type="warning"
        :closable="false"
        center
        show-icon
      />
      <el-alert
        v-if="is_check == '2'"
        :title="$t(certify_status) + ' : ' + form.audit_remark"
        type="error"
        :closable="false"
        center
        show-icon
      />
    </template>

    <el-form ref="form" :model="form" label-width="110px">
      <el-col :span="24" class="group-label">
        <span class="label-title">{{ $t('5dc91b41.614a80') }}</span>
      </el-col>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item :label="$t('5dc91b41.9190cc')" required>
            <el-input id="keyword" v-model="form.supplier_name" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('5dc91b41.986d36')">
            <el-input id="keyword" v-model="form.contact" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('5dc91b41.8098e2')" required>
            <el-input id="keyword" v-model="form.mobile" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('5dc91b41.e0b8cc')" required>
            <upload-img @changeImg="changeBusinessImg" :list="form.business_license" />
          </el-form-item>
        </el-col>

        <el-col :span="24" class="group-label">
          <span class="label-title">{{ $t('5dc91b41.63a578') }}</span>
          <span class="label-note"
            ><i class="el-icon-warning icon-wr" />{{ $t('5dc91b41.513723') }}</span
          >
        </el-col>

        <el-col :span="24">
          <el-form-item :label="$t('5dc91b41.06c785')" required>
            <upload-img @changeImg="changeQRImg" :list="form.wechat_qrcode" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('5dc91b41.e84643')" required>
            <el-input id="keyword" v-model="form.service_tel" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div class="label-note">{{ $t('5dc91b41.454df6') }}</div>
        </el-col>

        <el-col :span="24" class="group-label">
          <span class="label-title">{{ $t('5dc91b41.83be12') }}</span>
          <span class="label-note"
            ><i class="el-icon-warning icon-wr" />{{ $t('5dc91b41.6cd666') }}</span
          >
        </el-col>

        <el-col :span="8">
          <el-form-item :label="$t('5dc91b41.bd4097')" required>
            <el-input id="keyword" v-model="form.bank_name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('5dc91b41.d98e9d')" required>
            <el-input id="keyword" v-model="form.bank_account" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item v-if="is_check == '2' || is_check == '-1'">
        <el-button type="primary" size="large" @click="createSupplier">
          {{ $t('5dc91b41.646db0') }}
        </el-button>
      </el-form-item>
    </el-form>
  </SpPage>
</template>
<script>
import imgPicker from '@/components/imageselect'
import { getSupplierInfo, createSupplier } from '@/api/supplier'
import uploadImg from './components/uploadImg.vue'
const check_map = {
  0: '5dc91b41.5cb424',
  1: '5dc91b41.871a30',
  2: '5dc91b41.fe3661'
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
          message: this.$t('5dc91b41.23b62e'),
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
