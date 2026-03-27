<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane
        v-for="item in pane_list"
        :key="item.name"
        :label="$t(item.labelKey)"
        :name="item.name"
      >
        <div class="tip-info">
          <p>
            {{ $t('731b7d26.7b5c77') }}<strong>{{ $t('731b7d26.d99268') }}</strong
            >。
          </p>
          <p>
            {{ $t('731b7d26.41c5ec') }}<strong>{{ $t('731b7d26.d99268') }}</strong
            >{{ $t('731b7d26.40d0ad') }}
          </p>
        </div>
        <el-form ref="form" label-width="100px">
          <el-table
            v-loading="loading"
            :data="uploadList"
            :height="wheight - 240"
            :element-loading-text="$t('731b7d26.f09b12')"
          >
            <el-table-column prop="file_name" :label="$t('731b7d26.a6fc9e')" min-width="100" />
            <el-table-column prop="created_date" :label="$t('731b7d26.cae255')" min-width="80" />
            <el-table-column
              prop="file_size_format"
              :label="$t('731b7d26.396b7d')"
              min-width="60"
            />
            <el-table-column :label="$t('731b7d26.21b314')" min-width="50">
              <template slot-scope="scope">
                <span v-if="scope.row.handle_status == 'wait'">{{ $t('731b7d26.1e57c1') }}</span>
                <span v-if="scope.row.handle_status == 'processing'">{{
                  $t('731b7d26.5d459d')
                }}</span>
                <span v-if="scope.row.handle_status == 'finish'">{{ $t('731b7d26.7be39b') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="finish_date" :label="$t('731b7d26.475dea')" />
            <el-table-column :label="$t('731b7d26.3ba621')">
              <template slot-scope="scope">
                <span v-if="scope.row.handle_message"
                  >{{ scope.row.handle_message.successLine }}{{ $t('731b7d26.2d5aef') }}</span
                >
              </template>
            </el-table-column>
            <el-table-column :label="$t('731b7d26.1012e0')">
              <template slot-scope="scope">
                <span v-if="scope.row.handle_message"
                  >{{ scope.row.handle_message.errorLine }}{{ $t('731b7d26.2d5aef') }}</span
                >
                <a
                  v-if="scope.row.handle_message && scope.row.handle_message.errorLine > 0"
                  type="primary"
                  @click="exportErrorFile(scope.row.id, scope.row.file_type)"
                  >{{ $t('731b7d26.3798d3') }}</a
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
        <el-button @click="handleCancel">{{ $t('8da83775.625fb2') }}</el-button>
      </el-tab-pane>
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
      pane_list: [{ name: 'selform_registration_record', labelKey: '731b7d26.08b465' }],
      loading: false,
      total_count: 0,
      pageSize: 20,
      page: 1,
      activeName: 'selform_registration_record',
      uploadList: []
    }
  },
  computed: {
    ...mapGetters(['wheight'])
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
          message: this.$t('731b7d26.7bbfaa')
        })
        this.getUploadList()
      })
    },
    uploadHandleTemplate() {
      let fileName = ''
      if (this.activeName == 'member_consume') {
        fileName = this.$t('731b7d26.aa8b44')
      } else if (this.activeName == 'member_info') {
        fileName = this.$t('731b7d26.b554c4')
      } else if (this.activeName == 'member_update') {
        fileName = this.$t('731b7d26.1b0fc1')
      } else if (this.activeName == 'selform_registration_record') {
        fileName = this.$t('731b7d26.08b465')
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
            message: this.$t('731b7d26.bfd8d5')
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
            message: this.$t('731b7d26.bfd8d5')
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
    },
    handleCancel() {
      this.$router.go(-1)
    }
  }
}
</script>
