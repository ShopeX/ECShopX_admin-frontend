<template>
  <SpPage title="添加文章">
    <Form />
  </SpPage>
</template>

<script>
import { useForm } from '@/composables'

const [Form, FormApi] = useForm({
  formItems: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '标题'
      },
      fieldName: 'mobile',
      label: '文章标题',
      value: ''
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: '请选择'
      },
      fieldName: 'mobile',
      label: '文章分类',
      value: ''
    }
  ]
})
export default {
  components: {
    Form
  },
  data() {
    return {
      form: {
        title: '',
        category_id: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
