<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-form ref="form" label-width="100px">
    <el-form-item :label="$t('97689203.edbcda')">
      <el-input v-model="form.app_id" style="width: 300px" />
      <br />
      <span class="frm-tips">{{ $t('97689203.ec227a') }}</span>
    </el-form-item>
    <el-form-item :label="$t('97689203.c8ad33')">
      <el-input
        v-model="form.ali_public_key"
        type="textarea"
        :rows="5"
        :placeholder="$t('97689203.a11cc7')"
      />
      <br />
      <span class="frm-tips">{{ $t('97689203.28b4cb') }}</span>
    </el-form-item>
    <el-form-item :label="$t('97689203.7e99e0')">
      <el-input
        v-model="form.private_key"
        type="textarea"
        :rows="5"
        :placeholder="$t('97689203.a11cc7')"
      />
      <br />
      <span class="frm-tips">{{ $t('97689203.2b4b9b') }}</span>
    </el-form-item>
    <el-form-item :label="$t('97689203.53c3dd')">
      <el-switch v-model="form.is_open" />
    </el-form-item>
    <el-form-item :label="$t('97689203.947d98')">
      <span class="frm-tips"
        >{{ $t('97689203.ac8b9f')
        }}<a
          href="https://b.alipay.com/signing/productDetail.htm?productId=I1011000290000001001"
          target="_blank"
          >{{ $t('97689203.953f30') }}</a
        ></span
      >
    </el-form-item>
    <div class="section-footer with-border content-center">
      <el-button v-loading="loading" type="primary" @click="onSubmit">
        {{ $t('97689203.be5fbb') }}
      </el-button>
    </div>
  </el-form>
</template>
<script>
import { setPaymentSetting, getPaymentSetting } from '../../../../api/trade'
export default {
  data() {
    return {
      activeName: 'alipay',
      loading: false,
      form: {
        app_id: '',
        key: '',
        is_open: false,
        ali_public_key: '',
        private_key: ''
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
    getConfig() {
      let query = { pay_type: 'alipay' }
      getPaymentSetting(query).then((response) => {
        this.form = response.data.data
      })
    },
    onSubmit() {
      this.loading = true
      let query = {
        isUploadFile: true,
        pay_type: 'alipay',
        app_id: this.form.app_id,
        private_key: this.form.private_key,
        is_open: this.form.is_open,
        ali_public_key: this.form.ali_public_key
      }
      setPaymentSetting(query)
        .then((response) => {
          this.$message({
            type: 'success',
            message: this.$t('97689203.3b1083')
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
