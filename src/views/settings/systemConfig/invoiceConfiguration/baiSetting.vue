<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpFormPlus
      ref="form"
      v-model="form"
      :form-items="formItems"
      form-type="form"
      :show-default-actions="false"
    />
    <div class="section-footer with-border content-center">
      <el-button type="primary" @click="onSaveConfig">保存配置</el-button>
    </div>
  </SpPage>
</template>

<script>
import api from '@/api'
export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
        appKey: '',
        appSecret: '',
        orgAuthCode: '',
        taxNo: ''
      }
    }
  },
  computed: {
    formItems() {
      return [
        {
          fieldName: '__group_title',
          component: 'group',
          label: '百望云发票'
        },
        {
          fieldName: 'username',
          label: '用户名',
          component: 'input',
          formItemClass: 'w-1/2',
          componentProps: {
            placeholder: '请输入用户名'
          },
          rules: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
        },
        {
          fieldName: 'password',
          label: '密码',
          component: 'input',
          formItemClass: 'w-1/2',
          componentProps: {
            placeholder: '请输入密码',
            type: 'password'
          },
          rules: [{ required: true, message: '请输入密码', trigger: 'blur' }]
        },
        {
          fieldName: 'appKey',
          label: 'appKey',
          component: 'input',
          formItemClass: 'w-1/2',
          componentProps: {
            placeholder: '请输入appKey'
          },
          rules: [{ required: true, message: '请输入appKey', trigger: 'blur' }]
        },
        {
          fieldName: 'appSecret',
          label: 'appSecret',
          component: 'input',
          formItemClass: 'w-1/2',
          componentProps: {
            placeholder: '请输入appSecret'
          },
          rules: [{ required: true, message: '请输入appSecret', trigger: 'blur' }]
        },
        {
          fieldName: 'orgAuthCode',
          label: '用户盐值',
          component: 'input',
          formItemClass: 'w-1/2',
          componentProps: {
            placeholder: '请输入用户盐值'
          },
          rules: [{ required: true, message: '请输入用户盐值', trigger: 'blur' }]
        },
        {
          fieldName: 'taxNo',
          label: '机构税号',
          component: 'input',
          formItemClass: 'w-1/2',
          componentProps: {
            placeholder: '请输入机构税号'
          },
          rules: [{ required: true, message: '请输入机构税号', trigger: 'blur' }]
        }
      ]
    }
  },
  mounted() {
    this.getDeatl()
  },
  methods: {
    getDeatl() {
      api.financial.getBaiInvoiceSetting(this.id).then((res) => {
        this.form = {
          username: res.username || '',
          password: res.password || '',
          appKey: res.appKey || '',
          appSecret: res.appSecret || '',
          orgAuthCode: res.orgAuthCode || '',
          taxNo: res.taxNo || ''
        }
      })
    },
    async onSaveConfig() {
      try {
        await this.$refs.form.validate()
        await api.financial.setBaiInvoiceSetting({
          ...this.form
        })
        this.$message.success('保存成功')
      } catch (error) {
        //验证失败
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
