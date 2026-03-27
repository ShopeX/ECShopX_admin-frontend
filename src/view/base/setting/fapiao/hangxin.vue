<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-form ref="form" label-width="120px">
    <el-form-item :label="$t('fe598db4.c02ec9')">
      <el-switch
        v-model="form.hangxin_switch"
        :width="60"
        active-value="true"
        inactive-value="false"
        inactive-color="#ccc"
        :active-text="$t('fe598db4.cc42dd')"
        :inactive-text="$t('fe598db4.b15d91')"
        active-color="#13ce66"
      />
    </el-form-item>

    <el-form-item :label="$t('fe598db4.69d3e4')">
      <el-input v-model="form.NSRSBH" style="width: 300px" :placeholder="$t('fe598db4.fa7f31')" />
    </el-form-item>
    <el-form-item :label="$t('fe598db4.a52099')">
      <el-input v-model="form.FPQQLSH" style="width: 300px" :placeholder="$t('fe598db4.8a9ef0')" />
    </el-form-item>
    <el-form-item :label="$t('fe598db4.6671e1')">
      <el-input v-model="form.DSPTBM" style="width: 300px" :placeholder="$t('fe598db4.c721ec')" />
    </el-form-item>
    <el-form-item :label="$t('fe598db4.66c92c')">
      <el-input
        v-model="form.XHF_NSRSBH"
        style="width: 300px"
        :placeholder="$t('fe598db4.fbfb6e')"
      />
    </el-form-item>
    <el-form-item :label="$t('fe598db4.d618f1')">
      <el-input
        v-model="form.authorizationCode"
        style="width: 300px"
        :placeholder="$t('fe598db4.1ba9bd')"
      />
    </el-form-item>

    <div class="section-footer with-border content-center">
      <el-button type="primary" @click="onSubmit">{{ $t('fe598db4.59e7e6') }}</el-button>
    </div>
  </el-form>
</template>
<script>
import { getFapiaoset, saveFapiaoset } from '../../../../api/fapiao'

export default {
  data() {
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
  mounted() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      getFapiaoset(this.query).then((response) => {
        this.form = response.data.data
      })
    },
    onSubmit() {
      saveFapiaoset(this.form)
        .then((response) => {
          this.$message({ message: this.$t('fe598db4.3b1083'), type: 'success' })
          this.getInfo()
        })
        .catch()
    }
  }
}
</script>
<style lang="scss" scoped></style>
