import { isString } from '@/utils'
import { h } from 'vue'
import { PICKER_DATE_OPTIONS } from '@/consts'
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
      type: String,
      required: true
    },
    formItemClass: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    rules: {
      type: Array,
      default: () => []
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
    },
    // 渲染 input 组件
    renderInput() {
      return h('el-input', {
        attrs: {
          ...this.componentProps
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
      const options = (props.options || []).map(option =>
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
      const radios = (props.options || []).map(option =>
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
      const checkboxes = (props.options || []).map(option =>
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
            click: event => {
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
    // 渲染 datetime-range 组件
    renderDateTimePicker(props = {}) {
      return (
        <div class="el-date-picker__wrapper">
          <el-date-picker
            style="width: 100%"
            type={this.componentProps.type}
            startPlaceholder="开始日期/结束时间"
            // endPlaceholder="结束日期"
            rangeSeparator={`${this.modelValue.length > 1 ? '至' : ''}`}
            value={this.modelValue}
            pickerOptions={PICKER_DATE_OPTIONS}
            onInput={this.handleInput}
          />
        </div>
      )
      // return h('div', { class: 'el-date-picker__wrapper' }, [h('el-date-picker', {
      //   style: {
      //     width: '100%'
      //   },
      //   attrs: {
      //     ...this.componentProps
      //   },
      //   props: {
      //     startPlaceholder: '开始日期',
      //     endPlaceholder: '结束日期',
      //     rangeSeparator: '/',
      //     value: this.modelValue,
      //     pickerOptions: PICKER_DATE_OPTIONS
      //   },
      //   on: {
      //     change: () => {
      //       debugger
      //     },
      //     focus: () => {
      //       debugger
      //     },
      //     input: () => {
      //       debugger
      //     }
      //   }
      // })])
    },
    // 获取组件渲染函数
    getComponentRender() {
      if (isString(this.component)) {
        const type = this.component.toLowerCase()
        const renderMap = {
          input: this.renderInput,
          select: this.renderSelect,
          radio: this.renderRadio,
          checkbox: this.renderCheckbox,
          button: this.renderButton,
          datetimepicker: this.renderDateTimePicker
        }
        return renderMap[type] || this.renderInput
      }

      if (typeof this.component === 'function') {
        return () =>
          this.component({
            value: this.modelValue,
            props: this.componentProps,
            onInput: this.handleInput,
            h
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
    // 获取对应的渲染函数
    const renderComponent = this.getComponentRender()
    // 渲染表单项
    return h('div', { class: ['form-field', this.formItemClass] }, [
      h(
        'el-form-item',
        {
          props: {
            label: this.label,
            labelWidth: this.label ? '100px' : 'auto',
            prop: this.fieldName,
            rules: this.rules
          }
        },
        [renderComponent(this.componentProps)]
      )
    ])
  }
}
