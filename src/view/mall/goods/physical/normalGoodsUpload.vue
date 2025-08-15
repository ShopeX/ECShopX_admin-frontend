<style type="text/css" lang="scss">
.tip-info {
  padding: 8px 16px;
  background-color: #fff6f7;
  border-radius: 4px;
  border-left: 5px solid #ff7800;
  margin: 11px 0;
}
</style>
<template>
  <div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <div class="tip-info">
        <p>
          上传文件如果有处理失败的行数后将会生成错误文件，请及时查看错误信息修改后重新下载，错误描述文件只保留<strong>15天</strong>。
        </p>
        <p>超过<strong>15天</strong>的错误描述文件将会删除，不再提供下载查看</p>
      </div>
      <template v-for="item in pane_list">
        <el-tab-pane :key="item.name" :label="item.label" :name="item.name">
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
                <el-button size="small" type="primary"> 点击上传 </el-button>
              </el-upload>
              <el-button size="small" type="primary" @click="uploadHandleTemplate()">
                下载模版
              </el-button>
            </div>
            <el-table
              v-loading="loading"
              :data="uploadList"
              :height="wheight - 220"
              element-loading-text="数据加载中"
            >
              <el-table-column prop="file_name" label="上传文件" min-width="100" />
              <el-table-column prop="created_date" label="上传时间" min-width="80" />
              <el-table-column prop="file_size_format" label="文件大小" min-width="60" />
              <el-table-column label="处理状态" min-width="50">
                <template slot-scope="scope">
                  <span v-if="scope.row.handle_status == 'wait'">等待处理</span>
                  <span v-if="scope.row.handle_status == 'processing'">处理中</span>
                  <span v-if="scope.row.handle_status == 'finish'">处理完成</span>
                </template>
              </el-table-column>
              <el-table-column prop="finish_date" label="处理完成时间" />
              <el-table-column label="处理成功">
                <template slot-scope="scope">
                  <span v-if="scope.row.handle_message"
                    >{{ scope.row.handle_message.successLine }}行</span
                  >
                </template>
              </el-table-column>
              <el-table-column label="处理失败">
                <template slot-scope="scope">
                  <span v-if="scope.row.handle_message"
                    >{{ scope.row.handle_message.errorLine }}行</span
                  >
                  <a
                    v-if="scope.row.handle_message && scope.row.handle_message.errorLine > 0"
                    type="primary"
                    @click="exportErrorFile(scope.row.id, scope.row.file_type)"
                    >下载错误详情</a
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
import { IS_ADMIN, IS_SUPPLIER } from '@/utils'

export default {
  data() {
    return {
      pane_list: [
      { name: 'upload_tb_items', label: '上传淘宝链接' },
        { name: 'normal_goods', label: '上传实体类商品' },
        { name: 'employee_purchase_activity_items', label: '上传内购活动商品' },
        { name: 'physical_store_upload', label: '商品上下架' }
      ],
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
      if(this.activeName == 'upload_tb_items'){
        params.file_type = 'upload_tb_items'
      }
      handleUploadFile(params).then((response) => {
        this.$message({
          type: 'success',
          message: '上传成功，等待处理'
        })
        this.getUploadList()
      })
    },
    uploadHandleTemplate() {
      let fileName = '新增商品'
      if (this.activeName == 'employee_purchase_activity_items') {
        fileName = '新增内购活动商品'
      }
      let params = {
        file_type: IS_SUPPLIER() ? 'supplier_goods' : 'normal_goods',
        file_name: fileName
      }
      if(this.activeName == 'upload_tb_items'){
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
    },
    handleCurrentChange(val) {
      this.page = val
      this.getUploadList()
    },
    getUploadList() {
      this.loading = true
      let params = {
        file_type: this.activeName,
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
