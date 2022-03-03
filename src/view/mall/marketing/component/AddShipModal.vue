<template>
  <el-dialog
    title="通知消息"
    :visible.sync="visible"
    width="30%"
    :close-on-click-modal="false"
    :show-close="false"
    class="cus-shop-modal"
  >
    <div style="margin-bottom: 20px">
      {{ content }}
    </div>
    <el-form
      v-if="info.audit_state == '3'"
      ref="form"
      :model="form"
      label-position="top"
      label-width="140px"
      :rules="rules"
    >
      <el-form-item
        :label="info.mer_name + '分账占比'"
        prop="headquarters_proportion"
      >
        <el-input
          v-model="form.headquarters_proportion"
          style="width: 70%"
        >
          <i slot="suffix">%</i>
        </el-input>
      </el-form-item>
      <el-form-item
        :label="info.username + '分账占比'"
        prop="dealer_proportion"
      >
        <el-input
          v-model="form.dealer_proportion"
          style="width: 70%"
        >
          <i slot="suffix">%</i>
        </el-input>
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="primary"
        size="small"
        @click="handleDialogChange"
      >
        确 定
      </el-button>
      <el-button
        type="primary"
        size="small"
        plain
        @click="handleDialogClose"
      >
        取 消
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { dealerRelStore } from '@/api/marketing'
export default {
  props: ['content', 'handleClick', 'visible', 'info'],
  data () {
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
    handleDialogChange () {
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
    onPush () {
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
          message: '操作成功',
          type: 'success'
        })
      })
    },
    handleDialogClose () {
      this.form = {}
      this.$emit('handleClick', false)
    },
    validateNumber (rule, value, callback) {
      // 分账占比校验
      const { headquarters_proportion, dealer_proportion } = this.form
      let sum = Number(headquarters_proportion) + Number(dealer_proportion)
      const reg = /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
      if (!value) {
        callback(new Error('请输入'))
      } else {
        if (!reg.test(value)) {
          callback(new Error('请输入正确格式，最多保留两位小数'))
        } else if (Number(value) > 100) {
          callback(new Error('分账比例不能超过100'))
        } else if (headquarters_proportion && dealer_proportion && sum > 100) {
          callback(new Error('请输入正确分账占比'))
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
