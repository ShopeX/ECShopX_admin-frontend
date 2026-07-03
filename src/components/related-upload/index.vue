<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.related-upload__table-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}
.related-upload__operation-tip {
  margin-bottom: 12px;

  .el-alert__title {
    white-space: pre-line;
    line-height: 1.6;
  }
}
</style>

<template>
  <div>
    <div class="action-container">
      <el-upload
        action=""
        :on-change="uploadHandleChange"
        :auto-upload="false"
        :show-file-list="false"
      >
        <el-button size="small" type="primary"> {{ $t('5f45d286.2c808b') }} </el-button>
      </el-upload>
      <el-button size="small" type="primary" @click="uploadHandleTemplate()">
        {{ $t('5f45d286.402a67') }}
      </el-button>
    </div>
    <el-alert
      v-if="operationTip"
      class="related-upload__operation-tip"
      :title="operationTip"
      type="warning"
      show-icon
      :closable="false"
    />
    <div class="related-upload__table-toolbar">
      <el-button size="mini" icon="el-icon-refresh" :loading="loading" @click="handleRefreshList">
        {{ $t('5f45d286.694fc5') }}
      </el-button>
    </div>
    <el-table
      border
      v-loading="loading"
      :data="uploadList"
      :height="tableHeight"
      :element-loading-text="$t('5f45d286.f09b12')"
    >
      <el-table-column prop="file_name" :label="$t('5f45d286.a6fc9e')" min-width="100" />
      <el-table-column prop="created_date" :label="$t('5f45d286.cae255')" min-width="80" />
      <el-table-column prop="file_size_format" :label="$t('5f45d286.396b7d')" min-width="60" />
      <el-table-column :label="$t('5f45d286.21b314')" min-width="50">
        <template slot-scope="scope">
          <span v-if="scope.row.handle_status == 'wait'">{{ $t('5f45d286.1e57c1') }}</span>
          <span v-if="scope.row.handle_status == 'processing'">{{ $t('5f45d286.5d459d') }}</span>
          <span v-if="scope.row.handle_status == 'finish'">{{ $t('5f45d286.7be39b') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="finish_date" :label="$t('5f45d286.475dea')" />
      <el-table-column :label="$t('5f45d286.3ba621')">
        <template slot-scope="scope">
          <span v-if="scope.row.handle_message"
            >{{ scope.row.handle_message.successLine }}{{ $t('d41d8cd9.j5k6l7') }}</span
          >
        </template>
      </el-table-column>
      <el-table-column :label="$t('5f45d286.1012e0')">
        <template slot-scope="scope">
          <span v-if="scope.row.handle_message"
            >{{ scope.row.handle_message.errorLine }}{{ $t('d41d8cd9.j5k6l7') }}</span
          >
          <a
            v-if="scope.row.handle_message && scope.row.handle_message.errorLine > 0"
            type="primary"
            @click="exportErrorFile(scope.row.id, scope.row.file_type)"
            >{{ $t('5f45d286.3798d3') }}</a
          >
        </template>
      </el-table-column>
    </el-table>
    <div v-if="total_count > pageSize" class="content-top-padded content-center">
      <el-pagination
        layout="total, prev, pager, next"
        :total="total_count"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import {
  handleUploadFile,
  getUploadLists,
  exportUploadErrorFile,
  exportUploadTemplate
} from '@/api/common'

export default {
  props: {
    fileType: {
      type: String,
      required: true
    },
    relatedId: {
      type: [String, Number],
      default: ''
    },
    fileName: {
      type: String,
      required: true
    },
    tableHeight: {
      type: [String, Number],
      default: undefined
    },
    extraParams: {
      type: Object,
      default: () => ({})
    },
    operationTip: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      total_count: 0,
      pageSize: 20,
      page: 1,
      uploadList: []
    }
  },
  watch: {
    fileType() {
      this.refresh()
    },
    relatedId() {
      this.refresh()
    },
    extraParams() {
      this.refresh()
    }
  },
  mounted() {
    this.getUploadList()
  },
  methods: {
    getParams() {
      const params = {
        ...this.extraParams,
        file_type: this.fileType
      }
      if (
        this.relatedId !== '' &&
        this.relatedId !== null &&
        typeof this.relatedId !== 'undefined'
      ) {
        params.relation_id = this.relatedId
      }
      return params
    },
    refresh() {
      this.page = 1
      this.getUploadList()
    },
    handleRefreshList() {
      this.getUploadList()
    },
    uploadHandleChange(file, fileList) {
      let params = {
        isUploadFile: true,
        file: file.raw,
        ...this.getParams()
      }
      handleUploadFile(params).then((response) => {
        this.$message({
          type: 'success',
          message: this.$t('5f45d286.7bbfaa')
        })
        this.getUploadList()
      })
    },
    uploadHandleTemplate() {
      let params = {
        ...this.getParams(),
        file_name: this.fileName
      }
      exportUploadTemplate(params).then((response) => {
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
            message: this.$t('5f45d286.bfd8d5')
          })
        }
      })
    },
    exportErrorFile(id, fileType) {
      let params = { ...this.getParams(), file_type: fileType }
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
            message: this.$t('5f45d286.bfd8d5')
          })
        }
      })
    },
    handleCurrentChange(val) {
      this.page = val
      this.getUploadList()
    },
    getUploadList() {
      this.loading = true
      let params = {
        ...this.getParams(),
        page: this.page,
        pageSize: this.pageSize
      }
      getUploadLists(params)
        .then((response) => {
          const payload = response?.data?.data || {}
          this.uploadList = payload.list || []
          this.total_count = payload.total_count || 0
        })
        .catch(() => {
          this.uploadList = []
          this.total_count = 0
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
