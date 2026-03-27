<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <div class="tip-info">
        <p v-html="$t('01fa6885.08f306')" />
        <p v-html="$t('01fa6885.4f6279')" />
      </div>
      <div v-for="item in pane_list" :key="item.name">
        <el-tab-pane :label="item.label" :name="item.name">
          <el-form ref="form" label-width="100px">
            <!-- <div class="content-bottom-padded">
              <el-upload class="fl" style="margin-right: 10px" action="" :on-change="uploadHandleChange" :auto-upload="false" :show-file-list="false" >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
              <el-button size="small" @click="uploadHandleTemplate()" type="primary">下载模版</el-button>
          </div> -->
            <el-table
              v-loading="loading"
              :data="uploadList"
              :height="wheight - 220"
              :element-loading-text="$t('01fa6885.f09b12')"
            >
              <el-table-column prop="file_name" :label="$t('01fa6885.a6fc9e')" min-width="100" />
              <el-table-column prop="created_date" :label="$t('01fa6885.cae255')" min-width="80" />
              <el-table-column
                prop="file_size_format"
                :label="$t('01fa6885.396b7d')"
                min-width="60"
              />
              <el-table-column :label="$t('01fa6885.21b314')" min-width="50">
                <template slot-scope="scope">
                  <span v-if="scope.row.handle_status == 'wait'">{{ $t('01fa6885.1e57c1') }}</span>
                  <span v-if="scope.row.handle_status == 'processing'">{{
                    $t('01fa6885.5d459d')
                  }}</span>
                  <span v-if="scope.row.handle_status == 'finish'">{{
                    $t('01fa6885.7be39b')
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="finish_date" :label="$t('01fa6885.475dea')" />
              <el-table-column :label="$t('01fa6885.3ba621')">
                <template slot-scope="scope">
                  <span v-if="scope.row.handle_message"
                    >{{ scope.row.handle_message.successLine }}{{ $t('01fa6885.2d5aef') }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column :label="$t('01fa6885.1012e0')">
                <template slot-scope="scope">
                  <span v-if="scope.row.handle_message"
                    >{{ scope.row.handle_message.errorLine }}{{ $t('01fa6885.2d5aef') }}</span
                  >
                  <a
                    v-if="scope.row.handle_message && scope.row.handle_message.errorLine > 0"
                    type="primary"
                    @click="exportErrorFile(scope.row.id, scope.row.file_type)"
                    >{{ $t('01fa6885.3798d3') }}</a
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
      </div>
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
} from '../../../../api/common'

export default {
  data() {
    return {
      loading: false,
      total_count: 0,
      pageSize: 20,
      page: 1,
      activeName: 'normal_orders',
      uploadList: []
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    pane_list() {
      return [{ name: 'normal_orders', label: this.$t('01fa6885.9e6dce') }]
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
          message: this.$t('01fa6885.7bbfaa')
        })
        this.getUploadList()
      })
    },
    uploadHandleTemplate() {
      if (this.activeName == 'normal_orders') {
        var fileName = this.$t('01fa6885.66ab5e')
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
            message: this.$t('01fa6885.bfd8d5')
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
            message: this.$t('01fa6885.bfd8d5')
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
