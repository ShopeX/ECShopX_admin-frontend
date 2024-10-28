<template>
  <div class="wxapp-home">
    <SpPlatformTip h5 app alipay />
    <div v-if="!isDistributorTemplate" class="shop-header">
      <div v-if="!VERSION_B2C && !VERSION_IN_PURCHASE" class="shop-left">
        <span class="text">小程序模版呈现：</span>
        <div class="option-item">
          <span class="option-item_text">总部首页</span>
          <el-switch
            v-model="index_type"
            :active-value="1"
            :inactive-value="2"
            @change="changeHomeTemplate"
          />
        </div>
        <div v-if="VERSION_STANDARD" class="option-item">
          <span class="option-item_text">店铺首页</span>
          <el-switch
            v-model="index_type"
            :active-value="2"
            :inactive-value="1"
            @change="changeHomeTemplate"
          />
        </div>
        <span v-if="!VERSION_PLATFORM" class="text">模版同步设置：</span>
        <div v-if="!VERSION_PLATFORM" class="option-item">
          <span class="option-item_text">同步并启用</span>
          <el-switch
            v-model="is_enforce_sync"
            :active-value="1"
            :inactive-value="2"
            @change="toggleSynchronizeShop"
          />
        </div>
      </div>
      <div class="section-white mini-setting">
        <el-button
          type="text"
          style="margin-right: 10px"
          @click="
            () => {
              configDrawerShow = true
            }
          "
        >
          <i class="iconfont icon-cog" /> 小程序配置
        </el-button>
        <el-button type="text" @click="handleShowTabConfig">
          <i class="iconfont icon-cog" /> 小程序导航配置
        </el-button>
      </div>
    </div>

    <el-row :gutter="20" class="template-list">
      <el-col
        v-for="(item, index) in templateList"
        :key="index"
        class="template-col"
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
            <el-image class="template-pic" :src="item.template_pic" fit="cover" />
            <div v-if="item.template_type == 1" class="tag">同步模板</div>
          </div>
          <div class="template-name">
            <span>{{ item.template_title }}</span>
            <span class="el-icon-edit edit-css" @click="modifyTemplate(item)" />
          </div>
          <div v-if="!VERSION_B2C" class="template-common">
            <span class="temp-label">店铺可编辑挂件</span>
            <el-switch
              v-model="item.element_edit_status"
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
                :active-value="1"
                :inactive-value="2"
                @change="useTemplate(item, index)"
              />
            </el-tooltip>
          </div>
          <div class="time-wrap">
            <div v-if="item.timer_status == 2" class="no-time">
              <div>定时启用</div>
              <div class="picker-wrap">
                <img class="time-img" src="@/assets/img/time-img.png">
                <span>设置模板切换时间</span>
                <el-date-picker
                  v-model="item.timer_time"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  @change="changeDate(item)"
                />
              </div>
            </div>
            <div v-if="item.timer_status == 1" class="has-time">
              <span class="time">{{ item.timer_time }}启用</span>
              <span class="cancel-btn" @click="cancelTime(item)">取消</span>
            </div>
          </div>
          <div class="option-btns">
            <span class="btn" @click="editTemplate(item.pages_template_id)">编辑</span>
            <span class="btn" @click="copyTemplate(item.pages_template_id)">复制</span>
            <span
              v-if="!isDistributorTemplate"
              class="btn"
              @click="handleClickNav(item.pages_template_id)"
              >导航</span
            >
            <span class="btn" @click="abandonTemplate(item.pages_template_id)">废弃</span>
          </div>
          <div
            v-if="!isDistributorTemplate"
            class="synchronize-btn"
            @click="synchronizeTemplateToShop(index)"
          >
            同步模板至店铺
          </div>
        </div>
      </el-col>
      <el-col class="template-col" :xs="12" :sm="12" :md="8" :lg="6" :xl="4">
        <div
          :class="{
            'template-item': true,
            'add-btn': true
          }"
          @click="addTemplate"
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

    <MallDecoration
      :dialog-visible="templateVisible"
      :template-name="template_name"
      :rel-store="relStore"
      :show-like="configForm.is_open_recommend ? 1 : 2"
      :template-id="currTemplateId"
      @saved="closeDialog"
      @closeDialog="closeDialog"
    />

    <TemplatePreview
      :dialog-visible="previewVisible"
      :rel-store="relStore"
      :show-like="configForm.is_open_recommend ? 1 : 2"
      :template-id="currTemplateId"
      :tabs="tabs"
      usage="page"
      @saved="closePreviewDialog"
      @closeDialog="closePreviewDialog"
    />

    <SpDialog
      ref="templateDialogRef"
      v-model="templateDialog"
      :title="templateForm.pages_template_id ? '编辑模板' : '添加模板'"
      :form="templateForm"
      :form-list="templateFormList"
      @onSubmit="onTemplateFormSubmit"
    />

    <SpDrawer
      v-model="configDrawerShow"
      class="config-drawer"
      :title="'小程序配置'"
      :footer="false"
    >
      <SpForm
        ref="configForm"
        v-model="configForm"
        class="config-form"
        :label-width="'100px'"
        :form-list="configFormList"
        :submit="false"
      />
    </SpDrawer>

    <SpDrawer
      v-model="navDrawerShow"
      class="nav-drawer"
      :title="'导航设置'"
      :width="650"
      @confirm="
        () => {
          this.$refs['navForm'].handleSubmit()
        }
      "
    >
      <SpForm
        ref="navForm"
        v-model="navForm"
        class="nav-form"
        :label-width="'0'"
        :form-list="navFormList"
        :submit="false"
        @onSubmit="onSubmitTabList"
      />
    </SpDrawer>
  </div>
</template>

<script>
import moment from 'moment'
import { VERSION_PLATFORM, VERSION_STANDARD, VERSION_B2C } from '@/utils'

import DistributorSelect from '@/components/function/distributorSelect'
import MallDecoration from '@/components/function/mallDecoration'
import TemplatePreview from '@/components/function/templatePreview'
import { NAVS } from './consts'

import { setPagesTemplate, savePagesTemplate, syncPagesTemplate } from '@/api/template'

export default {
  components: {
    DistributorSelect,
    MallDecoration,
    TemplatePreview
  },
  data() {
    const { distributor_id } = this.$route?.query || {}
    return {
      relStore: {
        id: distributor_id ?? 0
      },
      index_type: 1,
      is_enforce_sync: 2,
      templateList: [],
      form: {
        template_title: '',
        template_pic: ''
      },
      distributorVisible: false,
      isValid: true,
      relDistributors: [],
      distributorStatus: false,

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
      globalTabbar: null,
      navDrawerShow: false,
      configDrawerShow: false,
      configForm: {
        is_open_recommend: false,
        is_open_wechatapp_location: true,
        is_open_scan_qrcode: false,
        is_open_official_account: false
      },
      configFormList: [
        {
          label: '热门推荐',
          key: 'is_open_recommend',
          type: 'switch',
          onChange: async () => {
            await this.$api.template.setPagesTemplate({
              is_open_recommend: this.configForm.is_open_recommend ? 1 : 2
            })
          }
        },
        {
          label: '小程序定位',
          key: 'is_open_wechatapp_location',
          type: 'switch',
          isShow: () => {
            return VERSION_PLATFORM || VERSION_STANDARD
          },
          onChange: async () => {
            const tempStatus = this.configForm.is_open_wechatapp_location
            if (!VERSION_PLATFORM && !this.configForm.is_open_wechatapp_location) {
              this.configForm.is_open_wechatapp_location = true
              await this.$confirm('关闭后附件商家组件将无法使用', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              })
            }
            await this.$api.template.setPagesTemplate({
              is_open_wechatapp_location: tempStatus ? 1 : 2
            })
            this.configForm.is_open_wechatapp_location = tempStatus
          }
        },
        {
          label: '扫码功能',
          key: 'is_open_scan_qrcode',
          type: 'switch',
          onChange: async () => {
            await this.$api.template.setPagesTemplate({
              is_open_scan_qrcode: this.configForm.is_open_scan_qrcode ? 1 : 2
            })
          }
        },
        {
          label: '公众号组件',
          key: 'is_open_official_account',
          type: 'switch',
          onChange: async () => {
            await this.$api.template.setPagesTemplate({
              is_open_official_account: this.configForm.is_open_official_account ? 1 : 2
            })
          }
        }
      ],
      template_name: 'yykweishop',
      templateDialog: false,
      templateForm: {
        pages_template_id: '',
        template_title: '',
        template_pic: ''
      },
      templateFormList: [
        {
          label: '模板名称',
          key: 'template_title',
          type: 'input',
          placeholder: '请输入模板名称',
          required: true,
          message: '不能为空'
        },
        {
          label: '模板封面',
          key: 'template_pic',
          component: () => <SpImagePicker v-model={this.templateForm.template_pic} />,
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('请上传封面图片'))
            } else {
              callback()
            }
          }
        }
      ],
      navForm: {
        pages_template_id: '',
        theme: {
          backgroundColor: '#ffffff',
          color: '#333333',
          selectedColor: '#1f82e0'
        },
        tabList: [
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
      navFormList: [
        {
          label: '',
          key: 'name',
          component: () => (
            <div class='tablist'>
              {this.navForm?.tabList?.map((item, index) => (
                <div
                  class='tab-item'
                  style={{
                    color: index == 0 ? this.navForm.theme.selectedColor : this.navForm.theme.color
                  }}
                  key={`tab-item__${index}`}
                >
                  {!item.iconPath && !item.selectedIconPath && (
                    <i class={`icon-${item.name} iconfont`} />
                  )}
                  {(item.iconPath || item.selectedIconPath) && (
                    <el-image
                      class='tab-image'
                      src={item.selectedIconPath || item.iconPath}
                      fit='cover'
                    />
                  )}
                  <div class='tab-text'>{item.text}</div>
                </div>
              ))}
            </div>
          )
        },
        {
          label: '',
          key: 'theme',
          component: () => (
            <el-row>
              <el-col span={8}>
                <div class='theme-item'>
                  <el-color-picker v-model={this.navForm.theme.backgroundColor}></el-color-picker>
                  背景色
                </div>
              </el-col>
              <el-col span={8}>
                <div class='theme-item'>
                  <el-color-picker v-model={this.navForm.theme.color}></el-color-picker>
                  默认颜色
                </div>
              </el-col>
              <el-col span={8}>
                <div class='theme-item'>
                  <el-color-picker v-model={this.navForm.theme.selectedColor}></el-color-picker>
                  选中颜色
                </div>
              </el-col>
            </el-row>
          )
        },
        {
          label: '',
          key: 'tabList',
          component: () => (
            <div class='nav-list'>
              <div class='nav-list-body'>
                {this.navForm?.tabList?.map((item, index) => (
                  <div class='nav-item'>
                    <div class='nav-item-hd'>
                      <SpImagePicker v-model={item.iconPath} />
                      <SpImagePicker v-model={item.selectedIconPath} />
                      <SpInput v-model={item.text} width={'120px'} placeholder='导航名称' />
                      <el-select
                        v-model={item.pagePath}
                        placeholder='请选择页面'
                        on-change={this.onChangePagePath.bind(this, index)}
                      >
                        {NAVS.map((item, index) => (
                          <el-option label={item.label} value={item.value} />
                        ))}
                      </el-select>
                      {item.pagePath == 'customPage' && (
                        <div  class="uploader-setting">
                          <div class="btn-linkpath" onClick={this.handleCustomPageSelect.bind(this,item)}>
                            {item?.customPage?.page_name ?? '请选择自定义页面' }
                          </div>
                        </div>
                      )}
                    </div>
                    <div class='nav-item-bd'>
                      {index > 1 && (
                        <el-button type='text' on-click={this.removeTabItem.bind(this, index)}>
                          删除
                        </el-button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div></div>
            </div>
          ),
          tip: '只能上传jpg/png文件，且不超过2M （建议尺寸：50px * 50px）',
          validator: (rule, value, callback) => {
            const fd = value.find((item) => !item.pagePath || !item.name)
            if (fd) {
              callback('请设置导航名称以及导航页面')
            } else {
              callback()
            }
          }
        },
        {
          label: '',
          component: () => (
            <el-button
              type='primary'
              disabled={this.navForm?.tabList?.length >= 5}
              plain
              class='iconfont icon-plus-circle'
              on-click={this.addTabItem}
            >
              添加菜单项
            </el-button>
          )
        }
      ]
    }
  },
  computed: {
    isDistributorTemplate() {
      const { distributor_id } = this.$route.query
      return distributor_id > 0
    }
  },
  mounted() {
    this.getTemplateSetInfo()
    this.getList()
  },
  methods: {
    async handleClickNav(templateId) {
      const { tab_bar } = await this.$api.template.getPagesTemplateSetInfo({
        pages_template_id: templateId
      })
      this.navForm = this.$options.data().navForm
      this.navForm.pages_template_id = templateId
      if (tab_bar) {
        const { config, data } = JSON.parse(tab_bar)
        this.navForm.theme = config
        this.navForm.tabList = data
      }
      this.navDrawerShow = true
    },
    async getTemplateSetInfo() {
      const {
        index_type,
        is_enforce_sync,
        is_open_recommend,
        is_open_wechatapp_location,
        is_open_scan_qrcode,
        is_open_official_account,
        tab_bar
      } = await this.$api.template.getPagesTemplateSetInfo()
      this.index_type = index_type
      this.is_enforce_sync = is_enforce_sync
      this.configForm = {
        is_open_recommend: is_open_recommend == 1,
        is_open_wechatapp_location: is_open_wechatapp_location == 1,
        is_open_scan_qrcode: is_open_scan_qrcode == 1,
        is_open_official_account: is_open_official_account == 1
      }

      if (tab_bar) {
        this.globalTabbar = JSON.parse(tab_bar)
      }
    },
    async getList() {
      const { distributor_id } = this.$route.query
      let params = {
        ...this.params,
        distributor_id
      }
      const { list, total_count } = await this.$api.template.getPagesTemplateList(params)
      this.templateList = list.map((item) => {
        return {
          ...item,
          // 店铺模板可编辑
          element_edit_status: item.element_edit_status || 2,
          // 是否启用
          status: item.status || 2,
          // 定时模板开启
          timer_status: item.timer_status || 2,
          // 定时时间
          timer_time:
            item.timer_time > 0 ? moment(item.timer_time * 1000).format('YYYY-MM-DD HH:mm:ss') : ''
        }
      })
      this.total_count = total_count
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
    async handleCustomPageSelect(item){
      const {data} = await this.$picker.pages({
        multiple:false,
        data:[item?.customPage?.id]
      })
      this.$set(item,'customPage',data[0])
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
    async changeHomeTemplate() {
      await this.$api.template.setPagesTemplate({
        index_type: this.index_type
      })
    },
    // 同步并启用
    async toggleSynchronizeShop() {
      await this.$api.template.setPagesTemplate({
        is_enforce_sync: this.is_enforce_sync
      })
      this.$message.success('操作成功')
    },
    addTemplate() {
      this.templateForm = this.$options.data().templateForm
      this.templateDialog = true
    },
    modifyTemplate({ pages_template_id, template_title, template_pic }) {
      this.templateForm = {
        pages_template_id,
        template_title,
        template_pic
      }
      this.templateDialog = true
    },
    async onTemplateFormSubmit() {
      const { pages_template_id, template_title, template_pic } = this.templateForm
      if (pages_template_id) {
        await this.$api.template.savePagesTemplate({
          pages_template_id,
          template_title,
          template_name: this.template_name,
          template_pic
        })
      } else {
        await this.$api.template.addPagesTemplate({
          template_title,
          template_name: this.template_name,
          template_pic
        })
      }
      this.templateDialog = false
      this.getList()
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
    // 立即启用模板
    async useTemplate(item, index) {
      const status = JSON.parse(JSON.stringify(item.status))
      if (item.status == 1) {
        this.templateList[index].status = 2
        await this.$confirm('确认立即启用当前模板？', '启用模板', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
      }
      await this.$api.template.modifyPagesTemplateStatus({
        pages_template_id: item.pages_template_id,
        template_name: this.template_name,
        status
      })
      this.getList()
    },
    // 设置定时模板
    async changeDate(item) {
      await this.$api.template.modifyPagesTemplateStatus({
        pages_template_id: item.pages_template_id,
        template_name: this.template_name,
        timer_status: 1,
        timer_time: item.timer_time
      })
      this.getList()
    },
    // 取消定时模板
    async cancelTime(item) {
      await this.$confirm('确认取消启用定时模板？', '取消定时模板', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      await this.$api.template.modifyPagesTemplateStatus({
        pages_template_id: item.pages_template_id,
        template_name: this.template_name,
        timer_status: 2,
        timer_time: ''
      })
      this.getList()
    },
    editTemplate(pages_template_id) {
      // this.templateVisible = true
      // this.currTemplateId = pages_template_id
      const { distributor_id } = this.$route.query
      if (distributor_id > 0) {
        this.$router.push(`/wxapp/manage/decorate?id=${pages_template_id}&scene=1003`)
      } else {
        this.$router.push(`/wxapp/manage/decorate?id=${pages_template_id}`)
      }
    },
    async copyTemplate(pages_template_id) {
      await this.$confirm('确认拷贝当前模板？', '拷贝模板', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      await this.$api.template.copyPagesTemplate({
        pages_template_id
      })
      this.$message.success('操作成功')
      this.params.page_no = 1
      this.getList()
    },
    async abandonTemplate(pages_template_id) {
      await this.$confirm('确认废弃当前模板？', '废弃模板', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      await this.$api.template.deletePagesTemplate(pages_template_id)
      this.$message.success('操作成功')
      this.params.page_no = 1
      this.getList()
    },
    // 同步模板
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
      const { config, name, data = [] } = this.globalTabbar || {}

      const { backgroundColor, color, selectedColor } = config || {}
      this.navForm = {
        pages_template_id: '',
        theme: {
          backgroundColor: backgroundColor ?? '#ffffff',
          color: color ?? '#333333',
          selectedColor: selectedColor ?? '#1f82e0'
        },
        tabList: data
      }
      this.navDrawerShow = true
    },
    removeTabItem(index) {
      this.navForm.tabList.splice(index, 1)
    },
    addTabItem() {
      const item = {
        pagePath: '',
        text: '',
        name: '',
        iconPath: '',
        selectedIconPath: ''
      }
      this.navForm.tabList.push(item)
    },
    onChangePagePath(index, value) {
      const { label, name } = NAVS.find((item) => item.value == value)
      this.navForm.tabList[index].text = label
      this.navForm.tabList[index].name = name
      if(value != 'customPage' && this.navForm.tabList[index]?.customPage){
        this.$delete(this.navForm.tabList[index],'customPage')
      }
    },
    async onSubmitTabList() {
      const { pages_template_id, theme, tabList } = this.navForm

      const emptyIndex = tabList.findIndex(item=>item.name == "customPage" && !item.customPage )
      if(emptyIndex > -1){
        return this.$message({
          message: '请选择自定义页面',
          type: 'error',
          duration: 5 * 1000
        })
      }

      let params = {
        tab_bar: JSON.stringify({
          name: 'tabs',
          config: theme,
          data: tabList
        })
      }
      if (pages_template_id) {
        params = {
          ...params,
          pages_template_id
        }
      }
      await this.$api.template.setPagesTemplate(params)
      this.navDrawerShow = false
      this.$message.success('操作成功')
    }
  }
}
</script>
<style lang="scss">
.nav-drawer {
  .tablist {
    display: flex;
    border: 1px solid #d8d8d8;
    height: 52px;
    padding: 6px 0;
    .tab-item {
      text-align: center;
      flex: 1;
      line-height: 20px;
    }
    .tab-image {
      width: 16px;
      height: 16px;
    }
    .tab-text {
      font-size: 13px;
    }
  }
  .theme-item {
    display: flex;
    font-size: 13px;
    .el-color-picker {
      margin-right: 4px;
    }
  }
  .nav-list {
    &-body {
    }
    .nav-item {
      display: flex;
      margin-bottom: 10px;
      .sp-input {
        margin-right: 10px;
        width: 120px;
        .el-input {
          margin: 0;
        }
      }
      &-hd {
        display: flex;
        align-items: center;
        flex: 1;
      }
      &-bd {
        width: 60px;
        display: flex;
        align-items: center;
        padding-left: 10px;
      }
    }
  }
  .image-item {
    width: 64px;
    height: 64px;
    line-height: 26px;
    margin-bottom: 0;
  }
}
</style>
<style lang="scss" scoped>
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
  .template-col {
    margin-bottom: 20px;
    // width: 300px;
  }
  .template-item {
    border-radius: 10px;
    border: 1px solid #eee;
    color: #606266;
    // height: 442px;
    &.add-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f2f2f2;
      // height: calc(100% - 20px);
      height: 100%;
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
        height: 100%;
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
      // height: 367px;
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
.btn-linkpath {
    padding: 0 8px;
    border: 1px solid #d9d9d9;
    background-color: #fff;
    height: 36px;
    line-height: 36px;
    border-radius: 3px;
    max-width: 160px;
    @include text-overflow();
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
