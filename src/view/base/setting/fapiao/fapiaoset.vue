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
    <el-form-item label="发票开关">
      <el-switch
        v-model="form.fapiao_switch"
        :width="60"
        active-value="true"
        inactive-value="false"
        inactive-color="#ccc"
        active-text="开启"
        inactive-text="关闭"
        active-color="#13ce66"
      />
    </el-form-item>
    <!-- 开票方信息  -->
    <el-form-item label="【开票方】" />
    <el-form-item label="名称(1)">
      <el-input v-model="form.content" style="width: 500px" placeholder="请输入内容" />
    </el-form-item>
    <el-form-item label="税率(2)">
      <el-input v-model="form.tax_rate" style="width: 500px" placeholder="请输入内容" />
    </el-form-item>
    <el-form-item label="税号(3)">
      <el-input v-model="form.registration_number" style="width: 500px" placeholder="请输入内容" />
    </el-form-item>
    <el-form-item label="开户银行(4)">
      <el-input v-model="form.bankname" style="width: 500px" placeholder="请输入内容" />
    </el-form-item>
    <el-form-item label="银行账号(5)">
      <el-input v-model="form.bankaccount" style="width: 500px" placeholder="请输入内容" />
    </el-form-item>
    <el-form-item label="联系电话(6)">
      <el-input v-model="form.company_phone" style="width: 500px" placeholder="请输入内容" />
    </el-form-item>
    <el-form-item label="开票人员(7)">
      <el-input v-model="form.user_name" style="width: 500px" placeholder="请输入内容" />
    </el-form-item>
    <el-form-item label="联系地址(8)">
      <el-input v-model="form.company_address" style="width: 500px" placeholder="请输入内容" />
    </el-form-item>

    <div class="section-footer with-border content-center">
      <el-button type="primary" @click="onSubmit"> 发票配置保存 </el-button>
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
      getFapiaoset(this.query).then(response => {
        this.form = response.data.data
      })
    },
    onSubmit() {
      saveFapiaoset(this.form).then(response => {})
    }
  }
}
</script>
<style lang="scss" scoped></style>
