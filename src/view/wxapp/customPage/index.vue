<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div v-if="$route.path.indexOf('detail') === -1">
      <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />

      <el-tabs v-model="activeTab" type="card" @tab-click="fetchPageList">
        <el-tab-pane :label="$t('0255d436.d7bc07')" name="my" />
        <el-tab-pane :label="$t('0255d436.cee6eb')" name="normal" />
      </el-tabs>

      <div class="action-container">
        <el-button type="primary" icon="plus" @click="openDialog()">
          {{ $t('0255d436.4c503b') }}
        </el-button>
      </div>

      <el-table border v-loading="loading" :data="list">
        <el-table-column prop="id" :label="$t('0255d436.6872c7')" />
        <el-table-column prop="page_name" :label="$t('0255d436.b78454')" />
        <el-table-column :label="$t('0255d436.53c3dd')">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_open == '0'" type="info">
              {{ $t('0255d436.710ad0') }}
            </el-tag>
            <el-tag v-else type="warning"> {{ $t('0255d436.7854b5') }} </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('0255d436.2b6bc0')" min-width="100">
          <template slot-scope="scope">
            <div class="flex items-center flex-wrap gap-2">
              <el-button type="primary" plain round size="mini" @click="temDialog(scope.row.id)">
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
                      {{ $t('0255d436.99e985') }}
                    </el-button>
                    <el-button v-clipboard:copy="curPageUrl" type="primary" plain size="mini">
                      {{ $t('0255d436.879058') }}
                    </el-button>
                  </div>
                </div>
                <el-button
                  slot="reference"
                  type="text"
                  class="m-0 px-1"
                  @click="handleClick(scope.row.id)"
                >
                  {{ $t('0255d436.536ff1') }}
                </el-button>
              </el-popover>
              <el-button type="text" class="m-0 pl-2">
                <a
                  href="javascript:void(0)"
                  class="no-underline text-inherit"
                  @click="delPage(scope.row.id)"
                >
                  {{ $t('0255d436.2f4aad') }}
                </a>
              </el-button>
            </div>
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
          <!-- <el-form-item label="页面类型">
            <el-select v-model="pageForm.page_type" placeholder="请选择页面类型" style="width: 55%">
              <el-option
                v-for="item in pageOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item> -->
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
          <!-- <el-form-item label="分享描述">
            <el-input v-model="pageForm.page_share_desc" placeholder="分享描述" style="width: 55%;"></el-input>
          </el-form-item> -->
          <el-form-item :label="$t('0255d436.106d52')">
            <div class="upload-box" @click="handleImgChange()">
              <img
                v-if="pageForm.page_share_imageUrl"
                :src="wximageurl + pageForm.page_share_imageUrl"
                class="avatar"
              >
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </div>
            <!-- <imgPicker
              :dialog-visible="imgDialog"
              :sc-status="isGetImage"
              @chooseImg="pickImg"
              @closeImgDialog="closeImgDialog"
            /> -->
          </el-form-item>
          <el-form-item :label="$t('0255d436.53c3dd')">
            <el-switch v-model="pageForm.is_open" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer content-center">
          <el-button type="primary" @click="savePage"> {{ $t('0255d436.babc8f') }} </el-button>
        </div>
      </el-dialog>
      <el-dialog
        :visible.sync="template_dialog"
        destroy-on-close
        :title="$t('0255d436.49bcb8')"
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
      dialogMode: 'new',
      loading: false,
      appID: '',
      appCodeUrl: '',
      curPageUrl: '',
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
        is_open: true,
        page_type: 'normal'
      },
      list: [],
      store: null,
      pageOption: [
        { label: '自定义', value: 'normal' },
        { label: '个人中心', value: 'my' }
      ],
      activeTab: 'my' // 默认「我的页面」
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
      if (this.activeTab == 'normal') {
        this.$router.push(`/decoration/mobile/home-template/edit?id=${id}&scene=1004`)
      } else {
        this.$router.push(`/decoration/mobile/home-template/edit?id=${id}&scene=1008`)
      }
    },
    closeDialog() {
      this.template_dialog = false
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.fetchPageList()
    },
    delPage(id) {
      this.$confirm(this.$t('0255d436.682fb3')).then((_) => {
        delCustomPage(id).then((res) => {
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
          is_open: true,
          page_type: this.activeTab
        }
      }
    },
    async savePage() {
      let {
        page_name,
        page_description,
        page_share_title,
        page_share_desc,
        page_share_imageUrl,
        is_open,
        id,
        page_type
      } = this.pageForm
      const params = {
        page_name,
        page_description,
        is_open: is_open,
        page_share_title,
        page_share_desc,
        page_share_imageUrl,
        template_name: this.template_name,
        page_type
      }
      try {
        if (this.dialogMode === 'edit') {
          await editCustomPage(id, params)
        }
        if (this.dialogMode === 'new') {
          await createCustomPage(params)
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
      Object.assign(this.params, { template_name: this.template_name, page_type: this.activeTab })
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
      const {
        data: { url }
      } = await this.$picker.image({
        data: { url: this.pageForm.page_share_imageUrl }
      })
      this.pageForm.page_share_imageUrl = url
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
.page-code {
  width: 100%;
}
.page-btns {
  text-align: center;
}
// 覆盖 Element UI 文本按钮的默认 margin-left
::v-deep .flex .el-button--text {
  margin-left: 0;
}
</style>
