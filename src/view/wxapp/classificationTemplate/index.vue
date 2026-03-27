<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div v-if="$route.path.indexOf('detail') === -1">
      <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" icon="plus" @click="openDialog()">
            {{ $t('baa9bc1d.b58ed1') }}
          </el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="list">
        <el-table-column prop="id" :label="$t('baa9bc1d.6872c7')" />
        <el-table-column prop="page_name" :label="$t('baa9bc1d.b78454')" />
        <el-table-column :label="$t('baa9bc1d.53c3dd')">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_open == '0'" type="info">
              {{ $t('baa9bc1d.710ad0') }}
            </el-tag>
            <el-tag v-else type="warning"> {{ $t('baa9bc1d.7854b5') }} </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('baa9bc1d.2b6bc0')" min-width="100">
          <template slot-scope="scope">
            <el-button type="primary" plain round size="mini" @click="temDialog(scope.row.id)">
              {{ $t('baa9bc1d.6343df') }}
            </el-button>
            <el-button type="text">
              <a href="javascript:void(0)" @click="openDialog(scope.row)">
                {{ $t('baa9bc1d.95b351') }}
              </a>
            </el-button>
            <el-popover v-if="appID" placement="top" width="200" trigger="click">
              <div>
                <img class="page-code" :src="appCodeUrl">
                <div class="page-btns">
                  <el-button
                    type="primary"
                    plain
                    size="mini"
                    @click="handleDownload(scope.row.page_name)"
                  >
                    {{ $t('baa9bc1d.99e985') }}
                  </el-button>
                  <el-button v-clipboard:copy="curPageUrl" type="primary" plain size="mini">
                    {{ $t('baa9bc1d.879058') }}
                  </el-button>
                </div>
              </div>
              <el-button
                slot="reference"
                style="width: 45px"
                type="text"
                @click="handleClick(scope.row.id)"
              >
                {{ $t('baa9bc1d.536ff1') }}
              </el-button>
            </el-popover>
            <el-button type="text">
              <a href="javascript:void(0)" @click="delPage(scope.row.id)">
                {{ $t('baa9bc1d.2f4aad') }}
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
          <el-form-item :label="$t('baa9bc1d.b78454')">
            <el-input
              v-model="pageForm.page_name"
              :placeholder="$t('baa9bc1d.b78454')"
              style="width: 55%"
            />
          </el-form-item>
          <el-form-item :label="$t('baa9bc1d.abf8f4')">
            <el-input
              v-model="pageForm.page_description"
              :placeholder="$t('baa9bc1d.abf8f4')"
              style="width: 55%"
            />
          </el-form-item>
          <el-form-item :label="$t('baa9bc1d.382e6f')">
            <el-input
              v-model="pageForm.page_share_title"
              :placeholder="$t('baa9bc1d.382e6f')"
              style="width: 55%"
            />
          </el-form-item>
          <!-- <el-form-item label="分享描述">
            <el-input v-model="pageForm.page_share_desc" placeholder="分享描述" style="width: 55%;"></el-input>
          </el-form-item> -->
          <el-form-item :label="$t('baa9bc1d.106d52')">
            <div class="upload-box" @click="handleImgChange()">
              <img
                v-if="pageForm.page_share_imageUrl"
                :src="wximageurl + pageForm.page_share_imageUrl"
                class="avatar"
              >
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </div>
          </el-form-item>
          <el-form-item :label="$t('baa9bc1d.53c3dd')">
            <el-switch v-model="pageForm.is_open" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer content-center">
          <el-button type="primary" @click="savePage"> {{ $t('baa9bc1d.babc8f') }} </el-button>
        </div>
      </el-dialog>
      <el-dialog
        :visible.sync="template_dialog"
        destroy-on-close
        :title="$t('baa9bc1d.49bcb8')"
        fullscreen
        lock-scroll
      >
        <shopDecoration
          :id="pageForm.id"
          usage="page"
          pagetype="cuspage"
          :rel-store="store"
          :template_name="template_name"
          @saved="closeDialog"
        />
      </el-dialog>
    </div>
    <router-view />
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import { getCustomPageList, createCustomPage, delCustomPage, editCustomPage } from '@/api/wxa'
import { getPageCode } from '@/api/marketing'
import shopDecoration from '@/components/function/shopDecoration'
export default {
  components: {
    shopDecoration
  },
  data() {
    return {
      template_dialog: false,
      page_dialog: false,
      total_count: 0,
      dialogMode: 'new',
      loading: false,
      appID: '',
      appCodeUrl: '',
      curPageUrl: '',
      params: {
        page: 1,
        pageSize: 10,
        page_type: 'category'
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
      list: [],
      store: null
    }
  },
  computed: {
    ...mapGetters(['template_name']),
    dialogTitleI18n() {
      return this.dialogMode === 'edit' ? this.$t('baa9bc1d.49bcb8') : this.$t('baa9bc1d.0024d3')
    }
  },
  mounted() {
    this.fetchPageList()
    this.fetchWechatList()
    this.store = { id: '0' }
  },
  methods: {
    async fetchWechatList() {
      const { list } = await this.$api.minimanage.gettemplateweapplist()
      list.forEach((item, i) => {
        if (item.key_name == 'yykweishop') {
          this.appID = item.authorizer.authorizer_appid
        }
      })
    },
    handleClick(id) {
      const page = 'pages/custom/custom-page'
      this.curPageUrl = `${page}?id=${id}`
      let params = {
        wxaAppId: this.appID,
        page,
        id
      }
      getPageCode(params).then((response) => {
        this.appCodeUrl = response.data.data.base64Image
      })
    },
    handleDownload(name) {
      var a = document.createElement('a')
      var temp = name
      if (this.appCodeUrl) {
        a.href = this.appCodeUrl
        a.download = temp + '.png'
        a.click()
      }
    },
    temDialog(id, type) {
      // this.pageForm.id = id
      // this.template_dialog = true
      this.$router.push(`/decoration/mobile/home-template/edit?id=${id}&scene=1006`)
    },
    closeDialog() {
      this.template_dialog = false
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.fetchPageList()
    },
    delPage(id) {
      this.$confirm(this.$t('baa9bc1d.682fb3')).then((_) => {
        delCustomPage(id).then((res) => {
          this.$message({ type: 'success', message: this.$t('baa9bc1d.3b6eb9') })
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
        page_type: 'category',
        page_name,
        page_description,
        is_open,
        page_share_title,
        page_share_desc,
        page_share_imageUrl,
        template_name: this.template_name
      }
      if (this.dialogMode === 'edit') {
        editCustomPage(id, params).then((res) => {
          this.page_dialog = false
          this.fetchPageList()
          this.$message({
            type: 'success',
            message: this.$t('baa9bc1d.800bb4')
          })
        })
      }
      if (this.dialogMode === 'new') {
        createCustomPage(params).then((res) => {
          this.page_dialog = false
          this.fetchPageList()
          this.$message({
            type: 'success',
            message: this.$t('baa9bc1d.800bb4')
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
    async handleImgChange() {
      try {
        const { data } = await this.$picker.image({
          data: this.pageForm.page_share_imageUrl
            ? { url: this.pageForm.page_share_imageUrl }
            : undefined
        })

        // 获取图片URL，可能是对象中的url属性，也可能是直接的字符串
        const imgUrl = (data && data.url) || data || ''

        if (imgUrl) {
          // 如果包含 wximageurl，则提取相对路径
          // pageForm.page_share_imageUrl 存储的是相对路径（显示时使用 wximageurl + pageForm.page_share_imageUrl）
          if (this.wximageurl && imgUrl.indexOf(this.wximageurl) === 0) {
            this.pageForm.page_share_imageUrl = imgUrl.replace(this.wximageurl, '')
          } else {
            this.pageForm.page_share_imageUrl = imgUrl
          }
        }
      } catch (error) {
        // 用户取消选择时不处理错误
        console.log('图片选择已取消')
      }
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
.page-code {
  width: 100%;
}
.page-btns {
  text-align: center;
}
</style>
