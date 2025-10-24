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

import { isString } from '@/utils'
import { h } from 'vue'
import { PICKER_DATE_OPTIONS } from '@/consts'
import { isFunction } from '@/utils/src/type-helper'
import './form-field.scss'

export default {
  name: 'FormField',
  inheritAttrs: false,
  props: {
    component: {
      type: [String, Function],
      default: 'input'
    },
    componentProps: {
      type: Object,
      default: () => ({})
    },
    fieldName: {
      type: String
    },
    formItemClass: {
      type: String,
      default: ''
    },
    formData: Object,
    isShow: {
      type: Function
    },
    label: {
      type: String,
      default: ''
    },
    rules: {
      type: Array,
      default: () => []
    },
    size: {
      type: String,
      default: '' // medium, small, mini
    },
    tip: {
      type: [String, Function],
      default: ''
    },
    value: {
      type: [String, Number, Boolean, Array, Object],
      default: ''
    }
  },
  data() {
    return {
      modelValue: this.value
    }
  },
  methods: {
    handleInput(val) {
      this.modelValue = val
      this.$emit('input', val)
      this.$emit('change', val)

      this.componentProps.onChange?.(val, this.formData)
    },
    // 渲染 input 组件
    renderInput() {
      return h('el-input', {
        attrs: {
          ...this.componentProps,
          size: this.size
        },
        props: {
          value: this.modelValue
        },
        on: {
          input: this.handleInput
        }
      })
    },
    // 渲染 select 组件
    renderSelect(props = {}) {
      const options = (props.options || []).map((option) =>
        h('el-option', {
          props: {
            key: option.value,
            label: option.label,
            value: option.value,
            disabled: option.disabled
          }
        })
      )

      return h(
        'el-select',
        {
          attrs: {
            size: this.size
          },
          props: {
            value: this.modelValue,
            placeholder: `请选择${this.label}`,
            ...props
          },
          on: {
            input: this.handleInput
          }
        },
        options
      )
    },
    // 渲染 radio 组件
    renderRadio(props = {}) {
      const radios = (props.options || []).map((option) =>
        h(
          'el-radio',
          {
            props: {
              label: option.value,
              disabled: option.disabled
            }
          },
          option.label
        )
      )

      return h(
        'el-radio-group',
        {
          props: {
            value: this.modelValue,
            ...props
          },
          on: {
            input: this.handleInput
          }
        },
        radios
      )
    },
    // 渲染 checkbox 组件
    renderCheckbox(props = {}) {
      const checkboxes = (props.options || []).map((option) =>
        h(
          'el-checkbox',
          {
            props: {
              label: option.value,
              disabled: option.disabled
            }
          },
          option.label
        )
      )

      return h(
        'el-checkbox-group',
        {
          props: {
            value: this.modelValue,
            ...props
          },
          on: {
            input: this.handleInput
          }
        },
        checkboxes
      )
    },
    // 渲染 button 组件
    renderButton(props = {}) {
      return h(
        'el-button',
        {
          props: {
            type: props.type || 'default',
            size: props.size || 'medium',
            disabled: props.disabled || false,
            loading: props.loading || false,
            ...props
          },
          class: props.class || '',
          on: {
            click: (event) => {
              this.$emit('click', event)
              if (props.onClick) {
                props.onClick(event)
              }
            }
          }
        },
        props.text || this.label || '按钮'
      )
    },
    renderDatePicker(props = {}) {
      return (
        <div class='el-date-picker__wrapper'>
          <el-date-picker
            type='date'
            value={this.modelValue}
            {...props}
            on-input={this.handleInput}
          />
        </div>
      )
    },
    // 渲染 datetime-range 组件
    renderDateTimePicker(props = {}) {
      return (
        <div class='el-datetime-picker__wrapper'>
          <el-date-picker
            style='width: 100%'
            type={this.componentProps.type}
            startPlaceholder='开始日期/结束时间'
            default-time={['00:00:00', '23:59:59']}
            // endPlaceholder="结束日期"
            rangeSeparator={`${this.modelValue.length > 1 ? '至' : ''}`}
            value={this.modelValue}
            pickerOptions={PICKER_DATE_OPTIONS}
            onInput={this.handleInput}
          />
        </div>
      )
    },
    renderImagePicker(props = {}) {
      return <SpImagePicker value={this.modelValue} {...props} on-onChange={this.handleInput} />
    },

    renderSwitch() {
      const props = {
        ...this.componentProps,
        disabled: isFunction(this.componentProps.disabled)
          ? this.componentProps.disabled(this.formData)
          : this.componentProps.disabled
      }
      return <el-switch value={this.modelValue} props={props} on-change={this.handleInput} />
    },

    // 获取组件渲染函数
    getComponentRender() {
      if (isString(this.component)) {
        const type = this.component.toLowerCase()
        const renderMap = {
          button: this.renderButton,
          checkbox: this.renderCheckbox,
          datepicker: this.renderDatePicker,
          datetimepicker: this.renderDateTimePicker,
          input: this.renderInput,
          imagepicker: this.renderImagePicker,
          radio: this.renderRadio,
          select: this.renderSelect,
          switch: this.renderSwitch
        }
        return renderMap[type] || this.renderInput
      }

      if (typeof this.component === 'function') {
        return () =>
          this.component({
            value: this.modelValue,
            props: this.componentProps,
            onInput: this.handleInput,
            h,
            formData: this.formData
          })
      }

      return this.renderInput
    }
  },
  watch: {
    value: {
      handler(val) {
        this.modelValue = val
      },
      immediate: true
    }
  },
  render(h) {
    if (this.component === 'group') {
      return <div class='form-field-group'>{this.label}</div>
    }

    // 获取对应的渲染函数
    const renderComponent = this.getComponentRender()
    // 渲染表单项
    return h('div', { class: ['form-field', this.formItemClass] }, [
      h(
        'el-form-item',
        {
          props: {
            label: this.label || '',
            labelWidth: this.labelWidth,
            prop: this.fieldName,
            rules: this.rules
          },
          directives: [
            {
              name: 'show',
              value: this.isShow ? this.isShow(this.modelValue) : true
            }
          ]
        },
        [
          renderComponent(this.componentProps),
          this.tip
            ? h('div', { class: 'text-sm text-gray-500 mt-0.5' }, [
                isFunction(this.tip) ? this.tip() : this.tip
              ])
            : null
        ]
      )
    ])
  }
}
