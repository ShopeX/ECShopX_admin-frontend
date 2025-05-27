import Vue from 'vue'
// import { SpFormPlus } from '@/components'

export function useForm(options = {}) {
  const {
    formProps = {}, // 表单属性
    formItems = [], // 表单项配置
    rules = {}, // 校验规则
    initialValues = {}, // 初始值
    showDefaultActions = true // 是否显示默认操作按钮
  } = options

  const FormApi = {}

  // 创建表单组件定义
  const Form = Vue.extend({
    name: 'DynamicForm',
    // components: {
    //   SpFormPlus // 注册组件
    // },
    data() {
      return {
        form: { ...initialValues }, // 表单数据，使用初始值
        formRules: rules // 表单校验规则
      }
    },
    created() {
      // 将方法挂载到 FormApi
      Object.assign(FormApi, {
        validate: this.validate.bind(this),
        resetFields: this.resetFields.bind(this),
        clearValidate: this.clearValidate.bind(this),
        setFieldsValue: this.setFieldsValue.bind(this),
        getFieldsValue: this.getFieldsValue.bind(this),
        setFields: this.setFields.bind(this)
      })
    },
    methods: {
      // 表单验证
      validate() {
        return new Promise((resolve, reject) => {
          this.$refs.form.validate((valid) => {
            if (valid) {
              resolve(this.form)
            } else {
              reject(new Error('表单验证失败'))
            }
          })
        })
      },
      // 重置表单
      resetFields() {
        this.$refs.form.resetFields()
      },
      // 清除验证
      clearValidate(props) {
        this.$refs.form.clearValidate(props)
      },
      // 设置表单字段值
      setFieldsValue(values) {
        Object.keys(values).forEach((key) => {
          this.$set(this.form, key, values[key])
        })
      },
      // 获取表单字段值
      getFieldsValue(fields) {
        if (Array.isArray(fields)) {
          const values = {}
          fields.forEach((field) => {
            values[field] = this.form[field]
          })
          return values
        }
        return { ...this.form }
      },
      // 设置表单字段验证状态
      setFields(fields) {
        Object.keys(fields).forEach((key) => {
          const field = fields[key]
          if (field.value !== undefined) {
            this.$set(this.form, key, field.value)
          }
          if (field.errors) {
            this.$refs.form.fields.forEach((item) => {
              if (item.prop === key) {
                item.validateMessage = field.errors[0]
                item.validateState = 'error'
              }
            })
          }
        })
      }
    },
    render(h) {
      return h('sp-form-plus', {
        ref: 'form',
        props: {
          formItems: formItems.map((item) => ({
            ...item,
            value: this.form[item.fieldName]
          })),
          labelWidth: formProps.labelWidth || '120px',
          showDefaultActions: !formProps.hideButtons,
          formApi: FormApi
        },
        on: {
          'field-change': ({ fieldName, value }) => {
            this.$set(this.form, fieldName, value)
          },
          submit: () => {
            this.validate()
              .then((formData) => {
                this.$emit('submit', formData)
              })
              .catch((err) => {
                this.$emit('error', err)
              })
          },
          reset: () => {
            this.resetFields()
            this.$emit('reset')
          }
        }
      })
    }
  })

  return [Form, FormApi]
}
