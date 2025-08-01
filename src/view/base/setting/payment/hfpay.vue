<template>
  <el-form ref="form" label-width="100px">
    <el-form-item label="商户客户号">
      <el-input v-model="form.mer_cust_id" style="width: 300px" />
      <br>
      <span class="frm-tips">汇付生成的商户唯一标志：mer_cust_id</span>
    </el-form-item>
    <el-form-item label="商户账户号">
      <el-input v-model="form.acct_id" style="width: 300px" />
      <br>
      <span class="frm-tips">汇付生成的唯一标志：acct_id</span>
    </el-form-item>
    <el-form-item label="证书密钥">
      <el-input v-model="form.pfx_password" style="width: 300px" />
    </el-form-item>

    <el-form-item label="商户证书">
      <span v-if="form.pfx_file_url"> {{ form.pfx_file_name }}</span>
      <el-upload class="" action="" :on-change="keyHandleChange" :auto-upload="false">
        <el-button size="small" type="primary"> 点击上传 </el-button>
      </el-upload>
      <span class="frm-tips">汇付下发的证书，此处换成商户自己的证书 .pfx 格式 加签使用</span>
    </el-form-item>

    <el-form-item label="CA证书">
      <span v-if="form.ca_pfx_file_url"> {{ form.ca_pfx_file_name }}</span>
      <el-upload class="" action="" :on-change="certHandleChange" :auto-upload="false">
        <el-button size="small" type="primary"> 点击上传 </el-button>
      </el-upload>
      <span class="frm-tips">汇付下发的.cer证书 ，需要一对证书 解签使用</span>
    </el-form-item>
    <el-form-item label="OCA31证书">
      <span v-if="form.oca31_pfx_file_url"> {{ form.oca31_pfx_file_name }}</span>
      <el-upload class="" action="" :on-change="cert31HandleChange" :auto-upload="false">
        <el-button size="small" type="primary"> 点击上传 </el-button>
      </el-upload>
      <span class="frm-tips">汇付下发的.cer证书 ，需要一对证书 解签使用</span>
    </el-form-item>

    <el-form-item label="是否启用">
      <el-switch v-model="form.is_open" active-color="#13ce66" inactive-color="#ff4949" />
    </el-form-item>

    <div class="section-footer with-border content-center">
      <el-button v-loading="loading" type="primary" @click="onSubmit"> 保存 </el-button>
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
        getPaymentSetting(query).then(response => {
          this.form = response.data.data
          this.form.is_open = response.data.data.is_open == 'true' ? true : false
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
        .then(response => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.loading = false
        })
        .catch(error => {
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
