<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
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
          <el-radio-button label="pass"> 发布已选 </el-radio-button>
          <el-radio-button label="refuse"> 下架已选 </el-radio-button>
        </el-radio-group>

        <div class="cont">
          <div class="info" v-html="modalInfo" />
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="modalHandle">
          {{ handleText }}
        </el-button>
        <el-button @click="handleCancelLabelsDialog"> 取消 </el-button>
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
      var dialogTitle = '笔记状态变更'
      var handleText = null
      var modalInfo = null
      // console.log('modalInit notesModalType',notesModalType)
      switch (notesModalType) {
        case 'pass':
          handleText = '发布'
          modalInfo =
            '笔记发布点击「发布」后已选笔记将被加入小程序展示的队列，并将适配对应展示规则；若您希望将所选笔记的展示位置进行调整，请修改对应排序。'
          break
        case 'refuse':
          handleText = '下架'
          modalInfo =
            '点击「下架」后已选笔记将不会在小程序中的社区中展示；<br/>同时，已转发/分享/收藏的链接&入口将失效。'
          break
      }
      this.$data.dialogTitle = dialogTitle
      this.$data.handleText = handleText
      this.$data.modalInfo = modalInfo
    },
    flagInit() {
      const { notesModalType } = this.$data
      var dialogTitle = '角标状态变更'
      var handleText = null
      var modalInfo = null
      //console.log('modalInit notesModalType',notesModalType)
      switch (notesModalType) {
        case 'pass':
          handleText = '发布'
          modalInfo = '点击「发布」后，带有已选角标的笔记将会在小程序社区中显示展示对应的角标。'
          break
        case 'refuse':
          handleText = '下架'
          modalInfo = '点击「下架」后，带有已选角标的笔记依旧存在，但不显示对应角标；'
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
