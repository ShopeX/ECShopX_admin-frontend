<template>
  <el-form
    ref="form"
    label-width="100px"
  >
    <el-form-item label="sys_id">
      <el-input
        v-model="form.sys_id"
        style="width: 300px"
      />
      <br>
    </el-form-item>
    <el-form-item label="product_id">
      <el-input
        v-model="form.product_id"
        style="width: 300px"
      />
      <br>
    </el-form-item>
    <el-form-item label="商户的汇付ID">
      <el-input
        v-model="form.upper_huifu_id"
        style="width: 300px"
      />
      <br>
    </el-form-item>
    <el-form-item label="商户私钥">
      <el-input
        v-model="form.rsa_merch_private_key"
        style="width: 880px"
        type="textarea"
        :rows="5"
        placeholder="请输入内容"
      />
      <br>
      <span class="frm-tips">RSA2(SHA256)密钥 自己私钥</span>
    </el-form-item>
    <el-form-item label="汇付公钥">
      <el-input
        v-model="form.rsa_huifu_public_key"
        style="width: 880px"
        type="textarea"
        :rows="5"
        placeholder="请输入内容"
      />
      <br>
      <span class="frm-tips">RSA2(SHA256)密钥 汇付公钥</span>
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
import { setPaymentSetting, getPaymentSetting } from '../../../../api/trade'
export default {
  data () {
    return {
      activeName: 'bspay',
      loading: false,
      form: {
        sys_id: '',
        product_id: '',
        upper_huifu_id: '',
        rsa_merch_private_key: '',
        rsa_huifu_public_key: '',
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
    getConfig () {
      let query = { pay_type: 'bspay' }
      getPaymentSetting(query).then((response) => {
        this.form = response.data.data
      })
    },
    onSubmit () {
      this.loading = true
      let query = {
        isUploadFile: true,
        pay_type: 'bspay',
        sys_id: this.form.sys_id,
        product_id: this.form.product_id,
        upper_huifu_id: this.form.upper_huifu_id,
        rsa_merch_private_key: this.form.rsa_merch_private_key,
        rsa_huifu_public_key: this.form.rsa_huifu_public_key,
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
