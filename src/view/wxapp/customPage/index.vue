<template>
  <div>
    <!-- <SpPlatformTip h5 app alipay /> -->
    <el-tabs v-model="activeTab" type="card" @tab-click="handleTabClick">
      <el-tab-pane label="自定义页面" name="normal" />
      <el-tab-pane label="我的页面" name="my" />
    </el-tabs>
    <SpFinder
      ref="finder"
      :setting="setting"
      :url="'/wxa/customizepage/list'"
      :hooks="{ beforeSearch }"
      reserve-selection
      row-key="id"
      :split-count="4"
      :no-selection="true"
    />
    <SpDialog
      ref="pageDialogRef"
      v-model="showPageDialog"
      :title="pageForm.id ? '编辑页面' : '新增页面'"
      :form="pageForm"
      :form-list="pageFormList"
      @onSubmit="onPageFormSubmit"
    />
    <imgPicker
      :dialog-visible="imgDialog"
      :sc-status="isGetImage"
      @chooseImg="pickImg"
      @closeImgDialog="closeImgDialog"
    />
  </div>
</template>

<script>
import { createSetting } from '@shopex/finder'
import { mapGetters } from 'vuex'
import imgPicker from '@/components/imageselect'

export default {
  components: {
    imgPicker
  },
  data() {
    return {
      showPageDialog: false,
      pageForm: {
        id: '',
        page_name: '',
        page_description: '',
        page_share_title: '',
        page_share_desc: '',
        page_share_imageUrl: '',
        is_open: true,
        page_type: 'normal',
        regionauth_id: ''
      },
      areas: [],
      appID: '',
      appCodeUrl: '',
      curPageUrl: '',
      activeTab: 'normal', // 添加activeTab
      imgDialog: false,
      isGetImage: false
    }
  },
  computed: {
    ...mapGetters(['template_name']),
    setting() {
      return createSetting({
        search: [
          {
            key: 'regionauth_id',
            name: '区域',
            type: 'select',
            options: this.areas
          }
        ],
        columns: [
          {
            key: 'id',
            name: '页面ID'
          },
          {
            key: 'page_name',
            name: '页面名称'
          },
          {
            key: 'is_open',
            name: '是否启用',
            render: (h, { row }) => {
              return h(
                'el-tag',
                {
                  props: {
                    type: row.is_open == '0' ? 'info' : 'warning'
                  }
                },
                row.is_open == '0' ? '禁用' : '启用'
              )
            }
          }
        ],
        actions: [
          {
            name: '添加页面',
            key: 'add',
            slot: 'header',
            type: 'button',
            buttonType: 'primary',
            action: {
              handler: () => {
                this.showPageDialog = true
                this.pageForm = {
                  id: '',
                  page_name: '',
                  page_description: '',
                  page_share_title: '',
                  page_share_desc: '',
                  page_share_imageUrl: '',
                  is_open: true,
                  page_type: 'normal',
                  regionauth_id: ''
                }
              }
            }
          },
          {
            name: '页面装修',
            key: 'decorate',
            type: 'button',
            buttonType: 'primary',
            plain: true,
            round: true,
            size: 'mini',
            action: {
              handler: ([row]) => {
                if (this.activeTab == 'normal') {
                  this.$router.push(`/wxapp/manage/decorate?id=${row.id}&scene=1004`)
                } else {
                  this.$router.push(`/wxapp/manage/decorate?id=${row.id}&scene=1008`)
                }
              }
            }
          },
          {
            name: '编辑',
            key: 'edit',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: ([row]) => {
                console.log(row)
                this.showPageDialog = true
                this.pageForm = { ...row }
                this.pageForm.is_open = row.is_open == '1'
              }
            }
          },
          {
            name: '投放',
            key: 'deploy',
            type: 'button',
            buttonType: 'text',
            width: 45,
            vif: () => this.appID,
            action: {
              handler: ([row]) => {
                this.handleClick(row.id)
              },
              popover: {
                width: 200,
                content: (h) => {
                  return h('div', [
                    h('img', {
                      class: 'page-code',
                      attrs: { src: this.appCodeUrl }
                    }),
                    h('div', { class: 'page-btns' }, [
                      h(
                        'el-button',
                        {
                          props: {
                            type: 'primary',
                            plain: true,
                            size: 'mini'
                          },
                          on: {
                            click: () => this.handleDownload(row.page_name)
                          }
                        },
                        '下载码'
                      ),
                      h(
                        'el-button',
                        {
                          props: {
                            type: 'primary',
                            plain: true,
                            size: 'mini',
                            'v-clipboard:copy': this.curPageUrl
                          }
                        },
                        '复制链接'
                      )
                    ])
                  ])
                }
              }
            }
          },
          {
            name: '删除',
            key: 'delete',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                await this.$confirm('确认删除当前页面吗？')
                await this.$api.wxa.delCustomPage(row.id)
                this.$message.success('删除成功')
                this.$refs.finder.refresh()
              }
            }
          }
        ]
      })
    },
    pageFormList() {
      const { page_share_imageUrl } = this.pageForm
      const { wximageurl, handleImgChange } = this
      return [
        {
          label: '页面名称',
          key: 'page_name',
          type: 'input',
          required: true,
          placeholder: '请输入页面名称',
          style: { width: '55%' }
        },
        {
          label: '页面类型',
          key: 'page_type',
          type: 'select',
          options: [
            { label: '自定义', value: 'normal' },
            { label: '个人中心', value: 'my' }
          ]
        },
        {
          label: '页面描述',
          key: 'page_description',
          type: 'input',
          placeholder: '请输入页面描述',
          style: { width: '55%' }
        },
        {
          label: '分享标题',
          key: 'page_share_title',
          type: 'input',
          placeholder: '请输入分享标题',
          style: { width: '55%' }
        },
        {
          label: '区域',
          key: 'regionauth_id',
          type: 'select',
          options: this.areas
        },
        {
          label: '分享图片',
          key: 'page_share_imageUrl',
          component: () => {
            return (
              <div class='upload-box' onClick={handleImgChange}>
                {page_share_imageUrl ? (
                  <img src={`${wximageurl}${page_share_imageUrl}`} class='avatar' />
                ) : (
                  <i class='el-icon-plus avatar-uploader-icon' />
                )}
              </div>
            )
          }
        },
        {
          label: '是否启用',
          key: 'is_open',
          type: 'switch'
        }
      ]
    }
  },
  mounted() {
    this.fetchWechatList()
    this.fetchAreas()
  },
  methods: {
    async fetchWechatList() {
      const { list } = await this.$api.minimanage.gettemplateweapplist()
      list.forEach((item) => {
        if (item.name == 'yykweishop') {
          this.appID = item.authorizer.authorizer_appid
        }
      })
    },
    async fetchAreas() {
      const res = await this.$api.regionauth.getRegionauth()
      this.areas = res.list.map((item) => ({
        label: item.regionauth_name,
        value: item.regionauth_id
      }))
    },
    // 添加tab切换处理方法
    handleTabClick() {
      this.$refs.finder.refresh()
    },

    beforeSearch(params) {
      return {
        ...params,
        template_name: this.template_name,
        page_type: this.activeTab // 添加页面类型筛选
      }
    },
    async onPageFormSubmit() {
      const params = { ...this.pageForm, template_name: this.template_name }
      if (this.pageForm.id) {
        await this.$api.wxa.editCustomPage(this.pageForm.id, params)
        this.showPageDialog = false
        this.$message({
          type: 'success',
          message: '保存页面成功'
        })
        this.$refs.finder.refresh()
      } else {
        await this.$api.wxa.createCustomPage(params)
        this.showPageDialog = false
        this.$message({
          type: 'success',
          message: '保存页面成功'
        })
        this.$refs.finder.refresh()
      }
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
  cursor: pointer;

  img {
    display: block;
    width: 100%;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 100px;
    line-height: 100px;
    text-align: center;
    border: 1px dashed #d9d9d9;
  }
}

.page-code {
  width: 100%;
}

.page-btns {
  text-align: center;
  margin-top: 10px;
}

.page-tabs {
  margin-bottom: 16px;

  :deep(.el-tabs__header) {
    margin-bottom: 0;
  }
}
</style>
