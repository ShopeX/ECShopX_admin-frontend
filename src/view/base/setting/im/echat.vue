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
  <SpPage>
    <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="index"
        :label="item.name"
        :name="item.activeName"
      >
        <template>
          <el-form ref="form" label-width="130px">
            <el-form-item label="开启一洽客服">
              <el-switch
                v-model="form.is_open"
                active-value="true"
                inactive-value="false"
                inactive-color="#ccc"
                active-text="开启"
                inactive-text="关闭"
                active-color="#13ce66"
              />
            </el-form-item>
            <el-form-item label="一洽客服链接地址">
              <el-input v-model="form.echat_url" style="width: 300px" placeholder="请输入内容" />
            </el-form-item>

            <div class="section-footer with-border content-center">
              <el-button type="primary" @click="onSubmit"> 一洽客服保存 </el-button>
            </div>
          </el-form>
        </template>
      </el-tab-pane>
    </el-tabs>
  </SpPage>
</template>

<script>
import { getECahtSetting, saveEChatSetting } from '../../../../api/im'

export default {
  data() {
    return {
      loading: false,
      form: {
        is_open: '',
        echat_url: ''
      },
      activeName: 'first',
      tabList: [{ name: '客服配置', activeName: 'first' }]
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      getECahtSetting().then(response => {
        this.form = response.data.data
      })
    },
    onSubmit() {
      saveEChatSetting(this.form)
        .then(response => {
          this.$message({ message: '保存成功', type: 'success' })
          this.getInfo()
        })
        .catch()
    }
  }
}
</script>
<style lang="scss" scoped></style>
