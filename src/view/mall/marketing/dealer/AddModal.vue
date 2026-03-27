<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-dialog
    :title="$t('eb7ad42d.28ce82')"
    :visible.sync="visible"
    width="35%"
    :close-on-click-modal="false"
    :show-close="false"
    class="cus-dialog-css"
  >
    <el-form ref="form" :model="form" label-width="100px" :rules="rules">
      <el-form-item :label="$t('eb7ad42d.f47e27')" prop="username">
        <el-input v-model="form.username" class="input-m" :placeholder="$t('eb7ad42d.02cc4f')" />
      </el-form-item>
      <el-form-item :label="$t('eb7ad42d.52409d')" prop="contact">
        <el-input v-model="form.contact" class="input-m" :placeholder="$t('eb7ad42d.02cc4f')" />
      </el-form-item>
      <el-form-item :label="$t('eb7ad42d.8098e2')" prop="mobile">
        <el-input
          v-model="form.mobile"
          class="input-m"
          :maxlength="11"
          :placeholder="$t('eb7ad42d.02cc4f')"
        />
      </el-form-item>
      <el-form-item :label="$t('eb7ad42d.bb2cdf')" prop="login_name">
        <el-input v-model="form.login_name" class="input-m" :placeholder="$t('eb7ad42d.02cc4f')" />
      </el-form-item>
      <el-form-item :label="$t('eb7ad42d.2b1c37')" prop="password">
        <el-input v-model="form.password" class="input-m" :placeholder="$t('eb7ad42d.02cc4f')" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleModalConfirm(true)">
          {{ $t('eb7ad42d.e83a25') }}
        </el-button>
        <el-button type="primary" plain @click="handleModalConfirm(false)">
          {{ $t('eb7ad42d.625fb2') }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { addDealer } from '@/api/marketing'
export default {
  props: ['handleClose', 'visible'],
  data() {
    return {
      form: {
        username: '',
        contact: '',
        mobile: '',
        login_name: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: this.$t('eb7ad42d.02cc4f'), trigger: 'change' }],
        contact: [{ required: true, message: this.$t('eb7ad42d.02cc4f'), trigger: 'change' }],
        mobile: [{ required: true, message: this.$t('eb7ad42d.02cc4f'), trigger: 'change' }],
        login_name: [{ required: true, message: this.$t('eb7ad42d.02cc4f'), trigger: 'change' }],
        password: [
          {
            required: true,
            message: this.$t('eb7ad42d.02cc4f'),
            trigger: 'change',
            validator: this.validateNumber
          }
        ]
      }
    }
  },
  methods: {
    handleModalConfirm(visible) {
      if (visible) {
        this.$refs['form'].validate(async (vaild) => {
          if (vaild) {
            const { form } = this
            addDealer({ ...form, operator_type: 'dealer' })
              .then(() => {
                this.$message.success(this.$t('eb7ad42d.a5bfd7'))
                this.$emit('handleClose', false)
              })
              .catch(() => {
                this.$message.error(this.$t('eb7ad42d.bac372'))
              })
          }
        })
      } else {
        this.$emit('handleClose', false)
      }
    },
    validateNumber(rule, value, callback) {
      if (value.length < 6 || value.length > 12) {
        callback(new Error(this.$t('eb7ad42d.9291b6')))
      } else {
        callback()
      }
    }
  }
}
</script>
<style lang="scss">
.cus-dialog-css {
  .el-dialog__body {
    display: flex;
    justify-content: center;
  }
}
</style>
