<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <div v-if="$route.path.indexOf('detail') === -1">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" icon="plus" @click="openDialog()">
            {{ $t('48a5ebf5.4c503b') }}
          </el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="list" :height="wheight - 140">
        <el-table-column prop="id" :label="$t('48a5ebf5.6872c7')" />
        <el-table-column prop="page_name" :label="$t('48a5ebf5.b78454')" />
        <el-table-column :label="$t('48a5ebf5.53c3dd')">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_open == '0'" type="info">
              {{ $t('48a5ebf5.710ad0') }}
            </el-tag>
            <el-tag v-else type="warning"> {{ $t('48a5ebf5.7854b5') }} </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('48a5ebf5.2b6bc0')" min-width="100">
          <template slot-scope="scope">
            <el-button type="text">
              <a href="javascript:void(0)" @click="delPage(scope.row.id)">
                {{ $t('48a5ebf5.2f4aad') }}
              </a>
            </el-button>
            <el-button type="text">
              <a href="javascript:void(0)" @click="openDialog(scope.row)">
                {{ $t('48a5ebf5.95b351') }}
              </a>
            </el-button>
            <el-button type="primary" plain round size="mini" @click="temDialog(scope.row.id)">
              {{ $t('48a5ebf5.6343df') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="total_count > params.pageSize" class="mt-4 text-right">
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
        :title="$t(dialogTitleKey)"
        :visible.sync="page_dialog"
        :close-on-click-modal="false"
        :before-close="handleCancel"
      >
        <el-form v-model="pageForm" label-width="200px">
          <el-form-item :label="$t('48a5ebf5.b78454')">
            <el-input
              v-model="pageForm.page_name"
              :placeholder="$t('48a5ebf5.b78454')"
              style="width: 55%"
            />
          </el-form-item>
          <el-form-item :label="$t('48a5ebf5.abf8f4')">
            <el-input
              v-model="pageForm.page_description"
              :placeholder="$t('48a5ebf5.abf8f4')"
              style="width: 55%"
            />
          </el-form-item>
          <el-form-item :label="$t('48a5ebf5.382e6f')">
            <el-input
              v-model="pageForm.page_share_title"
              :placeholder="$t('48a5ebf5.382e6f')"
              style="width: 55%"
            />
          </el-form-item>
          <!-- <el-form-item label="分享描述">
            <el-input v-model="pageForm.page_share_desc" placeholder="分享描述" style="width: 55%;"></el-input>
          </el-form-item> -->
          <el-form-item :label="$t('48a5ebf5.106d52')">
            <div class="upload-box" @click="handleImgChange()">
              <img
                v-if="pageForm.page_share_imageUrl"
                :src="wximageurl + pageForm.page_share_imageUrl"
                class="avatar"
              >
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </div>
            <imgPicker
              :dialog-visible="imgDialog"
              :sc-status="isGetImage"
              @chooseImg="pickImg"
              @closeImgDialog="closeImgDialog"
            />
          </el-form-item>
          <el-form-item :label="$t('48a5ebf5.53c3dd')">
            <el-switch v-model="pageForm.is_open" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer content-center">
          <el-button type="primary" @click="savePage"> {{ $t('48a5ebf5.babc8f') }} </el-button>
        </div>
      </el-dialog>
      <el-dialog
        :visible.sync="template_dialog"
        destroy-on-close
        :title="$t('48a5ebf5.49bcb8')"
        fullscreen
        lock-scroll
      >
        <shopDecoration
          :id="pageForm.id"
          usage="page"
          :template_name="template_name"
          @saved="closeDialog"
        />
      </el-dialog>
    </div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getCustomPageList, createCustomPage, delCustomPage, editCustomPage } from '@/api/wxa'
import shopDecoration from '@/components/function/shopDecoration'
import imgPicker from '@/components/imageselect'
export default {
  components: {
    shopDecoration,
    imgPicker
  },
  data() {
    return {
      imgDialog: false,
      isGetImage: false,
      template_dialog: false,
      page_dialog: false,
      total_count: 0,
      dialogTitleKey: '48a5ebf5.0024d3',
      loading: false,
      params: {
        page: 1,
        pageSize: 20
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
    ...mapGetters(['wheight', 'template_name'])
  },
  mounted() {
    this.fetchPageList()
  },
  methods: {
    temDialog(id, type) {
      this.pageForm.id = id
      this.template_dialog = true
    },
    closeDialog() {
      this.template_dialog = false
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.fetchPageList()
    },
    delPage(id) {
      this.$confirm(this.$t('48a5ebf5.682fb3')).then((_) => {
        delCustomPage(id).then((res) => {
          this.$message({ type: 'success', message: this.$t('48a5ebf5.3b6eb9') })
          this.fetchPageList()
        })
      })
    },
    openDialog(detail = null) {
      this.page_dialog = true
      if (detail) {
        this.pageForm = detail
        if (detail.is_open == 1) {
          this.pageForm.is_open = true
        }
        this.dialogTitleKey = '48a5ebf5.49bcb8'
      } else {
        this.dialogTitleKey = '48a5ebf5.0024d3'
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
    savePage() {
      let {
        page_name,
        page_description,
        page_share_title,
        page_share_desc,
        page_share_imageUrl,
        is_open,
        id
      } = this.pageForm
      const params = {
        page_name,
        page_description,
        is_open,
        page_share_title,
        page_share_desc,
        page_share_imageUrl,
        template_name: this.template_name
      }
      if (this.dialogTitleKey === '48a5ebf5.49bcb8') {
        editCustomPage(id, params).then((res) => {
          this.page_dialog = false
          this.fetchPageList()
          this.$message({
            type: 'success',
            message: this.$t('48a5ebf5.800bb4')
          })
        })
      }
      if (this.dialogTitleKey === '48a5ebf5.0024d3') {
        createCustomPage(params).then((res) => {
          this.page_dialog = false
          this.fetchPageList()
          this.$message({
            type: 'success',
            message: this.$t('48a5ebf5.800bb4')
          })
        })
      }
    },
    fetchPageList() {
      this.loading = true
      Object.assign(this.params, { template_name: this.template_name })
      getCustomPageList(this.params).then((response) => {
        if (response.data.data.list) {
          this.list = response.data.data.list
          this.total_count = response.data.data.total_count
        }
        this.loading = false
      })
    },
    handleCancel() {
      this.page_dialog = false
    },
    //上传卡封面
    handleImgChange() {
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg(data) {
      this.pageForm.page_share_imageUrl = data.url
      this.imgDialog = false
    },
    closeImgDialog() {
      this.imgDialog = false
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
