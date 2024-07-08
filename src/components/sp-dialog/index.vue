<style lang="scss">
.sp-dialog {
  .el-dialog__header {
    border-bottom: 1px solid #f5f5f5;
  }
  .el-dialog__body {
    padding: 16px;
    .el-form {
      margin-right: 100px;
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
import SpForm from '../sp-form'
import { isFunction } from '@/utils'
export default {
  name: 'SpDialog',
  props: {
    title: String,
    value: {
      type: Boolean,
      default: false
    },
    formList: Array,
    form: Object,
    loading: {
      type: Boolean,
      default: false
    },
    destroyOnClose: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '800px'
    },
    labelWidth: {
      type: String,
      default: '120px'
    },
    confirmStatus:{
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      localForm: {}
    }
  },
  created() {
    console.log('sp-dialog. created')
  },
  methods: {
    handleCancel() {
      this.$emit('input', false)
    },
    onFormSubmit() {
      this.$emit('onSubmit')
    },
    resetForm() {
      this.$refs['form'] && this.$refs['form'].resetForm()
    }
  },
  render() {
    const { title, value, form, formList, width, labelWidth ,confirmStatus} = this

    if (!value) {
      return null
    }

    return (
      <el-dialog
        class='sp-dialog'
        title={title}
        visible={value}
        width={width}
        append-to-body
        onclose={this.handleCancel}
        close-on-click-modal={false}
      >
        <SpForm
          ref='form'
          value={form}
          formList={formList}
          submit={false}
          labelWidth={labelWidth}
          on-onSubmit={this.onFormSubmit}
        />
        <div slot='footer' class='dialog-footer'>
          <el-button onClick={this.handleCancel}>取 消</el-button>
          <el-button
            loading={confirmStatus}
            type='primary'
            onClick={() => {
              this.$refs['form'].handleSubmit()
            }}
          >
            确 定
          </el-button>
        </div>
      </el-dialog>
    )
  }
}
</script>
