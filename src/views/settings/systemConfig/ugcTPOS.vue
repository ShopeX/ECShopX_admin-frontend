<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div class="flex items-center mb-5">
      <span class="font-bold mr-5">第三方审核对接设置</span>
      <span class="text-gray-500 text-sm">请填写对接所需要的内容并点击保存</span>
    </div>

    <el-card class="mb-5">
      <SpFormPlus
        ref="form"
        v-model="form"
        v-loading="formLoad"
        :form-items="formItems"
        form-type="form"
        label-width="140px"
        :show-default-actions="false"
      />
    </el-card>

    <el-row class="btn-bar">
      <el-col>
        <el-button type="primary" @click="confirmHandle"> 确认 </el-button>
      </el-col>
    </el-row>
  </SpPage>
</template>
<script>
import { getUGCSetting, setUGCSetting } from '@/api/ugc'

export default {
  provide() {
    return {
      refresh: this.getFetch
    }
  },
  data() {
    return {
      formLoad: false,
      form: {
        enable: false,
        url: null,
        appid: null,
        appsecret: null
      }
    }
  },
  computed: {
    formItems() {
      return [
        {
          fieldName: 'enable',
          label: '开启第三方审核',
          component: 'switch',
          componentProps: {
            'active-color': '#13ce66'
          },
          tip: '开启后用户的笔记首先会经过机审。'
        },
        {
          fieldName: 'url',
          label: 'API接入地址',
          component: 'input',
          componentProps: {
            style: { width: '300px' },
            size: 'small'
          },
          tip: '内容检测API配置管理服务',
          rules: [{ required: true, message: '请填写接入地址', trigger: 'blur' }]
        },
        {
          fieldName: 'appid',
          label: 'AccessKeyID',
          component: 'input',
          componentProps: {
            style: { width: '300px' },
            size: 'small'
          },
          rules: [{ required: true, message: '请填写AccessKeyID', trigger: 'blur' }]
        },
        {
          fieldName: 'appsecret',
          label: 'AccessKeySecret',
          component: 'input',
          componentProps: {
            style: { width: '300px' },
            size: 'small'
          },
          rules: [{ required: true, message: '请填写AccessKeySecret', trigger: 'blur' }]
        }
      ]
    }
  },
  mounted() {
    this.getFetch()
  },
  methods: {
    getFetch() {
      this.formLoad = true
      getUGCSetting({ type: 'contentCheck' }).then(
        (res) => {
          var { data } = res.data
          var form = {
            enable: data['contentCheck_enable'] == '1',
            url: data['contentCheck_url'],
            appid: data['contentCheck_appid'],
            appsecret: data['contentCheck_appsecret']
          }
          this.form = form
          this.formLoad = false
        },
        (err) => {
          this.formLoad = false
        }
      )
    },
    formTrans() {
      const { form } = this
      var params = { type: 'contentCheck', setting: null }
      var formtext = {
        contentCheck_enable: form.enable ? '1' : '0',
        contentCheck_url: form.url,
        contentCheck_appid: form.appid,
        contentCheck_appsecret: form.appsecret
      }
      params.setting = JSON.stringify(formtext)
      //console.log('formTrans',params);
      return params
    },
    async confirmHandle() {
      try {
        await this.$refs.form.validate()
        var params = this.formTrans()
        //console.log('confirmHandle params',params);
        const res = await setUGCSetting(params)
        var { message } = res.data.data
        this.$message({
          type: 'success',
          message
        })
      } catch (error) {
        console.log('error submit!!')
        return false
      }
    }
  }
}
</script>
