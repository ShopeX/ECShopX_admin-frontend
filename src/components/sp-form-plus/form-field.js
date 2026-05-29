/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { isString } from '@/utils'
// 与实例 render(h) 使用同一套 h，避免弹窗/动态挂载场景下与 import 的 h 混用导致子树不更新
import { h as hCompat } from 'vue'
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
    cellWidth: {
      type: Number,
      default: 1
    },
    computedCellWidth: {
      type: Number,
      default: null
    },
    formData: Object,
    formType: {
      type: String,
      default: 'searchForm'
    },
    hideFieldRequiredMark: {
      type: Boolean,
      default: false
    },
    isShow: {
      type: Function
    },
    label: {
      type: String,
      default: ''
    },
    labelInline: {
      type: Boolean,
      default: false
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
    renderInput(props = {}, hCreate = hCompat) {
      return hCreate('el-input', {
        attrs: {
          ...props,
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
    renderTextarea(props = {}, hCreate = hCompat) {
      return this.renderInput(
        {
          rows: 3,
          ...props,
          type: 'textarea'
        },
        hCreate
      )
    },
    renderDivider(props = {}) {
      const label = props.label || this.label
      return <div class='form-field-divider'>{label}</div>
    },
    // 渲染 select 组件（options 仅用于生成 el-option 子节点，不可传入 el-select）
    // style/class 须放在 vnode 根上；el-option 的 key 须为 vnode.key（勿放在 props 内，否则弹窗/表格内可能不渲染）
    // hCreate 须传入 render(h) 的 h，保证与父级同一渲染上下文（弹窗内内置 select 必传）
    renderSelect(props = {}, hCreate = hCompat) {
      const {
        options: rawOptions = [],
        style: selectStyle,
        class: selectClass,
        ...selectRest
      } = props
      const optionVnodes = (rawOptions || []).map((option, idx) =>
        hCreate('el-option', {
          key: option.value != null ? String(option.value) : `opt-${idx}`,
          props: {
            label: option.label,
            value: option.value,
            disabled: option.disabled
          }
        })
      )

      return hCreate(
        'el-select',
        {
          class: selectClass,
          style: selectStyle,
          attrs: {
            size: this.size
          },
          props: {
            value: this.modelValue,
            placeholder: this.$t('1bb56920.708c9d') + (this.label || '').replace(/:$/, ''),
            popperAppendToBody: true,
            ...selectRest
          },
          on: {
            input: this.handleInput
          }
        },
        optionVnodes
      )
    },
    // 渲染 radio 组件
    renderRadio(props = {}, hCreate = hCompat) {
      const radios = (props.options || []).map((option) =>
        hCreate(
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

      return hCreate(
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
    // 渲染 checkbox 组件（el-checkbox-group 的 value 必须为数组，否则会出现勾选一个则全部勾选等问题）
    renderCheckbox(props = {}, hCreate = hCompat) {
      const { options = [], ...restProps } = props
      const checkboxes = options.map((option) =>
        hCreate(
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
      const groupValue = Array.isArray(this.modelValue)
        ? this.modelValue
        : this.modelValue != null && this.modelValue !== ''
        ? [].concat(this.modelValue)
        : []

      return hCreate(
        'el-checkbox-group',
        {
          props: {
            ...restProps,
            value: groupValue
          },
          on: {
            input: this.handleInput
          }
        },
        checkboxes
      )
    },
    // 渲染 button 组件
    renderButton(props = {}, hCreate = hCompat) {
      return hCreate(
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
        props.text || this.label || this.$t('1bb56920.fa9663')
      )
    },
    renderDatePicker(props = {}) {
      return (
        <div class='el-date-picker__wrapper'>
          <el-date-picker
            size={this.size || 'small'}
            type='date'
            value={this.modelValue}
            prefix-icon={false}
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
            size={this.size || 'small'}
            type={this.componentProps.type}
            startPlaceholder={this.$t('1bb56920.ad93ed')}
            default-time={['00:00:00', '23:59:59']}
            // endPlaceholder="结束日期"
            rangeSeparator={`${this.modelValue.length > 1 ? '~' : ''}`}
            value={this.modelValue}
            pickerOptions={{
              ...PICKER_DATE_OPTIONS,
              shortcuts: PICKER_DATE_OPTIONS.shortcuts.map((s) => ({
                ...s,
                text: this.$t(s.text)
              }))
            }}
            prefix-icon={false}
            onInput={this.handleInput}
          />
        </div>
      )
    },
    renderImagePicker(props = {}) {
      return <SpImagePicker value={this.modelValue} {...props} on-onChange={this.handleInput} />
    },
    renderCascader(props = {}, hCreate = hCompat) {
      return hCreate('el-cascader', {
        attrs: {
          ...props,
          size: this.size || 'small'
        },
        props: {
          value: this.modelValue,
          options: props.options || [],
          props: props.props,
          clearable: props.clearable,
          placeholder: props.placeholder
        },
        on: {
          change: this.handleInput
        }
      })
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

    // 渲染 upload 组件
    renderUpload(props = {}, hCreate = hCompat) {
      const uploadProps = {
        action: props.action || '',
        'auto-upload': props.autoUpload,
        'on-change': props.onChange || this.handleInput,
        'file-list': this.modelValue || [],
        ...props
      }

      return hCreate('div', {}, [
        hCreate('span', { style: {} }, props.title),
        hCreate(
          'el-upload',
          {
            class: props.class || '',
            props: uploadProps
          },
          [
            hCreate(
              'el-button',
              {
                props: {
                  size: props.buttonSize || 'small',
                  type: props.buttonType || 'primary'
                }
              },
              props.buttonText || this.$t('1bb56920.2c808b')
            )
          ]
        )
      ])
    },

    // 获取组件渲染函数（传入 render(h) 的 h，与当前实例同一渲染上下文）
    getComponentRender(hRender) {
      const hFn = hRender || hCompat
      if (isString(this.component)) {
        const type = this.component.toLowerCase()
        const renderMap = {
          button: (props) => this.renderButton(props, hFn),
          checkbox: (props) => this.renderCheckbox(props, hFn),
          datepicker: (props) => this.renderDatePicker(props),
          datetimepicker: (props) => this.renderDateTimePicker(props),
          divider: (props) => this.renderDivider(props),
          input: (props) => this.renderInput(props, hFn),
          imagepicker: (props) => this.renderImagePicker(props),
          radio: (props) => this.renderRadio(props, hFn),
          select: (props) => this.renderSelect(props, hFn),
          switch: () => this.renderSwitch(),
          textarea: (props) => this.renderTextarea(props, hFn),
          upload: (props) => this.renderUpload(props, hFn),
          cascader: (props) => this.renderCascader(props, hFn)
        }
        return renderMap[type] || ((props) => this.renderInput(props, hFn))
      }

      if (typeof this.component === 'function') {
        return () =>
          this.component({
            value: this.modelValue,
            props: this.componentProps,
            onInput: this.handleInput,
            h: hFn,
            formData: this.formData
          })
      }

      return (props) => this.renderInput(props, hFn)
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
    // 检查是否应该显示该字段
    const shouldShow = this.isShow ? this.isShow(this.modelValue) : true
    if (!shouldShow) {
      // 如果不需要显示，直接返回 null，不占据任何空间
      return null
    }

    const isDivider =
      isString(this.component) && ['group', 'divider'].includes(this.component.toLowerCase())
    if (isDivider) {
      return this.renderDivider(this.componentProps)
    }

    // 获取对应的渲染函数（与当前 render 共用 h）
    const renderComponent = this.getComponentRender(h)

    // 渲染表单项
    const divProps = {
      class: ['form-field', this.formItemClass],
      attrs: {
        'data-cell-width': this.cellWidth
      }
    }
    if (this.computedCellWidth) {
      divProps.style = {
        flex: `0 0 ${this.computedCellWidth}px`,
        maxWidth: `${this.computedCellWidth}px`,
        width: `${this.computedCellWidth}px`
      }
    }

    return h('div', divProps, [
      h(
        'el-form-item',
        {
          props: {
            label: this.label || '',
            labelWidth: this.labelWidth,
            prop: this.fieldName,
            rules: this.rules
          },
          class: [
            { 'label-inline': this.labelInline },
            { 'hide-field-required-mark': this.hideFieldRequiredMark }
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
