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
  }
  &.min {
    .el-form-item {
      margin-bottom: 10px;
    }
  }
  .el-input {
    max-width: 260px;
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
  created() {},
  methods: {
    handleCancel() {
      // this.$emit('input', false)
    },
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$emit('input', this.value)
          this.$emit('onSubmit')
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$refs['form'] && this.$refs['form'].resetFields()
      this.localComps.forEach((comp) => {
        comp.resetField && comp.resetField(comp.$parent.initialValue)
      })
    },
    getItemShow({ isShow }) {
      if (isFunction(isShow)) {
        return isShow()
      } else {
        return isShow !== false
      }
    }
  },
  render() {
    const { title, value, formList, width } = this
    const Fn = () => {}
    const localComps = []
    const getComponentByType = (item) => {
      if (typeof item.component != 'undefined') {
        const comp = item.component()
        const { context, data } = comp
        // Vue.component(item.component)
        if (data && data.ref) {
          localComps.push(context.$refs[data.ref])
        }
        return comp
        // return <component is={item.component} ref='com' />
      } else if (item.type == 'textarea') {
        return (
          <el-input
            clearable
            type='textarea'
            placeholder={item.placeholder || '请输入内容'}
            rows={5}
            maxlength={item.maxlength}
            v-model={value[item.key]}
            show-word-limit
          />
        )
      } else if (item.type == 'input') {
        return (
          <el-input
            clearable
            type='text'
            placeholder={item.placeholder || '请输入内容'}
            v-model={this.value[item.key]}
          >
            <template slot='append'>{item.append}</template>
          </el-input>
        )
      } else if (item.type == 'text') {
        return <div class='el-text'>{value[item.key]}</div>
      } else if (item.type == 'select') {
        return (
          <el-select
            clearable
            v-model={value[item.key]}
            placeholder={item.placeholder || '请选择'}
            onChange={item.onChange || Fn}
          >
            {item.options.map((op) => (
              <el-option key={op.value} label={op.title} value={op.value}></el-option>
            ))}
          </el-select>
        )
      } else if (item.type == 'radio') {
        return (
          <el-radio-group
            v-model={value[item.key]}
            onChange={item.onChange || Fn}
            disabled={item.disabled || false}
          >
            {item.options.map((op) => (
              <el-radio label={op.label}>{op.name}</el-radio>
            ))}
          </el-radio-group>
        )
      } else if (item.type == 'checkbox') {
        return (
          <el-checkbox-group
            v-model={value[item.key]}
            onChange={item.onChange || Fn}
            disabled={item.disabled || false}
          >
            {item.options.map((op) => (
              <el-checkbox label={op.label} disabled={op.disabled || false} key={op.label}>
                {op.name}
              </el-checkbox>
            ))}
          </el-checkbox-group>
        )
      } else if (item.type == 'table') {
        return (
          <el-table border data={value[item.key]}>
            {item.options
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
      } else if (item.type == 'richText') {
        return (
          <vue-html5-editor
            ref='editor'
            content={value[item.key]}
            height={260}
            style='width: 80%'
            on-change={(e) => {
              value[item.key] = e
            }}
          />
        )
      } else if (item.type == 'image') {
        return <SpImage />
      } else if (item.type == 'switch') {
        return <el-switch v-model={value[item.key]} on-change={item.onChange || Fn} />
      }
    }

    let rules = {}
    formList.forEach((item) => {
      if (item.required) {
        rules[item.key] = [{ required: true, message: item.message }]
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
        label-width='160px'
        validate-on-rule-change={false}
        inline-message
      >
        {formList.map((item, index) => {
          if (item.type == 'group') {
            return <div class='sp-form-group'>{item.label}</div>
          } else {
            return (
              <el-form-item
                label={`${item.label}:`}
                prop={item.key}
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
            <el-button type='primary' onClick={this.handleSubmit}>
              确定
            </el-button>
          </el-form-item>
        )}
      </el-form>
    )
  }
}
</script>
