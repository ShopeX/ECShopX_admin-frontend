<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-form ref="form" label-width="100px">
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
    <el-form-item :label="$t('53e6f865.435ed4')">
      <el-input v-model="form.mid" style="width: 500px" />
      <br>
    </el-form-item>
    <el-form-item :label="$t('53e6f865.bdbef9')">
      <el-input v-model="form.tid" style="width: 500px" :placeholder="$t('53e6f865.a11cc7')" />
      <br>
    </el-form-item>
    <el-form-item :label="$t('53e6f865.1abce7')">
      <el-input v-model="form.rate" style="width: 200px" :placeholder="$t('53e6f865.a11cc7')" />%
      <br>
      <span class="frm-tips">{{ $t('53e6f865.2e9852') }}</span>
    </el-form-item>
    <el-form-item :label="$t('53e6f865.b1bbef')">
      <span v-if="form.rsa_private_path"> {{ form.rsa_private_name }}</span>
      <el-upload class="" action="" :on-change="privateHandleChange" :auto-upload="false">
        <el-button size="small" type="primary">{{ $t('53e6f865.2c808b') }}</el-button>
      </el-upload>
      <span class="frm-tips" />
    </el-form-item>
    <el-form-item :label="$t('53e6f865.a81052')">
      <el-input v-model="form.password" style="width: 200px" :placeholder="$t('53e6f865.a11cc7')" />
      <br>
    </el-form-item>
    <el-form-item :label="$t('53e6f865.486605')">
      <span v-if="form.rsa_public_path"> {{ form.rsa_public_name }}</span>
      <el-upload class="" action="" :on-change="publicHandleChange" :auto-upload="false">
        <el-button size="small" type="primary">{{ $t('53e6f865.2c808b') }}</el-button>
      </el-upload>
      <span class="frm-tips" />
    </el-form-item>
    <el-form-item :label="$t('53e6f865.53c3dd')">
      <el-switch v-model="form.is_open" />
    </el-form-item>
    <div class="section-footer with-border content-center">
      <el-button v-loading="loading" type="primary" @click="onSubmit">
{{
        $t('53e6f865.be5fbb')
      }}
</el-button>
    </div>
  </el-form>
</template>
<script>
import { setPaymentSetting, getPaymentSetting } from '@/api/trade'
export default {
  data() {
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
        is_open: false
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
    privateHandleChange(file, fileList) {
      this.form.rsa_private = file.raw
    },
    publicHandleChange(file, fileList) {
      this.form.rsa_public = file.raw
    },
    getConfig() {
      let query = { pay_type: this.payType }
      getPaymentSetting(query).then((response) => {
        this.form = response.data.data
      })
    },
    onSubmit() {
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
        is_open: this.form.is_open
      }
      setPaymentSetting(query)
        .then((response) => {
          this.$message({
            type: 'success',
            message: this.$t('53e6f865.3b1083')
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
