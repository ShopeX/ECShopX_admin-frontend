import Vue from 'vue'
import { SpFormPlus } from '@/components/sp-form-plus'

export function useForm(options = {}) {
  const {
    formProps = {}, // 表单属性
    formItems = [], // 表单项配置
    rules = {}, // 校验规则
    initialValues = {} // 初始值
  } = options

  // 创建表单组件定义
  const FormComponent = {
    name: 'DynamicForm',
    data() {
      return {
        form: { ...initialValues }, // 表单数据，使用初始值
        formRules: rules // 表单校验规则
      }
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
      // 渲染表单项
      const renderFormItems = () => {
        return formItems.map((item) => {
          const {
            prop, // 表单域字段
            label, // 标签文本
            type = 'input', // 输入框类型
            placeholder, // 占位文本
            options = [], // 选项（用于 select、radio、checkbox 等）
            slots = {}, // 插槽内容
            events = {}, // 事件处理
            ...restProps // 其他属性
          } = item

          // 根据类型渲染不同的表单组件
          const renderFormItemContent = () => {
            const commonProps = {
              props: {
                value: this.form[prop],
                placeholder,
                ...restProps
              },
              on: {
                input: (val) => {
                  this.$set(this.form, prop, val)
                },
                ...events
              }
            }

            switch (type) {
              case 'input':
                return h('el-input', commonProps)
              case 'select':
                return h(
                  'el-select',
                  commonProps,
                  options.map((option) => {
                    return h('el-option', {
                      props: {
                        label: option.label,
                        value: option.value,
                        disabled: option.disabled
                      }
                    })
                  })
                )
              case 'radio':
                return h(
                  'el-radio-group',
                  commonProps,
                  options.map((option) => {
                    return h(
                      'el-radio',
                      {
                        props: {
                          label: option.value,
                          disabled: option.disabled
                        }
                      },
                      option.label
                    )
                  })
                )
              case 'checkbox':
                return h(
                  'el-checkbox-group',
                  commonProps,
                  options.map((option) => {
                    return h(
                      'el-checkbox',
                      {
                        props: {
                          label: option.value,
                          disabled: option.disabled
                        }
                      },
                      option.label
                    )
                  })
                )
              case 'datePicker':
                return h('el-date-picker', commonProps)
              case 'timePicker':
                return h('el-time-picker', commonProps)
              case 'switch':
                return h('el-switch', commonProps)
              case 'slider':
                return h('el-slider', commonProps)
              case 'custom':
                // 支持自定义渲染函数
                return item.render ? item.render(h, this.form) : null
              default:
                return null
            }
          }

          // 渲染表单项
          return h(
            'el-form-item',
            {
              props: {
                label,
                prop,
                rules: item.rules // 支持单独的字段规则
              }
            },
            [
              // 前置插槽
              slots.prefix && h('template', { slot: 'prefix' }, slots.prefix),
              // 表单组件
              renderFormItemContent(),
              // 后置插槽
              slots.suffix && h('template', { slot: 'suffix' }, slots.suffix)
            ]
          )
        })
      }

      // 渲染整个表单
      return h(
        'el-form',
        {
          ref: 'form',
          props: {
            model: this.form,
            rules: this.formRules,
            ...formProps
          }
        },
        [
          renderFormItems(),
          // 默认的表单按钮，可以通过 formProps.hideButtons 来控制是否显示
          !formProps.hideButtons &&
            h('el-form-item', [
              h(
                'el-button',
                {
                  props: {
                    type: 'primary',
                    loading: this.submitting
                  },
                  on: {
                    click: () => {
                      this.validate()
                        .then((formData) => {
                          this.$emit('submit', formData)
                        })
                        .catch((err) => {
                          this.$emit('error', err)
                        })
                    }
                  }
                },
                '提交'
              ),
              h(
                'el-button',
                {
                  on: {
                    click: () => {
                      this.resetFields()
                      this.$emit('reset')
                    }
                  }
                },
                '重置'
              )
            ])
        ]
      )
    }
  }

  // 创建表单组件构造函数
  const Form = Vue.extend(FormComponent)

  // 创建表单 API
  const FormApi = {
    validate: null,
    resetFields: null,
    clearValidate: null,
    setFieldsValue: null,
    getFieldsValue: null,
    setFields: null
  }

  return {
    Form,
    FormApi
  }
}
