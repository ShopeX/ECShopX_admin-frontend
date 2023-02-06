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
      .is-error {
        .el-input__inner {
          border-color: #f56c6c;
        }
      }
    }
    &.inline {
      display: inline-block;
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
    value: [Number, String, Object],
    size: {
      type: String,
      default: 'normal'
    },
    submit: {
      type: Boolean,
      default: true
    },
    labelWidth: {
      type: String,
      default: '160px'
    },
    showMessage: {
      type: Boolean,
      default: false
    }
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
          disabled={disabled}
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
      const { className, placeholder, append, key, min, max, disabled = false } = item
      return (
        <el-input
          class={className}
          type='number'
          min={min}
          max={max}
          disabled={disabled}
          placeholder={placeholder || '请输入内容'}
          v-model={value[key]}
        >
          <template slot='append'>{append}</template>
        </el-input>
      )
    },
    _renderText(item) {
      const { value } = this
      const { key } = item
      return <div class='el-text'>{value[key]}</div>
    },
    _renderSelect(item) {
      const { value } = this
      const { key, placeholder, options, onChange = () => {} } = item
      return (
        <el-select
          clearable
          v-model={value[key]}
          placeholder={placeholder || '请选择'}
          onChange={onChange}
        >
          {options.map((op) => (
            <el-option key={op.value} label={op.title} value={op.value} />
          ))}
        </el-select>
      )
    },
    _renderRadio(item) {
      const { value } = this
      const { key, disabled = false, options, onChange = () => {} } = item
      return (
        <el-radio-group v-model={value[key]} onChange={onChange} disabled={disabled}>
          {options.map((op) => (
            <el-radio label={op.label}>{op.name}</el-radio>
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
      const { value } = this
      const { key, disabled = false, options } = item
      return (
        <vue-html5-editor
          ref='editor'
          content={value[key]}
          height={260}
          style='width: 80%'
          on-change={(e) => {
            value[key] = e
          }}
        />
      )
    },
    _renderImage(item) {
      const { value } = this
      const { key, disabled = false, options } = item
      return <SpImage />
    },
    _renderSwitch(item) {
      const { value } = this
      const { key, onChange = () => {} } = item
      return <el-switch v-model={value[key]} on-change={onChange} />
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
        'checkbox': this._renderCheckbox,
        'table': this._renderTable,
        'richText': this._renderRichText,
        'image': this._renderImage,
        'switch': this._renderSwitch
      }
      return renderItem[item.type](item)
    }

    let rules = {}
    formList.forEach((item) => {
      if (item.required) {
        rules[item.key] = [{ required: true, message: item.message || '不能为空' }]
      } else if (item.validator) {
        rules[item.key] = [{ validator: item.validator }]
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
                    'custom-error': typeof item.validator != 'undefined'
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
            <el-button onClick={this.resetForm}>重置</el-button>
            <el-button type='primary' onClick={this.onSubmit}>
              确定
            </el-button>
          </el-form-item>
        )}
      </el-form>
    )
  }
}
</script>
