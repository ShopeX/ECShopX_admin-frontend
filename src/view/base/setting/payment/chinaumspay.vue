<template>
  <el-form
    ref="form"
    label-width="100px"
  >
    <!-- <el-form-item label="开发者ID">
      <el-input
        v-model="form.appid"
        style="width: 500px"
      />
      <br>
    </el-form-item>
    <el-form-item label="开发者key">
      <el-input
        v-model="form.appkey"
        style="width: 500px"
      />
      <br>
    </el-form-item> -->
    <el-form-item label="平台商户号">
      <el-input
        v-model="form.mid"
        style="width: 500px"
      />
      <br>
      <!-- <span class="frm-tips">APPID</span> -->
    </el-form-item>
    <el-form-item label="平台终端号">
      <el-input
        v-model="form.tid"
        style="width: 500px"
        placeholder="请输入内容"
      />
      <br>
    </el-form-item>
    <el-form-item label="费率">
      <el-input
        v-model="form.rate"
        style="width: 200px"
        placeholder="请输入内容"
      />%
      <br>
      <span class="frm-tips">收单手续费</span>
    </el-form-item>
    <el-form-item label="商户加签私钥">
      <span v-if="form.rsa_private_path"> {{ form.rsa_private_name }}</span>
      <el-upload
        class=""
        action=""
        :on-change="privateHandleChange"
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
      ></span>
    </el-form-item>
    <el-form-item label="密码">
      <el-input
        v-model="form.password"
        style="width: 200px"
        placeholder="请输入内容"
      />
      <br>
      <!-- <span class="frm-tips">收单手续费</span> -->
    </el-form-item>
    <el-form-item label="商户回盘验签公钥">
      <span v-if="form.rsa_public_path"> {{ form.rsa_public_name }}</span>
      <el-upload
        class=""
        action=""
        :on-change="publicHandleChange"
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
      ></span>
    </el-form-item>
    <el-form-item label="是否启用">
      <el-switch v-model="form.is_open" />
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
      activeName: 'chinaumspay',
      payType: 'chinaumspay',
      loading: false,
      form: {
        // appid: '',
        // appkey: '',
        mid: '',
        tid: '',
        rate: 0,
        rsa_private: '',
        password: '',
        rsa_public: '',
        is_open: false,
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
    privateHandleChange (file, fileList) {
      this.form.rsa_private = file.raw
    },
    publicHandleChange (file, fileList) {
      this.form.rsa_public = file.raw
    },
    getConfig () {
      let query = { pay_type: this.payType }
      getPaymentSetting(query).then((response) => {
        this.form = response.data.data
      })
    },
    onSubmit () {
      this.loading = true
      let query = {
        isUploadFile: true,
        pay_type: this.payType,
        // appid: this.form.appid,
        // appkey: this.form.appkey,
        mid: this.form.mid,
        tid: this.form.tid,
        rate: this.form.rate,
        rsa_private: this.form.rsa_private,
        password: this.form.password,
        rsa_public: this.form.rsa_public,
        is_open: this.form.is_open,
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
