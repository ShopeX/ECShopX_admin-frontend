<template>
  <div>
    <div v-if="relStore.id == '0'" class="shop-header">
      <div v-if="!VERSION_B2C && !VERSION_IN_PURCHASE" class="shop-left">
        <span class="text">小程序模版呈现：</span>
        <div class="option-item">
          <span class="option-item_text">总部首页</span>
          <el-switch
            v-model="index_type"
            :active-value="1"
            :inactive-value="2"
            active-color="#13ce66"
            @change="changeShop('platform')"
          />
        </div>
        <div v-if="VERSION_STANDARD" class="option-item">
          <span class="option-item_text">店铺首页</span>
          <el-switch
            v-model="index_type"
            :active-value="2"
            :inactive-value="1"
            active-color="#13ce66"
            @change="changeShop('shop')"
          />
        </div>
        <span v-if="!VERSION_PLATFORM" class="text">模版同步设置：</span>
        <div v-if="!VERSION_PLATFORM" class="option-item">
          <span class="option-item_text">同步并启用</span>
          <el-switch
            v-model="is_enforce_sync"
            :active-value="1"
            :inactive-value="2"
            active-color="#13ce66"
            @change="toggleSynchronizeShop"
          />
        </div>
      </div>
      <div v-if="relStore.id == '0'" class="section-white mini-setting">
        <el-button type="text" style="margin-right: 10px" @click="handleShowConfig">
          <i class="iconfont icon-cog" style="color: #8080ff" /> 小程序配置
        </el-button>
        <el-button type="text" @click="handleShowTabConfig">
          <i class="iconfont icon-cog" style="color: #8080ff" /> 小程序导航配置
        </el-button>
      </div>
    </div>

    <el-row
      :gutter="20"
      class="template-list"
      :class="{ 'is-shop': relStore.id != '0' || VERSION_B2C }"
    >
      <el-col
        v-for="(item, index) in templateList"
        :key="index"
        :xs="12"
        :sm="12"
        :md="8"
        :lg="6"
        :xl="4"
      >
        <div class="template-item">
          <div class="img-wrap">
            <div class="preview-cover" @click="previewTemplate(item.pages_template_id)">
              <img class="preview-cover_img" src="@/assets/img/preview.png" alt="预览">
              <span class="preview-cover_text">预览</span>
            </div>
            <img class="template-pic" :src="item.template_pic">
            <div v-if="item.template_type == 1" class="tag">同步模板</div>
          </div>
          <div class="template-name">
            <span>{{ item.template_title }}</span>
            <span class="el-icon-edit edit-css" @click="AddOrEditDialog('edit', item)" />
          </div>
          <div v-if="relStore.id == '0' && !VERSION_B2C" class="template-common">
            <span class="temp-label">店铺可编辑挂件</span>
            <el-switch
              v-model="item.element_edit_status"
              active-color="#13ce66"
              :active-value="1"
              :inactive-value="2"
              @change="changeShopEdit(index)"
            />
          </div>
          <div class="template-common">
            <span class="temp-label">立即启用</span>
            <el-tooltip class="item" effect="dark" content="至少开启一套模版" placement="top-start">
              <el-switch
                v-model="item.status"
                active-color="#13ce66"
                :active-value="1"
                :inactive-value="2"
                @change="useTemplate(index, item.status)"
              />
            </el-tooltip>
          </div>
          <div class="time-wrap">
            <div v-if="!item.showTime" class="no-time">
              <div>定时启用</div>
              <div class="picker-wrap">
                <img class="time-img" src="@/assets/img/time-img.png">
                <span>设置模板切换时间</span>
                <el-date-picker
                  v-model="item.timer_time"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  @change="changeDate(index)"
                />
              </div>
            </div>
            <div v-if="item.showTime" class="has-time">
              <span class="time">{{ item.timer_time }}启用</span>
              <span class="cancel-btn" @click="cancelTime(index)">取消</span>
            </div>
          </div>
          <div class="option-btns">
            <span class="btn" @click="editTemplate(item.pages_template_id)">编辑</span>
            <span class="btn" @click="copyTemplate(item.pages_template_id)">复制</span>
            <span class="btn" @click="copyTemplate(item.pages_template_id)">导航</span>
            <span class="btn" @click="abandonTemplate(item.pages_template_id)">废弃</span>
          </div>
          <div
            v-if="relStore.id == '0' && !VERSION_B2C && !VERSION_IN_PURCHASE"
            class="synchronize-btn"
            @click="synchronizeTemplateToShop(index)"
          >
            同步模板至店铺
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4">
        <div
          :class="{
            'template-item': true,
            'add-btn': true,
            'sync-template':
              relStore.id == '0' && !VERSION_B2C && !VERSION_PLATFORM && !VERSION_IN_PURCHASE
          }"
          @click="AddOrEditDialog('add')"
        >
          <div class="template-wrap">
            <img class="add-img" src="@/assets/img/add-template.png" alt="添加">
            <div class="add-text">添加模板</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <DistributorSelect
      :store-visible="distributorVisible"
      :is-synchronize="isSynchronize"
      :is-valid="isValid"
      :rel-data-ids="relDistributors"
      :get-status="distributorStatus"
      @chooseStore="distributorChooseAction"
      @chooseAllStore="allDistributorChooseAction"
      @closeStoreDialog="closeDialogAction"
    />
    <imgPicker
      :dialog-visible="imgsVisible"
      :sc-status="isGetImage"
      @chooseImg="pickImg"
      @closeImgDialog="closeimgsVisible"
    />
    <MallDecoration
      :dialog-visible="templateVisible"
      :template-name="template_name"
      :rel-store="relStore"
      :show-like="is_open_recommend"
      :template-id="currTemplateId"
      @saved="closeDialog"
      @closeDialog="closeDialog"
    />
    <TemplatePreview
      :dialog-visible="previewVisible"
      :rel-store="relStore"
      :show-like="is_open_recommend"
      :template-id="currTemplateId"
      :tabs="tabs"
      usage="page"
      @saved="closePreviewDialog"
      @closeDialog="closePreviewDialog"
    />

    <el-dialog
      title="新增模板"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="50%"
      :before-close="closeAddDialog"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="模板名称" prop="template_title">
          <el-input v-model="form.template_title" type="text" :maxlength="10" style="width: 55%" />
        </el-form-item>
        <el-form-item label="模板封面">
          <div class="setting-item slider" style="width: 55%">
            <img
              v-if="form.template_pic"
              :src="form.template_pic"
              class="banner-uploader"
              @click="handleImgChange"
            >
            <div v-else class="banner-uploader" @click="handleImgChange">
              <i class="iconfont icon-camera" />
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer content-center">
        <el-button type="primary" @click="addTemplate('form')"> 确 定 </el-button>
      </div>
    </el-dialog>

    <sideBar :visible.sync="show_sideBar" :title="'小程序配置'" width="20">
      <el-form label-width="120px">
        <el-form-item label="开启热门推荐">
          <el-switch
            v-model="is_open_recommend"
            :active-value="1"
            :inactive-value="2"
            active-color="#13ce66"
            @change="toggleOpenRecommend"
          />
        </el-form-item>
        <el-form-item v-if="VERSION_PLATFORM || VERSION_STANDARD" label="开启小程序定位">
          <el-switch
            v-model="is_open_wechatapp_location"
            :active-value="1"
            :inactive-value="2"
            active-color="#13ce66"
            @change="toggleOpenWechatappLocation"
          />
        </el-form-item>
        <el-form-item label="开启扫码功能">
          <el-switch
            v-model="is_open_scan_qrcode"
            :active-value="1"
            :inactive-value="2"
            active-color="#13ce66"
            @change="toggleOpenScanQrcode"
          />
        </el-form-item>
        <el-form-item label="开启公众号组件">
          <el-switch
            v-model="is_open_official_account"
            :active-value="1"
            :inactive-value="2"
            active-color="#13ce66"
            @change="toggleOpenOfficialAccount"
          />
        </el-form-item>
      </el-form>
    </sideBar>

    <sideBar :visible.sync="show_tab_sideBar" :title="'小程序导航配置'" width="35">
      <div
        class="template-tabs"
        :style="{ background: tabs.config.backgroundColor, color: tabs.config.color }"
      >
        <div class="current-active" />
        <div
          v-for="(item, index) in tabs.data"
          :key="index"
          class="tab"
          :style="index === currentTab ? `color:${tabs.config.selectedColor}` : ''"
        >
          <i v-if="!item.iconPath" :class="`icon-${item.name} iconfont`" />
          <!-- <svg
            v-if="!item.iconPath"
            class="svg-icon"
            aria-hidden="true"
            :style="index === currentTab ? `color:${tabs.config.selectedColor}` : ''"
          >
            <use :xlink:href="`#icon-${item.name}`"></use>

          </svg> -->

          <template v-else>
            <img
              v-if="index === currentTab"
              class="svg-icon"
              :src="
                item.selectedIconPath || 'https://fakeimg.pl/60x60/EFEFEF/CCC/?text=icofont=lobster'
              "
            >
            <img
              v-else
              class="svg-icon"
              :src="item.iconPath || 'https://fakeimg.pl/60x60/EFEFEF/CCC/?text=icon&font=lobster'"
            >
          </template>
          <div class="tab-text">
            {{ item.text }}
          </div>
        </div>
      </div>
      <tabsEditor :res="editorData" @bindImgs="showImgs" @saveTab="handelSaveTab" />
    </sideBar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { VERSION_B2C } from '@/utils'

import DistributorSelect from '@/components/function/distributorSelect'
import ShopDecoration from '@/components/function/shopDecoration'
import MallDecoration from '@/components/function/mallDecoration'
import TemplatePreview from '@/components/function/templatePreview'
import imgPicker from '@/components/imageselect'
import sideBar from '@/components/element/sideBar'
import tabsEditor from '@/components/template_editor/tab_bar_new'

import {
  setPagesTemplate,
  getPagesTemplateSetInfo,
  getPagesTemplateList,
  addPagesTemplate,
  copyPagesTemplate,
  deletePagesTemplate,
  getPagesTemplateDetail,
  savePagesTemplate,
  syncPagesTemplate,
  modifyPagesTemplateStatus
} from '@/api/template'

export default {
  components: {
    DistributorSelect,
    imgPicker,
    ShopDecoration,
    MallDecoration,
    TemplatePreview,
    sideBar,
    tabsEditor
  },
  props: {
    relStore: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      index_type: 1,
      orgin_index_type: 'platform',
      is_enforce_sync: 2,
      is_open_recommend: 2,
      is_open_wechatapp_location: 1,
      is_open_scan_qrcode: 2,
      is_open_official_account: 2,
      templateList: [],
      form: {
        template_title: '',
        template_pic: ''
      },
      rules: {
        template_title: [{ required: true, message: '请输入模板名称', trigger: 'blur' }]
      },
      distributorVisible: false,
      isValid: true,
      relDistributors: [],
      distributorStatus: false,
      dialogVisible: false,
      dialogType: '',
      dialogData: {},
      imgsVisible: false,
      isGetImage: false,
      isSynchronize: false,
      templateVisible: false,
      previewVisible: false,
      currTemplateId: null,
      params: {
        page_no: 1,
        page_size: 10
      },
      total_count: 0,
      show_sideBar: false,
      show_tab_sideBar: false,
      tabIcon: '',
      currentTab: 0,
      selectedTab: false,
      tabs: {
        name: 'tabs',
        config: {
          color: '#333333',
          selectedColor: '#1f82e0',
          backgroundColor: '#ffffff'
        },
        data: [
          {
            pagePath: '/pages/index',
            text: '首页',
            name: 'home',
            iconPath: '',
            selectedIconPath: ''
          },
          {
            pagePath: '/pages/category/index',
            text: '分类',
            name: 'category',
            iconPath: '',
            selectedIconPath: ''
          },
          {
            pagePath: '/pages/cart/espier-index',
            text: '购物车',
            name: 'cart',
            iconPath: '',
            selectedIconPath: ''
          },
          {
            pagePath: '/pages/member/index',
            text: '我的',
            name: 'member',
            iconPath: '',
            selectedIconPath: ''
          }
        ]
      },
      editorData: {},
      editorDataIndex: null,
      app_page_type: {
        wechat: 'wechat',
        alipay: 'alipay'
      }
    }
  },
  mounted() {
    this.getTemplateSetInfo()
    this.getList()
  },
  computed: {
    ...mapGetters(['app_type', 'template_name', 'ali_template_name'])
  },
  methods: {
    getTemplateSetInfo() {
      // let params = {
      //   page_type: this.app_page_type[this.app_type]
      // }
      // getPagesTemplateSetInfo(params).then((res) => {
      getPagesTemplateSetInfo().then((res) => {
        let data = res.data.data
        this.index_type = data.index_type
        this.is_enforce_sync = data.is_enforce_sync
        this.is_open_recommend = data.is_open_recommend
        this.is_open_wechatapp_location = data.is_open_wechatapp_location
        this.is_open_scan_qrcode = data.is_open_scan_qrcode
        this.is_open_official_account = data.is_open_official_account
        if (this.index_type == 1) {
          this.orgin_index_type = 'platform'
        } else {
          this.orgin_index_type = 'shop'
        }
        if (data.tab_bar) {
          this.tabs = JSON.parse(data.tab_bar)
          console.log(this.tabs)
        }
      })
    },
    getList(status) {
      let params = {
        ...this.params,
        distributor_id: this.relStore.id
        // page_type: this.app_page_type[this.app_type]
      }
      getPagesTemplateList(params).then((res) => {
        // this.te·mplateList = res.data.data.list
        let list = []
        res.data.data.list.map((item) => {
          list.push({
            ...item,
            element_edit_status: item.element_edit_status || 2,
            status: item.status || 2,
            timer_status: item.timer_status || 2,
            showTime: false,
            timer_time: !item.timer_time ? '' : this.formatTimeStampToStr(item.timer_time),
            showTime: item.timer_status == 1
          })
        })
        this.templateList = list
        this.total_count = res.data.data.total_count
      })
    },
    formatTimeStampToStr(timeStamp) {
      //时间戳转时间字符串
      var date = new Date()
      date.setTime(timeStamp * 1000)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? '0' + d : d
      var h = date.getHours()
      h = h < 10 ? '0' + h : h
      var minute = date.getMinutes()
      var second = date.getSeconds()
      minute = minute < 10 ? '0' + minute : minute
      second = second < 10 ? '0' + second : second
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
    },
    handleImgChange(data) {
      this.imgsVisible = true
      this.isGetImage = true
    },
    pickImg(data) {
      if (this.editorDataIndex != null) {
        if (this.tabIcon === 'default') {
          this.editorData.data[this.editorDataIndex].iconPath = data.url
          this.tabs.data[this.editorDataIndex].iconPath = data.url
        } else {
          this.editorData.data[this.editorDataIndex].selectedIconPath = data.url
          this.tabs.data[this.editorDataIndex].selectedIconPath = data.url
        }
      } else {
        this.form.template_pic = data.url
      }
      this.imgsVisible = false
    },
    closeimgsVisible() {
      this.imgsVisible = false
    },
    distributorChooseAction(data) {
      if (data === null || data.length <= 0) {
        this.distributorVisible = false
        this.distributorStatus = false
        return
      }
      this.relDistributors = data
      let shop_ids = data.map((item) => {
        return item.distributor_id
      })
      this.syncTemplate(2, shop_ids)
    },
    allDistributorChooseAction() {
      this.syncTemplate(1)
    },
    syncTemplate(is_all_distributor, shop_ids) {
      let params = {
        pages_template_id: this.currTemplateId,
        is_all_distributor
      }
      if (is_all_distributor == 2) {
        params.distributor_ids = JSON.stringify(shop_ids)
      }
      syncPagesTemplate(params).then((res) => {
        this.distributorVisible = false
        this.distributorStatus = false
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    closeDialogAction() {
      this.distributorStatus = false
      this.distributorVisible = false
    },
    changeShop(type) {
      if (type == 'shop') {
        this.index_type = 2
      } else {
        this.index_type = 1
      }
      if (this.orgin_index_type == type) {
        return
      } else {
        this.orgin_index_type = type
      }
      let params = {
        index_type: this.index_type
        // page_type: this.app_page_type[this.app_type]
      }
      setPagesTemplate(params).then((res) => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    toggleSynchronizeShop(val) {
      let params = {
        is_enforce_sync: val
        // page_type: this.app_page_type[this.app_type]
      }
      setPagesTemplate(params).then((res) => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    handleInputChange(e) {
      console.log('===handleInputChange', e)
      this.form.template_title = e
    },
    toggleOpenRecommend(val) {
      let params = {
        is_open_recommend: val
        // page_type: this.app_page_type[this.app_type]
      }
      setPagesTemplate(params).then((res) => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    toggleOpenWechatappLocation(val) {
      if (this.VERSION_PLATFORM && val == 2) {
        this.$confirm('关闭后附件商家组件将无法使用', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.updateLocation(val)
          })
          .catch(() => {
            this.is_open_wechatapp_location = 1
          })
        return
      }
      this.updateLocation(val)
    },
    updateLocation(val) {
      let params = {
        is_open_wechatapp_location: val
        // page_type: this.app_page_type[this.app_type]
      }
      setPagesTemplate(params).then((res) => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    toggleOpenScanQrcode(val) {
      let params = {
        is_open_scan_qrcode: val
        // page_type: this.app_page_type[this.app_type]
      }
      setPagesTemplate(params).then((res) => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    toggleOpenOfficialAccount(val) {
      let params = {
        is_open_official_account: val
        // page_type: this.app_page_type[this.app_type]
      }
      setPagesTemplate(params).then((res) => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    AddOrEditDialog(type, item) {
      this.dialogVisible = true
      this.dialogType = type
      this.dialogData = item
      this.editorDataIndex = null
      if (item) {
        this.form.template_title = item.template_title
        this.form.template_pic = item.template_pic
      }
    },
    closeAddDialog() {
      this.dialogVisible = false
      this.dialogType = ''
      this.dialogData = ''
      this.resetForm('form')
    },
    addTemplate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = this.form
          let requestApi
          if (this.dialogType == 'add') {
            requestApi = addPagesTemplate
            params.template_name = this.template_name
            params.distributor_id = this.relStore.id
          } else {
            requestApi = savePagesTemplate
            params.pages_template_id = this.dialogData.pages_template_id
          }
          requestApi(params).then((res) => {
            this.getList()
            this.resetForm(formName)
          })
        }
      })
    },
    resetForm(formName) {
      this.dialogVisible = false
      this.$refs[formName].resetFields()
      this.form = {
        template_title: '',
        template_pic: ''
      }
      this.dialogType = ''
      this.dialogData = {}
    },
    previewTemplate(pages_template_id) {
      this.previewVisible = true
      this.currTemplateId = pages_template_id
    },
    async changeShopEdit(index) {
      let params = {
        distributor_id: this.relStore.id,
        pages_template_id: this.templateList[index].pages_template_id,
        template_content: this.templateList[index].template_content,
        element_edit_status: this.templateList[index].element_edit_status,
        template_name: this.template_name
        // template_name: this.app_type === 'wechat' ?  this.template_name : this.ali_template_name
      }
      await savePagesTemplate(params)
      this.$message({
        message: '操作成功',
        type: 'success'
      })
    },
    useTemplate(index, val) {
      this.currTemplateId = this.templateList[index].pages_template_id
      if (val == 1) {
        this.templateList[index].status = 2
        this.$confirm('确认立即启用当前模板？', '启用模板', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(() => {
            this.modifyTemplateStatus(index, 'status', val)
          })
          .catch(() => {})
      } else {
        this.templateList[index].status = 1
        this.modifyTemplateStatus(index, 'status', val)
      }
    },
    useTimeTemplate(index, val) {
      this.currTemplateId = this.templateList[index].pages_template_id
      if (val == 2) {
        this.templateList[index].timer_status = 1
        this.$confirm('确认取消启用定时模板？', '取消定时模板', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(() => {
            this.modifyTemplateStatus(index, val)
            this.templateList[index].timer_time = ''
            this.templateList[index].showTime = false
            this.templateList[index].timer_status = val
          })
          .catch(() => {})
      } else {
        this.currTemplateId = this.templateList[index].pages_template_id
        this.templateList[index].timer_status = val
      }
    },
    cancelTime(index) {
      this.$confirm('确认取消启用定时模板？', '取消定时模板', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.currTemplateId = this.templateList[index].pages_template_id
          this.modifyTemplateStatus(index, 'timer_status', 2)
        })
        .catch(() => {})
    },
    changeDate(index) {
      this.currTemplateId = this.templateList[index].pages_template_id
      this.modifyTemplateStatus(index, 'timer_status', 1)
    },
    async modifyTemplateStatus(index, type, status) {
      let params = {
        pages_template_id: this.currTemplateId,
        template_name: this.template_name
        // template_name: this.app_type === 'wechat' ?  this.template_name : this.ali_template_name
      }
      if (type == 'status') {
        params.status = status
      } else {
        params.timer_status = status
        // params.timer_time = this.templateList[index].timer_time
        params.timer_time = status == 1 ? this.templateList[index].timer_time : ''
      }
      await modifyPagesTemplateStatus(params)
      this.getList()
      this.$message({
        message: '操作成功',
        type: 'success'
      })
    },
    editTemplate(pages_template_id) {
      // this.templateVisible = true
      // this.currTemplateId = pages_template_id
      // window.open(`/wxapp/manage/decorate?id=${pages_template_id}`, '_blank')
      const { distributor_id } = this.$route.query
      if (distributor_id > 0) {
        this.$router.push(
          `/wxapp/manage/decorate?id=${pages_template_id}&scene=1003&distributor_id=${distributor_id}`
        )
      } else {
        this.$router.push(`/wxapp/manage/decorate?id=${pages_template_id}`)
      }
    },
    copyTemplate(pages_template_id) {
      let params = {
        pages_template_id: pages_template_id
        // page_type: this.app_page_type[this.app_type]
      }
      this.$confirm('确认拷贝当前模板？', '拷贝模板', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          copyPagesTemplate(params).then((res) => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.params.page_no = 1
            this.getList()
          })
        })
        .catch(() => {})
    },
    abandonTemplate(pages_template_id) {
      this.$confirm('确认废弃当前模板？', '废弃模板', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          deletePagesTemplate(pages_template_id).then((res) => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.params.page_no = 1
            this.getList()
          })
        })
        .catch(() => {})
    },
    synchronizeTemplateToShop(index) {
      this.distributorVisible = true
      this.distributorStatus = true
      this.isSynchronize = true
      this.relDistributors = []
      this.currTemplateId = this.templateList[index].pages_template_id
    },
    closeDialog() {
      this.templateVisible = false
    },
    closePreviewDialog() {
      this.previewVisible = false
    },
    handleShowConfig() {
      this.show_sideBar = true
    },
    handleShowTabConfig() {
      this.show_tab_sideBar = true
      this.editorData = { ...this.tabs }
    },
    handleCloseSidebar(status) {
      this.show_tab_sideBar = status
    },
    showImgs(index, tabIcon) {
      this.imgsVisible = true
      this.isGetImage = true
      this.editorDataIndex = index
      if (tabIcon) {
        this.tabIcon = tabIcon
      }
    },
    handelSaveTab() {
      let param = JSON.stringify(this.editorData)
      let params = {
        tab_bar: param
        // page_type: this.app_page_type[this.app_type]
      }
      setPagesTemplate(params).then((res) => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style scoped lang="scss" scoped>
.shop-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  .shop-left {
    display: flex;
    align-items: center;
  }
  .text {
    padding-left: 20px;
    color: #ccc;
  }
}
.option-item {
  display: inline-block;
  margin-right: 20px;
  &_text {
    margin-right: 5px;
  }
}
.template-list {
  display: flex;
  flex-wrap: wrap;

  .template-item {
    border-radius: 10px;
    margin-bottom: 20px;
    border: 1px solid #eee;
    color: #606266;
    // height: 442px;
    &.add-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f2f2f2;
      // height: calc(100% - 20px);
      height: 404px;
      cursor: pointer;
      &.sync-template {
        height: 444px;
      }
      .add-img {
        width: 60px;
      }
      .add-text {
        font-size: 15px;
        color: #606266;
        margin-top: 10px;
      }
    }
    .img-wrap {
      width: 100%;
      height: 200px;
      background: #f2f2f2;
      position: relative;
      border-top-right-radius: 10px;
      border-top-left-radius: 10px;
      overflow: hidden;
      .template-pic {
        width: 100%;
      }
      .preview-cover {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 0;
        opacity: 0;
        background: rgba($color: #000000, $alpha: 0.3);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        transition: all 1s ease;
        cursor: pointer;
        &_img {
          width: 40px;
        }
        &_text {
          font-size: 15px;
          color: #fff;
          margin-top: 5px;
        }
      }
      .tag {
        position: absolute;
        left: 0;
        top: 30px;
        z-index: 11;
        width: 36px;
        background: rgba(128, 128, 255, 0.39);
        font-size: 14px;
        color: #fff;
        text-align: center;
        padding: 6px 0;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
      &:hover {
        .preview-cover {
          z-index: 10;
          opacity: 1;
        }
      }
    }
    .template-name {
      font-size: 15px;
      margin: 15px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
      justify-content: space-between;
      .edit-css {
        font-size: 14px;
        color: #409eff;
        cursor: pointer;
      }
    }
    .template-common {
      margin: 0 15px 15px;
      display: flex;
      justify-content: space-between;
      .temp-label {
        font-size: 13px;
      }
    }
    .time-wrap {
      height: 26px;
      margin: 0 15px 10px 15px;
      .no-time {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .picker-wrap {
        display: inline-block;
        font-size: 13px;
        color: #8080ff;
        position: relative;
        overflow: hidden;
        .time-img {
          width: 16px;
          vertical-align: top;
          margin-top: 1px;
        }
        .el-date-editor {
          position: absolute;
          z-index: 10;
          left: 0;
          opacity: 0;
        }
      }
      .has-time {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        .time {
          color: #d9001b;
        }
        .cancel-btn {
          color: #8080ff;
          cursor: pointer;
        }
      }
    }
    .option-btns {
      display: flex;
      border-top: 1px solid #eee;
      .btn {
        display: inline-block;
        padding: 10px 0;
        flex: 1;
        border-right: 1px solid #eee;
        text-align: center;
        cursor: pointer;
        font-size: 12px;
        &:last-child {
          border-right-width: 0;
        }
      }
    }
    .synchronize-btn {
      text-align: center;
      height: 40px;
      line-height: 40px;
      font-size: 12px;
      border-top: 1px solid #eee;
      cursor: pointer;
    }
  }
  &.is-shop {
    .template-item {
      height: 367px;
    }
  }
}
.content-center {
  text-align: center;
}
.template-tabs {
  position: relative;
  display: flex;
  // width: 320px;
  width: 100%;
  height: 49px;
  margin: 0 auto;
  border: 1px solid rgba(0, 0, 0, 0.3);
  margin-bottom: 20px;
  .tab {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    height: 49px;
    text-align: center;
    .svg-icon {
      width: 24px;
      height: 24px;
      margin-bottom: 3px;
    }
    .tab-text {
      font-size: 11px;
      line-height: 1.2;
    }
  }
  .current-active {
    position: absolute;
    left: -3px;
    top: -3px;
    right: -3px;
    bottom: -3px;
    border: 3px solid #ff5000;
    z-index: -1;
    opacity: 0;
    box-shadow: 0 0 5px rgba(255, 80, 0, 0.3);
    background: rgba(255, 80, 0, 0.2);
    transition: all 0.3s ease;
  }
  &.active .current-active {
    opacity: 1;
    z-index: 999;
  }
}
</style>
<style lang="scss" scoped>
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #606272;
}
.el-button + .el-button {
  margin-left: 10px !important;
}
</style>
