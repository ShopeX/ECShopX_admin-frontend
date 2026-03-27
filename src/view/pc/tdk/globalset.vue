<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage :title="$t('5f8c2276.e807b2')">
    <template slot="page-footer">
      <div class="text-center">
        <el-button type="primary" :loading="loading" @click="onSubmit">
{{
          $t('5f8c2276.be5fbb')
        }}
</el-button>
      </div>
    </template>
    <Form />
  </SpPage>
</template>
<script>
import { useForm } from '@/composables'

const [Form, FormApi] = useForm({
  formItems: [
    {
      component: 'Input',
      fieldName: 'title',
      formItemClass: 'w-2/5',
      label: '5f8c2276.8d6b59'
    },
    {
      component: 'Input',
      fieldName: 'mate_description',
      formItemClass: 'w-2/5',
      label: '5f8c2276.abf8f4'
    },
    {
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 3
      },
      fieldName: 'mate_keywords',
      formItemClass: 'w-2/5',
      label: '5f8c2276.9699a5',
      tip: '5f8c2276.c0a63b'
    }
  ],
  showDefaultActions: false
})

export default {
  components: {
    Form
  },

  data() {
    return {
      loading: false
    }
  },
  mounted() {
    this.getTdkglobalset()
  },
  methods: {
    async getTdkglobalset() {
      const res = await this.$api.tdkset.getTdkglobalset()
      FormApi.setFieldsValue({
        title: res.title,
        mate_description: res.mate_description,
        mate_keywords: res.mate_keywords
      })
    },
    // 保存数据
    async onSubmit() {
      this.loading = true
      const res = await FormApi.getFieldsValue()
      const params = {
        title: res.title,
        mate_description: res.mate_description,
        mate_keywords: res.mate_keywords
      }
      this.$api.tdkset.saveTdkglobalset(params)
      this.loading = false
      this.$message.success(this.$t('5f8c2276.3b1083'))
    }
  }
}
</script>
