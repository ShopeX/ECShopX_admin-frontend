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
<style scoped lang="scss">
.upload-box {
  width: 120px;
  height: 120px;
  align-items: center;
  justify-content: center;
  display: flex;
  border: 1px dashed #ccc;
  border-radius: 5px;
  img {
    width: 100%;
  }
}
.icon-camera {
  font-size: 40px;
  color: #d7d7d7;
}
.form-item-tip {
  font-size: 13px;
  color: #999;
  line-height: initial;
}
</style>

<template>
  <el-card class="el-card--normal">
    <div slot="header">
      <div>店铺图片<span class="frm-tips">（只能上传jpg/png文件，且不超过2M）</span></div>
    </div>
    <el-form label-width="120px" :inline="true">
      <el-form-item label="店铺Logo">
        <div class="upload-box" @click="handleImgPicker('logo')">
          <img v-if="content.baseForm.logo" :src="content.baseForm.logo" class="avatar">
          <i v-else class="iconfont icon-camera" />
        </div>
        <div class="form-item-tip">推荐尺寸：140px * 140px</div>
      </el-form-item>
      <el-form-item label="商铺背景">
        <div class="upload-box" @click="handleImgPicker('banner')">
          <img v-if="content.baseForm.banner" :src="content.baseForm.banner" class="avatar">
          <i v-else class="iconfont icon-camera" />
        </div>
        <div class="form-item-tip">推荐尺寸：400px * 260px</div>
      </el-form-item>
    </el-form>

    <imgPicker
      :dialog-visible="imgDialog"
      :sc-status="isGetImage"
      @chooseImg="pickImg"
      @closeImgDialog="closeImgDialog"
    />
  </el-card>
</template>

<script>
import imgPicker from '@/components/imageselect'
export default {
  components: {
    imgPicker
  },
  inject: ['content'],
  data() {
    return {
      pickerImgType: 'logo',
      imgDialog: false,
      isGetImage: false,
      form: {
        logo: '',
        banner: ''
      }
    }
  },
  mounted() {},
  methods: {
    closeImgDialog() {
      this.imgDialog = false
      this.isGetImage = false
    },
    handleImgPicker: function (pickerImgType) {
      this.pickerImgType = pickerImgType
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg(data) {
      if (this.pickerImgType == 'logo') {
        this.content.baseForm.logo = data.url
      } else {
        this.content.baseForm.banner = data.url
      }
      this.imgDialog = false
    }
  }
}
</script>
