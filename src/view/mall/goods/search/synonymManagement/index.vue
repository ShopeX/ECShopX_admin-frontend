<template>
  <div>
    <div style="margin-bottom: 20px">
      智能搜索开关: <el-switch :value="switchValue" @change="updateSynonymSwitch" />
    </div>
    <SpFinder
      ref="finder"
      url="/search/synonym/list"
      fixed-row-action
      row-actions-width="200px"
      :other-config="{}"
      no-selection
      :setting="tableSchema"
      :hooks="{
        beforeSearch
      }"
      row-actions-fixed-align="left"
    >
      <template v-slot:tableTop>
        <div class="action-container">
          <el-button type="primary" plain @click="addConfigHandle">添加同义词</el-button>
          <el-upload
            class="fl"
            style="margin-right: 10px"
            action=""
            :on-change="uploadHandleChange"
            :auto-upload="false"
            show-file-list
          >
            <el-button size="small" type="primary"> 批量导入 </el-button>
          </el-upload>
          <el-button type="primary" plain @click="exportHandle">导出</el-button>
        </div>
      </template>
    </SpFinder>

    <SpDialog
      ref="searchDialogRef"
      v-model="showCreateInfoDialog"
      :title="editRowInfo ? '编辑' : '添加' + '同义词'"
      :modal="false"
      class="base-form"
      :form="activityRule"
      :form-list="activityRuleList"
      @onSubmit="saveSelectAction"
    />
  </div>
</template>
<script>
import { createTableSchema, createFormSchema } from './schema.js'
import { generatorParams } from '@/utils/schemaHelper.js'
import { exportSynonym } from '@/api/synonym'

import { handleUploadFile } from '@/api/common'

import api from '@/api'

export default {
  data() {
    return {
      // 显示添加行弹窗
      showCreateInfoDialog: false,
      // 行数据
      editRowInfo: null,
      formList: [''],
      activityRule: {
        ...generatorParams(createFormSchema(this))
      },
      switchValue: false
    }
  },
  computed: {
    activityRuleList() {
      return createFormSchema(this)
    },
    tableSchema() {
      return createTableSchema(this)
    }
  },
  mounted() {
    this.getSynonymSwitch()
  },
  methods: {
    // 获取智能搜索开关
    getSynonymSwitch() {
      api.synonym.isOpenSynonym().then((res) => {
        this.switchValue = res.status === 'off' ? false : true
      })
    },
    // 更新智能搜索开关
    updateSynonymSwitch() {
      api.synonym.updateSynonymSwitch({ status: this.switchValue ? 'off' : 'on' }).then((res) => {
        this.switchValue = !this.switchValue
        this.$message({
          message: '更新成功',
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    // 页面初始化
    refresh() {
      this.$refs.finder.refresh(true)
    },
    // 添加事件
    addConfigHandle() {
      this.showCreateInfoDialog = true
      this.formList = ['']
    },
    // 编辑点击事件
    editConfigHandle(row) {
      this.editRowInfo = row
      this.formList = row?.synonyms?.split(',')
      console.log(this.formList)
      this.showCreateInfoDialog = true
    },
    // 删除
    deleteHandle(row) {
      this.$confirm('是否确认删除，删除后将无法恢复', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api.synonym.deleteSynonym(row.id).then((res) => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.refresh()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    uploadHandleChange(file, fileList) {
      let params = { isUploadFile: true, file_type: 'search_synonyms', file: file.raw }
      handleUploadFile(params).then((response) => {
        this.$message({
          type: 'success',
          message: '上传成功，等待处理'
        })
        this.refresh()
      })
    },
    beforeSearch(params) {
      this.searchParams = params
      return {
        ...params
      }
    },
    // 导出
    exportHandle() {
      exportSynonym(this.searchParams).then((response) => {
        if (response.data.data.status) {
          this.$message({
            type: 'success',
            message: '已加入执行队列，请在设置-导出列表中下载'
          })
          this.$export_open('search_synonyms')
          return
        } else if (response.data.data.url) {
          this.downloadUrl = response.data.data.url
          this.downloadName = response.data.data.filename
          this.downloadView = true
        } else {
          this.$message({
            type: 'error',
            message: '没有相关数据可导出'
          })
        }
      })
    },
    // 动态插入数据
    appendHandle() {
      this.formList.push('')
    },
    async saveSelectAction() {
      console.log(this.formList)
      let res = null
      try {
        if (this.editRowInfo) {
          res = await api.synonym.updateSynonym(this.editRowInfo?.id, { synonyms: this.formList })
        } else {
          res = await api.synonym.addSynonym({ synonyms: this.formList })
        }
        this.$message({
          type: 'success',
          message: `操作成功`
        })
        this.refresh()
        this.editRowInfo = null
        this.showCreateInfoDialog = false
        this.formList = ['']
      } catch (error) {
        console.log(error)
        this.$message({
          type: 'error',
          message: `${error}`
        })
      }
    }
  }
}
</script>
<style scoped>
.base-form >>> .el-form-item__content {
  margin-left: 0px !important;
}
.base-form >>> .el-icon-circle-plus-outline:before {
  content: '\e723';
  font-size: 24px;
  position: relative;
  right: 2px;
  top: 4px;
}
</style>
