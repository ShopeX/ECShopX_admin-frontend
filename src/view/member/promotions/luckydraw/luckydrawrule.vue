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
  <el-col class="section section-white" :span="12">
    <div class="section-header with-border">抽奖规则配置</div>
    <div class="section-white content-padded">
      <el-form ref="form_content" label-width="80px">
        <el-form-item label="抽奖规则" prop="content">
          <el-input v-model="form_content.content" type="textarea" :rows="18" />
        </el-form-item>
      </el-form>
    </div>
    <div class="section-footer content-center">
      <el-button type="primary" @click="saveContent"> 保存 </el-button>
    </div>
    <br>
  </el-col>
</template>

<script>
import { setLuckydrawRules, getLuckydrawRules } from '../../../../api/promotions'
// 组件
import imgPicker from '@/components/imageselect'
export default {
  data() {
    return {
      form_content: {}
    }
  },
  mounted() {
    this.getLuckydrawRules()
  },
  methods: {
    saveContent() {
      setLuckydrawRules(this.form_content).then(res => {
        this.$message({
          message: '保存成功',
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    getLuckydrawRules() {
      getLuckydrawRules().then(res => {
        this.form_content = res.data.data
      })
    }
  }
}
</script>

<style scoped></style>
