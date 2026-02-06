<template>
  <div>
    <SpFinder
      ref="finder"
      :split-count="6"
      :setting="setting"
      reserve-selection
      row-key="id"
      :url="url"
      :hooks="{ beforeSearch: beforeSearch }"
    />
    <SpDialog
      ref="groupDialogRef"
      v-model="showSettingSaleClassify"
      title="关联销售分类"
      :form="saleClassifyForm"
      :form-list="saleClassifyFormList"
      @onSubmit="onSaleClassifyFormSubmit"
    />
    <!-- <SpDialog ref="copyDialogRef" v-model="showCopyDialog" title="复制页面" :form="copyForm" :form-list="copyFormList"
            @onSubmit="onCopyFormSubmit" /> -->
    <SpDialog
      ref="addTemplateDialogRef"
      v-model="showAddTemplateDialog"
      :title="addTemplateForm.id ? '编辑模板' : '添加模板'"
      :form="addTemplateForm"
      :form-list="addTemplateFormList"
      @onSubmit="onAddTemplateFormSubmit"
    />
  </div>
</template>

<script>
import { createSetting } from '@shopex-ui/finder'
export default {
  data() {
    return {
      showSettingSaleClassify: false,
      saleClassifyForm: {
        id: '',
        category_id: ''
      },
      disabled: false,
      showCopyDialog: false,
      // copyForm: {
      //     id: '',
      //     name: ''
      // },
      copyFormList: [
        {
          label: '模板名称',
          key: 'name',
          type: 'input',
          maxlength: 150,
          placeholder: '请输入页面名称',
          required: true,
          message: '页面名称不能为空'
        }
      ],
      showAddTemplateDialog: false,
      addTemplateForm: {
        page_name: '',
        page_description: '',
        is_open: true
      },
      categoryList: [],
      url: '/wxa/customizepage/list'
    }
  },
  computed: {
    setting() {
      return createSetting({
        search: [
          {
            key: 'id',
            name: '页面ID',
            minWidth: 100
          },
          {
            key: 'page_name',
            name: '页面名称',
            minWidth: 260
          }
        ],
        columns: [
          {
            key: 'id',
            name: '页面ID',
            minWidth: 100
          },
          {
            key: 'page_name',
            name: '页面名称',
            minWidth: 260
          },
          {
            key: 'category_name',
            name: '关联销售分类',
            minWidth: 120
          },
          {
            key: 'is_open',
            name: '是否启用',
            render: (h, { row }) =>
              h('el-switch', {
                props: {
                  'value': row.is_open,
                  'active-value': '1',
                  'inactive-value': '0'
                },
                on: {
                  change: async (e) => {
                    await this.$api.wxa.editCustomPage(row.id, {
                      page_name: row.page_name,
                      page_description: row.page_description,
                      is_open: e == 1,
                      id: row.id,
                      page_type: 'category',
                      template_name: 'yykweishop'
                    })
                    row.is_open = e
                    this.$message.success('更新成功')
                    // this.$refs.finder.refresh()
                  }
                }
              }),
            minWidth: 120
          }
        ],
        actions: [
          {
            name: '添加模板',
            key: 'add',
            slot: 'header',
            type: 'button',
            buttonType: 'primary',
            action: {
              handler: () => {
                this.showAddTemplateDialog = true
                this.addTemplateForm.page_name = ''
                this.addTemplateForm.page_description = ''
                this.addTemplateForm.is_open = true
                this.addTemplateForm.id = ''
                this.disabled = false
              }
            }
          },
          {
            name: '页面装修',
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: ([{ id }]) => {
                this.$router.push(`/wxapp/manage/decorate?id=${id}&scene=1007`)
              }
            }
          },
          {
            name: '关联销售分类',
            key: 'link',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                this.categoryList = []
                const res = await this.$api.goods.getCategory({
                  parent_id: 0
                })
                const list = res.map((item) => ({
                  title: item.category_name,
                  value: item.category_id
                }))
                this.categoryList = list
                this.saleClassifyForm.id = row?.id
                this.saleClassifyForm.category_id = row?.category_id
                this.showSettingSaleClassify = true
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
                this.addTemplateForm.id = row?.id
                this.showAddTemplateDialog = true
                this.addTemplateForm.page_name = row?.page_name
                this.addTemplateForm.page_description = row?.page_description
                this.addTemplateForm.is_open = row?.is_open == 1
                this.disabled = true
              }
            }
          },
          {
            name: '复制',
            key: 'copy',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                // this.showCopyDialog = true
                await this.$api.wxa.copyCustomPage(row.id)
                this.$message.success('复制成功')
                this.$refs.finder.refresh()
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
                await this.$confirm(`确认删除？`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消'
                })
                await this.$api.wxa.delCustomPage(row.id)
                this.$refs['finder'].refresh()
              }
            }
          }
        ]
      })
    },
    saleClassifyFormList() {
      return [
        {
          label: '销售分类',
          key: 'category_id',
          type: 'select',
          maxlength: 150,
          placeholder: '请输入销售分类',
          required: true,
          message: '不能为空',
          options: this.categoryList
        }
      ]
    },

    addTemplateFormList() {
      return [
        {
          label: '模板名称',
          key: 'page_name',
          type: 'input',
          maxlength: 150,
          placeholder: '请输入模板名称',
          required: true,
          message: '模板名称不能为空'
        },
        {
          label: '页面描述',
          key: 'page_description',
          type: 'input',
          maxlength: 150,
          placeholder: '请输入页面描述',
          required: true,
          message: '页面描述不能为空'
        },
        {
          label: '是否启用',
          key: 'is_open',
          type: 'switch'
        }
      ]
    }
  },

  activated() {
    this.$refs['finder'].refresh()
  },
  methods: {
    onSearch() {
      this.$refs['finder'].refresh()
    },
    beforeSearch(params) {
      let _params = {
        ...params,
        page_type: 'category',
        template_name: 'yykweishop'
      }
      return _params
    },
    async onSaleClassifyFormSubmit() {
      await this.$api.wxa.bindcategory(this.saleClassifyForm.id, {
        category_id: this.saleClassifyForm.category_id
      })
      this.$message.success('关联成功')
      this.showSettingSaleClassify = false
      this.$refs.finder.refresh()
    },
    async onCopyFormSubmit(form) {
      try {
        await this.$api.template.copyPagesTemplate({
          id: form.id,
          name: form.name
        })
        this.$message.success('复制成功')
        this.showCopyDialog = false
        this.$refs.finder.refresh()
      } catch (error) {
        console.error(error)
      }
    },
    async onAddTemplateFormSubmit() {
      try {
        console.log(this.addTemplateForm, 'form')
        if (this.addTemplateForm.id) {
          await this.$api.wxa.editCustomPage(this.addTemplateForm.id, {
            ...this.addTemplateForm,
            page_type: 'category',
            template_name: 'yykweishop'
          })
          this.$message.success('编辑成功')
        } else {
          await this.$api.wxa.createCustomPage({
            ...this.addTemplateForm,
            page_type: 'category',
            template_name: 'yykweishop'
          })
          this.$message.success('添加成功')
        }
        this.showAddTemplateDialog = false
        this.$refs.finder.refresh()
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style lang="scss">
.sp-finder-actions__wrap {
  margin-bottom: 16px !important;
}

.sp-page--financial-detailed .sp-finder .sp-finder-actions__wrap .sp-finder-button .el-button {
  padding: 8px 8px !important;
}
</style>
