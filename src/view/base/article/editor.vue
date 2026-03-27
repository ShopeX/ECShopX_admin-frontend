<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage :title="$t('0b9f427f.768d47')">
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
        placeholder: '0b9f427f.32c65d'
      },
      fieldName: 'image_url',
      label: '0b9f427f.9cbbc8',
      value: '',
      rules: [{ required: true, message: '0b9f427f.5b90d1' }]
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '0b9f427f.32c65d'
      },
      fieldName: 'title',
      formItemClass: 'w-2/5',
      label: '0b9f427f.7526a0',
      value: '',
      rules: [{ required: true, message: '0b9f427f.fc96ee' }]
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: '0b9f427f.8bb820',
        options: []
      },
      fieldName: 'category_id',
      formItemClass: 'w-2/5',
      label: '0b9f427f.c1ed55',
      value: '',
      rules: [
        {
          required: true,
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('0b9f427f.6a5ef5'))
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
            onChange={(val) => {
              onInput(val)
            }}
          />
        )
      },
      fieldName: 'content',
      label: '0b9f427f.ad531b',
      value: '',
      rules: [{ required: true, message: '0b9f427f.980167' }]
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
      options: res.map((item) => ({
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
        this.$message.success(this.$t('0b9f427f.6d2221'))
      } else {
        await this.$api.article.createArticle({
          title: FormData.title,
          category_id: FormData.category_id,
          content: FormData.content,
          image_url: FormData.image_url
        })
        this.$message.success(this.$t('0b9f427f.e04b36'))
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
