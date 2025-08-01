<template>
  <div class="checkBoxDialog">
    <el-dialog :visible.sync="visible" :before-close="handleClose" :modal-append-to-body="false">
      <div slot="title" class="title"><i class="el-icon-info" /> 提交审批</div>
      <p class="message" v-html="message" />

      <el-form ref="form" :model="form">
        <el-form-item v-if="is_sms" style="justify-content: center">
          <el-checkbox-group v-model="form.is_sms">
            <el-checkbox :key="info[0].value" value="1">
              {{ info[0].value }}<br>(短信费用将在短信余额中扣除)
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="is_idea" style="justify-content: center">
          <el-input
            v-model="form.comments"
            style="width: 350px"
            type="textarea"
            :rows="5"
            :maxlength="300"
            :show-word-limit="true"
            placeholder="请填写审批意见"
          />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" size="mini" @click="confirm">确 定</el-button> -->
        <loading-btn
          ref="loadingBtn"
          size="mini"
          type="primary"
          text="确定"
          @clickHandle="confirm"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import loadingBtn from '@/components/loading-btn'
export default {
  components: {
    loadingBtn
  },
  props: {
    visible: {
      default: false
    },
    message: {
      type: String
    },
    info: {
      default: ''
    },
    is_sms: {},
    is_idea: {
      type: Boolean,
      default: false
    },
    comments: {
      default: ''
    }
  },
  // mounted(){
  //   debugger
  //   this.form.is_sms = this.isNote=='1'?true:false
  // },
  data() {
    return {
      form: {
        is_sms: '',
        comments: ''
      }
    }
  },
  methods: {
    confirm() {
      this.$refs['loadingBtn'].loading = true
      if (this.form.is_sms) {
        this.form.is_sms = '1'
      } else {
        this.form.is_sms = '0'
      }
      this.$emit('checkBoxConfirmHandle', this.form)
      this.closeLoading()
    },
    handleClose() {
      this.$emit('checkBoxVisibleHandle')
      this.clearForm()
    },
    closeLoading() {
      this.clearForm()
      this.$refs['loadingBtn'].closeLoading()
    },
    clearForm() {
      this.form.is_sms = ''
      this.form.comments = ''
    }
  }
  // watch: {
  //   isNote(val) {
  //     this.form.is_sms = val == '1' ? true : false
  //   }
  // }
}
</script>
<style lang="scss" scoped>
.checkBoxDialog {
  text-align: center;
  .title {
    font-size: 15px;
    text-align: left;
    .el-icon-info {
      color: #409eff;
    }
  }
  .message {
    font-size: 14px;
    color: #000;
    margin-bottom: 10px;
  }
}
</style>
<style lang="scss">
.checkBoxDialog {
  .el-dialog__body {
    padding: 20px 10px 0px;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #606266;
  }
  .el-dialog {
    max-width: 500px;
    min-width: 400px;
  }
  .el-checkbox__input {
    margin-top: -43px;
  }
}
</style>
