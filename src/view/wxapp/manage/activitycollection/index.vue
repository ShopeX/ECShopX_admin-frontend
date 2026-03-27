<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />

    <div class="action-container">
      <el-button type="primary" icon="plus" @click="openDialog()">
        {{ $t('fde6e25d.d38e65') }}
      </el-button>
    </div>

    <el-table border v-loading="loading" :data="list">
      <el-table-column prop="collection_id" :label="$t('fde6e25d.26cf62')" width="100" />
      <el-table-column prop="collection_name" :label="$t('fde6e25d.fd4fcb')" />
      <el-table-column prop="description" :label="$t('fde6e25d.3bdd08')" />
      <el-table-column :label="$t('fde6e25d.53c3dd')" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.is_open == '0' || !scope.row.is_open" type="info">
            {{ $t('fde6e25d.710ad0') }}
          </el-tag>
          <el-tag v-else type="success"> {{ $t('fde6e25d.7854b5') }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('fde6e25d.eca37c')" width="180">
        <template slot-scope="scope">
          {{ formatDate(scope.row.created_time) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('fde6e25d.2b6bc0')" min-width="200">
        <template slot-scope="scope">
          <el-button type="primary" plain round size="mini" @click="openDialog(scope.row)">
            {{ $t('fde6e25d.95b351') }}
          </el-button>
          <el-button
            type="danger"
            plain
            round
            size="mini"
            @click="delCollection(scope.row.collection_id)"
          >
            {{ $t('fde6e25d.2f4aad') }}
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
      :title="dialogTitleI18n"
      :visible.sync="collection_dialog"
      :close-on-click-modal="false"
      :before-close="handleCancel"
      width="600px"
    >
      <el-form :model="collectionForm" label-width="120px">
        <el-form-item :label="$t('fde6e25d.fd4fcb')" required>
          <el-input v-model="collectionForm.collection_name" :placeholder="$t('fde6e25d.55f14c')" />
        </el-form-item>
        <el-form-item :label="$t('fde6e25d.f85b91')">
          <el-input
            v-model="collectionForm.description"
            type="textarea"
            :rows="3"
            :placeholder="$t('fde6e25d.d51833')"
          />
        </el-form-item>
        <el-form-item :label="$t('fde6e25d.53c3dd')">
          <el-switch v-model="collectionForm.is_open" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel"> {{ $t('fde6e25d.625fb2') }} </el-button>
        <el-button type="primary" @click="saveCollection"> {{ $t('fde6e25d.babc8f') }} </el-button>
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
      dialogMode: 'new',
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
        this.dialogMode = 'edit'
      } else {
        this.dialogMode = 'new'
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
        this.$message.error(this.$t('fde6e25d.55f14c'))
        return
      }

      const params = {
        collection_name: this.collectionForm.collection_name.trim(),
        description: this.collectionForm.description || '',
        is_open: this.collectionForm.is_open ? 1 : 0
      }

      try {
        if (this.dialogMode === 'edit') {
          await editActivityCollection(this.collectionForm.collection_id, params)
        } else {
          await createActivityCollection(params)
        }
        this.collection_dialog = false
        this.fetchCollectionList()
        this.$message({
          type: 'success',
          message: this.$t('fde6e25d.3b1083')
        })
      } catch (error) {
        console.error(error)
        this.$message.error(this.$t('fde6e25d.6de920'))
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
          this.$message.error(this.$t('fde6e25d.fe9d24'))
        })
    },
    delCollection(id) {
      this.$confirm(this.$t('fde6e25d.b97aaa'), this.$t('fde6e25d.02d981'), {
        confirmButtonText: this.$t('fde6e25d.38cf16'),
        cancelButtonText: this.$t('fde6e25d.625fb2'),
        type: 'warning'
      })
        .then(() => {
          delActivityCollection(id)
            .then(() => {
              this.$message({ type: 'success', message: this.$t('fde6e25d.0007d1') })
              this.fetchCollectionList()
            })
            .catch((error) => {
              console.error(error)
              this.$message.error(this.$t('fde6e25d.acf066'))
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
