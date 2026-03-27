<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-form ref="form" :model="form" label-position="left" label-width="200px">
      <div class="section-body">
        <el-form-item :label="$t('d36c7c28.b04548')" class="title" />
        <el-form-item :label="$t('d36c7c28.de0720')">
          <el-switch v-model="form.data.point_url_is_open" />
        </el-form-item>
        <el-form-item :label="$t('d36c7c28.c23968')">
          <el-input v-model="form.data.point_app_id" type="text" style="width: 300px" />
        </el-form-item>
        <el-form-item :label="$t('d36c7c28.86a389')">
          <el-input v-model="form.data.point_page" type="text" style="width: 300px" />
        </el-form-item>
        <el-form-item :label="$t('d36c7c28.ebe017')" class="title" />
        <el-form-item :label="$t('d36c7c28.de0720')">
          <el-switch v-model="form.data.info_url_is_open" />
        </el-form-item>
        <el-form-item :label="$t('d36c7c28.c23968')">
          <el-input v-model="form.data.info_app_id" type="text" style="width: 300px" />
        </el-form-item>
        <el-form-item :label="$t('d36c7c28.86a389')">
          <el-input v-model="form.data.info_page" type="text" style="width: 300px" />
        </el-form-item>
      </div>
      <div class="section-footer content-center">
        <el-button v-loading="loading" type="primary" @click="saveConfig">
{{
          $t('d36c7c28.be5fbb')
        }}
</el-button>
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
    getParamByTempName(filter).then((res) => {
      if (res.data.data.list.length !== 0) {
        if (typeof res.data.data.list[0].params.data != 'undefined') {
          this.form = res.data.data.list[0].params.data
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
      savePageParams(param).then((res) => {
        if (res.data.data.status) {
          this.$message({
            message: this.$t('d36c7c28.3b1083'),
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
