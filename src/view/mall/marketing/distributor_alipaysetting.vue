<template>
  <el-form
    ref="form"
    label-width="100px"
  >
    <el-form-item label="当前店铺名称">
      <span>{{name}}</span>
    </el-form-item>
    <el-form-item label="合作者PID">
      <el-input
        v-model="form.app_id"
        style="width: 300px"
      />
      <br>
      <span class="frm-tips">APPID</span>
    </el-form-item>
    <el-form-item label="支付宝公钥">
      <el-input
        v-model="form.ali_public_key"
        type="textarea"
        :rows="5"
        placeholder="请输入内容"
      />
      <br>
      <span class="frm-tips">RSA2(SHA256)密钥 支付宝公钥</span>
    </el-form-item>
    <el-form-item label="应用私钥">
      <el-input
        v-model="form.private_key"
        type="textarea"
        :rows="5"
        placeholder="请输入内容"
      />
      <br>
      <span class="frm-tips">RSA2(SHA256)密钥 自己私钥</span>
    </el-form-item>
    <el-form-item label="温馨提示">
      <span
        class="frm-tips"
      >您绑定的企业支付宝账号必须开通<a
        href="https://b.alipay.com/signing/productDetail.htm?productId=I1011000290000001001"
        target="_blank"
      >手机网站支付</a></span>
    </el-form-item>
    <div class="section-footer with-border content-center">
      <el-button
        v-loading="loading"
        type="primary"
        @click="onSubmit"
      >
        保存
      </el-button>
    </div>
  </el-form>
</template>
<script>
import { setPaymentSetting, getPaymentSetting } from '@/api/trade'
export default {
  data () {
    return {
      activeName: 'alipay',
      loading: false,
      form: {
        distributors: 0,
        app_id: '',
        ali_public_key: '',
        private_key: '',
        is_open: true
      }
    }
  },
  mounted () {
    this.getConfig()
  },
  methods: {
    handleClick () {
      this.getConfig()
    },
    certHandleChange (file, fileList) {
      this.form.cert = file.raw
    },
    keyHandleChange (file, fileList) {
      this.form.cert_key = file.raw
    },
    getConfig () {
      const { distributor_id, name } = this.$route.query
      this.name = name
      this.form.distributor_id = distributor_id

      let query = { pay_type: 'alipay', distributor_id: distributor_id }
      getPaymentSetting(query).then((response) => {
        let form =
          Array.isArray(response.data.data) && !response.data.data.length
            ? {}
            : response.data.data
        for (let key of Object.keys(form)) {
          this.$set(this.form, key, form[key])
        }
      })
    },
    onSubmit () {
      this.loading = true
      let query = {
        distributor_id: this.form.distributor_id,
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
            message: '保存成功'
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
