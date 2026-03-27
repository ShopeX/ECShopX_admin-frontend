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
      <el-button type="primary" @click="onSaveConfig">{{ $t('f254650c.ed7526') }}</el-button>
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
          label: this.$t('f254650c.74246c')
        },
        {
          fieldName: 'username',
          label: this.$t('f254650c.819767'),
          component: 'input',
          formItemClass: 'w-1/2',
          componentProps: {
            placeholder: this.$t('f254650c.08b1fa')
          },
          rules: [{ required: true, message: this.$t('f254650c.08b1fa'), trigger: 'blur' }]
        },
        {
          fieldName: 'password',
          label: this.$t('f254650c.a81052'),
          component: 'input',
          formItemClass: 'w-1/2',
          componentProps: {
            placeholder: this.$t('f254650c.e39ffe'),
            type: 'password'
          },
          rules: [{ required: true, message: this.$t('f254650c.e39ffe'), trigger: 'blur' }]
        },
        {
          fieldName: 'appKey',
          label: this.$t('f254650c.368480'),
          component: 'input',
          formItemClass: 'w-1/2',
          componentProps: {
            placeholder: this.$t('f254650c.d9bebe')
          },
          rules: [{ required: true, message: this.$t('f254650c.d9bebe'), trigger: 'blur' }]
        },
        {
          fieldName: 'appSecret',
          label: this.$t('f254650c.bf74fe'),
          component: 'input',
          formItemClass: 'w-1/2',
          componentProps: {
            placeholder: this.$t('f254650c.c3744f')
          },
          rules: [{ required: true, message: this.$t('f254650c.c3744f'), trigger: 'blur' }]
        },
        {
          fieldName: 'orgAuthCode',
          label: this.$t('f254650c.de07d8'),
          component: 'input',
          formItemClass: 'w-1/2',
          componentProps: {
            placeholder: this.$t('f254650c.c83b5a')
          },
          rules: [{ required: true, message: this.$t('f254650c.c83b5a'), trigger: 'blur' }]
        },
        {
          fieldName: 'taxNo',
          label: this.$t('f254650c.c7f1e4'),
          component: 'input',
          formItemClass: 'w-1/2',
          componentProps: {
            placeholder: this.$t('f254650c.d4d7ac')
          },
          rules: [{ required: true, message: this.$t('f254650c.d4d7ac'), trigger: 'blur' }]
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
        this.$message.success(this.$t('f254650c.3b1083'))
      } catch (error) {
        //验证失败
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
