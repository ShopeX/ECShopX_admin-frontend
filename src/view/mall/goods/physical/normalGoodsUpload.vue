<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <div class="tip-info">
        <p>
          {{ $t('5f45d286.08f306') }}
        </p>
        <p>{{ $t('5f45d286.4f6279') }}</p>
      </div>
      <template v-for="item in pane_list">
        <el-tab-pane :key="item.name" :label="item.label" :name="item.name">
          <el-form ref="form" label-width="100px">
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
            <el-table
              border
              v-loading="loading"
              :data="uploadList"
              :height="wheight - 220"
              :element-loading-text="$t('5f45d286.f09b12')"
            >
              <el-table-column prop="file_name" :label="$t('5f45d286.a6fc9e')" min-width="100" />
              <el-table-column prop="created_date" :label="$t('5f45d286.cae255')" min-width="80" />
              <el-table-column
                prop="file_size_format"
                :label="$t('5f45d286.396b7d')"
                min-width="60"
              />
              <el-table-column :label="$t('5f45d286.21b314')" min-width="50">
                <template slot-scope="scope">
                  <span v-if="scope.row.handle_status == 'wait'">{{ $t('5f45d286.1e57c1') }}</span>
                  <span v-if="scope.row.handle_status == 'processing'">{{
                    $t('5f45d286.5d459d')
                  }}</span>
                  <span v-if="scope.row.handle_status == 'finish'">{{
                    $t('5f45d286.7be39b')
                  }}</span>
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
          </el-form>
        </el-tab-pane>
      </template>
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
} from '../../../../api/common'
import { IS_ADMIN, IS_SUPPLIER } from '@/utils'
import { i18n } from '@/i18n'

export default {
  data() {
    const paneList = [
      { name: 'upload_tb_items', label: i18n.t('5f45d286.f1968b') },
      { name: 'normal_goods', label: i18n.t('5f45d286.9e6dce') }
    ]

    if (!IS_SUPPLIER()) {
      paneList.push({ name: 'employee_purchase_activity_items', label: i18n.t('5f45d286.4482b6') })
    }

    return {
      pane_list: paneList,
      loading: false,
      total_count: 0,
      pageSize: 20,
      page: 1,
      activeName: '',
      uploadList: []
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    const { file_type = 'normal_goods' } = this.$route.query
    this.activeName = file_type
    this.getUploadList()
  },
  methods: {
    getDistributorId() {
      return {
        distributor_id: this.$store.getters.shopId || 0
      }
    },
    handleClick() {
      this.getUploadList()
    },
    uploadHandleChange(file, fileList) {
      let params = {
        isUploadFile: true,
        file: file.raw,
        ...this.getDistributorId(),
        file_type: IS_SUPPLIER() ? 'supplier_goods' : 'normal_goods'
      }
      if (this.activeName == 'upload_tb_items') {
        params.file_type = 'upload_tb_items'
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
      let fileName = this.$t('5f45d286.27fabd')
      if (this.activeName == 'employee_purchase_activity_items') {
        fileName = this.$t('5f45d286.3dd83a')
      }
      let params = {
        file_type: IS_SUPPLIER() ? 'supplier_goods' : 'normal_goods',
        file_name: fileName
      }
      if (this.activeName == 'upload_tb_items') {
        params.file_type = 'upload_tb_items'
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
        file_type:
          IS_SUPPLIER() && this.activeName == 'normal_goods' ? 'supplier_goods' : this.activeName,
        page: this.page,
        pageSize: this.pageSize,
        ...this.getDistributorId()
      }
      getUploadLists(params).then((response) => {
        this.uploadList = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    }
  }
}
</script>
