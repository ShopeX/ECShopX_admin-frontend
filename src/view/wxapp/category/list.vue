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
      :title="$t('c7eb6efa.7b3c0e')"
      :form="saleClassifyForm"
      :form-list="saleClassifyFormList"
      @onSubmit="onSaleClassifyFormSubmit"
    />
    <!-- <SpDialog ref="copyDialogRef" v-model="showCopyDialog" title="复制页面" :form="copyForm" :form-list="copyFormList"
            @onSubmit="onCopyFormSubmit" /> -->
    <SpDialog
      ref="addTemplateDialogRef"
      v-model="showAddTemplateDialog"
      :title="addTemplateForm.id ? $t('c7eb6efa.c6aa35') : $t('c7eb6efa.6fef15')"
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
            name: this.$t('c7eb6efa.d9df76'),
            minWidth: 100
          },
          {
            key: 'page_name',
            name: this.$t('c7eb6efa.b78454'),
            minWidth: 260
          }
        ],
        columns: [
          {
            key: 'id',
            name: this.$t('c7eb6efa.d9df76'),
            minWidth: 100
          },
          {
            key: 'page_name',
            name: this.$t('c7eb6efa.b78454'),
            minWidth: 260
          },
          {
            key: 'category_name',
            name: this.$t('c7eb6efa.7b3c0e'),
            minWidth: 120
          },
          {
            key: 'is_open',
            name: this.$t('c7eb6efa.53c3dd'),
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
                    this.$message.success(this.$t('c7eb6efa.55aa63'))
                    // this.$refs.finder.refresh()
                  }
                }
              }),
            minWidth: 120
          }
        ],
        actions: [
          {
            name: this.$t('c7eb6efa.6fef15'),
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
            name: this.$t('c7eb6efa.6343df'),
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
            name: this.$t('c7eb6efa.7b3c0e'),
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
            name: this.$t('c7eb6efa.95b351'),
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
            name: this.$t('c7eb6efa.79d3ab'),
            key: 'copy',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                // this.showCopyDialog = true
                await this.$api.wxa.copyCustomPage(row.id)
                this.$message.success(this.$t('c7eb6efa.20a495'))
                this.$refs.finder.refresh()
              }
            }
          },
          {
            name: this.$t('c7eb6efa.2f4aad'),
            key: 'delete',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                await this.$confirm(this.$t('c7eb6efa.b28efa'), this.$t('c7eb6efa.02d981'), {
                  confirmButtonText: this.$t('c7eb6efa.38cf16'),
                  cancelButtonText: this.$t('c7eb6efa.625fb2')
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
          label: this.$t('c7eb6efa.392d49'),
          key: 'category_id',
          type: 'select',
          maxlength: 150,
          placeholder: this.$t('c7eb6efa.8f1896'),
          required: true,
          message: this.$t('c7eb6efa.281bad'),
          options: this.categoryList
        }
      ]
    },

    addTemplateFormList() {
      return [
        {
          label: this.$t('c7eb6efa.a5d1c5'),
          key: 'page_name',
          type: 'input',
          maxlength: 150,
          placeholder: this.$t('c7eb6efa.8f21b9'),
          required: true,
          message: this.$t('c7eb6efa.a23746')
        },
        {
          label: this.$t('c7eb6efa.abf8f4'),
          key: 'page_description',
          type: 'input',
          maxlength: 150,
          placeholder: this.$t('c7eb6efa.9c5cf8'),
          required: true,
          message: this.$t('c7eb6efa.8aeb4e')
        },
        {
          label: this.$t('c7eb6efa.53c3dd'),
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
      this.$message.success(this.$t('c7eb6efa.55828c'))
      this.showSettingSaleClassify = false
      this.$refs.finder.refresh()
    },
    async onCopyFormSubmit(form) {
      try {
        await this.$api.template.copyPagesTemplate({
          id: form.id,
          name: form.name
        })
        this.$message.success(this.$t('c7eb6efa.20a495'))
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
          this.$message.success(this.$t('c7eb6efa.3bb47b'))
        } else {
          await this.$api.wxa.createCustomPage({
            ...this.addTemplateForm,
            page_type: 'category',
            template_name: 'yykweishop'
          })
          this.$message.success(this.$t('c7eb6efa.3fdaea'))
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
