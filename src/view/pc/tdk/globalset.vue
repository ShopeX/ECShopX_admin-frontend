<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage title="SEO配置">
    <template slot="page-footer">
      <div class="text-center">
        <el-button type="primary" :loading="loading" @click="onSubmit"> 保存 </el-button>
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
      label: '页面标题'
    },
    {
      component: 'Input',
      fieldName: 'mate_description',
      formItemClass: 'w-2/5',
      label: '页面描述'
    },
    {
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 3
      },
      fieldName: 'mate_keywords',
      formItemClass: 'w-2/5',
      label: '关键词',
      tip: '关键词之间请用半角”,”分隔'
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
      this.$message.success('保存成功')
    }
  }
}
</script>
