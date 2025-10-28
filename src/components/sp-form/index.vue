<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<style lang="scss">
.sp-form {
  .el-form-item {
    margin-bottom: 26px;
    &__error {
      position: absolute !important;
      top: 100% !important;
      left: 0 !important;
      margin-left: 0;
    }
    &.custom-error {
      .el-input__inner {
        border-color: #d9d9d9;
      }
    }
    &.is-error {
      .is-error {
        .el-input__inner {
          border-color: #f56c6c;
        }
      }
    }
    &.inline {
      display: inline-block;
      vertical-align: top;
    }
    &.no-label {
      > .el-form-item__content {
        margin-left: 0 !important;
      }
    }
  }
  &.min {
    .el-form-item {
      margin-bottom: 10px;
    }
  }
  .el-input,
  .el-select {
    max-width: 260px;
  }
  .el-select {
    display: block;
  }
  .form-item-tip {
    font-size: 13px;
    color: #999;
    line-height: initial;
  }
  .sp-form-group {
    &:before {
      position: absolute;
      top: 11px;
      bottom: 11px;
      left: 0;
      width: 2px;
      background-color: #298dff;
      content: '';
    }
    padding: 6px 0 6px 8px;
    color: #333;
    font-weight: 500;
    font-size: 16px;
    position: relative;
    border-bottom: 1px solid #f1f2f5;
    margin-bottom: 10px;
  }
}
</style>

<script>
import { isFunction } from '@/utils'
export default {
  name: 'SpForm',
  props: {
    formList: Array,
    labelWidth: {
      type: String,
      default: '160px'
    },
    resetBtn: {
      type: Boolean,
      default: true
    },
    resetBtnText: {
      type: String,
      default: '重置'
    },
    submitBtn: {
      type: Boolean,
      default: true
    },
    submitBtnText: {
      type: String,
      default: '确定'
    },
    size: {
      type: String,
      default: 'normal'
    },
    submit: {
      type: Boolean,
      default: true
    },
    showMessage: {
      type: Boolean,
      default: false
    },
    value: [Number, String, Object]
  },
  data() {
    // const _form = {}
    // this.formList.forEach(({ value, key }) => {
    //   _form[key] = value || ''
    // })
    // const { value } = this
    return {
      // formData: value
      localComps: []
    }
  },
  // watch: {
  //   value: {
  //     deep: true,
  //     handler(val) {
  //       this.$emit('input', val)
  //     }
  //   }
  // },
  created() {},
  methods: {
    handleCancel() {
      // this.$emit('input', false)
    },
    onSubmit() {
      this.handleSubmit().catch(() => {})
    },
    handleSubmit() {
      return new Promise((resolve, reject) => {
        this.$refs['form'].validate((valid, errField) => {
          if (valid) {
            this.$emit('input', this.value)
            this.$emit('onSubmit')
            resolve()
          } else {
            if (this.showMessage) {
              const keys = Object.keys(errField)
              const { key, validator } = this.formList.find(({ key }) => keys.includes(key))
              this.$message.error(errField[key][0].message)
            }
            reject(errField)
            // return false
          }
        })
      })
    },
    resetForm() {
      this.$refs['form'] && this.$refs['form'].resetFields()
      this.localComps.forEach((comp) => {
        comp.resetField && comp.resetField(comp.$parent.initialValue)
      })
    },
    getItemShow(item) {
      const { value } = this
      const { isShow } = item
      if (isFunction(isShow)) {
        return isShow(item, value)
      } else {
        return isShow !== false
      }
    },
    setField(data, key, value) {
      data.forEach((item) => {
        if (item.key === key) {
          Object.keys(value).forEach((k) => {
            item[k] = value[k]
          })
        }
      })
    },
    _renderTextArea(item) {
      const { value } = this
      const { placeholder, maxlength, key } = item
      return (
        <el-input
          clearable
          type='textarea'
          placeholder={placeholder || '请输入内容'}
          rows={5}
          maxlength={maxlength}
          v-model={value[key]}
          show-word-limit
        />
      )
    },
    _renderInput(item) {
      const { value } = this
      const { className, placeholder, append, key, maxlength, disabled = false } = item
      return (
        <el-input
          clearable
          class={className}
          type='text'
          disabled={isFunction(disabled) ? disabled() : disabled}
          maxlength={maxlength}
          showWordLimit={!!maxlength}
          placeholder={placeholder || '请输入内容'}
          v-model={value[key]}
        >
          <template slot='append'>{append}</template>
        </el-input>
      )
    },
    _renderNumber(item) {
      const { value } = this
      const {
        className,
        placeholder,
        append,
        key,
        min = 0,
        max,
        disabled = false,
        precision = 0,
        setp = 1
      } = item
      return (
        // <el-input
        //   class={className}
        //   type='number'
        //   min={min}
        //   max={max}
        //   disabled={disabled}
        //   placeholder={placeholder || '请输入内容'}
        //   v-model={value[key]}
        // >
        //   <template slot='append'>{append}</template>
        // </el-input>
        <el-input-number
          v-model={value[key]}
          controls-position='right'
          min={min}
          max={max}
          precision={precision}
          setp={setp}
        />
      )
    },
    _renderText(item) {
      const { value } = this
      const { key } = item
      return <div class='el-text'>{value[key]}</div>
    },
    _renderSelect(item) {
      const { value } = this
      const { key, placeholder, options, clearable, onChange = () => {}, disabled = false } = item
      return (
        <el-select
          clearable={clearable ?? true}
          filterable
          v-model={value[key]}
          placeholder={placeholder || '请选择'}
          onChange={onChange}
          disabled={isFunction(disabled) ? disabled() : disabled}
        >
          {options.map((op) => (
            <el-option
              key={op.value}
              label={op.title}
              value={op.value}
              disabled={isFunction(op.disabled) ? op.disabled() : op.disabled}
            />
          ))}
        </el-select>
      )
    },
    _renderRadio(item) {
      const { value } = this
      const { key, disabled = false, options, onChange = () => {} } = item
      return (
        <el-radio-group
          v-model={value[key]}
          onChange={onChange}
          disabled={isFunction(disabled) ? disabled() : disabled}
        >
          {options.map((op) => (
            <el-radio label={op.label}>{op.name}</el-radio>
          ))}
        </el-radio-group>
      )
    },
    _renderRadioButton({ key, options, onchange = () => {} }) {
      return (
        <el-radio-group v-model={this.value[key]} size='mini' onChange={(e) => onchange(e, this)}>
          {options.map((op) => (
            <el-radio-button label={op.label}>{op.name}</el-radio-button>
          ))}
        </el-radio-group>
      )
    },
    _renderCheckbox(item) {
      const { value } = this
      const { key, disabled = false, options, onChange = () => {} } = item
      return (
        <el-checkbox-group v-model={value[key]} onChange={onChange} disabled={disabled}>
          {options.map((op) => (
            <el-checkbox label={op.label} disabled={op.disabled} key={op.label}>
              {op.name}
            </el-checkbox>
          ))}
        </el-checkbox-group>
      )
    },
    _renderTable(item) {
      const { value } = this
      const { key, disabled = false, options } = item
      return (
        <el-table border data={value[key]}>
          {options
            .filter((item) => item.isShow !== false)
            .map((op) => (
              <el-table-column
                prop={op.key}
                label={op.title}
                width={op.width}
                formatter={op.render}
              ></el-table-column>
            ))}
        </el-table>
      )
    },
    _renderRichText(item) {
      const { value, editorModules } = this
      const { key, disabled = false, options } = item
      return <SpRichText v-model={value[key]} />
    },
    _renderImage(item) {
      const { value } = this
      const { key, disabled = false, options } = item
      return <SpImage />
    },
    _renderSwitch(item) {
      const { value } = this
      const { key, disabled = false, onChange = () => {} } = item
      return (
        <el-switch
          v-model={value[key]}
          on-change={onChange}
          disabled={isFunction(disabled) ? disabled() : disabled}
        />
      )
    },
    _renderColor(item) {
      const { value } = this
      const { key, initValue = '#fff' } = item
      return (
        <div class='el-color-picker-wrap'>
          <el-color-picker v-model={value[key]} size='small' />
          <el-button
            class='button-reset'
            type='text'
            on-click={() => {
              value[key] = initValue
            }}
          >
            重置
          </el-button>
        </div>
      )
    },
    _renderSlider(item) {
      const { value } = this
      const { key, showInput = false } = item
      return <el-slider v-model={value[key]} show-input={showInput} />
    }
  },
  render() {
    const { title, value, formList, width, labelWidth } = this
    // console.log('sp-form value:', value)
    const localComps = []
    const getComponentByType = (item) => {
      if (typeof item.component != 'undefined') {
        const comp = item.component(item, value)
        const { context, data } = comp
        if (data && data.ref) {
          localComps.push(context.$refs[data.ref])
        }
        return comp
      }

      const renderItem = {
        'textarea': this._renderTextArea,
        'input': this._renderInput,
        'number': this._renderNumber,
        'text': this._renderText,
        'select': this._renderSelect,
        'radio': this._renderRadio,
        'radiobutton': this._renderRadioButton,
        'checkbox': this._renderCheckbox,
        'table': this._renderTable,
        'richText': this._renderRichText,
        'image': this._renderImage,
        'switch': this._renderSwitch,
        'color': this._renderColor,
        'slider': this._renderSlider
      }
      return renderItem[item.type](item)
    }

    let rules = {}
    formList.forEach((item) => {
      if (item.validator) {
        rules[item.key] = [{ validator: item.validator }]
      } else if (item.required) {
        rules[item.key] = [{ required: true, message: item.message || '不能为空' }]
      }
    })
    this.localComps = localComps

    return (
      <el-form
        ref='form'
        class={{
          'sp-form': true,
          normal: this.size == 'normal',
          min: this.size == 'min'
        }}
        props={{
          model: value
        }}
        rules={rules}
        label-width={labelWidth}
        validate-on-rule-change={false}
        inline-message
      >
        {formList.map((item, index) => {
          if (item.type == 'group') {
            return (
              <div class='sp-form-group' v-show={this.getItemShow(item)}>
                {item.label}
              </div>
            )
          } else {
            return (
              <el-form-item
                label={item.label ? `${item.label}:` : ''}
                prop={item.key}
                required={typeof item.required == 'undefined' ? false : item.required}
                class={[
                  item.display,
                  {
                    'no-label': typeof item.label == 'undefined',
                    'custom-error': typeof item.component != 'undefined',
                    'is-required': item.required || item.validator,
                    inline: typeof item.inline != 'undefined' ? item.inline : false
                  }
                ]}
                style={{
                  width: item.width ? item.width : 'auto'
                }}
                showMessage={typeof item.showMessage == 'undefined' ? true : item.showMessage}
                v-show={this.getItemShow(item)}
              >
                {getComponentByType(item)}
                <div class='form-item-tip' domPropsInnerHTML={item.tip}></div>
              </el-form-item>
            )
          }
        })}
        {this.submit && (
          <el-form-item>
            {this.resetBtn && (
              <el-button class='mr-5' type='default' onClick={this.resetForm}>
                {this.resetBtnText}
              </el-button>
            )}
            {this.submitBtn && (
              <el-button type='primary' onClick={this.onSubmit}>
                {this.submitBtnText}
              </el-button>
            )}
          </el-form-item>
        )}
      </el-form>
    )
  }
}
</script>
