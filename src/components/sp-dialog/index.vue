<style lang="scss">
.sp-dialog {
  .el-dialog__header {
    border-bottom: 1px solid #f5f5f5;
  }
  .el-dialog__body {
    padding: 16px;
    .el-form {
      margin-right: 200px;
    }
    .el-table {
      line-height: initial;
    }
    .el-table__row {
      td {
        padding: 6px 0;
      }
    }
  }
  .el-dialog__footer {
    border-top: 1px solid #f5f5f5;
  }
}
</style>

<script>
// const renderTextarea = () => {
//   return <el-input
//     type="text"
//     placeholder="请输入内容"
//     v-model="text"
//     maxlength="10"
//     show-word-limit
//   />
// }

export default {
  name: 'SpDialog',
  props: {
    title: String,
    value: false,
    formList: Array,
    form: Object
  },
  data () {
    return {}
  },
  created () {},
  methods: {
    handleCancel () {
      this.$emit('input', false)
    },
    handleSubmit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
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
    const { title, value, form, formList } = this
    const Fn = () => {}
    const getComponentByType = (item) => {
      if (item.type == 'textarea') {
        return (
          <el-input
            clearable
            type='textarea'
            placeholder={item.placeholder || '请输入内容'}
            rows={5}
            maxlength={item.maxlength}
            v-model={form[item.key]}
            show-word-limit
          />
        )
      } else if (item.type == 'input') {
        return (
          <el-input
            clearable
            type='text'
            placeholder={item.placeholder || '请输入内容'}
            v-model={form[item.key]}
          />
        )
      } else if (item.type == 'text') {
        return <div class='el-text'>{form[item.key]}</div>
      } else if (item.type == 'select') {
        return (
          <el-select
            clearable
            v-model={form[item.key]}
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
          <el-radio-group v-model={form[item.key]} onChange={item.onChange || Fn}>
            {item.options.map((op) => (
              <el-radio label={op.label}>{op.name}</el-radio>
            ))}
          </el-radio-group>
        )
      } else if (item.type == 'table') {
        return (
          <el-table border data={form[item.key]}>
            {item.options.map((op) => (
              <el-table-column prop={op.key} label={op.title} width={op.width}></el-table-column>
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
      <el-dialog
        class='sp-dialog'
        title={title}
        visible={value}
        width='800px'
        onclose={this.handleCancel}
      >
        <el-form
          ref='form'
          props={{
            model: form
          }}
          rules={rules}
          label-width='100px'
          validate-on-rule-change={false}
        >
          {formList.map((item, index) => {
            return (
              <el-form-item label={item.label} prop={item.key} v-show={item.isShow !== false}>
                {getComponentByType(item)}
              </el-form-item>
            )
            // return
          })}
        </el-form>
        <div slot='footer' class='dialog-footer'>
          <el-button onClick={this.handleCancel}>取 消</el-button>
          <el-button type='primary' onClick={this.handleSubmit}>
            确 定
          </el-button>
        </div>
      </el-dialog>
    )
  }
}
</script>
