<!--
  列表：SpFinder；新增/编辑：this.$dialog.open
-->
<template>
  <SpPage>
    <div v-if="$route.path.indexOf('editor') === -1">
      <el-row class="mb-4">
        <el-button type="primary" @click="openTemplateDialog(null)">
          {{ $t('8b0d1458.4c503b') }}
        </el-button>
      </el-row>
      <el-row>
        <el-tabs type="card" v-model="page_type" @tab-click="handleTabClick">
          <el-tab-pane
            v-for="(item, index) of tabList"
            :key="index"
            :label="getPageTypeLabel(item)"
            :name="item.name"
          />
        </el-tabs>
      </el-row>
      <SpFinder
        ref="finder"
        class="mt-2"
        url="/pctemplate/lists"
        row-key="theme_pc_template_id"
        fixed-row-action
        row-actions-width="260px"
        no-selection
        border
        :setting="finderSetting"
        :hooks="{ beforeSearch: beforeSearch }"
      />
    </div>
  </SpPage>
</template>

<script>
import { createSetting } from '@shopex-ui/finder'
import { addPageTemplate, editPageTemplate, deletePageTemplate } from '@/api/webtemplate'
import WebPcTemplateForm from './components/WebPcTemplateForm.vue'

const tabList = [
  { labelKey: '8b0d1458.db1c89', name: 'index' },
  { labelKey: '8b0d1458.ec20e4', name: 'custom' },
  { labelKey: '025a9251.544780', name: 'product_list' }
]

export default {
  name: 'WebTemplateList',
  data() {
    return {
      tabList,
      page_type: 'index',
      statusLoadingMap: {}
    }
  },
  computed: {
    finderSetting() {
      return createSetting({
        columns: [
          { name: this.$t('8b0d1458.6872c7'), key: 'theme_pc_template_id', width: 120 },
          { name: this.$t('8b0d1458.b78454'), key: 'template_title' },
          { name: this.$t('8b0d1458.abf8f4'), key: 'template_description' },
          {
            name: this.$t('8b0d1458.46f391'),
            key: 'page_type',
            render: (h, scope) => {
              return h('span', this.getPageTypeLabel(scope.row.page_type))
            }
          },
          {
            name: this.$t('8b0d1458.53c3dd'),
            key: 'status_label',
            width: 120,
            render: (h, { row }) => {
              return h('el-switch', {
                props: {
                  value: row.status == 1,
                  disabled: !!this.statusLoadingMap[row.theme_pc_template_id]
                },
                on: {
                  change: () => this.handleDisable(row)
                }
              })
            }
          },
          {
            name: this.$t('8b0d1458.2b6bc0'),
            key: '_actions',
            width: 220,
            fixed: 'right',
            render: (h, { row }) => {
              return h('div', [
                h(
                  'el-button',
                  {
                    props: { type: 'text', size: 'mini' },
                    on: { click: () => this.handleDelete(row) }
                  },
                  this.$t('8b0d1458.2f4aad')
                ),
                h(
                  'el-button',
                  {
                    props: { type: 'text', size: 'mini' },
                    on: { click: () => this.openTemplateDialog(row) }
                  },
                  this.$t('8b0d1458.95b351')
                ),
                h(
                  'el-button',
                  {
                    props: { type: 'text', size: 'mini' },
                    on: { click: () => this.handleRenovation(row) }
                  },
                  this.$t('8b0d1458.6343df')
                )
              ])
            }
          }
        ]
      })
    }
  },
  methods: {
    getPageTypeLabel(pageType) {
      const pageTypeName = typeof pageType === 'string' ? pageType : pageType && pageType.name
      const tab = this.tabList.find((item) => item.name === pageTypeName)
      if (!tab) {
        return pageTypeName || ''
      }
      return tab.labelKey ? this.$t(tab.labelKey) : tab.label
    },
    getDistributorId() {
      const routeDistributorId = this.$route.query.distributor_id
      if (routeDistributorId !== undefined && routeDistributorId !== '') {
        return Number(routeDistributorId)
      }
      const shopId = this.$store.getters.shopId
      if (shopId !== undefined && shopId !== '') {
        return Number(shopId)
      }
      return undefined
    },
    beforeSearch(query) {
      const q = { ...query }
      if (q.page_size == null && q.pageSize != null) {
        q.page_size = q.pageSize
      }
      if (q.page_no == null) {
        if (q.pageNum != null) {
          q.page_no = q.pageNum
        } else if (q.page != null) {
          q.page_no = q.page
        } else {
          q.page_no = 1
        }
      }
      q.page_type = this.page_type
      const distributorId = this.getDistributorId()
      if (distributorId !== undefined) {
        q.distributor_id = distributorId
      }
      return q
    },
    handleTabClick() {
      this.$nextTick(() => {
        if (this.$refs.finder) {
          this.$refs.finder.refresh(true)
        }
      })
    },
    openTemplateDialog(row) {
      const isEdit = row && row.theme_pc_template_id != null && row.theme_pc_template_id !== ''
      const initialValue = isEdit
        ? {
            theme_pc_template_id: row.theme_pc_template_id,
            template_title: row.template_title,
            template_description: row.template_description,
            page_type: row.page_type,
            distributor_id: row.distributor_id,
            status: row.status == 1
          }
        : {
            theme_pc_template_id: '',
            template_title: '',
            template_description: '',
            page_type: this.page_type,
            distributor_id: this.getDistributorId(),
            status: true
          }

      const formVmHolder = { vm: null }
      const h = this.$createElement

      this.$dialog.open({
        title: isEdit ? this.$t('8b0d1458.f4b9c2') : this.$t('8b0d1458.e3a8f1'),
        size: 'small',
        content: h(WebPcTemplateForm, {
          key: `pc-tpl-${isEdit ? 'e' : 'n'}-${Date.now()}`,
          props: {
            initialValue,
            tabList: this.tabList
          },
          ref: (vm) => {
            formVmHolder.vm = vm
          }
        }),
        confirmBefore: async () => {
          const formVm = formVmHolder.vm
          if (!formVm || typeof formVm.buildApiParams !== 'function') {
            throw new Error(this.$t('025a9251.a733c4'))
          }
          const params = await formVm.buildApiParams()
          try {
            if (!params.theme_pc_template_id) {
              await addPageTemplate(params)
            } else {
              await editPageTemplate(params)
            }
            if (this.$refs.finder) {
              this.$refs.finder.refresh()
            }
          } catch (e) {
            console.error(e)
            throw e
          }
        }
      })
    },
    handleRenovation({ theme_pc_template_id, page_type }) {
      const pageType = page_type || this.page_type
      const { href } = this.$router.resolve({
        path: '/decoration/web/template/edit',
        query: {
          id: theme_pc_template_id,
          page_type: pageType
        }
      })
      window.open(href, '_blank', 'noopener,noreferrer')
    },
    async handleDisable({ status, created, updated, deleted_at, ...rest }) {
      const rowId = rest.theme_pc_template_id
      this.$set(this.statusLoadingMap, rowId, true)
      try {
        await editPageTemplate({
          status: status == 1 ? '2' : '1',
          ...rest
        })
        if (this.$refs.finder) {
          this.$refs.finder.refresh()
        }
      } catch (err) {
        console.error(err)
      } finally {
        this.$set(this.statusLoadingMap, rowId, false)
      }
    },
    async handleDelete({ theme_pc_template_id: id }) {
      try {
        await this.$confirm(this.$t('8b0d1458.f9abac'), this.$t('8b0d1458.02d981'), {
          confirmButtonText: this.$t('8b0d1458.38cf16'),
          cancelButtonText: this.$t('8b0d1458.625fb2'),
          type: 'warning'
        })
        await deletePageTemplate(id)
        if (this.$refs.finder) {
          this.$refs.finder.refresh()
        }
      } catch (err) {
        if (err !== 'cancel') {
          console.error(err)
        }
      }
    }
  }
}
</script>
