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
            <div class="text">拒绝原因</div>
            <el-input
              v-model="refuse_reason"
              type="textarea"
              :rows="2"
              maxlength="50"
              :show-word-limit="true"
              placeholder="非必填项，请填写不超过50字。"
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
        <el-button type="primary" @click="handleAudit"> 确认 </el-button>
        <el-button @click="handleCancelLabelsDialog"> 取消 </el-button>
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
          dialogTitle = '笔记审核'
          passInfo =
            '若笔记再三确认后无任何违规或敏感内容，点击「确认」后将：</br></br>1. 笔记状态将变为已通过，但可再次修改审核状态；</br>2. 若用户修改笔记，则该笔记需要再次审核。'
          passTips =
            '我已确认所选的笔记中 <span class="underline red">含有「非待审核」的笔记</span> ，</br> 并将通过此操作<span class="underline">变更状态为「已通过」，小程序端将显示笔记。</span>'
          if (notesModalType == 'refuse') {
            passTips =
              '我已确认所选的笔记中 <span class="underline red">含有「非待审核」的笔记</span> ，</br> 并将通过此操作<span class="underline">变更状态为「已拒绝」，小程序端将屏蔽笔记。</span>'
          }
          resultInfo = { pass_text: '发布所选', refuse_text: '下架所选' }
          break
        case 'tag':
          dialogTitle = 'Tag审核'
          passInfo =
            '若Tag再三确认后无任何违规或敏感内容，点击「确认」后将：</br></br>1. Tag状态将变为已通过，但可再次修改审核状态；</br>2. 用户不可修改Tag。'
          passTips =
            '我已确认所选的Tag中 <span class="underline red">含有「非待审核」的Tag</span> ，</br> 并将通过此操作<span class="underline">变更状态为「已通过」，小程序端将显示Tag。</span>'
          resultInfo = { pass_text: '通过该Tag', refuse_text: '拒绝该Tag' }
          if (notesModalType == 'refuse') {
            passTips =
              '我已确认所选的Tag中 <span class="underline red">含有「待审核」的Tag</span> ，</br> 并将通过此操作<span class="underline">变更状态为「已拒绝」，小程序端将屏蔽Tag。</span>'
          }
          if (auditdiff) {
            resultInfo = { pass_text: '通过所有', refuse_text: '拒绝所有' }
          }
          break
        case 'topic':
          dialogTitle = '关联话题审核'
          passInfo =
            '若话题内容再三确认后无任何违规或敏感内容，点击「确认」后将：</br></br>1. 话题状态将变为已通过，但可再次修改审核状态；</br>2. 用户更换话题不会影响该话题的状态。'
          passTips =
            '我已确认所选的话题中<span class="underline red">含有「非待审核」的话题</span> ，</br> 并将通过此操作<span class="underline">变更状态为「已通过」，小程序端将显示话题。</span>'
          resultInfo = { pass_text: '通过该话题', refuse_text: '拒绝该话题' }
          if (notesModalType == 'refuse') {
            passTips =
              '我已确认所选的话题中 <span class="underline red">含有「待审核」与「已通过」的话题</span> ，</br> 并将通过此操作<span class="underline">变更状态为「已拒绝」，小程序端将屏蔽话题。</span>'
          }
          if (auditdiff) {
            resultInfo = { pass_text: '通过所有', refuse_text: '拒绝所有' }
          }
          break
        case 'review':
          dialogTitle = '评论审核'
          passInfo =
            '若评论再三确认后无任何违规或敏感内容，点击「确认」后将：</br></br>1. 评论状态将变为已通过，但可再次修改审核状态；</br>2. 用户不可修改评论。'
          passTips =
            '我已确认所选的评论中<span class="underline red">含有「非待审核」的评论</span> ，</br> 并将通过此操作<span class="underline">变更状态为「已通过」，小程序端将显示评论。</span>'
          resultInfo = { pass_text: '通过该评论', refuse_text: '拒绝该评论' }
          if (notesModalType == 'refuse') {
            passTips =
              '我已确认所选的评论中 <span class="underline red">含有「待审核」的评论</span> ，</br> 并将通过此操作<span class="underline">变更状态为「已拒绝」，小程序端将屏蔽评论。</span>'
          }
          if (auditdiff) {
            resultInfo = { pass_text: '通过所有', refuse_text: '拒绝所有' }
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
          message: '请勾选审核状态知晓条目'
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
