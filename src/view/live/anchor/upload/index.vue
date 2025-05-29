<template>
  <div class="page-body">
    <div class="tip-info">
      <p>
        上传文件如果有处理失败的行数后将会生成错误文件，请及时查看错误信息修改后重新下载，错误描述文件只保留<strong>15天</strong>。
      </p>
      <p>超过<strong>15天</strong>的错误描述文件将会删除，不再提供下载查看</p>
    </div>
    <SpFinder
      ref="finder"
      url="espier/upload_files"
      fixed-row-action
      row-actions-width="120px"
      :other-config="{}"
      :hooks="{
        beforeSearch
      }"
      no-selection
      :setting="tableSchema"
    >
      <template v-slot:tableTop>
        <div class="action-container">
          <el-upload
            style="display: inline-block; height: 0"
            action=""
            :http-request="importHandle"
            :auto-upload="true"
            :show-file-list="false"
          >
            <el-button type="primary" plain> 批量上传 </el-button>
          </el-upload>
          <el-button type="primary" plain @click="downloadTemplateFile"> 下载模版 </el-button>
        </div>
      </template>
    </SpFinder>
  </div>
</template>

<script>
import schema from './schema'
import {
  handleUploadFile,
  exportAnchorTemplate,
  exportUploadTemplate,
  exportUploadErrorFile
} from '@/api/common'

export default {
  computed: {
    tableSchema() {
      return schema.tableSchema(this)
    }
  },
  methods: {
    refresh() {
      this.$refs.finder.refresh(true)
    },
    beforeSearch(params) {
      params = {
        ...params,
        file_type: 'polyv_anchor'
      }
      return params
    },
    importHandle(e) {
      const { file } = e
      let params = { isUploadFile: true, file_type: 'polyv_anchor', file: file }
      handleUploadFile(params)
        .then(() => {
          this.$message({
            type: 'success',
            message: '上传成功'
          })
          this.refresh()
        })
        .catch((err) => {
          this.$message({
            type: 'error',
            message: '上传失败'
          })
          console.log(err)
        })
    },
    // 下载模板
    downloadTemplateFile() {
      let params = { file_type: 'polyv_anchor', file_name: '账号模板' }
      exportUploadTemplate(params).then((response) => {
        let { data } = response.data
        if (data.file) {
          var a = document.createElement('a')
          a.href = data.file
          a.download = data.name
          document.body.appendChild(a)
          a.click()
          a.remove()
        } else {
          this.$message({
            type: 'error',
            message: '没有相关数据可导出'
          })
        }
      })
    },
    exportErrorFile(id, fileType) {
      let params = { file_type: fileType }
      exportUploadErrorFile(id, params).then((response) => {
        if (response.data.data.file) {
          var a = document.createElement('a')
          a.href = response.data.data.file
          a.download = response.data.data.name
          document.body.appendChild(a)
          a.click()
          a.remove()
        } else {
          this.$message({
            type: 'error',
            message: '没有相关数据可导出'
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.tip-info {
  padding: 8px 16px;
  background-color: #fff6f7;
  border-radius: 4px;
  border-left: 5px solid #ff7800;
  margin: 11px 0;
}
</style>
