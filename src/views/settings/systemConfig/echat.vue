<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />
    <SpFormPlus
      ref="form"
      v-model="form"
      :form-items="formItems"
      form-type="form"
      label-width="130px"
      :show-default-actions="false"
    />
    <div class="section-footer with-border content-center">
      <el-button type="primary" @click="onSubmit">{{ $t('c909c3af.7cf724') }}</el-button>
    </div>
  </SpPage>
</template>

<script>
import { getECahtSetting, saveEChatSetting } from '../../../api/im'

export default {
  data() {
    return {
      loading: false,
      form: {
        is_open: '',
        echat_url: ''
      }
    }
  },
  computed: {
    formItems() {
      return [
        {
          fieldName: '__group_echat',
          component: 'group',
          label: this.$t('c909c3af.63a578')
        },
        {
          fieldName: 'is_open',
          label: this.$t('c909c3af.1e2a73'),
          component: 'switch',
          componentProps: {
            'active-value': 'true',
            'inactive-value': 'false',
            'inactive-color': '#ccc',
            'active-text': this.$t('c909c3af.cc42dd'),
            'inactive-text': this.$t('c909c3af.b15d91'),
            'active-color': '#13ce66'
          }
        },
        {
          fieldName: 'echat_url',
          label: this.$t('c909c3af.930436'),
          component: 'input',
          componentProps: {
            style: { width: '300px' },
            placeholder: this.$t('c909c3af.a11cc7')
          }
        }
      ]
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      getECahtSetting().then((response) => {
        this.form = response.data.data
      })
    },
    async onSubmit() {
      try {
        await this.$refs.form.validate()
        await saveEChatSetting(this.form)
        this.$message({ message: this.$t('c909c3af.3b1083'), type: 'success' })
        this.getInfo()
      } catch (error) {}
    }
  }
}
</script>
