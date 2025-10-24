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
<!--
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /app/src/view/base/setting/memberCenter/redirect.vue
 * @Date: 2020-11-19 15:44:11
 * @LastEditors: Arvin
 * @LastEditTime: 2020-11-19 22:37:53
-->
<template>
  <div>
    <el-form ref="form" :model="form" label-position="left" label-width="200px">
      <div class="section-body">
        <el-form-item label="“积分”点击跳转设置" class="title" />
        <el-form-item label="外部链接是否开启：">
          <el-switch v-model="form.data.point_url_is_open" />
        </el-form-item>
        <el-form-item label="外部链接小程序appid：">
          <el-input v-model="form.data.point_app_id" type="text" style="width: 300px" />
        </el-form-item>
        <el-form-item label="外部链接路径：">
          <el-input v-model="form.data.point_page" type="text" style="width: 300px" />
        </el-form-item>
        <el-form-item label="“个人信息”点击跳转设置" class="title" />
        <el-form-item label="外部链接是否开启：">
          <el-switch v-model="form.data.info_url_is_open" />
        </el-form-item>
        <el-form-item label="外部链接小程序appid：">
          <el-input v-model="form.data.info_app_id" type="text" style="width: 300px" />
        </el-form-item>
        <el-form-item label="外部链接路径：">
          <el-input v-model="form.data.info_page" type="text" style="width: 300px" />
        </el-form-item>
      </div>
      <div class="section-footer content-center">
        <el-button v-loading="loading" type="primary" @click="saveConfig"> 保存 </el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { savePageParams, getParamByTempName } from '@/api/wxa'
export default {
  data() {
    return {
      activeName: 'redirect',
      loading: false,
      form: {
        name: 'base',
        data: {
          point_url_is_open: true,
          point_app_id: '',
          point_page: '',
          info_url_is_open: true,
          info_app_id: '',
          info_page: ''
        }
      },
      pic: '',
      remnant: 0,
      fileList: [],
      imgDialog: false,
      isGetImage: false,
      pickerImgType: 'no_login'
    }
  },
  computed: {
    ...mapGetters(['wheight', 'wwidth', 'template_name'])
  },
  mounted() {
    let filter = {
      template_name: this.template_name,
      version: 'v1.0.1',
      page_name: 'member_center_redirect_setting'
    }
    getParamByTempName(filter).then(res => {
      if (res.data.data.list.length !== 0) {
        if (typeof res.data.data.list[0].params.data != 'undefined') {
          this.form.data = res.data.data.list[0].params.data
        }
      }
    })
  },
  methods: {
    handleClick(tab, event) {},
    // 保存设置
    saveConfig() {
      let param = {
        template_name: this.template_name,
        config: JSON.stringify([this.form]),
        page_name: 'member_center_redirect_setting'
      }
      savePageParams(param).then(res => {
        if (res.data.data.status) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.title {
  .el-form-item__label {
    font-size: 16px !important;
    font-weight: bold !important;
  }
}
</style>
