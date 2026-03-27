<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :before-close="handleCancelLabelsDialog"
      :visible.sync="dialogIsShow"
      :show-close="false"
      width="30%"
    >
      <div>
        <el-radio-group v-model="notesModalType" size="small" class="result" @change="auditInit">
          <el-radio-button label="pass">
            {{ resultInfo.pass_text }}
          </el-radio-button>
          <el-radio-button label="refuse">
            {{ resultInfo.refuse_text }}
          </el-radio-button>
        </el-radio-group>

        <div class="cont">
          <div v-if="notesModalType == 'pass'" class="info" v-html="passInfo" />
          <div v-if="notesModalType == 'refuse'" class="refuse-info">
            <div class="text">{{ $t('9e8ad576.f48f94') }}</div>
            <el-input
              v-model="refuse_reason"
              type="textarea"
              :rows="2"
              maxlength="50"
              :show-word-limit="true"
              :placeholder="$t('9e8ad576.714fa9')"
            />
          </div>

          <div v-if="auditdiff" class="check-hint">
            <el-checkbox v-model="checkHint">
              <div class="tips" v-html="passTips" />
            </el-checkbox>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="handleAudit">{{ $t('9e8ad576.e83a25') }}</el-button>
        <el-button @click="handleCancelLabelsDialog">{{ $t('9e8ad576.625fb2') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    auditType: String,
    dufStatus: String,
    auditdiff: Boolean,
    dialogIsShow: Boolean
  },
  data() {
    return {
      checkHint: false,
      refuse_reason: null,
      dialogTitle: null,
      notesModalType: 'pass',
      resultInfo: {},
      passInfo: null,
      passTips: null
    }
  },
  computed: {},
  watch: {
    dialogIsShow: {
      handler(newValue, oldValue) {
        const { dufStatus } = this.$props
        if (dufStatus != null) {
          this.$data.notesModalType = dufStatus
        }
        this.auditInit()
      },
      immediate: true
    }
  },
  mounted() {
    //this.auditInit();
  },
  methods: {
    auditInit() {
      const { auditType, auditdiff } = this.$props
      const { notesModalType } = this.$data
      var dialogTitle = null
      var passInfo = null
      var passTips = null
      var resultInfo = {}
      //console.log('auditInit',auditType,auditdiff,dufStatus);
      switch (auditType) {
        case 'note':
          dialogTitle = this.$t('9e8ad576.32a1ad')
          passInfo = this.$t('9e8ad576.faeb3f')
          passTips = this.$t('9e8ad576.0913e2')
          if (notesModalType == 'refuse') {
            passTips = this.$t('9e8ad576.5989d6')
          }
          resultInfo = {
            pass_text: this.$t('9e8ad576.a63017'),
            refuse_text: this.$t('9e8ad576.d5915d')
          }
          break
        case 'tag':
          dialogTitle = this.$t('9e8ad576.2779f4')
          passInfo = this.$t('9e8ad576.f6428f')
          passTips = this.$t('9e8ad576.5394a5')
          resultInfo = {
            pass_text: this.$t('9e8ad576.8d264d'),
            refuse_text: this.$t('9e8ad576.c31391')
          }
          if (notesModalType == 'refuse') {
            passTips = this.$t('9e8ad576.8903bf')
          }
          if (auditdiff) {
            resultInfo = {
              pass_text: this.$t('9e8ad576.7c64aa'),
              refuse_text: this.$t('9e8ad576.05bb42')
            }
          }
          break
        case 'topic':
          dialogTitle = this.$t('9e8ad576.910f09')
          passInfo = this.$t('9e8ad576.d3abe6')
          passTips = this.$t('9e8ad576.9130ff')
          resultInfo = {
            pass_text: this.$t('9e8ad576.fe6d3b'),
            refuse_text: this.$t('9e8ad576.f9890e')
          }
          if (notesModalType == 'refuse') {
            passTips = this.$t('9e8ad576.845a32')
          }
          if (auditdiff) {
            resultInfo = {
              pass_text: this.$t('9e8ad576.7c64aa'),
              refuse_text: this.$t('9e8ad576.05bb42')
            }
          }
          break
        case 'review':
          dialogTitle = this.$t('9e8ad576.52f2a0')
          passInfo = this.$t('9e8ad576.28f24d')
          passTips = this.$t('9e8ad576.eea022')
          resultInfo = {
            pass_text: this.$t('9e8ad576.2bf3cf'),
            refuse_text: this.$t('9e8ad576.1a96ca')
          }
          if (notesModalType == 'refuse') {
            passTips = this.$t('9e8ad576.905935')
          }
          if (auditdiff) {
            resultInfo = {
              pass_text: this.$t('9e8ad576.7c64aa'),
              refuse_text: this.$t('9e8ad576.05bb42')
            }
          }
          break
      }

      this.$data.dialogTitle = dialogTitle
      this.$data.passInfo = passInfo
      this.$data.passTips = passTips
      this.$data.resultInfo = resultInfo
    },
    handleCancelLabelsDialog() {
      this.$emit('cancelLabelsDialog', false)
    },
    handleAudit() {
      const { auditdiff } = this.$props
      const { checkHint, refuse_reason, notesModalType } = this.$data
      var params = { status: notesModalType == 'pass' ? 1 : 4, refuse_reason }
      if (auditdiff && !checkHint) {
        this.$message({
          type: 'error',
          message: this.$t('9e8ad576.5576b1')
        })
        return false
      }
      //console.log('handleAudit',params)
      this.$emit('notesAuditHandle', params)
    }
  }
}
</script>
<style scoped lang="css">
.result {
  position: absolute;
  top: 20px;
  right: 20px;
}
.btn-bar {
  margin-top: 30px;
  text-align: right;
}
.refuse-info .text {
  margin-bottom: 20px;
}
.check-hint {
  margin-top: 20px;
}
.check-hint /deep/ .tips .underline {
  text-decoration: underline;
  color: #000;
  font-weight: bolder;
}
.check-hint /deep/ .tips .underline.red {
  color: #f00;
}
.check-hint /deep/ .el-checkbox__label {
  vertical-align: middle;
}
.check-hint /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #666;
}
</style>
