<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-form ref="form" label-width="100px">
    <el-form-item :label="$t('62b1cf9c.be151f')">
      <el-input v-model="form.app_id" style="width: 300px" /><span class="frm-tips">{{
        $t('62b1cf9c.ab69af')
      }}</span>
      <br />
      <span class="frm-tips">{{ $t('62b1cf9c.777b9b') }}</span>
    </el-form-item>
    <el-form-item :label="$t('62b1cf9c.47e254')">
      <el-input v-model="form.app_app_id" style="width: 300px" /><span class="frm-tips">{{
        $t('62b1cf9c.ccb91e')
      }}</span>
      <br />
      <span class="frm-tips">{{ $t('62b1cf9c.460b81') }}</span>
    </el-form-item>
    <el-form-item :label="$t('62b1cf9c.f173b7')">
      <el-input v-model="form.merchant_id" style="width: 300px" /><span class="frm-tips">{{
        $t('62b1cf9c.ab69af')
      }}</span>
      <br /><span class="frm-tips">{{ $t('62b1cf9c.ff00eb') }}</span>
    </el-form-item>
    <el-form-item :label="$t('62b1cf9c.6f5c56')">
      <el-input v-model="form.key" style="width: 300px" /><span class="frm-tips">{{
        $t('62b1cf9c.ab69af')
      }}</span>
      <br /><span class="frm-tips">{{ $t('62b1cf9c.a63cd4') }}</span>
    </el-form-item>
    <el-form-item :label="$t('62b1cf9c.a5e041')">
      <el-switch v-model="form.is_servicer" active-color="#13ce66" inactive-color="#ff4949" />
      <span class="frm-tips">{{ $t('62b1cf9c.167466') }}</span>
    </el-form-item>
    <el-form-item :label="$t('62b1cf9c.e2febe')">
      <el-input v-model="form.servicer_app_id" style="width: 300px" />
    </el-form-item>
    <el-form-item :label="$t('62b1cf9c.13f855')">
      <el-input v-model="form.servicer_merchant_id" style="width: 300px" />
    </el-form-item>
    <el-form-item :label="$t('62b1cf9c.9fa3f8')">
      <span v-if="form.cert_name"> {{ form.cert_name }}</span>
      <el-upload class="" action="" :on-change="certHandleChange" :auto-upload="false">
        <el-button size="small" type="primary">{{ $t('62b1cf9c.2c808b') }}</el-button>
      </el-upload>
      <span class="frm-tips">{{ $t('62b1cf9c.c58e48') }}</span>
    </el-form-item>
    <el-form-item :label="$t('62b1cf9c.34c0ad')">
      <span v-if="form.cert_key_url"> {{ form.cert_key_name }}</span>
      <el-upload class="" action="" :on-change="keyHandleChange" :auto-upload="false">
        <el-button size="small" type="primary">{{ $t('62b1cf9c.2c808b') }}</el-button>
      </el-upload>
      <span class="frm-tips">{{ $t('62b1cf9c.2af448') }}</span>
    </el-form-item>
    <el-form-item :label="$t('62b1cf9c.53c3dd')">
      <el-switch v-model="form.is_open" active-color="#13ce66" inactive-color="#ff4949" />
    </el-form-item>
    <div class="section-footer with-border content-center">
      <el-button v-loading="loading" type="primary" @click="onSubmit">
        {{ $t('62b1cf9c.be5fbb') }}
      </el-button>
    </div>
  </el-form>
</template>
<script>
import { setPaymentSetting, getPaymentSetting } from '../../../../api/trade'
export default {
  data() {
    return {
      activeName: 'wxpay',
      loading: false,
      teegonForm: {
        app_key: '',
        client_secret: '',
        is_open: ''
      },
      form: {
        app_id: '',
        app_app_id: '',
        merchant_id: '',
        key: '',
        is_servicer: false,
        servicer_merchant_id: '',
        servicer_app_id: '',
        cert: '',
        cert_key: '',
        is_open: true
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
    certHandleChange(file, fileList) {
      this.form.cert = file.raw
    },
    keyHandleChange(file, fileList) {
      this.form.cert_key = file.raw
    },
    getConfig() {
      let query = {}
      if (this.activeName == 'wxpay') {
        query = { pay_type: 'wxpay' }
        getPaymentSetting(query).then((response) => {
          let form =
            Array.isArray(response.data.data) && !response.data.data.length
              ? {}
              : response.data.data
          form.is_servicer = response.data.data.is_servicer == 'true' ? true : false
          form.is_open =
            response.data.data.is_open == 'true' || response.data.data.is_open == true
              ? true
              : false

          for (let key of Object.keys(form)) {
            this.$set(this.form, key, form[key])
          }
          console.log('this.form', this.form)
        })
      } else {
        query = { pay_type: 'teegon' }
        getPaymentSetting(query).then((response) => {
          this.teegonForm = response.data.data
        })
      }
    },
    onSubmit() {
      this.loading = true
      let query = {}
      if (this.activeName == 'wxpay') {
        query = {
          isUploadFile: true,
          pay_type: 'wxpay',
          app_id: this.form.app_id,
          app_app_id: this.form.app_app_id,
          merchant_id: this.form.merchant_id,
          key: this.form.key,
          is_servicer: this.form.is_servicer,
          servicer_merchant_id: this.form.servicer_merchant_id,
          servicer_app_id: this.form.servicer_app_id,
          is_open: this.form.is_open,
          cert: this.form.cert,
          cert_key: this.form.cert_key
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
            message: this.$t('62b1cf9c.3b1083')
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
