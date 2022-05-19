<style lang="scss">
.sp-form {
  .el-form-item {
    margin-bottom: 26px;
  }
  .el-input {
    max-width: 260px;
  }
  .form-item-tip {
    font-size: 13px;
    color: #999;
    line-height: 1;
    position: absolute;
  }
}
</style>

<script>
import Vue from 'vue'
export default {
  name: 'SpForm',
  props: {
    formList: Array,
    value: [Number, String, Object]
  },
  data () {
    // const _form = {}
    // this.formList.forEach(({ value, key }) => {
    //   _form[key] = value || ''
    // })
    // const { value } = this
    return {
      // formData: value
    }
  },
  created () {},
  methods: {
    handleCancel () {
      // this.$emit('input', false)
    },
    handleSubmit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$emit('input', this.value)
          this.$emit('onSubmit')
        } else {
          return false
        }
      })
    },
    resetForm () {
      this.$refs['form'] && this.$refs['form'].resetFields()
    }
  },
  render () {
    const { title, value, formList, width } = this
    const Fn = () => {}
    const getComponentByType = (item) => {
      console.log(item.key)
      if (item.type == 'textarea') {
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
          />
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

    return (
      <el-form
        ref='form'
        class='sp-form'
        props={{
          model: value
        }}
        rules={rules}
        label-width='160px'
        validate-on-rule-change={false}
        inline-message
      >
        {formList.map((item, index) => {
          return (
            <el-form-item label={`${item.label}:`} prop={item.key} v-show={item.isShow !== false}>
              {getComponentByType(item)}
              <div class='form-item-tip'>{item.tip}</div>
            </el-form-item>
          )
        })}
        <el-form-item>
          <el-button onClick={this.resetForm}>重置</el-button>
          <el-button type='primary' onClick={this.handleSubmit}>
            确定
          </el-button>
        </el-form-item>
      </el-form>
    )
  }
}
</script>
