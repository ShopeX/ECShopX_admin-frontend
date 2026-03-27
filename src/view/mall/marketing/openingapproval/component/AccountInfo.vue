<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-card class="mycard">
      <div slot="header">
        {{ $t('a4450ce9.1f0739') }}
        <el-popover v-if="subTitle" placement="top-start" width="400" trigger="hover">
          <i slot="reference" class="el-icon-question" />
          <pre slot="" style="white-space: pre-line">
            {{ subTitle }}
          </pre>
        </el-popover>
      </div>
      <el-form ref="form" :model="form" :rules="rules">
        <el-row class="cus-row-form">
          <el-col :span="12">
            <el-form-item :label="$t('a4450ce9.6e640f')" prop="adapay_fee_mode">
              <el-select
                v-model="form.adapay_fee_mode"
                :clearable="true"
                :placeholder="$t('a4450ce9.708c9d')"
                style="width: 100%"
              >
                <el-option :label="$t('a4450ce9.75d29a')" value="I" />
                <el-option :label="$t('a4450ce9.6c1506')" value="O" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('a4450ce9.08605d')" prop="headquarters_proportion">
              <el-input
                v-model="form.headquarters_proportion"
                :clearable="true"
                :placeholder="$t('a4450ce9.02cc4f')"
                style="width: 100%"
              >
                <span slot="suffix">%</span>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col
            v-if="info.is_rel_dealer || info.entry_apply_info.apply_type === 'dealer'"
            :span="12"
          >
            <el-form-item :label="$t('a4450ce9.b61188')" prop="dealer_proportion">
              <el-input
                v-model="form.dealer_proportion"
                :clearable="true"
                :placeholder="$t('a4450ce9.02cc4f')"
                style="width: 100%"
              >
                <span slot="suffix">%</span>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item class="cus-el-form">
          <el-button type="primary" @click="handleDialogOpen('form', 'APPROVED')">
            {{ $t('a4450ce9.23c1f3') }}
          </el-button>
          <el-button type="danger" @click="handleDialogOpen('form', 'REJECT')">
            {{ $t('a4450ce9.325254') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog
      :title="$t('a4450ce9.45fa1c')"
      :visible.sync="dialogFormVisible"
      width="30%"
      :modal="false"
      :close-on-click-modal="false"
      @close="handleDialogClose"
    >
      <el-row>{{ visibleContent }}</el-row>
      <el-input
        v-model="comments"
        type="textarea"
        :rows="5"
        :maxlength="300"
        :show-word-limit="true"
        :placeholder="$t('a4450ce9.c4c230')"
      />
      <div slot="footer" class="dialog-footer">
        <loading-btn
          ref="loadingBtn"
          size="medium"
          type="primary"
          :text="$t('a4450ce9.aa7527')"
          @clickHandle="handleDialogChange('loadingBtn')"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { setDetailApprove } from '@/api/adapay/dealer'
import loadingBtn from '@/components/loading-btn'

export default {
  components: { loadingBtn },
  props: ['info', 'subTitle', 'handleClose'],
  data() {
    return {
      form: {
        headquarters_proportion: '',
        adapay_fee_mode: '',
        dealer_proportion: ''
      },
      rules: {
        headquarters_proportion: [
          { required: true, validator: this.validateNumber, trigger: 'blur' }
        ],
        adapay_fee_mode: [
          { required: true, message: this.$t('a4450ce9.708c9d'), trigger: 'change' }
        ],
        dealer_proportion: [{ required: true, validator: this.validateNumber, trigger: 'blur' }]
      },
      dialogFormVisible: false,
      visibleContent: '',
      comments: '',
      approveType: ''
    }
  },
  mounted() {
    const { entry_apply_info, dealer_info, distributor_info, is_rel_dealer } = this.info
    if (entry_apply_info.apply_type === 'dealer' || is_rel_dealer) {
      this.form = { ...JSON.parse(dealer_info.split_ledger_info) }
    }
  },
  methods: {
    handleDialogChange(ref) {
      // 点击审批弹框确定按钮
      const { entry_apply_info, dealer_info, distributor_info } = this.info
      setDetailApprove({
        split_ledger_info: JSON.stringify(this.form),
        apply_type: entry_apply_info.apply_type,
        status: this.approveType,
        id: entry_apply_info.id,
        comments: this.comments,
        save_id:
          entry_apply_info.apply_type === 'dealer'
            ? dealer_info.operator_id
            : distributor_info.distributor_id
      }).then((res) => {
        this.dialogFormVisible = false
        this.$emit('handleClose', 'update')
        // 跳转到列表页
        this.$message({
          message: this.$t('a4450ce9.33130f'),
          type: 'success'
        })
        this.$refs[ref].closeLoading()
        this.$refs.form.resetFields()
      })
    },
    handleDialogOpen(formName, status) {
      // 打开审批弹框
      const {
        entry_apply_info: { user_name }
      } = this.info
      // 需要判断当时是店铺还是经销商 目前只判断了店铺
      this.approveType = status
      if (status === 'APPROVED') {
        this.$refs['form'].validate(async (vaild) => {
          if (vaild) {
            this.visibleContent = this.$t('a4450ce9.c13dbc', { name: user_name })
            this.dialogFormVisible = true
          }
        })
      } else {
        this.visibleContent = this.$t('a4450ce9.b337a2', { name: user_name })
        this.dialogFormVisible = true
      }
    },
    handleDialogClose() {
      // 关闭审批弹框
      this.dialogFormVisible = false
      this.comments = ''
      this.visibleContent = ''
    },
    validateNumber(rule, value, callback) {
      // 经销商分账占比校验
      const { headquarters_proportion, dealer_proportion } = this.form
      const {
        entry_apply_info: { apply_type },
        is_rel_dealer
      } = this.info
      let sum = ''
      if (apply_type === 'dealer' || is_rel_dealer) {
        // 申请类型为店铺并且关联经销商
        sum = Number(headquarters_proportion) + Number(dealer_proportion)
      }
      const reg = /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
      if (!value) {
        callback(new Error(this.$t('a4450ce9.02cc4f')))
      } else {
        if (!reg.test(value)) {
          callback(new Error(this.$t('a4450ce9.cc1ce5')))
        } else if (Number(value) > 100) {
          // 店铺类型为直营店的时候 能输入100
          callback(new Error(this.$t('a4450ce9.d19795')))
        } else if ((apply_type === 'dealer' || is_rel_dealer) && sum > 100) {
          callback(new Error(this.$t('a4450ce9.d7d7ed')))
        } else {
          callback()
        }
        // else if (apply_type === 'distributor' && is_rel_dealer && sum < 100) {
        //   callback(new Error(this.subTitle))
        // }
      }
    }
  }
}
</script>

<style lang="scss">
.el-form-item {
  display: flex;
}
.cus-el-form {
  justify-content: center;
  margin-top: 30px;
}
.cus-row-form {
  .el-col-12 {
    margin-bottom: 20px;
  }
}
</style>
