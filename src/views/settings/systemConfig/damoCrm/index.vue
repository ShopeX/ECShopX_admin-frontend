<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage v-loading="loading">
    <SpFormPlus
      ref="crmform"
      v-model="formData"
      form-type="form"
      :form-items="formItems"
      label-width="100px"
      @submit="handleSubmit"
    />
  </SpPage>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      lock: false,
      formData: {
        app_key: '',
        app_secret: '',
        ent_sign: '',
        is_open: false
      }
    }
  },
  computed: {
    formItems() {
      return [
        {
          component: 'input',
          formItemClass: 'w-1/2',
          componentProps: {
            placeholder: this.$t('da33b0d1.d9bebe'),
            clearable: true
          },
          fieldName: 'app_key',
          label: this.$t('da33b0d1.368480'),
          rules: [{ required: true, message: this.$t('da33b0d1.d9bebe'), trigger: 'blur' }]
        },
        {
          component: 'input',
          formItemClass: 'w-1/2',
          componentProps: {
            placeholder: this.$t('da33b0d1.c3744f'),
            clearable: true
          },
          fieldName: 'app_secret',
          label: this.$t('da33b0d1.bf74fe'),
          rules: [{ required: true, message: this.$t('da33b0d1.c3744f'), trigger: 'blur' }]
        },
        {
          component: 'input',
          formItemClass: 'w-1/2',
          componentProps: {
            placeholder: this.$t('da33b0d1.9730be'),
            clearable: true
          },
          fieldName: 'ent_sign',
          label: this.$t('da33b0d1.62d025'),
          rules: [{ required: true, message: this.$t('da33b0d1.9730be'), trigger: 'blur' }]
        },
        {
          fieldName: 'is_open',
          label: this.$t('da33b0d1.53c3dd'),
          formItemClass: 'w-1/2',
          component: 'switch',
          value: false,
          componentProps: {
            activeColor: '#13ce66',
            inactiveColor: '#ff4949'
          }
        }
      ]
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    async getConfig() {
      this.loading = true
      try {
        const data = await this.$api.third.getDmcrmSetting()
        console.log(data, data.app_key)
        this.formData.app_key = data.app_key
        this.formData.app_secret = data.app_secret
        this.formData.ent_sign = data.ent_sign
        this.formData.is_open = data.is_open ? true : false
        this.loading = false
      } catch (error) {
        console.log(error)
        this.loading = false
      }
    },
    async handleSubmit(formData) {
      try {
        console.log(formData, '--')
        await this.$api.third.setDmcrmSetting(formData)
        this.$message.success(this.$t('da33b0d1.b374d9'))
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
