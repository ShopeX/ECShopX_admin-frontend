<template>
  <div>
    <el-card class="mycard">
      <div v-if="info.entry_apply_info.operator_type === 'distributor'" slot="header">
        分帐信息
        <el-popover
          v-if="subTitle"
          placement="top-start"
          width="400"
          trigger="hover"
        >
          <i
            slot="reference"
            class="el-icon-question"
          />
          <pre
            slot=""
            style="white-space: pre-line"
          >
            {{ subTitle }}
          </pre>
        </el-popover>
      </div>
      <el-form
        ref="form"
        :model="form"
      >
        <el-row class="cus-row-form">
          <!-- <el-col :span="12">
            <el-form-item
              label="手续费扣费方式"
              prop="adapay_fee_mode"
            >
              <el-select
                v-model="form.adapay_fee_mode"
                :clearable="true"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  label="内扣"
                  value="I"
                />
                <el-option
                  label="外扣"
                  value="O"
                />
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col v-if="info.entry_apply_info.operator_type === 'distributor'" :span="12">
            <el-form-item
              label="总部分账占比"
              prop="headquarters_proportion"
            >
              <el-input
                v-model="form.headquarters_proportion"
                :clearable="true"
                placeholder="请输入"
                style="width: 100%"
              >
                <span slot="suffix">%</span>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col
            v-if="info.is_rel_dealer && info.entry_apply_info.operator_type === 'distributor'"
            :span="12"
          >
            <el-form-item
              label="经销商分账占比"
              prop="dealer_proportion"
            >
              <el-input
                v-model="form.dealer_proportion"
                :clearable="true"
                placeholder="请输入"
                style="width: 100%"
              >
                <span slot="suffix">%</span>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col
            v-if="info.is_rel_merchant && info.entry_apply_info.operator_type === 'distributor'"
            :span="12"
          >
            <el-form-item
              label="商户分账占比"
              prop="merchant_proportion"
            >
              <el-input
                v-model="form.merchant_proportion"
                :clearable="true"
                placeholder="请输入"
                style="width: 100%"
              >
                <span slot="suffix">%</span>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item class="cus-el-form">
          <el-button
            type="primary"
            @click="handleDialogOpen('form', 'APPROVED')"
          >
            通过
          </el-button>
          <el-button
            type="danger"
            @click="handleDialogOpen('form', 'REJECT')"
          >
            驳回
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog
      title="审批弹框"
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
        placeholder="请填写审批意见"
      />
      <div
        slot="footer"
        class="dialog-footer"
      >
        <loading-btn
          ref="loadingBtn"
          size="medium"
          type="primary"
          text="确 定"
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
  data () {
    return {
      form: {
        headquarters_proportion: '',
        dealer_proportion: '',
        merchant_proportion: '',
      },
      rules: {
        headquarters_proportion: [
          { required: true, validator: this.validateNumber, trigger: 'blur' }
        ],
        dealer_proportion: [{ required: true, validator: this.validateNumber, trigger: 'blur' }],
        merchant_proportion: [{ required: true, validator: this.validateNumber, trigger: 'blur' }],
      },
      dialogFormVisible: false,
      visibleContent: '',
      comments: '',
      approveType: ''
    }
  },
  mounted () {
    const { entry_apply_info, dealer_info, distributor_info, is_rel_dealer } = this.info
    // if (entry_apply_info.operator_type === 'dealer' || is_rel_dealer) {
    //   this.form = { ...JSON.parse(dealer_info.split_ledger_info) }
    // }
  },
  methods: {
    handleDialogChange (ref) {
      // 点击审批弹框确定按钮
      const { entry_apply_info, dealer_info, distributor_info } = this.info
      this.$api.bspay.setApproveAudit({
        split_ledger_info: JSON.stringify(this.form),
        operator_type: entry_apply_info.operator_type,
        status: this.approveType,
        id: entry_apply_info.id,
        comments: this.comments,
        save_id:
          entry_apply_info.operator_type === 'distributor'
            ? dealer_info.distributor_id
            : 0
      }).then((res) => {
        this.dialogFormVisible = false
        this.$emit('handleClose', 'update')
        // 跳转到列表页
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.$refs[ref].closeLoading()
        this.$refs.form.resetFields()
      })
    },
    handleDialogOpen (formName, status) {
      // 打开审批弹框
      const {
        entry_apply_info: { user_name }
      } = this.info
      // 需要判断当时是店铺还是经销商 目前只判断了店铺
      this.approveType = status
      if (status === 'APPROVED') {
        this.$refs['form'].validate(async (vaild) => {
          if (vaild) {
            this.visibleContent = `请确认是否通过${user_name}的开户申请`
            this.dialogFormVisible = true
          }
        })
      } else {
        this.visibleContent = `请确认是否驳回${user_name}的开户申请`
        this.dialogFormVisible = true
      }
    },
    handleDialogClose () {
      // 关闭审批弹框
      this.dialogFormVisible = false
      this.comments = ''
      this.visibleContent = ''
    },
    validateNumber (rule, value, callback) {
      // 经销商分账占比校验
      const { headquarters_proportion, dealer_proportion } = this.form
      const {
        entry_apply_info: { operator_type },
        is_rel_dealer
      } = this.info
      let sum = ''
      if (operator_type === 'dealer' || is_rel_dealer) {
        // 申请类型为店铺并且关联经销商
        sum = Number(headquarters_proportion) + Number(dealer_proportion)
      }
      const reg = /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
      if (!value) {
        callback(new Error('请输入'))
      } else {
        if (!reg.test(value)) {
          callback(new Error('请输入正确格式，最多保留两位小数'))
        } else if (Number(value) > 100) {
          // 店铺类型为直营店的时候 能输入100
          callback(new Error('分账比例不能超过100'))
        } else if ((operator_type === 'dealer' || is_rel_dealer) && sum > 100) {
          callback(new Error('分账占比和不能大于100，请核实后再试'))
        } else {
          callback()
        }
        // else if (operator_type === 'distributor' && is_rel_dealer && sum < 100) {
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
