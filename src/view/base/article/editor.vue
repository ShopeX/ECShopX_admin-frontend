<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <SpPage title="添加文章">
    <Form @submit="onHandleSubmit" />
  </SpPage>
</template>

<script>
import { useForm } from '@/composables'

const [Form, FormApi] = useForm({
  formItems: [
    {
      component: 'imagepicker',
      componentProps: {
        placeholder: '标题'
      },
      fieldName: 'image_url',
      label: '封面图片',
      value: '',
      rules: [{ required: true, message: '请选择封面图片' }]
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '标题'
      },
      fieldName: 'title',
      formItemClass: 'w-2/5',
      label: '文章标题',
      value: '',
      rules: [{ required: true, message: '请输入文章标题' }]
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: '请选择分类',
        options: []
      },
      fieldName: 'category_id',
      formItemClass: 'w-2/5',
      label: '文章分类',
      value: '',
      rules: [
        {
          required: true,
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('请选择文章分类'))
            }
            callback()
          }
        }
      ]
    },
    {
      component: ({ h, value, onInput }) => {
        return (
          <SpRichText
            value={value}
            onChange={val => {
              onInput(val)
            }}
          />
        )
      },
      fieldName: 'content',
      label: '文章内容',
      value: '',
      rules: [{ required: true, message: '请输入文章内容' }]
    }
  ]
})
export default {
  components: {
    Form
  },
  data() {
    return {}
  },
  async mounted() {
    if (this.$route.query.id) {
      const res = await this.$api.article.getArticleInfo(this.$route.query.id)
      FormApi.setFieldsValue({
        title: res.title,
        category_id: res.category_id,
        content: res.content,
        image_url: res.image_url
      })
    }
    const res = await this.$api.article.getArticleCategoryList({
      category_type: 'general'
    })

    FormApi.setFieldComponentProps('category_id', {
      options: res.map(item => ({
        label: item.category_name,
        value: item.category_id
      }))
    })
  },
  methods: {
    async onHandleSubmit() {
      await FormApi.validate()
      const FormData = await FormApi.getFieldsValue()

      if (this.$route.query.id) {
        await this.$api.article.updateArticle(this.$route.query.id, {
          title: FormData.title,
          category_id: FormData.category_id,
          content: FormData.content,
          image_url: FormData.image_url
        })
        this.$message.success('修改文章成功')
      } else {
        await this.$api.article.createArticle({
          title: FormData.title,
          category_id: FormData.category_id,
          content: FormData.content,
          image_url: FormData.image_url
        })
        this.$message.success('添加文章成功')
      }

      setTimeout(() => {
        this.$parent.onActivated()
        this.$router.go(-1)
      }, 70)
    }
  }
}
</script>

<style lang="scss" scoped></style>
