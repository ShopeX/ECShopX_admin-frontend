<template>
  <div>
    <div v-if="$route.path.indexOf('detail') === -1">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button
            type="primary"
            icon="plus"
            @click="openDialog()"
          >
            添加页面
          </el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="loading"
        :data="list"
        :height="wheight - 140"
      >
        <el-table-column
          prop="id"
          label="页面id"
        />
        <el-table-column
          prop="page_name"
          label="页面名称"
        />
        <el-table-column label="是否启用">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.is_open == '0'"
              type="info"
            >
              禁用
            </el-tag>
            <el-tag
              v-else
              type="warning"
            >
              启用
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="100"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain
              round
              size="mini"
              @click="temDialog(scope.row.id)"
            >
              页面装修
            </el-button>
            <el-button type="text">
              <a
                href="javascript:void(0)"
                @click="openDialog(scope.row)"
              > 编辑 </a>
            </el-button>
            <el-popover
              v-if="appID"
              placement="top"
              width="200"
              trigger="click">
              <div>
                <img class="page-code" :src="appCodeUrl" />
                <div class="page-btns">
                  <el-button type="primary" plain size="mini" @click="handleDownload(scope.row.page_name)">下载码</el-button>
                  <el-button type="primary" plain size="mini" v-clipboard:copy="curPageUrl">复制链接</el-button>
                </div>
              </div>
              <el-button style="width: 45px" type="text" slot="reference" @click="handleClick(scope.row.id)">投放</el-button>
            </el-popover>
            <el-button type="text">
              <a
                href="javascript:void(0)"
                @click="delPage(scope.row.id)"
              > 删除 </a>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div
        v-if="total_count > params.pageSize"
        class="content-padded content-center"
      >
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
        :visible.sync="page_dialog"
        :close-on-click-modal="false"
        :before-close="handleCancel"
      >
        <el-form
          v-model="pageForm"
          label-width="200px"
        >
          <el-form-item label="页面名称">
            <el-input
              v-model="pageForm.page_name"
              placeholder="页面名称"
              style="width: 55%"
            />
          </el-form-item>
          <el-form-item label="页面描述">
            <el-input
              v-model="pageForm.page_description"
              placeholder="页面描述"
              style="width: 55%"
            />
          </el-form-item>
          <el-form-item label="分享标题">
            <el-input
              v-model="pageForm.page_share_title"
              placeholder="分享标题"
              style="width: 55%"
            />
          </el-form-item>
          <!-- <el-form-item label="分享描述">
            <el-input v-model="pageForm.page_share_desc" placeholder="分享描述" style="width: 55%;"></el-input>
          </el-form-item> -->
          <el-form-item label="分享图片">
            <div
              class="upload-box"
              @click="handleImgChange()"
            >
              <img
                v-if="pageForm.page_share_imageUrl"
                :src="wximageurl + pageForm.page_share_imageUrl"
                class="avatar"
              >
              <i
                v-else
                class="el-icon-plus avatar-uploader-icon"
              />
            </div>
            <imgPicker
              :dialog-visible="imgDialog"
              :sc-status="isGetImage"
              @chooseImg="pickImg"
              @closeImgDialog="closeImgDialog"
            />
          </el-form-item>
          <el-form-item label="是否启用">
            <el-switch v-model="pageForm.is_open" />
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer content-center"
        >
          <el-button
            type="primary"
            @click="savePage"
          >
            确认保存
          </el-button>
        </div>
      </el-dialog>
      <el-dialog
        :visible.sync="template_dialog"
        destroy-on-close
        title="编辑页面"
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
  </div>
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
  data () {
    return {
      imgDialog: false,
      isGetImage: false,
      template_dialog: false,
      page_dialog: false,
      total_count: 0,
      dialogTitle: '新增页面',
      loading: false,
      appID: '',
      appCodeUrl: '',
      curPageUrl: '',
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
      list: [],
      store: null
    }
  },
  computed: {
    ...mapGetters(['wheight', 'template_name'])
  },
  mounted () {
    this.fetchPageList()
    this.fetchWechatList()
    this.store = { id: '0' }
  },
  methods: {
    async fetchWechatList() {
      const { list } = await this.$api.minimanage.gettemplateweapplist()
      list.forEach((item, i) => {
        if (item.name == 'yykweishop') {
          this.appID = item.authorizer.authorizer_appid
        }
      })
    },
    handleClick (id) {
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
    handleDownload (name) {
      var a = document.createElement('a')
      var temp = name
      if (this.appCodeUrl) {
        a.href = this.appCodeUrl
        a.download = temp + '.png'
        a.click()
      }
    },
    temDialog (id, type) {
      this.pageForm.id = id
      this.template_dialog = true
    },
    closeDialog () {
      this.template_dialog = false
    },
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.fetchPageList()
    },
    delPage (id) {
      this.$confirm('确认删除当前页面吗？').then((_) => {
        delCustomPage(id).then((res) => {
          this.$message({ type: 'success', message: '操作成功！' })
          this.fetchPageList()
        })
      })
    },
    openDialog (detail = null) {
      this.page_dialog = true
      if (detail) {
        this.pageForm = detail
        if (detail.is_open == 1) {
          this.pageForm.is_open = true
        }
        this.dialogTitle = '编辑页面'
      } else {
        this.dialogTitle = '新增页面'
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
    savePage () {
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
      if (this.dialogTitle == '编辑页面') {
        editCustomPage(id, params).then((res) => {
          this.page_dialog = false
          this.fetchPageList()
          this.$message({
            type: 'success',
            message: '保存页面成功'
          })
        })
      }
      if (this.dialogTitle == '新增页面') {
        createCustomPage(params).then((res) => {
          this.page_dialog = false
          this.fetchPageList()
          this.$message({
            type: 'success',
            message: '保存页面成功'
          })
        })
      }
    },
    fetchPageList () {
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
    handleCancel () {
      this.page_dialog = false
    },
    //上传卡封面
    handleImgChange () {
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg (data) {
      this.pageForm.page_share_imageUrl = data.url
      this.imgDialog = false
    },
    closeImgDialog () {
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
</style>
