<template>
  <el-form
    ref="form"
    :model="form"
    label-width="100px"
    :rules="rules"
  >
    <el-form-item
      label="API_KEY"
      prop="api_key"
    >
      <el-input
        v-model="form.api_key"
        style="width: 500px"
      />
    </el-form-item>
    <el-form-item
      label="接口RSA公钥"
      prop="agent_public_key"
    >
      <el-input
        v-model="form.agent_public_key"
        style="width: 880px"
        type="textarea"
        :rows="5"
        placeholder="请输入内容"
      />
      <br>
      <span class="frm-tips">请确保您上传的RSA公钥的正确性，以免影响交易</span>
    </el-form-item>
    <el-form-item
      label="商户RSA公钥"
      prop="public_key"
    >
      <div class="flex">
        <el-input
          v-model="form.public_key"
          style="width: 880px"
          type="textarea"
          :rows="5"
        />
        <br>
        <span class="frm-tips">请确保您上传的RSA公钥的正确性，以免影响交易</span>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="createKey"
      >
        生成RSA秘钥
      </el-button>
      <p class="tips">
        您可以选择直接生成RSA密钥
      </p>
    </el-form-item>
    <el-form-item
      label="是否启用"
      prop="is_open"
    >
      <el-switch
        v-model="form.is_open"
        active-color="#13ce66"
        inactive-color="#ff4949"
        :active-value="true"
        :inactive-value="false"
      />
    </el-form-item>
    <div class="section-footer with-border content-center">
      <el-button
        v-loading="loading"
        type="primary"
        @click="onSubmit('form')"
      >
        保存
      </el-button>
    </div>
  </el-form>
</template>
<script>
import { getPaymentSetting } from '@/api/trade'

export default {
  data () {
    return {
      activeName: 'alipay',
      loading: false,
      form: {
        api_key: '',
        agent_public_key: '',
        public_key: '',
        private_key: '',
        is_open: false
      },
      rules: {
        api_key: { required: true, message: '请输入API_KEY', trigger: 'blur' },
        agent_public_key: { required: true, message: '请输入接口RSA公钥', trigger: 'blur' },
        public_key: { required: true, message: '请输入商户RSA公钥', trigger: 'blur' },
        private_key: { required: true, message: '请生成', trigger: 'blur' },
        is_open: { required: true, message: '请选择', trigger: 'blur' }
      }
    }
  },
  mounted () {
    this.getConfig()
  },
  methods: {
    async createKey () {
      const { private_key, public_key } = await this.$api.adapay.getAdapayPaySettingKey()
      if (private_key && public_key) {
        this.form.public_key = public_key
        this.form.private_key = private_key
        this.$notify({
          title: '成功',
          type: 'success',
          duration: 2000
        })
      }
    },
    async onSubmit (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { status } = await this.$api.adapay.postAdapayPaySetting({
            ...this.form,
            pay_type: 'adapay'
          })
          if (status) {
            this.$message.success('保存成功')
            this.getConfig()
          } else {
            this.$message.error('保存失败')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getConfig () {
      let query = { pay_type: 'adapay' }
      getPaymentSetting(query).then((response) => {
        if (response.data.data.length == 0) {
          return
        } else {
          this.form = { ...this.form, ...response.data.data }
        }
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
