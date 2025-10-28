// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统 
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn 
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------

import Vue from 'vue'
// import { SpFormPlus } from '@/components'

export function useForm(options = {}) {
  const {
    colon = false,
    formItems = [], // 表单项配置
    formType = 'search-form', // 表单类型: 搜索表单、编辑表单等
    inline = false,
    labelWidth = '120px', // 标签宽度
    rules = {}, // 校验规则
    showDefaultActions = true // 是否显示默认操作按钮
  } = options

  const FormApi = {}

  // 创建表单组件定义
  const Form = Vue.extend({
    name: 'DynamicForm',
    // components: {
    //   SpFormPlus // 注册组件
    // },
    props: {
      value: Object
    },
    data() {
      return {
        localFormItems: formItems,
        formData: {},
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
        setFields: this.setFields.bind(this),
        setFieldComponentProps: this.setFieldComponentProps.bind(this)
      })
    },
    methods: {
      // 表单验证
      async validate() {
        return await this.$refs.form.validate()
        // return new Promise((resolve, reject) => {
        //   debugger
        //   this.$refs.form.validate(valid => {
        //     debugger
        //     if (valid) {
        //       resolve(this.form)
        //     } else {
        //       reject()
        //     }
        //   })
        // })
      },
      // 重置表单
      resetFields() {
        this.$refs.formData.resetFields()
      },
      // 清除验证
      clearValidate(props) {
        this.$refs.formData.clearValidate(props)
      },
      // 设置表单字段值
      setFieldsValue(values) {
        Object.keys(values).forEach((key) => {
          this.$set(this.formData, key, values[key])
        })
      },
      // 获取表单字段值
      getFieldsValue(fields) {
        if (Array.isArray(fields)) {
          const values = {}
          fields.forEach((field) => {
            values[field] = this.formData[field]
          })
          return values
        }
        return { ...this.formData }
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
      },
      setFieldComponentProps(fieldName, props) {
        this.localFormItems.forEach((item) => {
          if (item.fieldName === fieldName) {
            item.componentProps = {
              ...item.componentProps,
              ...props
            }
          }
        })
        console.log('formItems', this.localFormItems)
      }
    },
    render(h) {
      return h('sp-form-plus', {
        ref: 'form',
        props: {
          colon,
          formItems: this.localFormItems,
          formType: formType,
          formApi: FormApi,
          inline,
          labelWidth: labelWidth || '120px',
          showDefaultActions: showDefaultActions,
          value: this.value
        },
        on: {
          // 'field-change': ({ fieldName, value }) => {
          //   this.$set(this.formData, fieldName, value)
          // },
          submit: (formData) => {
            this.$emit('submit', formData)
          },
          input: (formData) => {
            this.formData = formData
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
