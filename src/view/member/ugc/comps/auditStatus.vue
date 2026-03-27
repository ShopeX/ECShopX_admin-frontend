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
        <el-radio-group v-model="notesModalType" class="result" size="small" @change="modalInit">
          <el-radio-button label="pass">{{ $t('2e5b8fba.17523d') }}</el-radio-button>
          <el-radio-button label="refuse">{{ $t('2e5b8fba.a066c7') }}</el-radio-button>
        </el-radio-group>

        <div class="cont">
          <div class="info" v-html="modalInfo" />
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="modalHandle">
          {{ handleText }}
        </el-button>
        <el-button @click="handleCancelLabelsDialog">{{ $t('2e5b8fba.625fb2') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogIsShow: Boolean,
    auditType: String,
    dufStatus: String
  },
  data() {
    return {
      notesModalType: 'pass',
      dialogTitle: null,
      handleText: null,
      modalInfo: null
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
        this.modalInit()
      },
      immediate: true
    }
  },
  mounted() {},
  methods: {
    modalInit() {
      const { auditType } = this.$props
      //console.log('auditType',auditType,dufStatus)
      switch (auditType) {
        case 'note':
          this.noteInit()
          break
        case 'flag':
          this.flagInit()
          break
      }
    },
    noteInit() {
      const { notesModalType } = this.$data
      var dialogTitle = this.$t('2e5b8fba.082432')
      var handleText = null
      var modalInfo = null
      switch (notesModalType) {
        case 'pass':
          handleText = this.$t('2e5b8fba.83611a')
          modalInfo = this.$t('2e5b8fba.ec4c48')
          break
        case 'refuse':
          handleText = this.$t('2e5b8fba.d2379a')
          modalInfo = this.$t('2e5b8fba.b62289')
          break
      }
      this.$data.dialogTitle = dialogTitle
      this.$data.handleText = handleText
      this.$data.modalInfo = modalInfo
    },
    flagInit() {
      const { notesModalType } = this.$data
      var dialogTitle = this.$t('2e5b8fba.fbda8b')
      var handleText = null
      var modalInfo = null
      switch (notesModalType) {
        case 'pass':
          handleText = this.$t('2e5b8fba.83611a')
          modalInfo = this.$t('2e5b8fba.77f9f0')
          break
        case 'refuse':
          handleText = this.$t('2e5b8fba.d2379a')
          modalInfo = this.$t('2e5b8fba.1719bf')
          break
      }
      this.$data.dialogTitle = dialogTitle
      this.$data.handleText = handleText
      this.$data.modalInfo = modalInfo
    },
    handleCancelLabelsDialog() {
      this.$emit('cancelLabelsDialog', false)
    },
    modalHandle() {
      const { notesModalType } = this.$data
      var params = { status: notesModalType == 'pass' ? 1 : 4 }
      //console.log('handleAudit',params)
      this.$emit('modalHandle', params)
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
</style>
