<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />

    <div class="action-container">
      <el-button type="primary" icon="plus" @click="openDialog()"> 添加活动集合 </el-button>
    </div>

    <el-table border v-loading="loading" :data="list">
      <el-table-column prop="collection_id" label="集合ID" width="100" />
      <el-table-column prop="collection_name" label="集合名称" />
      <el-table-column prop="description" label="描述" />
      <el-table-column label="是否启用" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.is_open == '0' || !scope.row.is_open" type="info"> 禁用 </el-tag>
          <el-tag v-else type="success"> 启用 </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180">
        <template slot-scope="scope">
          {{ formatDate(scope.row.created_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="200">
        <template slot-scope="scope">
          <el-button type="primary" plain round size="mini" @click="openDialog(scope.row)">
            编辑
          </el-button>
          <el-button
            type="danger"
            plain
            round
            size="mini"
            @click="delCollection(scope.row.collection_id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="mt-4 text-right">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page.sync="params.page"
        :total="total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="collection_dialog"
      :close-on-click-modal="false"
      :before-close="handleCancel"
      width="600px"
    >
      <el-form :model="collectionForm" label-width="120px">
        <el-form-item label="集合名称" required>
          <el-input v-model="collectionForm.collection_name" placeholder="请输入集合名称" />
        </el-form-item>
        <el-form-item label="集合描述">
          <el-input
            v-model="collectionForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入集合描述"
          />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="collectionForm.is_open" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel"> 取消 </el-button>
        <el-button type="primary" @click="saveCollection"> 确认保存 </el-button>
      </div>
    </el-dialog>
  </SpPage>
</template>

<script>
import {
  getActivityCollectionList,
  createActivityCollection,
  editActivityCollection,
  delActivityCollection
} from '@/api/promotions'

export default {
  name: 'ActivityCollection',
  data() {
    return {
      collection_dialog: false,
      dialogTitle: '新增活动集合',
      loading: false,
      total_count: 0,
      params: {
        page: 1,
        pageSize: 10
      },
      collectionForm: {
        collection_id: '',
        collection_name: '',
        description: '',
        is_open: true
      },
      list: []
    }
  },
  mounted() {
    this.fetchCollectionList()
  },
  methods: {
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.fetchCollectionList()
    },
    openDialog(detail = null) {
      this.collection_dialog = true
      if (detail) {
        this.collectionForm = {
          collection_id: detail.collection_id,
          collection_name: detail.collection_name || '',
          description: detail.description || '',
          is_open: detail.is_open == 1 || detail.is_open === true
        }
        this.dialogTitle = '编辑活动集合'
      } else {
        this.dialogTitle = '新增活动集合'
        this.collectionForm = {
          collection_id: '',
          collection_name: '',
          description: '',
          is_open: true
        }
      }
    },
    async saveCollection() {
      if (!this.collectionForm.collection_name || !this.collectionForm.collection_name.trim()) {
        this.$message.error('请输入集合名称')
        return
      }

      const params = {
        collection_name: this.collectionForm.collection_name.trim(),
        description: this.collectionForm.description || '',
        is_open: this.collectionForm.is_open ? 1 : 0
      }

      try {
        if (this.dialogTitle == '编辑活动集合') {
          await editActivityCollection(this.collectionForm.collection_id, params)
        } else {
          await createActivityCollection(params)
        }
        this.collection_dialog = false
        this.fetchCollectionList()
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      } catch (error) {
        console.error(error)
        this.$message.error('保存失败')
      }
    },
    fetchCollectionList() {
      this.loading = true
      getActivityCollectionList(this.params)
        .then((response) => {
          if (response.data.data) {
            this.list = response.data.data.list || []
            this.total_count = response.data.data.total_count || 0
          }
          this.loading = false
        })
        .catch((error) => {
          console.error(error)
          this.loading = false
          this.$message.error('获取列表失败')
        })
    },
    delCollection(id) {
      this.$confirm('确认删除该活动集合吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delActivityCollection(id)
            .then(() => {
              this.$message({ type: 'success', message: '删除成功' })
              this.fetchCollectionList()
            })
            .catch((error) => {
              console.error(error)
              this.$message.error('删除失败')
            })
        })
        .catch(() => {})
    },
    handleCancel() {
      this.collection_dialog = false
    },
    formatDate(timestamp) {
      if (!timestamp) return '-'
      const date = new Date(timestamp * 1000)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}`
    }
  }
}
</script>

<style lang="scss" scoped>
.action-container {
  margin-bottom: 20px;
}
</style>
