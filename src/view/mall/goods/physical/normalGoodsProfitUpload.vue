<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <div class="tip-info">
        <p>{{ $t('9e7232ca.7b5c77') }}<strong>15</strong>{{ $t('9e7232ca.249aba') }}。</p>
        <p>
          {{ $t('9e7232ca.41c5ec') }}<strong>15</strong>{{ $t('9e7232ca.249aba')
          }}{{ $t('9e7232ca.40d0ad') }}
        </p>
      </div>
      <div v-for="(item, idx) in pane_list" :key="idx">
        <el-tab-pane :label="item.label" :name="item.name">
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
                <el-button size="small" type="primary"> {{ $t('9e7232ca.2c808b') }} </el-button>
              </el-upload>
              <el-button size="small" type="primary" @click="uploadHandleTemplate()">
                {{ $t('9e7232ca.402a67') }}
              </el-button>
            </div>
            <el-table
              v-loading="loading"
              :data="uploadList"
              :height="wheight - 220"
              :element-loading-text="$t('9e7232ca.f09b12')"
            >
              <el-table-column prop="file_name" :label="$t('9e7232ca.a6fc9e')" min-width="100" />
              <el-table-column prop="created_date" :label="$t('9e7232ca.cae255')" min-width="80" />
              <el-table-column
                prop="file_size_format"
                :label="$t('9e7232ca.396b7d')"
                min-width="60"
              />
              <el-table-column :label="$t('9e7232ca.21b314')" min-width="50">
                <template slot-scope="scope">
                  <span v-if="scope.row.handle_status == 'wait'">{{ $t('9e7232ca.1e57c1') }}</span>
                  <span v-if="scope.row.handle_status == 'processing'">{{
                    $t('9e7232ca.5d459d')
                  }}</span>
                  <span v-if="scope.row.handle_status == 'finish'">{{
                    $t('9e7232ca.7be39b')
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="finish_date" :label="$t('9e7232ca.475dea')" />
              <el-table-column :label="$t('9e7232ca.3ba621')">
                <template slot-scope="scope">
                  <span v-if="scope.row.handle_message"
                    >{{ scope.row.handle_message.successLine }}{{ $t('9e7232ca.2d5aef') }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column :label="$t('9e7232ca.1012e0')">
                <template slot-scope="scope">
                  <span v-if="scope.row.handle_message"
                    >{{ scope.row.handle_message.errorLine }}{{ $t('9e7232ca.2d5aef') }}</span
                  >
                  <a
                    v-if="scope.row.handle_message && scope.row.handle_message.errorLine > 0"
                    type="primary"
                    @click="exportErrorFile(scope.row.id, scope.row.file_type)"
                    >{{ $t('9e7232ca.3798d3') }}</a
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
  exportUploadTemplate
} from '@/api/common'

export default {
  data() {
    return {
      pane_list: [],
      loading: false,
      total_count: 0,
      pageSize: 20,
      page: 1,
      activeName: 'normal_goods_profit',
      uploadList: []
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    pane_list() {
      return [{ name: 'normal_goods_profit', label: this.$t('9e7232ca.d80111') }]
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
          message: this.$t('9e7232ca.7bbfaa')
        })
        this.getUploadList()
      })
    },
    uploadHandleTemplate() {
      if (this.activeName == 'normal_goods_profit') {
        var fileName = this.$t('9e7232ca.1975c3')
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
            message: this.$t('9e7232ca.bfd8d5')
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
            message: this.$t('9e7232ca.bfd8d5')
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
