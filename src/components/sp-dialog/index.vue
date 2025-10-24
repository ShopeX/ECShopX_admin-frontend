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
    confirmStatus: {
      type: Boolean,
      default: false
    },
    isShowFooter: {
      type: Boolean,
      default: true
    },
    confirmBtnText: {
      type: String,
      default: '确定'
    }
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
    const {
      title,
      value,
      form,
      formList,
      width,
      labelWidth,
      confirmStatus,
      isShowFooter,
      confirmBtnText
    } = this

    if (!value) {
      return null
    }

    return (
      <el-dialog
        class="sp-dialog"
        title={title}
        visible={value}
        width={width}
        append-to-body
        onclose={this.handleCancel}
        close-on-click-modal={false}
      >
        <SpForm
          ref="form"
          value={form}
          formList={formList}
          submit={false}
          labelWidth={labelWidth}
          on-onSubmit={this.onFormSubmit}
        />
        {isShowFooter && (
          <div slot="footer" class="dialog-footer">
            <el-button onClick={this.handleCancel}>取 消</el-button>
            <el-button
              loading={confirmStatus}
              type="primary"
              onClick={() => {
                this.$refs['form'].handleSubmit()
              }}
            >
              {confirmBtnText}
            </el-button>
          </div>
        )}
      </el-dialog>
    )
  }
}
</script>
