import { isString } from '@/utils'
import { h } from 'vue'
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
    renderInput(props = {}) {
      return h('el-input', {
        props: {
          value: this.modelValue,
          placeholder: `请输入${this.label}`,
          ...props
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
    // 获取组件渲染函数
    getComponentRender() {
      if (isString(this.component)) {
        const type = this.component.toLowerCase()
        const renderMap = {
          input: this.renderInput,
          select: this.renderSelect,
          radio: this.renderRadio,
          checkbox: this.renderCheckbox,
          button: this.renderButton
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
    return h('div', { class: 'form-field' }, [
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
