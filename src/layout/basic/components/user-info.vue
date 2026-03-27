<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="user-info-form">
    <SpFormPlus
      ref="userInfoForm"
      v-model="formData"
      form-type="normalForm"
      :form-items="formItems"
      label-width="100px"
      :show-default-actions="false"
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
import { i18n } from '@/i18n'
export default {
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formData: {
        account: '',
        nickname: '',
        avatar: ''
      }
    }
  },
  computed: {
    formItems() {
      return [
        {
          component: ({ value }) => {
            return this.$createElement(
              'span',
              {
                style: { color: '#606266', fontSize: '14px' }
              },
              value || ''
            )
          },
          fieldName: 'account',
          label: i18n.t('97f0b47f.7116e7')
        },
        {
          component: 'input',
          componentProps: {
            placeholder: i18n.t('97f0b47f.916ff9'),
            clearable: true,
            maxlength: 20,
            showWordLimit: true
          },
          fieldName: 'nickname',
          formItemClass: 'w-2/3',
          label: i18n.t('97f0b47f.23eb0e'),
          rules: [
            { required: true, message: i18n.t('97f0b47f.916ff9'), trigger: 'blur' },
            { min: 2, max: 20, message: i18n.t('97f0b47f.f15f1e'), trigger: 'blur' }
          ]
        },
        {
          component: 'imagepicker',
          fieldName: 'avatar',
          formItemClass: 'w-2/3',
          label: i18n.t('97f0b47f.4c50ee')
        }
      ]
    }
  },
  mounted() {
    this.formData = {
      account: this.value.account,
      nickname: this.value.nickname,
      avatar: this.value.avatar
    }
  },
  methods: {
    async validate() {
      // 暴露给layout-header弹框
      await this.$refs.userInfoForm.validate()
    },
    async getFieldsValue() {
      // 暴露给layout-header弹框
      return this.$refs.userInfoForm.getFieldsValue()
    },
    async onSubmit() {
      // 暴露给layout-header弹框
      try {
        await this.$refs.userInfoForm.handleSubmit()
        await this.handleSubmit(this.formData)
      } catch (error) {
        throw new Error(error)
      }
    },
    async handleSubmit(formData) {
      try {
        await this.$api.login.updateAdminInfo({
          username: formData.nickname,
          head_portrait: formData.avatar
        })
        this.$message.success(this.$t('97f0b47f.b374d9'))
      } catch (error) {
        throw new Error(this.$t('97f0b47f.930442'))
      }
    }
  }
}
</script>
