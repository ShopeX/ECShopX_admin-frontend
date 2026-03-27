<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <div style="display: flex">
        <el-button type="primary" style="margin-right: 20px" @click="downloadtemplate">
          {{ $t('d41d8cd9.o5p6q7') }}
        </el-button>
        <el-upload
          action=""
          :on-change="uploadHandleChange"
          :auto-upload="false"
          :show-file-list="false"
          class="upload"
        >
          <el-button type="primary"> {{ $t('d41d8cd9.r8s9t0') }} </el-button>
        </el-upload>
        <el-tooltip
          style="margin-left: 10px; margin-top: 10px"
          effect="light"
          :content="$t('71df5316.29119c')"
          placement="top-start"
        >
          <i class="el-icon-warning-outline" />
        </el-tooltip>
      </div>
      <div class="tip-info">
        <p>
          {{ $t('d41d8cd9.u1v2w3') }}<strong>15{{ $t('d41d8cd9.x4y5z6') }}</strong
          >{{ $t('d41d8cd9.a7b8c9') }}
        </p>
        <p>
          {{ $t('d41d8cd9.d0e1f2a') }}<strong>15{{ $t('d41d8cd9.x4y5z6') }}</strong
          >{{ $t('d41d8cd9.g3h4i5') }}
        </p>
      </div>
      <div v-for="item in pane_list">
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
              :element-loading-text="$t('71df5316.f09b12')"
            >
              <el-table-column prop="file_name" :label="$t('71df5316.a6fc9e')" min-width="100" />
              <el-table-column prop="created_date" :label="$t('71df5316.cae255')" min-width="80" />
              <el-table-column
                prop="file_size_format"
                :label="$t('71df5316.396b7d')"
                min-width="60"
              />
              <el-table-column :label="$t('71df5316.21b314')" min-width="50">
                <template slot-scope="scope">
                  <span v-if="scope.row.handle_status == 'wait'">{{ $t('d41d8cd9.j6k7l8') }}</span>
                  <span v-if="scope.row.handle_status == 'processing'">{{
                    $t('d41d8cd9.m9n0o1')
                  }}</span>
                  <span v-if="scope.row.handle_status == 'finish'">{{
                    $t('d41d8cd9.p2q3r4')
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="finish_date" :label="$t('71df5316.475dea')" />
              <el-table-column :label="$t('71df5316.3ba621')">
                <template slot-scope="scope">
                  <span v-if="scope.row.handle_message"
                    >{{ scope.row.handle_message.successLine }}{{ $t('d41d8cd9.s5t6u7') }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column :label="$t('71df5316.1012e0')">
                <template slot-scope="scope">
                  <span v-if="scope.row.handle_message"
                    >{{ scope.row.handle_message.errorLine }}{{ $t('d41d8cd9.s5t6u7') }}</span
                  >
                  <a
                    v-if="scope.row.handle_message && scope.row.handle_message.errorLine > 0"
                    type="primary"
                    @click="exportErrorFile(scope.row.id, scope.row.file_type)"
                    >{{ $t('d41d8cd9.v8w9x0') }}</a
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
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  handleUploadFile,
  getUploadLists,
  exportUploadErrorFile,
  exportUploadTemplate,
  download
} from '../../../../api/common'

export default {
  data() {
    return {
      pane_list: [],
      loading: false,
      total_count: 0,
      pageSize: 20,
      page: 1,
      activeName: 'normal_orders',
      uploadList: []
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.pane_list = [{ name: 'normal_orders', label: this.$t('71df5316.9e6dce') }]
    this.getUploadList()
  },
  methods: {
    async downloadtemplate() {
      const result = await download()
      let { data } = result.data
      if (data.file) {
        var a = document.createElement('a')
        a.href = data.file
        a.download = data.name
        document.body.appendChild(a)
        a.click()
        a.remove()
      }
      console.log(result)
    },
    uploadHandleChange(file) {
      let params = {
        isUploadFile: true,
        file_type: 'normal_orders',
        file: file.raw
      }
      handleUploadFile(params).then(() => {
        this.$message({
          type: 'success',
          message: this.$t('71df5316.7bbfaa')
        })
      })
    },
    handleClick() {
      this.getUploadList()
    },
    uploadHandleChange(file, fileList) {
      let params = { isUploadFile: true, file_type: this.activeName, file: file.raw }
      handleUploadFile(params).then((response) => {
        this.$message({
          type: 'success',
          message: this.$t('71df5316.7bbfaa')
        })
        this.getUploadList()
      })
    },
    uploadHandleTemplate() {
      if (this.activeName == 'normal_orders') {
        var fileName = this.$t('71df5316.66ab5e')
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
            message: this.$t('71df5316.bfd8d5')
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
            message: this.$t('71df5316.bfd8d5')
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
