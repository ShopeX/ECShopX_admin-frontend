<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage class="mb-2.5">
    <div class="mb-5 p-4 bg-gray-100 rounded">
      <span class="font-medium text-gray-600">{{ $t('38a9041d.9d15be') }}</span>
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
      <el-button v-loading="loading" type="primary" @click="onSubmit">
        {{ $t('38a9041d.be5fbb') }}
      </el-button>
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
          label: this.$t('38a9041d.be151f'),
          component: 'input',
          formItemClass: 'w-3/4',
          value: this.form.app_id,
          componentProps: {
            placeholder: this.$t('38a9041d.09b451'),
            style: { width: '300px' }
          },
          tip: this.$t('38a9041d.dd851e'),
          rules: [{ required: true, message: this.$t('38a9041d.09b451'), trigger: 'blur' }]
        },
        {
          fieldName: 'app_app_id',
          label: this.$t('38a9041d.47e254'),
          component: 'input',
          formItemClass: 'w-3/4',
          value: this.form.app_app_id,
          componentProps: {
            placeholder: this.$t('38a9041d.46311b'),
            style: { width: '300px' }
          },
          tip: this.$t('38a9041d.460b81')
        },
        {
          fieldName: 'merchant_id',
          label: this.$t('38a9041d.f173b7'),
          component: 'input',
          formItemClass: 'w-3/4',
          componentProps: {
            placeholder: this.$t('38a9041d.b9a935'),
            style: { width: '300px' }
          },
          rules: [{ required: true, message: this.$t('38a9041d.b9a935'), trigger: 'blur' }]
        },
        {
          fieldName: 'key',
          label: this.$t('38a9041d.6f5c56'),
          component: 'input',
          formItemClass: 'w-3/4',
          componentProps: {
            placeholder: this.$t('38a9041d.f160f3'),
            style: { width: '300px' }
          },
          rules: [{ required: true, message: this.$t('38a9041d.f160f3'), trigger: 'blur' }]
        },
        {
          fieldName: 'is_servicer',
          label: this.$t('38a9041d.a5e041'),
          component: 'switch',
          value: this.form.is_servicer,
          componentProps: {
            activeColor: '#13ce66',
            inactiveColor: '#ff4949'
          },
          tip: this.$t('38a9041d.167466')
        },
        {
          fieldName: 'servicer_app_id',
          label: this.$t('38a9041d.e2febe'),
          component: 'input',
          formItemClass: 'w-3/4',
          value: this.form.servicer_app_id,
          componentProps: {
            placeholder: this.$t('38a9041d.ea377b'),
            style: { width: '300px' }
          }
        },
        {
          fieldName: 'servicer_merchant_id',
          label: this.$t('38a9041d.13f855'),
          component: 'input',
          formItemClass: 'w-3/4',
          value: this.form.servicer_merchant_id,
          componentProps: {
            placeholder: this.$t('38a9041d.d40bb8'),
            style: { width: '300px' }
          }
        },
        {
          fieldName: 'cert',
          label: this.$t('38a9041d.9fa3f8'),
          component: 'upload',
          componentProps: {
            title: this.form.cert_name,
            buttonSize: this.$t('38a9041d.2c808b'),
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
          tip: this.$t('38a9041d.c58e48'),
          rules: [
            {
              required: true,
              message: this.$t('38a9041d.538a0f'),
              trigger: 'change',
              validator: (rule, value, callback) => {
                if (!this.form.cert && !this.form.cert_name) {
                  callback(new Error(this.$t('38a9041d.538a0f')))
                } else {
                  callback()
                }
              }
            }
          ]
        },
        {
          fieldName: 'cert_key',
          label: this.$t('38a9041d.34c0ad'),
          component: 'upload',
          componentProps: {
            title: this.form.cert_key_name,
            buttonSize: this.$t('38a9041d.2c808b'),
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
          tip: this.$t('38a9041d.2af448'),
          rules: [
            {
              required: true,
              message: this.$t('38a9041d.a56677'),
              trigger: 'change',
              validator: (rule, value, callback) => {
                if (!this.form.cert_key && !this.form.cert_key_name) {
                  callback(new Error(this.$t('38a9041d.a56677')))
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
        this.$message.success(this.$t('38a9041d.3b1083'))
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
