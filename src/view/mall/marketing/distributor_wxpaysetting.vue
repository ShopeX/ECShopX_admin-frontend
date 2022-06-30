<template>
  <el-form
    ref="form"
    label-width="100px"
  >
  <el-form-item label="当前店铺名称">
      <span>{{name}}</span>
    </el-form-item>
    <el-form-item label="公众账号ID">
      <el-input
        v-model="form.app_id"
        style="width: 300px"
      />
      <br>
      <span class="frm-tips">微信支付分配的公众账号ID（企业号corpid即为此appId）</span>
    </el-form-item>
    <el-form-item label="APP应用ID">
      <el-input
        v-model="form.app_app_id"
        style="width: 300px"
      />
      <br>
      <span
        class="frm-tips"
      >微信开放平台审核通过的应用APPID（请登录open.weixin.qq.com查看，注意与公众号的APPID不同）</span>
    </el-form-item>
    <el-form-item label="商户号">
      <el-input
        v-model="form.merchant_id"
        style="width: 300px"
      />
    </el-form-item>
    <el-form-item label="API密钥">
      <el-input
        v-model="form.key"
        style="width: 300px"
      />
    </el-form-item>
    <el-form-item label="是否特约商户">
      <el-switch
        v-model="form.is_servicer"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
      <span class="frm-tips">如是特约商户，请联系您的服务商获取如下两个参数</span>
    </el-form-item>
    <el-form-item label="服务商APPID">
      <el-input
        v-model="form.servicer_app_id"
        style="width: 300px"
      />
    </el-form-item>
    <el-form-item label="服务商商户号">
      <el-input
        v-model="form.servicer_merchant_id"
        style="width: 300px"
      />
    </el-form-item>
    <el-form-item label="商户证书">
      <span v-if="form.cert_name"> {{ form.cert_name }}</span>
      <el-upload
        class=""
        action=""
        :on-change="certHandleChange"
        :auto-upload="false"
      >
        <el-button
          size="small"
          type="primary"
        >
          点击上传
        </el-button>
      </el-upload>
      <span
        class="frm-tips"
      >微信商户平台(pay.weixin.qq.com)-->账户设置-->API安全-->证书下载 apiclient_cert.pem</span>
    </el-form-item>
    <el-form-item label="商户证书秘钥">
      <span v-if="form.cert_key_url"> {{ form.cert_key_name }}</span>
      <el-upload
        class=""
        action=""
        :on-change="keyHandleChange"
        :auto-upload="false"
      >
        <el-button
          size="small"
          type="primary"
        >
          点击上传
        </el-button>
      </el-upload>
      <span
        class="frm-tips"
      >微信商户平台(pay.weixin.qq.com)-->账户设置-->API安全-->证书下载 apiclient_key.pem</span>
    </el-form-item>
    <!-- <el-form-item label="是否启用">
      <el-switch
        v-model="form.is_open"
        active-color="#13ce66"
        inactive-color="#ff4949"
      />
    </el-form-item> -->
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
      loading: false,
      name: '',
      form: {
        distributors: 0,
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
      let query = {}
      query = { pay_type: 'wxpay', distributor_id: distributor_id }
      getPaymentSetting(query).then((response) => {
        let form =
          Array.isArray(response.data.data) && !response.data.data.length
            ? {}
            : response.data.data
        form.is_servicer = response.data.data.is_servicer == 'true' ? true : false
        form.is_open = response.data.data.is_open == 'true' ? true : false

        for (let key of Object.keys(form)) {
          this.$set(this.form, key, form[key])
        }
        console.log('this.form', this.form)
      })
    },
    onSubmit () {
      this.loading = true
      let query = {}
      query = {
        distributor_id: this.form.distributor_id,
        isUploadFile: true,
        pay_type: 'wxpay',
        app_id: this.form.app_id,
        app_app_id: this.form.app_app_id,
        merchant_id: this.form.merchant_id,
        key: this.form.key,
        is_servicer: this.form.is_servicer,
        servicer_merchant_id: this.form.servicer_merchant_id,
        servicer_app_id: this.form.servicer_app_id,
        // is_open: this.form.is_open,
        is_open: true,
        cert: this.form.cert,
        cert_key: this.form.cert_key
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
