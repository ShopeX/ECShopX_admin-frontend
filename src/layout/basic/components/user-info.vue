<template>
  <div class="user-info-form">
    <SpFormPlus
      ref="userInfoForm"
      v-model="formData"
      form-type="normalForm"
      :form-items="formItems"
      label-width="100px"
      :showDefaultActions="false"
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
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
      },
      formItems: [
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
          label: '账户'
        },
        {
          component: 'input',
          componentProps: {
            placeholder: '请输入昵称',
            clearable: true,
            maxlength: 20,
            showWordLimit: true
          },
          fieldName: 'nickname',
          formItemClass: 'w-2/3',
          label: '昵称',
          rules: [
            { required: true, message: '请输入昵称', trigger: 'blur' },
            { min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' }
          ]
        },
        {
          component: 'imagepicker',
          fieldName: 'avatar',
          formItemClass: 'w-2/3',
          label: '头像'
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
      await this.$refs.userInfoForm.validate()
    },
    async getFieldsValue() {
      return this.$refs.userInfoForm.getFieldsValue()
    },
    async onSubmit() {
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
        this.$message.success('更新成功，重新登录后生效')
      } catch (error) {
        throw new Error('更新失败')
      }
    }
  }
}
</script>
