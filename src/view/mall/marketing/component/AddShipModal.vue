<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-dialog
    :title="$t('9c4b2ce5.59a702')"
    :visible.sync="visible"
    width="30%"
    :close-on-click-modal="false"
    :show-close="false"
    class="cus-shop-modal"
  >
    <div style="margin-bottom: 20px">{{ content }}</div>
    <el-form
      v-if="info.audit_state == '3'"
      :model="form"
      label-position="top"
      label-width="140px"
      :rules="rules"
      ref="form"
    >
      <el-form-item :label="info.mer_name + $t('9c4b2ce5.3ab164')" prop="headquarters_proportion">
        <el-input v-model="form.headquarters_proportion" style="width: 70%">
          <i slot="suffix">%</i>
        </el-input>
      </el-form-item>
      <el-form-item :label="info.username + $t('9c4b2ce5.3ab164')" prop="dealer_proportion">
        <el-input v-model="form.dealer_proportion" style="width: 70%">
          <i slot="suffix">%</i>
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="handleDialogChange">
        {{ $t('9c4b2ce5.aa7527') }}
      </el-button>
      <el-button type="primary" size="small" plain @click="handleDialogClose">
        {{ $t('9c4b2ce5.c08ab9') }}
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
        headquarters_proportion: '',
        dealer_proportion: ''
      },
      rules: {
        headquarters_proportion: [
          { validator: this.validateNumber, trigger: 'change', required: true }
        ],
        dealer_proportion: [{ validator: this.validateNumber, trigger: 'change', required: true }]
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
      const { distributor_id, name } = this.info
      let operator_id = this.$route.query.dealer_id
      dealerRelStore({
        ...this.form,
        operator_id,
        distributor_id,
        name,
        is_rel: 1
      }).then((res) => {
        this.form = {}
        this.$emit('handleClick', false)
        // 跳转到列表页
        this.$message({
          message: this.$t('9c4b2ce5.33130f'),
          type: 'success'
        })
      })
    },
    handleDialogClose() {
      this.form = {}
      this.$emit('handleClick', false)
    },
    validateNumber(rule, value, callback) {
      // 分账占比校验
      const { headquarters_proportion, dealer_proportion } = this.form
      let sum = Number(headquarters_proportion) + Number(dealer_proportion)
      const reg = /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
      if (!value) {
        callback(new Error(this.$t('9c4b2ce5.02cc4f')))
      } else {
        if (!reg.test(value)) {
          callback(new Error(this.$t('9c4b2ce5.cc1ce5')))
        } else if (Number(value) > 100) {
          callback(new Error(this.$t('9c4b2ce5.d19795')))
        } else if (headquarters_proportion && dealer_proportion && sum > 100) {
          callback(new Error(this.$t('9c4b2ce5.91f96d')))
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
  .cus-item {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>
