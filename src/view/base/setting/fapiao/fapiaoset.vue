<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-form ref="form" label-width="100px">
    <!-- 2.0、发票开关：设置发票开关 -->
    <!-- 2.1、开票方名称：设置开票方名称 -->
    <!-- 2.2、税率：设置默认开票税率 -->
    <!-- 2.3、开票方税号：设置开票方税号 -->
    <!-- 2.4、开票方银行：设置开票方账号所属银行 -->
    <!-- 2.5、开票方银行账号：设置开票方银行账号 -->
    <!-- 2.6、开票方联系电话：设置开票方联系电话 -->
    <!-- 2.7、开票人：设置开票方联系人 -->
    <!-- 2.8、开票方联系地址：设置开票方联系地址 -->
    <el-form-item :label="$t('d24a4871.3f677c')">
      <el-switch
        v-model="form.fapiao_switch"
        :width="60"
        active-value="true"
        inactive-value="false"
        inactive-color="#ccc"
        :active-text="$t('d24a4871.cc42dd')"
        :inactive-text="$t('d24a4871.b15d91')"
        active-color="#13ce66"
      />
    </el-form-item>
    <el-form-item :label="$t('d24a4871.6c209b')" />
    <el-form-item :label="$t('d24a4871.811b67')">
      <el-input v-model="form.content" style="width: 500px" :placeholder="$t('d24a4871.a11cc7')" />
    </el-form-item>
    <el-form-item :label="$t('d24a4871.a24cea')">
      <el-input v-model="form.tax_rate" style="width: 500px" :placeholder="$t('d24a4871.a11cc7')" />
    </el-form-item>
    <el-form-item :label="$t('d24a4871.42a240')">
      <el-input
        v-model="form.registration_number"
        style="width: 500px"
        :placeholder="$t('d24a4871.a11cc7')"
      />
    </el-form-item>
    <el-form-item :label="$t('d24a4871.e189ce')">
      <el-input v-model="form.bankname" style="width: 500px" :placeholder="$t('d24a4871.a11cc7')" />
    </el-form-item>
    <el-form-item :label="$t('d24a4871.5c3060')">
      <el-input
        v-model="form.bankaccount"
        style="width: 500px"
        :placeholder="$t('d24a4871.a11cc7')"
      />
    </el-form-item>
    <el-form-item :label="$t('d24a4871.82fd4c')">
      <el-input
        v-model="form.company_phone"
        style="width: 500px"
        :placeholder="$t('d24a4871.a11cc7')"
      />
    </el-form-item>
    <el-form-item :label="$t('d24a4871.adf175')">
      <el-input
        v-model="form.user_name"
        style="width: 500px"
        :placeholder="$t('d24a4871.a11cc7')"
      />
    </el-form-item>
    <el-form-item :label="$t('d24a4871.8c1cc0')">
      <el-input
        v-model="form.company_address"
        style="width: 500px"
        :placeholder="$t('d24a4871.a11cc7')"
      />
    </el-form-item>

    <div class="section-footer with-border content-center">
      <el-button type="primary" @click="onSubmit">{{ $t('d24a4871.4dc84b') }}</el-button>
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
        fapiao_switch: '',
        content: '',
        tax_rate: '',
        registration_number: '',
        bankname: '',
        bankaccount: '',
        company_phone: '',
        user_name: '',
        company_address: '',
        registration_number: '',
        registration_number: '',
        type: 'fapiaoset'
      },
      query: {
        type: 'fapiaoset'
      }
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
      saveFapiaoset(this.form).then((response) => {})
    }
  }
}
</script>
<style lang="scss" scoped></style>
