<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <div class="tip-info">
        <p>
          {{ $t('5b0ca5e8.7b5c77') }}<strong>{{ $t('5b0ca5e8.d99268') }}</strong
          >。
        </p>
        <p>
          {{ $t('5b0ca5e8.41c5ec') }}<strong>{{ $t('5b0ca5e8.d99268') }}</strong
          >{{ $t('5b0ca5e8.40d0ad') }}
        </p>
      </div>
      <div v-for="item in pane_list" :key="item.label">
        <el-tab-pane :label="item.label" :name="item.name">
          <el-form ref="form" label-width="100px">
            <div class="content-bottom-padded">
              <el-upload
                style="margin-right: 10px; float: left"
                action=""
                :on-change="uploadHandleChange"
                :auto-upload="false"
                :show-file-list="false"
              >
                <el-button size="small" type="primary"> {{ $t('5b0ca5e8.2c808b') }} </el-button>
              </el-upload>
              <el-button size="small" type="primary" @click="uploadHandleTemplate()">
                {{ $t('5b0ca5e8.402a67') }}
              </el-button>
            </div>
            <el-table
              v-loading="loading"
              :data="uploadList"
              :height="wheight - 220"
              :element-loading-text="$t('5b0ca5e8.f09b12')"
            >
              <el-table-column prop="file_name" :label="$t('5b0ca5e8.a6fc9e')" min-width="100" />
              <el-table-column prop="created_date" :label="$t('5b0ca5e8.cae255')" min-width="80" />
              <el-table-column
                prop="file_size_format"
                :label="$t('5b0ca5e8.396b7d')"
                min-width="60"
              />
              <el-table-column :label="$t('5b0ca5e8.21b314')" min-width="50">
                <template slot-scope="scope">
                  <span v-if="scope.row.handle_status == 'wait'">{{ $t('5b0ca5e8.1e57c1') }}</span>
                  <span v-if="scope.row.handle_status == 'processing'">{{
                    $t('5b0ca5e8.5d459d')
                  }}</span>
                  <span v-if="scope.row.handle_status == 'finish'">{{
                    $t('5b0ca5e8.7be39b')
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="finish_date" :label="$t('5b0ca5e8.475dea')" />
              <el-table-column :label="$t('5b0ca5e8.3ba621')">
                <template slot-scope="scope">
                  <span v-if="scope.row.handle_message"
                    >{{ scope.row.handle_message.successLine }}{{ $t('5b0ca5e8.2d5aef') }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column :label="$t('5b0ca5e8.1012e0')">
                <template slot-scope="scope">
                  <span v-if="scope.row.handle_message"
                    >{{ scope.row.handle_message.errorLine }}{{ $t('5b0ca5e8.2d5aef') }}</span
                  >
                  <a
                    v-if="scope.row.handle_message && scope.row.handle_message.errorLine > 0"
                    class="error_a"
                    type="primary"
                    @click="exportErrorFile(scope.row.id, scope.row.file_type)"
                    >{{ $t('5b0ca5e8.3798d3') }}</a
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
  getTemplate,
  getFlieList,
  uploadFiles,
  exportUploadErrorFile
} from '@/api/productUpdate.js'

export default {
  data() {
    return {
      pane_list: [{ name: 'normal_goods', label: this.$t('5b0ca5e8.9e6dce') }],
      loading: false,
      total_count: 0,
      pageSize: 20,
      page: 1,
      activeName: 'normal_goods',
      uploadList: [],
      flie: {
        file_type: 'distributor_info',
        file_name: this.$t('5b0ca5e8.9d8114')
      }
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
    // 上传文件
    async uploadHandleChange(file, fileList) {
      console.log(file)
      console.log(fileList)
      let data = {
        isUploadFile: true,
        file_type: 'distributor_info',
        file: file.raw
      }

      await uploadFiles(data)
      this.$message({
        type: 'success',
        message: this.$t('5b0ca5e8.7bbfaa')
      })
      this.getUploadList()
    },
    // 下载模板
    async uploadHandleTemplate() {
      try {
        const { status, data } = await getTemplate(this.flie)
        if (status === 200) {
          const a = document.createElement('a')
          a.href = data.data.file
          a.download = data.data.name
          document.body.appendChild(a)
          a.click()
          a.remove()
        }
      } catch (error) {
        this.$message({
          type: 'error',
          message: this.$t('5b0ca5e8.bfd8d5')
        })
      }
    },
    // 错误信息
    async exportErrorFile(id, fileType) {
      let params = { file_type: fileType }
      try {
        const { data } = await exportUploadErrorFile(id, params)
        let a = document.createElement('a')
        a.href = data.data.file
        a.download = data.data.name
        document.body.appendChild(a)
        a.click()
        a.remove()
      } catch (error) {
        this.$message({
          type: 'error',
          message: this.$t('5b0ca5e8.bfd8d5')
        })
      }
    },
    handleCurrentChange(val) {
      this.page = val
      this.getUploadList()
    },
    // 获取上传文件列表
    async getUploadList() {
      this.loading = true
      let query = {
        file_type: this.flie.file_type,
        page: this.page,
        pageSize: this.pageSize
      }
      const { data, status } = await getFlieList(query)
      if (status === 200) {
        this.uploadList = data.data.list
        this.total_count = data.data.total_count
        this.loading = false
      }
    }
    // cellStyle(row,column,rowIndex,columnIndex){
    //     console.log(row.column);
    //     console.log(column);
    //     if (row.row.handle_status == 'processing') {
    //         return 'background:#FFB800'
    //     }else if(row.row.handle_status =='finish'){
    //          return 'background:#56BD6A'
    //     }else{
    //         return 'background:#E85E58'
    //     }

    // }
  }
}
</script>

<style type="text/css" lang="scss">
.error_a {
  cursor: pointer;
}
</style>
