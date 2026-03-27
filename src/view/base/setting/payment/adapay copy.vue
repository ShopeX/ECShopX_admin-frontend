<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-form ref="form" :model="form" label-width="150px" :rules="rules">
    <el-form-item label="App_ID" prop="app_id">
      <el-input v-model="form.app_id" style="width: 500px" />
    </el-form-item>
    <el-form-item :label="$t('9a737107.8c46a6')" prop="test_api_key">
      <el-input v-model="form.test_api_key" style="width: 500px" />
    </el-form-item>
    <el-form-item :label="$t('9a737107.291949')" prop="live_api_key">
      <el-input v-model="form.live_api_key" style="width: 500px" />
    </el-form-item>
    <el-form-item :label="$t('9a737107.d906ef')" prop="rsa_private_key">
      <el-input v-model="form.rsa_private_key" style="width: 880px" type="textarea" :rows="5" />
    </el-form-item>
    <el-form-item :label="$t('9a737107.53c3dd')" prop="is_open">
      <el-switch
        v-model="form.is_open"
        active-color="#13ce66"
        inactive-color="#ff4949"
        :active-value="true"
        :inactive-value="false"
      />
    </el-form-item>
    <div class="section-footer with-border content-center">
      <el-button v-loading="loading" type="primary" @click="onSubmit('form')">
{{
        $t('9a737107.be5fbb')
      }}
</el-button>
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
        app_id: { required: true, message: this.$t('9a737107.34ac4d'), trigger: 'blur' },
        test_api_key: { required: true, message: this.$t('9a737107.111180'), trigger: 'blur' },
        live_api_key: { required: true, message: this.$t('9a737107.5fc6f0'), trigger: 'blur' },
        rsa_private_key: { required: true, message: this.$t('9a737107.641d0a'), trigger: 'blur' },
        is_open: { required: true, message: this.$t('9a737107.708c9d'), trigger: 'blur' }
      }
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    async onSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { status } = await this.$api.adapay.postAdapayPaySetting({
            ...this.form,
            pay_type: 'adapay'
          })
          if (status) {
            this.$message.success(this.$t('9a737107.3b1083'))
            this.getConfig()
          } else {
            this.$message.error(this.$t('9a737107.6de920'))
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getConfig() {
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
