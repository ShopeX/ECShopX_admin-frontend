<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style type="text/css" lang="scss">
.content-bottom-padded {
  display: flex;
}
</style>
<template>
  <div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <div class="tip-info">
        <p>
          {{ $t('f68ac74d.7b5c77') }}<strong>{{ $t('f68ac74d.d99268') }}</strong
          >。
        </p>
        <p>
          {{ $t('f68ac74d.41c5ec') }}<strong>{{ $t('f68ac74d.d99268') }}</strong
          >{{ $t('f68ac74d.40d0ad') }}
        </p>
      </div>
      <el-form ref="form" label-width="100px">
        <div class="content-bottom-padded">
          <el-upload
            class="fl"
            style="margin-right: 10px"
            action=""
            :on-change="uploadHandleChange"
            :auto-upload="false"
            :show-file-list="false"
          >
            <el-button size="small" type="primary">{{ $t('f68ac74d.2c808b') }}</el-button>
          </el-upload>
          <el-button size="small" type="primary" @click="uploadHandleTemplate()">
            {{ $t('f68ac74d.402a67') }}
          </el-button>
        </div>
        <el-table
          v-loading="loading"
          :data="uploadList"
          :element-loading-text="$t('f68ac74d.f09b12')"
        >
          <el-table-column prop="file_name" :label="$t('f68ac74d.a6fc9e')" min-width="100" />
          <el-table-column prop="created_date" :label="$t('f68ac74d.cae255')" min-width="80" />
          <el-table-column prop="file_size_format" :label="$t('f68ac74d.396b7d')" min-width="60" />
          <el-table-column :label="$t('f68ac74d.21b314')" min-width="50">
            <template slot-scope="scope">
              <span v-if="scope.row.handle_status == 'wait'">{{ $t('f68ac74d.1e57c1') }}</span>
              <span v-if="scope.row.handle_status == 'processing'">{{
                $t('f68ac74d.5d459d')
              }}</span>
              <span v-if="scope.row.handle_status == 'finish'">{{ $t('f68ac74d.7be39b') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="finish_date" :label="$t('f68ac74d.475dea')" />
          <el-table-column :label="$t('f68ac74d.3ba621')">
            <template slot-scope="scope">
              <span v-if="scope.row.handle_message"
                >{{ scope.row.handle_message.successLine }}{{ $t('f68ac74d.2d5aef') }}</span
              >
            </template>
          </el-table-column>
          <el-table-column :label="$t('f68ac74d.1012e0')">
            <template slot-scope="scope">
              <span v-if="scope.row.handle_message"
                >{{ scope.row.handle_message.errorLine }}{{ $t('f68ac74d.2d5aef') }}</span
              >
              <a
                v-if="scope.row.handle_message && scope.row.handle_message.errorLine > 0"
                type="primary"
                @click="exportErrorFile(scope.row.id, scope.row.file_type)"
                >{{ $t('f68ac74d.3798d3') }}</a
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
      </el-form>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  handleUploadFile,
  getUploadLists,
  exportUploadErrorFile,
  exportUploadTemplate
} from '../../../api/common'

export default {
  data() {
    return {
      loading: false,
      total_count: 0,
      pageSize: 20,
      page: 1,
      activeName: 'community_chief',
      uploadList: []
    }
  },
  mounted() {
    this.getUploadList()
  },
  methods: {
    handleClick() {
      this.getUploadList()
    },
    uploadHandleChange(file, fileList) {
      let params = { isUploadFile: true, file_type: this.activeName, file: file.raw }
      handleUploadFile(params).then((response) => {
        this.$message({
          type: 'success',
          message: this.$t('f68ac74d.7bbfaa')
        })
        this.getUploadList()
      })
    },
    uploadHandleTemplate() {
      if (this.activeName == 'member_info') {
        var fileName = this.$t('f68ac74d.b554c4')
      } else if (this.activeName == 'member_update') {
        var fileName = this.$t('f68ac74d.1b0fc1')
      } else if (this.activeName == 'community_chief') {
        var fileName = this.$t('f68ac74d.733c3a')
      }
      let params = { file_type: this.activeName, file_name: fileName }
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
            message: this.$t('f68ac74d.bfd8d5')
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
            message: this.$t('f68ac74d.bfd8d5')
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
      let params = { file_type: this.activeName, page: this.page, pageSize: this.pageSize }
      getUploadLists(params).then((response) => {
        this.uploadList = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    }
  }
}
</script>
