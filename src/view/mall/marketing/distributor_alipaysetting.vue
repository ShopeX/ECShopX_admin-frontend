<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage class="mb-2.5">
    <div class="mb-5 p-4 bg-gray-100 rounded">
      <span class="font-medium text-gray-600">{{ $t('7a42c841.9d15be') }}</span>
      <span class="text-gray-800 text-sm">{{ name }}</span>
    </div>
    <SpFormPlus
      ref="formRef"
      v-model="form"
      :form-items="formItems"
      form-type="normalForm"
      label-width="120px"
      :show-default-actions="false"
    />
    <div class="mt-5 p-4 rounded" style="background-color: #fff6f7">
      <span class="text-gray-500 text-xs leading-6">
        {{ $t('7a42c841.1fd9ff')
        }}<a
          href="https://b.alipay.com/signing/productDetail.htm?productId=I1011000290000001001"
          target="_blank"
          class="text-blue-500 no-underline"
          >{{ $t('7a42c841.953f30') }}</a
        >
      </span>
    </div>
    <div class="mt-5 pt-5 border-t border-gray-200 text-center">
      <el-button v-loading="loading" type="primary" @click="onSubmit">
        {{ $t('7a42c841.be5fbb') }}
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
        ali_public_key: '',
        private_key: '',
        is_open: true
      },
      formItems: [
        {
          fieldName: 'app_id',
          label: this.$t('7a42c841.edbcda'),
          component: 'input',
          formItemClass: 'w-3/4',
          componentProps: {
            placeholder: this.$t('7a42c841.0541f0'),
            style: { width: '300px' }
          },
          tip: 'APPID',
          rules: [{ required: true, message: this.$t('7a42c841.0541f0'), trigger: 'blur' }]
        },
        {
          fieldName: 'ali_public_key',
          label: this.$t('7a42c841.c8ad33'),
          component: 'input',
          formItemClass: 'w-3/4',
          componentProps: {
            type: 'textarea',
            placeholder: this.$t('7a42c841.0797c6'),
            rows: 5
          },
          tip: this.$t('7a42c841.28b4cb'),
          rules: [{ required: true, message: this.$t('7a42c841.0797c6'), trigger: 'blur' }]
        },
        {
          fieldName: 'private_key',
          label: this.$t('7a42c841.7e99e0'),
          component: 'input',
          formItemClass: 'w-3/4',
          componentProps: {
            type: 'textarea',
            placeholder: this.$t('7a42c841.cb68a9'),
            rows: 5
          },
          tip: this.$t('7a42c841.2b4b9b'),
          rules: [{ required: true, message: this.$t('7a42c841.cb68a9'), trigger: 'blur' }]
        }
      ]
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

      let query = { pay_type: 'alipay', distributor_id: distributor_id }
      const data = await this.$api.trade.getPaymentSetting(query)
      this.form = {
        ...data,
        is_open: data.is_open == 'true' ? true : false
      }
    },
    async onSubmit() {
      try {
        await this.$refs.formRef.$refs.form.validate()
      } catch (error) {
        return
      }

      this.loading = true
      let query = {
        distributor_id: this.form.distributor_id,
        isUploadFile: true,
        pay_type: 'alipay',
        app_id: this.form.app_id,
        private_key: this.form.private_key,
        is_open: this.form.is_open,
        ali_public_key: this.form.ali_public_key
      }
      try {
        await setPaymentSetting(query)
        this.$message.success(this.$t('7a42c841.3b1083'))
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
