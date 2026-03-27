<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-form ref="form" label-width="100px">
    <el-form-item label="AppId">
      <el-input v-model="form.app_id" style="width: 300px" />
      <br>
    </el-form-item>
    <el-form-item label="AppSecret">
      <el-input
        v-model="form.app_secret"
        type="textarea"
        :rows="5"
        :placeholder="$t('e86b4ef3.a11cc7')"
      />
      <br>
    </el-form-item>
    <el-form-item :label="$t('e86b4ef3.eb4ed4')">
      <el-input
        v-model="form.payment_channel_id"
        type="textarea"
        :rows="5"
        :placeholder="$t('e86b4ef3.a11cc7')"
      />
      <br>
      <span class="frm-tips">{{ $t('e86b4ef3.fc6076') }}</span>
    </el-form-item>
    <!-- <el-form-item label="温馨提示">
      <span class="frm-tips">您绑定的企业支付宝账号必须开通<a href="https://b.alipay.com/signing/productDetail.htm?productId=I1011000290000001001" target="_blank">手机网站支付</a></span>
    </el-form-item> -->
    <div class="section-footer with-border content-center">
      <el-button v-loading="loading" type="primary" @click="onSubmit">
{{
        $t('e86b4ef3.be5fbb')
      }}
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
        app_secret: '',
        payment_channel_id: '',
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
    getConfig() {
      let query = { pay_type: 'ebuy' }
      getPaymentSetting(query).then((response) => {
        this.form = response.data.data
      })
    },
    onSubmit() {
      this.loading = true
      this.form.pay_type = 'ebuy'
      setPaymentSetting(this.form)
        .then((response) => {
          this.$message({
            type: 'success',
            message: this.$t('e86b4ef3.3b1083')
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
