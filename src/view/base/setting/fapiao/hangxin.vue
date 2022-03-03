<template>
  <el-form
    ref="form"
    label-width="120px"
  >
    <el-form-item label="航信开关">
      <el-switch
        v-model="form.hangxin_switch"
        :width="60"
        active-value="true"
        inactive-value="false"
        inactive-color="#ccc"
        active-text="开启"
        inactive-text="关闭"
        active-color="#13ce66"
      />
    </el-form-item>

    <el-form-item label="开票方识别号1">
      <el-input
        v-model="form.NSRSBH"
        style="width: 300px"
        placeholder="纳税人识别号..."
      />
    </el-form-item>
    <el-form-item label="唯一流水号2">
      <el-input
        v-model="form.FPQQLSH"
        style="width: 300px"
        placeholder="发票请求唯一流水号..."
      />
    </el-form-item>
    <el-form-item label="平台编码3">
      <el-input
        v-model="form.DSPTBM"
        style="width: 300px"
        placeholder="平台编码..."
      />
    </el-form-item>
    <el-form-item label="销货方识别号4">
      <el-input
        v-model="form.XHF_NSRSBH"
        style="width: 300px"
        placeholder="销货方识别号..."
      />
    </el-form-item>
    <el-form-item label="纳税人授权码5">
      <el-input
        v-model="form.authorizationCode"
        style="width: 300px"
        placeholder="纳税人授权码..."
      />
    </el-form-item>

    <div class="section-footer with-border content-center">
      <el-button
        type="primary"
        @click="onSubmit"
      >
        航信配置保存
      </el-button>
    </div>
  </el-form>
</template>
<script>
import { getFapiaoset, saveFapiaoset } from '../../../../api/fapiao'

export default {
  data () {
    return {
      loading: false,
      form: {
        hangxin_switch: '',
        hangxin_tax_no: '',
        hangxin_auth_code: ''
      },
      query: {}
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      getFapiaoset(this.query).then((response) => {
        this.form = response.data.data
      })
    },
    onSubmit () {
      saveFapiaoset(this.form)
        .then((response) => {
          this.$message({ message: '保存成功', type: 'success' })
          this.getInfo()
        })
        .catch()
    }
  }
}
</script>
<style lang="scss" scoped></style>
