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
  <div class="section section-white">
    <el-form ref="form" :model="form" label-position="left" label-width="120px">
      <div class="section-body">
        <template>
          <el-form-item label="购物车顶部营销语:">
            <el-input v-model="form.ad_title" required placeholder="" style="width: 100px" />
          </el-form-item>
        </template>
      </div>
      <div class="section-footer with-border content-center">
        <el-button type="primary" @click="save"> 保 存 </el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { getCartMarketingAd, setCartMarketingAd } from '@/api/trade'
export default {
  data() {
    return {
      form: {
        ad_title: ''
      }
    }
  },
  mounted() {
    getCartMarketingAd().then(res => {
      let setting = res.data.data
      if (setting.ad_title) {
        this.form.ad_title = setting.ad_title
      }
    })
  },
  methods: {
    save() {
      if (!this.form.ad_title) {
        this.$message({ message: '信息必填', type: 'error' })
        return
      }
      setCartMarketingAd(this.form).then(res => {
        this.$message({ message: '保存成功', type: 'success' })
      })
    }
  }
}
</script>
<style scoped lang="scss"></style>
