<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <el-form ref="form" :model="form" label-width="150px" :rules="rules">
    <el-form-item label="App_ID" prop="app_id">
      <el-input v-model="form.app_id" style="width: 500px" />
    </el-form-item>
    <el-form-item label="mock模式API_KEY" prop="test_api_key">
      <el-input v-model="form.test_api_key" style="width: 500px" />
    </el-form-item>
    <el-form-item label="prod模式API_KEY" prop="live_api_key">
      <el-input v-model="form.live_api_key" style="width: 500px" />
    </el-form-item>
    <el-form-item label="商户RSA私钥" prop="rsa_private_key">
      <el-input v-model="form.rsa_private_key" style="width: 880px" type="textarea" :rows="5" />
    </el-form-item>
    <el-form-item label="是否启用" prop="is_open">
      <el-switch
        v-model="form.is_open"
        active-color="#13ce66"
        inactive-color="#ff4949"
        :active-value="true"
        :inactive-value="false"
      />
    </el-form-item>
    <div class="section-footer with-border content-center">
      <el-button v-loading="loading" type="primary" @click="onSubmit('form')"> 保存 </el-button>
    </div>
  </el-form>
</template>
<script>
import { getPaymentSetting } from '@/api/trade'

export default {
  data() {
    return {
      activeName: 'adapay',
      loading: false,
      form: {
        app_id: '',
        test_api_key: '',
        live_api_key: '',
        rsa_private_key: '',
        is_open: false
      },
      rules: {
        app_id: { required: true, message: '请输入App_ID', trigger: 'blur' },
        test_api_key: { required: true, message: '请输入mock模式API_KEY', trigger: 'blur' },
        live_api_key: { required: true, message: '请输入prod模式API_KEY', trigger: 'blur' },
        rsa_private_key: { required: true, message: '请输入商户RSA私钥', trigger: 'blur' },
        is_open: { required: true, message: '请选择', trigger: 'blur' }
      }
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    async onSubmit(formName) {
      this.$refs[formName].validate(async valid => {
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
    getConfig() {
      let query = { pay_type: 'adapay' }
      getPaymentSetting(query).then(response => {
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
