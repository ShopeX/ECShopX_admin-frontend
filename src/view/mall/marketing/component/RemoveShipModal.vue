<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-dialog
    :title="$t('d3a35fa3.59a702')"
    :visible.sync="visible"
    width="33%"
    :close-on-click-modal="false"
    :show-close="false"
    class="cus-shop-modal"
    @close="handleDialogClose"
  >
    <div style="margin-bottom: 10px">
      {{ content }}
    </div>
    <el-form
      v-if="info.audit_state == '3'"
      ref="form"
      :model="form"
      :rules="rules"
      label-position="top"
      label-width="140px"
    >
      <el-form-item :label="$t('d3a35fa3.08605d')" prop="headquarters_proportion">
        <el-input v-model="form.headquarters_proportion" style="width: 70%">
          <i slot="suffix">%</i>
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" plain @click="handleDialogClose">
        {{ $t('d3a35fa3.625fb2') }}
      </el-button>
      <el-button type="primary" size="small" @click="handleDialogChange">
        {{ $t('d3a35fa3.38cf16') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { dealerRelStore } from '@/api/marketing'
export default {
  props: ['content', 'handleClick', 'visible', 'info'],
  data() {
    return {
      form: {
        headquarters_proportion: ''
      },
      rules: {
        headquarters_proportion: [
          { validator: this.validateNumber, trigger: 'change', required: true }
        ]
      }
    }
  },
  methods: {
    handleDialogChange() {
      const { audit_state } = this.info
      if (audit_state == '3') {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.onPush()
          }
        })
      } else {
        this.onPush()
      }
    },
    onPush() {
      const { operator_id, distributor_id, name } = this.info
      dealerRelStore({
        ...this.form,
        operator_id,
        distributor_id,
        name,
        is_rel: 0
      }).then((res) => {
        this.$emit('handleClick', false)
        this.form = {}
        this.$message({
          message: this.$t('d3a35fa3.33130f'),
          type: 'success'
        })
      })
    },
    handleDialogClose() {
      this.form = {}
      this.$emit('handleClick', false)
    },
    validateNumber(rule, value, callback) {
      const reg = /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
      if (!value) {
        callback(new Error(this.$t('d3a35fa3.02cc4f')))
      } else {
        if (!reg.test(value)) {
          callback(new Error(this.$t('d3a35fa3.cc1ce5')))
        } else if (Number(value) > 100) {
          callback(new Error(this.$t('d3a35fa3.d19795')))
        } else {
          callback()
        }
      }
    }
  }
}
</script>

<style lang="scss">
.cus-shop-modal {
  .el-form-item__label {
    padding: 0px;
  }
  .el-dialog__body {
    padding: 20px 40px !important;
    padding-bottom: 0px !important;
  }
}
</style>
