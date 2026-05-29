<!--
  导航菜单：创建 /decoration/web-menu/create 与编辑 /decoration/web-menu/:id 共用
  编辑模式下维护菜单项（最多三级，递归拖拽 + $dialog.open + MenuItemForm）
-->
<template>
  <SpPage>
    <SpPageHeader :title="pageTitle" />

    <SpFormPlus
      ref="menuFormRef"
      v-model="menuForm"
      form-type="form"
      label-width="120px"
      class="max-w-[800px]"
      :show-default-actions="false"
      :form-items="menuFormItems"
    />

    <el-alert
      v-if="isCreate"
      class="mt-4 !ml-[120px] !max-w-[800px]"
      type="info"
      :closable="false"
      :title="$t('80206cbf.83e4fb')"
      show-icon
    />

    <template v-else>
      <div class="max-w-[800px] pl-[120px]">
        <div
          v-loading="loading"
          class="min-h-[120px] rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div class="mb-5 flex items-center justify-between gap-3">
            <span class="text-base font-medium text-gray-800">{{ $t('80206cbf.7419d6') }}</span>
            <el-button type="text" class="!p-0 primary" @click="openItemDialog(null, 0)">
              {{ $t('80206cbf.648c5e') }}
            </el-button>
          </div>

          <draggable
            v-model="topItems"
            handle=".drag-handle"
            :animation="200"
            class="flex flex-col gap-5"
            @end="onTopSortEnd"
          >
            <div v-for="item in topItems" :key="item.id" class="flex flex-col gap-3">
              <WebMenuItemBlock
                :node="item"
                :depth="1"
                :max-depth="maxMenuItemDepth"
                :open-item-dialog="openItemDialog"
                :handle-delete-item="handleDeleteItem"
                :on-child-sort-end="onChildSortEnd"
                :item-link-label="itemLinkLabel"
              />
            </div>
          </draggable>
        </div>
      </div>
    </template>

    <div class="mt-8 flex max-w-[800px] gap-3 pl-[120px]">
      <el-button @click="goList">{{ $t('80206cbf.625fb2') }}</el-button>
      <el-button type="primary" :loading="menuSaving" @click="saveMenu">{{
        $t('80206cbf.be5fbb')
      }}</el-button>
    </div>
  </SpPage>
</template>

<script>
import Draggable from 'vuedraggable'
import SpFormPlus from '@/components/sp-form-plus'
import MenuItemForm from './components/MenuItemForm.vue'
import WebMenuItemBlock from './components/WebMenuItemBlock.vue'
import { LINK_PATH } from '@/consts'
import { MENU_ITEM_PAGE_PRESETS } from './components/menuItemPagePresets'

const defaultMenuForm = () => ({
  name: '',
  key: ''
})

export default {
  name: 'WebMenuId',
  components: { Draggable, SpFormPlus, WebMenuItemBlock },
  data() {
    return {
      /** 菜单项最大层级（1=顶级，3=共三级） */
      maxMenuItemDepth: 3,
      loading: false,
      menuSaving: false,
      menuForm: defaultMenuForm(),
      topItems: []
    }
  },
  computed: {
    isCreate() {
      return this.$route.name === 'webMenuCreate'
    },
    menuId() {
      if (this.isCreate) return null
      const id = Number(this.$route.params.id)
      return Number.isFinite(id) && id > 0 ? id : null
    },
    pageTitle() {
      return this.isCreate ? this.$t('80206cbf.ba750e') : this.$t('80206cbf.ca3472')
    },
    menuFormItems() {
      return [
        {
          fieldName: 'name',
          label: this.$t('80206cbf.8ee9f2'),
          component: 'input',
          rules: [{ required: true, message: this.$t('80206cbf.4cd562'), trigger: 'blur' }],
          componentProps: { placeholder: this.$t('80206cbf.eb6d93'), clearable: true }
        },
        {
          fieldName: 'key',
          label: this.$t('80206cbf.f3c00c'),
          component: 'input',
          rules: [{ required: true, message: this.$t('80206cbf.59a3f5'), trigger: 'blur' }],
          componentProps: { placeholder: this.$t('80206cbf.645de9'), clearable: true }
        }
      ]
    }
  },
  watch: {
    $route: {
      handler() {
        this.bootstrap()
      },
      immediate: true
    }
  },
  methods: {
    /** 为树节点补全 _expanded，保证任意深度子级可渲染 */
    decorateMenuTree(nodes) {
      if (!Array.isArray(nodes)) return []
      return nodes.map((n) => ({
        ...n,
        _expanded: n._expanded !== undefined ? n._expanded : true,
        children: this.decorateMenuTree(n.children || [])
      }))
    },
    itemLinkLabel(item) {
      const lt = item.link_type || 'url'
      const v = item.link_value != null ? String(item.link_value) : ''
      const title = String(item.link_extra?.title || '').trim()
      const typeLabel = LINK_PATH[lt] || lt

      if (lt === 'none' || (!title && !v)) {
        return '—'
      }

      if (title) {
        return typeLabel ? `${typeLabel}：${title}` : title
      }

      if (lt === 'url') {
        const preset = MENU_ITEM_PAGE_PRESETS.find((entry) => entry.value === v)
        const presetLabel = preset ? this.$t(preset.labelKey) : v || '—'
        return typeLabel ? `${typeLabel}：${presetLabel}` : presetLabel
      }

      return typeLabel ? `${typeLabel}：${v || '—'}` : v || '—'
    },
    bootstrap() {
      if (this.isCreate) {
        this.menuForm = defaultMenuForm()
        this.topItems = []
        return
      }
      if (!this.menuId) {
        this.$message.error(this.$t('80206cbf.76ac0c'))
        return
      }
      this.fetchDetail()
    },
    goList() {
      this.$router.replace('/decoration/web-menu')
    },
    async saveMenu() {
      try {
        await this.$refs.menuFormRef.validate()
      } catch (e) {
        return
      }
      this.menuSaving = true
      try {
        if (this.isCreate) {
          const created = await this.$api.decoration.createMenu(this.menuForm)
          const newId = created && created.id != null ? Number(created.id) : null
          if (!newId) {
            this.$message.error(this.$t('80206cbf.d97d00'))
            return
          }
          this.$message.success(this.$t('80206cbf.3b1083'))
          this.$router.replace(`/decoration/web-menu/${newId}`)
          return
        }
        await this.$api.decoration.updateMenu(this.menuId, this.menuForm)
        this.$message.success(this.$t('80206cbf.3b1083'))
        await this.fetchDetail()
      } catch (e) {
        // 全局拦截已提示
      } finally {
        this.menuSaving = false
      }
    },
    async fetchDetail() {
      if (!this.menuId) return
      this.loading = true
      try {
        const menu = await this.$api.decoration.getMenuDetail(this.menuId)
        if (!menu) {
          this.$message.error(this.$t('80206cbf.dd36ca'))
          return
        }
        this.menuForm = {
          name: menu.name != null ? menu.name : '',
          key: menu.key != null ? menu.key : ''
        }
        this.topItems = this.decorateMenuTree(menu.items || [])
      } catch (e) {
        console.error(e)
        this.$message.error((e && e.message) || this.$t('80206cbf.0e2999'))
      } finally {
        this.loading = false
      }
    },
    openItemDialog(item, parentIdForCreate) {
      if (!this.menuId) return
      const editingItemId = item ? item.id : null
      const currentParentId = item ? item.parent_id : parentIdForCreate
      const normalizeLinkType = (linkType) => {
        const value = String(linkType || '').trim()
        return value && value !== 'none' ? value : ''
      }
      const initialValue = item
        ? {
            id: item.id,
            name: item.name,
            path: {
              linkPage: normalizeLinkType(item.link_type),
              title: item.link_extra?.title || item.name || '',
              id: item.link_value != null ? String(item.link_value) : '',
              extra: item.link_extra || {}
            },
            imageUrl: item.image_url != null ? item.image_url : '',
            sort: item.sort
          }
        : { name: '', path: null, imageUrl: '', sort: 0 }

      const formVmHolder = { vm: null }
      const h = this.$createElement

      this.$dialog.open({
        title: editingItemId ? this.$t('80206cbf.cd1e63') : this.$t('80206cbf.e0b6e8'),
        size: 'small',
        buttonConfirm: { text: this.$t('80206cbf.e83a25') },
        content: h(MenuItemForm, {
          props: { initialValue },
          ref: (vm) => {
            formVmHolder.vm = vm
          }
        }),
        confirmBefore: async () => {
          const formVm = formVmHolder.vm
          if (!formVm || typeof formVm.validate !== 'function') {
            throw new Error(this.$t('80206cbf.a733c4'))
          }
          await formVm.validate()
          const selectedPath = formVm.form.path || {}
          const hasSelectedPath = Boolean(
            selectedPath.linkPage && selectedPath.id != null && selectedPath.id !== ''
          )
          const payload = {
            name: formVm.form.name,
            link_type: hasSelectedPath ? selectedPath.linkPage : 'none',
            link_value: hasSelectedPath ? String(selectedPath.id) : '',
            link_extra: hasSelectedPath
              ? {
                  ...(selectedPath.extra || {}),
                  title: selectedPath.title || ''
                }
              : {},
            image_url: formVm.form.imageUrl || '',
            sort: formVm.form.sort != null ? Number(formVm.form.sort) : 0,
            status: editingItemId != null && item && item.status != null ? Number(item.status) : 1,
            parent_id: currentParentId
          }
          if (editingItemId) {
            await this.$api.decoration.updateMenuItem(this.menuId, editingItemId, payload)
          } else {
            await this.$api.decoration.createMenuItem(this.menuId, payload)
          }
          this.$message.success(this.$t('80206cbf.3b1083'))
          await this.fetchDetail()
        }
      })
    },
    async handleDeleteItem(item) {
      if (!this.menuId) return
      const hasKids = item.children && item.children.length
      const tip = hasKids
        ? this.$t('80206cbf.78b5ac', { name: item.name })
        : this.$t('80206cbf.c0650e', { name: item.name })
      try {
        await this.$confirm(tip, this.$t('80206cbf.50eaf9'), { type: 'warning' })
        await this.$api.decoration.removeMenuItem(this.menuId, item.id)
        this.$message.success(this.$t('80206cbf.0007d1'))
        await this.fetchDetail()
      } catch (e) {
        if (e !== 'cancel') console.error(e)
      }
    },
    async onTopSortEnd() {
      if (!this.menuId) return
      const sorts = this.topItems.map((row, idx) => ({ id: row.id, sort: idx }))
      await this.$api.decoration.sortMenuItems(this.menuId, sorts)
    },
    async onChildSortEnd(parentItem) {
      if (!this.menuId) return
      const sorts = parentItem.children.map((child, idx) => ({ id: child.id, sort: idx }))
      await this.$api.decoration.sortMenuItems(this.menuId, sorts)
    }
  }
}
</script>
