<template>
  <div>
    <el-form ref="form" :model="form" label-position="left" label-width="100px">
      <div class="section-body">
        <el-form-item label="商城Logo">
          <SpImagePicker v-model="form.logo" size="small" />
        </el-form-item>
        <el-form-item label="背景图">
          <SpImagePicker v-model="form.background" />
        </el-form-item>
      </div>
      <div class="section-footer content-center">
        <el-button v-loading="loading" type="primary" @click="onSubmit"> 保存 </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { saveLoginPageSetting, getLoginPageSetting } from '@/api/webtemplate'
export default {
  data() {
    return {
      loading: false,
      form: {
        logo: '',
        background: ''
      }
    }
  },
  mounted() {
    getLoginPageSetting().then((res) => {
      this.form.logo = res.data.data.logo
      this.form.background = res.data.data.background
    })
  },
  methods: {
    onSubmit() {
      let params = {}
      this.loading = true

      params = {
        logo: this.form.logo,
        background: this.form.background
      }
      console.log(params)
      saveLoginPageSetting(params).then((response) => {
        if (response.data.data) {
          this.$message({
            message: '保存配置信息成功！',
            type: 'success'
          })
          this.loading = false
        } else {
          this.$message.error('配置信息失败，请确认是否正确填写内容！')
          this.loading = false
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss"></style>
