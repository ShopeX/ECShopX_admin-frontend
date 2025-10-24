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
  <div v-loading="loading" class="section-white content-padded">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="充值协议" prop="content">
        <!-- <el-input type="textarea" v-model="form.content" :rows='18'></el-input> -->
        <SpRichText v-model="form.content" />
      </el-form-item>
      <div class="section-footer with-border content-center">
        <el-button type="primary" @click="save"> 保存 </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { setRechargeAgreement, getRechargeAgreementByCompanyId } from '../../../api/deposit'
export default {
  props: ['getStatus'],
  data() {
    return {
      loading: false,
      form: {
        content: ''
      },
      rules: {
        content: [{ required: true, message: '请输入充值协议', trigger: 'blur' }]
      }
    }
  },
  watch: {
    getStatus(newVal, oldVal) {
      if (newVal) {
        this.getAgreement()
      }
    }
  },
  methods: {
    save() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          setRechargeAgreement(this.form).then(res => {
            this.$message({
              message: '保存成功',
              type: 'success',
              duration: 5 * 1000
            })
          })
        }
      })
    },
    getAgreement() {
      this.loading = true
      getRechargeAgreementByCompanyId().then(res => {
        this.form.content = res.data.data.content
        this.loading = false
      })
    },
    updateContent(data) {
      this.form.content = data
    }
  }
}
</script>

<style scoped lang="scss">
.agreement-content {
  display: inline-block;
  overflow: hidden;
  word-break: break-all;
  width: 80%;
}
</style>
