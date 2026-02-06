<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage class="mb-2.5">
    <div class="mb-5 p-4 bg-gray-100 rounded">
      <span class="font-medium text-gray-600">当前店铺名称：</span>
      <span class="text-gray-800 text-sm">{{ name }}</span>
    </div>
    <SpFormPlus
      ref="formRef"
      v-model="form"
      :form-items="getFormItems"
      form-type="normalForm"
      label-width="120px"
      :show-default-actions="false"
    />
    <div class="mt-5 pt-5 border-t border-gray-200 text-center">
      <el-button v-loading="loading" type="primary" @click="onSubmit"> 保存 </el-button>
    </div>
  </SpPage>
</template>
<script>
import SpFormPlus from '@/components/sp-form-plus'
import { setPaymentSetting, getPaymentSetting } from '@/api/trade'
export default {
  components: {
    SpFormPlus
  },
  data() {
    return {
      loading: false,
      name: '',
      form: {
        distributor_id: 0,
        app_id: '',
        app_app_id: '',
        merchant_id: '',
        key: '',
        is_servicer: false,
        servicer_merchant_id: '',
        servicer_app_id: '',
        cert: null,
        cert_key: null,
        cert_name: '',
        cert_key_name: '',
        is_open: true
      }
    }
  },
  computed: {
    getFormItems() {
      const formItems = [
        {
          fieldName: 'app_id',
          label: '公众账号ID',
          component: 'input',
          formItemClass: 'w-3/4',
          value: this.form.app_id,
          componentProps: {
            placeholder: '请输入公众账号ID',
            style: { width: '300px' }
          },
          tip: '微信支付分配的公众账号ID（企业号corpid即为此appId）',
          rules: [{ required: true, message: '请输入公众账号ID', trigger: 'blur' }]
        },
        {
          fieldName: 'app_app_id',
          label: 'APP应用ID',
          component: 'input',
          formItemClass: 'w-3/4',
          value: this.form.app_app_id,
          componentProps: {
            placeholder: '请输入APP应用ID',
            style: { width: '300px' }
          },
          tip: '微信开放平台审核通过的应用APPID（请登录open.weixin.qq.com查看，注意与公众号的APPID不同）'
        },
        {
          fieldName: 'merchant_id',
          label: '商户号',
          component: 'input',
          formItemClass: 'w-3/4',
          componentProps: {
            placeholder: '请输入商户号',
            style: { width: '300px' }
          },
          rules: [{ required: true, message: '请输入商户号', trigger: 'blur' }]
        },
        {
          fieldName: 'key',
          label: 'API密钥',
          component: 'input',
          formItemClass: 'w-3/4',
          componentProps: {
            placeholder: '请输入API密钥',
            style: { width: '300px' }
          },
          rules: [{ required: true, message: '请输入API密钥', trigger: 'blur' }]
        },
        {
          fieldName: 'is_servicer',
          label: '是否特约商户',
          component: 'switch',
          value: this.form.is_servicer,
          componentProps: {
            activeColor: '#13ce66',
            inactiveColor: '#ff4949'
          },
          tip: '如是特约商户，请联系您的服务商获取如下两个参数'
        },
        {
          fieldName: 'servicer_app_id',
          label: '服务商APPID',
          component: 'input',
          formItemClass: 'w-3/4',
          value: this.form.servicer_app_id,
          componentProps: {
            placeholder: '请输入服务商APPID',
            style: { width: '300px' }
          }
        },
        {
          fieldName: 'servicer_merchant_id',
          label: '服务商商户号',
          component: 'input',
          formItemClass: 'w-3/4',
          value: this.form.servicer_merchant_id,
          componentProps: {
            placeholder: '请输入服务商商户号',
            style: { width: '300px' }
          }
        },
        {
          fieldName: 'cert',
          label: '商户证书',
          component: 'upload',
          componentProps: {
            title: this.form.cert_name,
            buttonSize: '点击上传',
            size: 'middle',
            autoUpload: false,
            multiple: false,
            onChange: (file, fileList) => {
              this.$set(this.form, 'cert', file.raw)
              this.$set(this.form, 'cert_name', file.name)
              // 触发字段验证
              this.$nextTick(() => {
                if (this.$refs.formRef && this.$refs.formRef.$refs.form) {
                  this.$refs.formRef.$refs.form.validateField('cert')
                }
              })
            }
          },
          tip: '微信商户平台(pay.weixin.qq.com)-->账户设置-->API安全-->证书下载 apiclient_cert.pem',
          rules: [
            {
              required: true,
              message: '请上传商户证书',
              trigger: 'change',
              validator: (rule, value, callback) => {
                if (!this.form.cert && !this.form.cert_name) {
                  callback(new Error('请上传商户证书'))
                } else {
                  callback()
                }
              }
            }
          ]
        },
        {
          fieldName: 'cert_key',
          label: '商户证书秘钥',
          component: 'upload',
          componentProps: {
            title: this.form.cert_key_name,
            buttonSize: '点击上传',
            size: 'middle',
            autoUpload: false,
            multiple: false,
            onChange: (file, fileList) => {
              this.$set(this.form, 'cert_key', file.raw)
              this.$set(this.form, 'cert_key_name', file.name)
              // 触发字段验证
              this.$nextTick(() => {
                if (this.$refs.formRef && this.$refs.formRef.$refs.form) {
                  this.$refs.formRef.$refs.form.validateField('cert_key')
                }
              })
            }
          },
          tip: '微信商户平台(pay.weixin.qq.com)-->账户设置-->API安全-->证书下载 apiclient_key.pem',
          rules: [
            {
              required: true,
              message: '请上传商户证书秘钥',
              trigger: 'change',
              validator: (rule, value, callback) => {
                if (!this.form.cert_key && !this.form.cert_key_name) {
                  callback(new Error('请上传商户证书秘钥'))
                } else {
                  callback()
                }
              }
            }
          ]
        }
      ]
      return formItems
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    async getConfig() {
      const { distributor_id, name } = this.$route.query
      this.name = name
      this.form.distributor_id = distributor_id
      let query = { pay_type: 'wxpay', distributor_id: distributor_id }
      const data = await this.$api.trade.getPaymentSetting(query)
      this.form = {
        ...data,
        is_servicer: data.is_servicer == 'true' ? true : false,
        is_open: data.is_open == 'true' ? true : false
      }
    },
    async onSubmit() {
      const { distributor_id } = this.$route.query
      // 表单校验
      try {
        await this.$refs.formRef.$refs.form.validate()
      } catch (error) {
        return
      }

      this.loading = true
      let params = {
        ...this.form,
        isUploadFile: true,
        pay_type: 'wxpay',
        distributor_id
      }
      Object.keys(params).forEach((key) => {
        if (key === 'undefined') {
          delete params[key]
        }
      })
      delete params.cert_name
      delete params.cert_url
      delete params.cert_key_name
      delete params.cert_key_url
      try {
        await setPaymentSetting(params)
        this.$message.success('保存成功')
        this.getConfig()
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
