<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->
<template>
  <SpPage>
    <SpFilterForm v-if="IS_ADMIN()" :model="filterForm" @onSearch="onSearch" @onReset="onReset">
      <SpFilterFormItem prop="distributor_id" :label="$t('0255d436.f4e8d2')" size="max">
        <SpSelectShop
          v-model="filterForm.distributor_id"
          clearable
          :placeholder="$t('0255d436.708c9d')"
        />
      </SpFilterFormItem>
    </SpFilterForm>

    <div class="action-container">
      <el-button type="primary" icon="plus" @click="openDialog()">
        {{ $t('0255d436.4c503b') }}
      </el-button>
    </div>

    <el-table border v-loading="loading" :data="list">
      <el-table-column prop="id" :label="$t('0255d436.6872c7')" />
      <el-table-column prop="distributor_id" :label="$t('0255d436.f4e8d2')" />
      <el-table-column prop="page_name" :label="$t('0255d436.b78454')" />
      <el-table-column :label="$t('0255d436.53c3dd')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.is_open == '0' || scope.row.is_open === 0" type="info">
            {{ $t('0255d436.710ad0') }}
          </el-tag>
          <el-tag v-else type="warning"> {{ $t('0255d436.7854b5') }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('0255d436.2b6bc0')" min-width="100">
        <template slot-scope="scope">
          <el-button type="primary" plain round size="mini" @click="openDecoration(scope.row)">
            {{ $t('0255d436.6343df') }}
          </el-button>
          <el-button type="text" class="m-0 px-1">
            <a
              href="javascript:void(0)"
              class="no-underline text-inherit"
              @click="openDialog(scope.row)"
            >
              {{ $t('0255d436.95b351') }}
            </a>
          </el-button>
          <el-button type="text" class="m-0 pl-2">
            <a
              href="javascript:void(0)"
              class="no-underline text-inherit"
              @click="delPage(scope.row.id)"
            >
              {{ $t('0255d436.2f4aad') }}
            </a>
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
      :visible.sync="page_dialog"
      :close-on-click-modal="false"
      :before-close="handleCancel"
    >
      <el-form v-model="pageForm" label-width="200px">
        <el-form-item :label="$t('0255d436.b78454')">
          <el-input
            v-model="pageForm.page_name"
            :placeholder="$t('0255d436.b78454')"
            style="width: 55%"
          />
        </el-form-item>
        <el-form-item :label="$t('0255d436.abf8f4')">
          <el-input
            v-model="pageForm.page_description"
            :placeholder="$t('0255d436.abf8f4')"
            style="width: 55%"
          />
        </el-form-item>
        <el-form-item :label="$t('0255d436.382e6f')">
          <el-input
            v-model="pageForm.page_share_title"
            :placeholder="$t('0255d436.382e6f')"
            style="width: 55%"
          />
        </el-form-item>
        <el-form-item :label="$t('0255d436.106d52')">
          <div class="upload-box" @click="handleImgChange()">
            <img
              v-if="pageForm.page_share_imageUrl"
              :src="wximageurl + pageForm.page_share_imageUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </div>
        </el-form-item>
        <el-form-item :label="$t('0255d436.53c3dd')">
          <el-switch v-model="pageForm.is_open" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer content-center">
        <el-button type="primary" @click="savePage"> {{ $t('0255d436.babc8f') }} </el-button>
      </div>
    </el-dialog>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  getStoreHomePageList,
  createStoreHomePage,
  updateStoreHomePage,
  deleteStoreHomePage
} from '@/api/marketing'
import shopDecoration from '@/components/function/shopDecoration'
import Config from '@/config'

export default {
  name: 'EnterprisePurchaseStoreHomePage',
  components: { shopDecoration },
  data() {
    return {
      template_dialog: false,
      decoratePageId: '',
      decorateStore: null,
      page_dialog: false,
      total_count: 0,
      dialogMode: 'new',
      loading: false,
      wximageurl: Config.imagesOssUrl || '',
      filterForm: {
        distributor_id: ''
      },
      params: {
        page: 1,
        pageSize: 10
      },
      pageForm: {
        id: '',
        page_name: '',
        page_description: '',
        page_share_title: '',
        page_share_desc: '',
        page_share_imageUrl: '',
        is_open: true
      },
      list: []
    }
  },
  computed: {
    ...mapGetters(['template_name']),
    dialogTitleI18n() {
      return this.dialogMode === 'edit' ? this.$t('0255d436.49bcb8') : this.$t('0255d436.0024d3')
    }
  },
  mounted() {
    this.fetchPageList()
    this.decorateStore = this.buildRelStore()
  },
  methods: {
    buildRelStore() {
      const sid = this.IS_DISTRIBUTOR() ? this.$store.getters.shopId : 0
      return { id: sid ? String(sid) : '0' }
    },
    onSearch() {
      this.params.page = 1
      this.fetchPageList()
    },
    onReset() {
      this.filterForm.distributor_id = ''
      this.onSearch()
    },
    openDecoration(row) {
      const cid = row.weapp_customize_page_id
      if (!cid) {
        this.$message.warning(this.$t('9d1e03c7.c1d902'))
        return
      }
      this.$router.push({
        path: '/wxapp/manage/decorate',
        query: {
          id: String(cid),
          scene: '1010'
        }
      })
    },
    closeDialog() {
      this.template_dialog = false
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.fetchPageList()
    },
    delPage(id) {
      this.$confirm(this.$t('0255d436.682fb3')).then(() => {
        deleteStoreHomePage(id).then(() => {
          this.$message({ type: 'success', message: this.$t('0255d436.3b6eb9') })
          this.fetchPageList()
        })
      })
    },
    openDialog(detail = null) {
      this.page_dialog = true
      if (detail) {
        this.pageForm = JSON.parse(JSON.stringify(detail))
        if (detail.is_open == 1) {
          this.pageForm.is_open = true
        } else {
          this.pageForm.is_open = false
        }
        this.dialogMode = 'edit'
      } else {
        this.dialogMode = 'new'
        this.pageForm = {
          id: '',
          page_name: '',
          page_description: '',
          page_share_title: '',
          page_share_desc: '',
          page_share_imageUrl: '',
          is_open: true
        }
      }
    },
    async savePage() {
      const {
        page_name,
        page_description,
        page_share_title,
        page_share_desc,
        page_share_imageUrl,
        is_open,
        id
      } = this.pageForm
      const base = {
        page_name,
        page_description,
        is_open,
        page_share_title,
        page_share_desc,
        page_share_imageUrl,
        template_name: this.template_name
      }
      try {
        if (this.dialogMode === 'edit') {
          await updateStoreHomePage(id, base)
        } else {
          await createStoreHomePage({ ...base })
        }
        this.page_dialog = false
        this.fetchPageList()
        this.$message({
          type: 'success',
          message: this.$t('0255d436.800bb4')
        })
      } catch (error) {
        console.log(error)
      }
    },
    fetchPageList() {
      this.loading = true
      const q = { ...this.params }
      if (this.IS_ADMIN() && this.filterForm.distributor_id) {
        q.distributor_id = this.filterForm.distributor_id
      }
      getStoreHomePageList(q).then((response) => {
        const data = response.data.data
        if (data && data.list) {
          this.list = data.list
          this.total_count = data.total_count
        } else {
          this.list = []
          this.total_count = 0
        }
        this.loading = false
      })
    },
    handleCancel() {
      this.page_dialog = false
    },
    async handleImgChange() {
      const {
        data: { url }
      } = await this.$picker.image({
        data: { url: this.pageForm.page_share_imageUrl }
      })
      this.pageForm.page_share_imageUrl = url
    }
  }
}
</script>
<style lang="scss" scoped>
.upload-box {
  width: 230px;
  img {
    display: block;
    width: 100%;
  }
}
</style>
