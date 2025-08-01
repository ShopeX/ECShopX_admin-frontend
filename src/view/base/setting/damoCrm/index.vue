<template>
  <SpPage v-loading="loading">
    <SpFilterForm
      ref="form"
      :model="form"
      label-width="100px"
    >
      <SpFilterFormItem label="appKey" prop="app_key">
        <el-input
          v-model="form.app_key"
          style="width: 300px"
        />
      </SpFilterFormItem>
      <SpFilterFormItem label="appSecret" prop="app_secret">
        <el-input
          v-model="form.app_secret"
          style="width: 300px"
        />
      </SpFilterFormItem>
      <SpFilterFormItem label="企业标识" prop="ent_sign">
        <el-input
          v-model="form.ent_sign"
          style="width: 300px"
        />
      </SpFilterFormItem>
      <SpFilterFormItem label="是否启用">
        <el-switch
          v-model="form.is_open"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </SpFilterFormItem>
      <div class="section-footer with-border content-center">
        <el-button
          v-loading="lock"
          type="primary"
          @click="onSubmit"
        >
          保存
        </el-button>
      </div>
    </SpFilterForm>
  </SpPage>
</template>

<script>
import {
  getDmcrmSetting,
  setDmcrmSetting
} from '@/api/third'

export default {
  data() {
    return {
      loading: false,
      lock: false,
      form: {
        app_key: '',
        app_secret: '',
        ent_sign: '',
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
      const resp = await getDmcrmSetting()
      // if (resp.data.data.is_open) {
      //   this.form.app_key = resp.data.data.app_key
      //   this.form.app_secret = resp.data.data.app_secret
      //   this.form.ent_sign = resp.data.data.ent_sign
      //   this.form.is_open = true
      // }
      this.form.app_key = resp.data.data.app_key
      this.form.app_secret = resp.data.data.app_secret
      this.form.ent_sign = resp.data.data.ent_sign
      this.form.is_open = resp.data.data.is_open
      this.loading = false
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.lock = true
          setDmcrmSetting(this.form).then(() => {
            this.lock = false
            this.$message({
              type: 'success',
              message: '保存成功'
            })
          }).catch(() => {
            this.lock = false
          })
        }
      })
    }
  }
}
</script>
