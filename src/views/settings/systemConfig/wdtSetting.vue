<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div v-loading="loading">
      <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay :text-val="$t('59579ae2.c5d4d8')" />
      <SpFormPlus
        ref="form"
        v-model="form"
        :form-items="formItems"
        form-type="form"
        label-width="100px"
        :show-default-actions="false"
      />
      <div class="section-footer with-border content-center">
        <el-button v-loading="lock" type="primary" @click="onSubmit">
          {{ $t('59579ae2.be5fbb') }}
        </el-button>
      </div>
    </div>
  </SpPage>
</template>

<script>
import { getWdtErpSetting, setWdtErpSetting } from '@/api/third'

export default {
  data() {
    return {
      loading: false,
      lock: false,
      form: {
        sid: '',
        app_key: '',
        app_secret: '',
        shop_no: '',
        is_open: false
      }
    }
  },
  computed: {
    formItems() {
      return [
        {
          fieldName: 'sid',
          label: 'sid',
          component: 'input',
          componentProps: {
            style: { width: '300px' }
          }
        },
        {
          fieldName: 'app_key',
          label: 'appKey',
          component: 'input',
          componentProps: {
            style: { width: '300px' }
          }
        },
        {
          fieldName: 'app_secret',
          label: 'appSecret',
          component: 'input',
          componentProps: {
            style: { width: '300px' }
          }
        },
        {
          fieldName: 'shop_no',
          label: 'shopNo',
          component: 'input',
          componentProps: {
            style: { width: '300px' }
          }
        },
        {
          fieldName: 'is_open',
          label: this.$t('59579ae2.53c3dd'),
          component: 'switch',
          componentProps: {
            'active-color': '#13ce66',
            'inactive-color': '#ff4949'
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
      const resp = await getWdtErpSetting()
      if (resp.data.data.is_open) {
        this.form.sid = resp.data.data.sid
        this.form.app_key = resp.data.data.app_key
        this.form.app_secret = resp.data.data.app_secret
        this.form.shop_no = resp.data.data.shop_no
        this.form.is_open = true
      }
      this.loading = false
    },
    async onSubmit() {
      try {
        await this.$refs.form.validate()
        this.lock = true
        await setWdtErpSetting(this.form)
        this.lock = false
        this.$message({
          type: 'success',
          message: this.$t('59579ae2.3b1083')
        })
      } catch (error) {
        this.lock = false
      }
    }
  }
}
</script>
