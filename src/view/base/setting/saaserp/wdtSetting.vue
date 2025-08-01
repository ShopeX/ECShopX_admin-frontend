<template>
  <SpPage>
    <div v-loading="loading">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="sid" prop="sid">
          <el-input v-model="form.sid" style="width: 300px" />
        </el-form-item>
        <el-form-item label="appKey" prop="app_key">
          <el-input v-model="form.app_key" style="width: 300px" />
        </el-form-item>
        <el-form-item label="appSecret" prop="app_secret">
          <el-input v-model="form.app_secret" style="width: 300px" />
        </el-form-item>
        <el-form-item label="shopNo" prop="shop_no">
          <el-input v-model="form.shop_no" style="width: 300px" />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="form.is_open" active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>
        <div class="section-footer with-border content-center">
          <el-button v-loading="lock" type="primary" @click="onSubmit"> 保存 </el-button>
        </div>
      </el-form>
    </div>
  </SpPage>
</template>

<script>
import { getWdtErpSetting, setWdtErpSetting } from '@/api/third'

export default {
  data() {
    return {
      loading: false,
      lock: false,
      form: {
        sid: '',
        app_key: '',
        app_secret: '',
        shop_no: '',
        is_open: false
      }
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    async getConfig() {
      this.loading = true
      const resp = await getWdtErpSetting()
      if (resp.data.data.is_open) {
        this.form.sid = resp.data.data.sid
        this.form.app_key = resp.data.data.app_key
        this.form.app_secret = resp.data.data.app_secret
        this.form.shop_no = resp.data.data.shop_no
        this.form.is_open = true
      }
      this.loading = false
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.lock = true
          setWdtErpSetting(this.form)
            .then(() => {
              this.lock = false
              this.$message({
                type: 'success',
                message: '保存成功'
              })
            })
            .catch(() => {
              this.lock = false
            })
        }
      })
    }
  }
}
</script>
