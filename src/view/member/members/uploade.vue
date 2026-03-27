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
  <SpPage>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane v-for="item in pane_list" :key="item.name" :label="item.label" :name="item.name">
        <div class="tip-info">
          <p>
            {{ $t('f4f9c6d7.7b5c77') }}<strong>{{ $t('f4f9c6d7.d99268') }}</strong
            >。
          </p>
          <p>
            {{ $t('f4f9c6d7.41c5ec') }}<strong>{{ $t('f4f9c6d7.d99268') }}</strong
            >{{ $t('f4f9c6d7.40d0ad') }}
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
              <el-button size="small" type="primary">{{ $t('f4f9c6d7.2c808b') }}</el-button>
            </el-upload>
            <el-button size="small" type="primary" @click="uploadHandleTemplate()">
              {{ $t('f4f9c6d7.402a67') }}
            </el-button>
          </div>
          <el-table
            v-loading="loading"
            :data="uploadList"
            :height="wheight - 240"
            :element-loading-text="$t('f4f9c6d7.f09b12')"
          >
            <el-table-column prop="file_name" :label="$t('f4f9c6d7.a6fc9e')" min-width="100" />
            <el-table-column prop="created_date" :label="$t('f4f9c6d7.cae255')" min-width="80" />
            <el-table-column
              prop="file_size_format"
              :label="$t('f4f9c6d7.396b7d')"
              min-width="60"
            />
            <el-table-column :label="$t('f4f9c6d7.21b314')" min-width="50">
              <template slot-scope="scope">
                <span v-if="scope.row.handle_status == 'wait'">{{ $t('f4f9c6d7.1e57c1') }}</span>
                <span v-if="scope.row.handle_status == 'processing'">{{
                  $t('f4f9c6d7.5d459d')
                }}</span>
                <span v-if="scope.row.handle_status == 'finish'">{{ $t('f4f9c6d7.7be39b') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="finish_date" :label="$t('f4f9c6d7.475dea')" />
            <el-table-column :label="$t('f4f9c6d7.3ba621')">
              <template slot-scope="scope">
                <span v-if="scope.row.handle_message"
                  >{{ scope.row.handle_message.successLine }}{{ $t('f4f9c6d7.2d5aef') }}</span
                >
              </template>
            </el-table-column>
            <el-table-column :label="$t('f4f9c6d7.1012e0')">
              <template slot-scope="scope">
                <span v-if="scope.row.handle_message"
                  >{{ scope.row.handle_message.errorLine }}{{ $t('f4f9c6d7.2d5aef') }}</span
                >
                <a
                  v-if="scope.row.handle_message && scope.row.handle_message.errorLine > 0"
                  type="primary"
                  @click="exportErrorFile(scope.row.id, scope.row.file_type)"
                  >{{ $t('f4f9c6d7.3798d3') }}</a
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
      </el-tab-pane>
    </el-tabs>
  </SpPage>
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
      activeName: 'member_info',
      uploadList: []
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    pane_list() {
      if (this.VERSION_SHUYUN()) {
        return [{ name: 'selform_registration_record', label: this.$t('f4f9c6d7.08b465') }]
      }
      return [
        { name: 'member_consume', label: this.$t('f4f9c6d7.8ae64d') },
        { name: 'member_info', label: this.$t('f4f9c6d7.6eaa98') },
        { name: 'member_update', label: this.$t('f4f9c6d7.f7fc5b') },
        { name: 'selform_registration_record', label: this.$t('f4f9c6d7.08b465') }
      ]
    }
  },
  created() {
    if (this.VERSION_SHUYUN()) {
      this.activeName = 'selform_registration_record'
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
          message: this.$t('f4f9c6d7.7bbfaa')
        })
        this.getUploadList()
      })
    },
    uploadHandleTemplate() {
      if (this.activeName == 'member_info') {
        var fileName = this.$t('f4f9c6d7.b554c4')
      } else if (this.activeName == 'member_update') {
        var fileName = this.$t('f4f9c6d7.1b0fc1')
      } else if (this.activeName == 'member_consume') {
        var fileName = this.$t('f4f9c6d7.aa8b44')
      } else if (this.activeName == 'selform_registration_record') {
        var fileName = this.$t('f4f9c6d7.08b465')
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
            message: this.$t('f4f9c6d7.bfd8d5')
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
            message: this.$t('f4f9c6d7.bfd8d5')
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
