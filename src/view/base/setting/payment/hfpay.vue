<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-form ref="form" label-width="100px">
    <el-form-item :label="$t('ea670112.1e7316')">
      <el-input v-model="form.mer_cust_id" style="width: 300px" />
      <br />
      <span class="frm-tips">{{ $t('ea670112.bbe462') }}</span>
    </el-form-item>
    <el-form-item :label="$t('ea670112.a5f9af')">
      <el-input v-model="form.acct_id" style="width: 300px" />
      <br />
      <span class="frm-tips">{{ $t('ea670112.06c08f') }}</span>
    </el-form-item>
    <el-form-item :label="$t('ea670112.476853')">
      <el-input v-model="form.pfx_password" style="width: 300px" />
    </el-form-item>

    <el-form-item :label="$t('ea670112.9fa3f8')">
      <span v-if="form.pfx_file_url"> {{ form.pfx_file_name }}</span>
      <el-upload class="" action="" :on-change="keyHandleChange" :auto-upload="false">
        <el-button size="small" type="primary">{{ $t('ea670112.2c808b') }}</el-button>
      </el-upload>
      <span class="frm-tips">{{ $t('ea670112.ba042d') }}</span>
    </el-form-item>

    <el-form-item :label="$t('ea670112.863c3d')">
      <span v-if="form.ca_pfx_file_url"> {{ form.ca_pfx_file_name }}</span>
      <el-upload class="" action="" :on-change="certHandleChange" :auto-upload="false">
        <el-button size="small" type="primary">{{ $t('ea670112.2c808b') }}</el-button>
      </el-upload>
      <span class="frm-tips">{{ $t('ea670112.bfb1f0') }}</span>
    </el-form-item>
    <el-form-item :label="$t('ea670112.42ded6')">
      <span v-if="form.oca31_pfx_file_url"> {{ form.oca31_pfx_file_name }}</span>
      <el-upload class="" action="" :on-change="cert31HandleChange" :auto-upload="false">
        <el-button size="small" type="primary">{{ $t('ea670112.2c808b') }}</el-button>
      </el-upload>
      <span class="frm-tips">{{ $t('ea670112.bfb1f0') }}</span>
    </el-form-item>

    <el-form-item :label="$t('ea670112.53c3dd')">
      <el-switch v-model="form.is_open" active-color="#13ce66" inactive-color="#ff4949" />
    </el-form-item>

    <div class="section-footer with-border content-center">
      <el-button v-loading="loading" type="primary" @click="onSubmit">
        {{ $t('ea670112.be5fbb') }}
      </el-button>
    </div>
  </el-form>
</template>
<script>
import { setPaymentSetting, getPaymentSetting } from '../../../../api/trade'
export default {
  data() {
    return {
      activeName: 'hfpay',
      loading: false,
      teegonForm: {
        app_key: '',
        client_secret: '',
        is_open: ''
      },
      form: {
        mer_cust_id: '',
        acct_id: '',
        pfx_password: '',
        pfx_file: '',
        ca_pfx_file: '',
        oca31_pfx_file: '',
        is_open: ''
      }
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    handleClick() {
      this.getConfig()
    },
    keyHandleChange(file, fileList) {
      console.log(file.raw)
      this.form.pfx_file = file.raw
    },
    certHandleChange(file, fileList) {
      this.form.ca_pfx_file = file.raw
    },
    cert31HandleChange(file, fileList) {
      this.form.oca31_pfx_file = file.raw
    },
    getConfig() {
      let query = {}
      if (this.activeName == 'hfpay') {
        query = { pay_type: 'hfpay' }
        getPaymentSetting(query).then((response) => {
          this.form = response.data.data
          this.form.is_open =
            response.data.data.is_open == 'true' || response.data.data.is_open == true
              ? true
              : false
        })
      }
    },
    onSubmit() {
      this.loading = true
      let query = {}
      if (this.activeName == 'hfpay') {
        query = {
          isUploadFile: true,
          pay_type: 'hfpay',
          mer_cust_id: this.form.mer_cust_id,
          acct_id: this.form.acct_id,
          pfx_password: this.form.pfx_password,
          pfx_file: this.form.pfx_file,
          ca_pfx_file: this.form.ca_pfx_file,
          oca31_pfx_file: this.form.oca31_pfx_file,
          is_open: this.form.is_open
        }
      } else {
        query = {
          pay_type: 'teegon',
          config: this.teegonForm
        }
      }
      setPaymentSetting(query)
        .then((response) => {
          this.$message({
            type: 'success',
            message: this.$t('ea670112.3b1083')
          })
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
        })
    }
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 10px;
  .frm-tips {
    color: #ff0000;
  }
}
</style>
