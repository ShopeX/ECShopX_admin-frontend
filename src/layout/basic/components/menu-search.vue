<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <div
      class="flex items-center gap-2 px-3 py-1 cursor-pointer bg-gray-100 hover:bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200"
      @click="openSearchDialog"
    >
      <Search theme="outline" :size="14" fill="#333" />
      <span class="text-gray-600">{{ $t('37d406b5.e5f71f') }}</span>
      <span class="px-2 py-1 bg-white rounded-l-md rounded-r-xl text-gray-700 font-medium">
        <span v-if="isMac">⌘K</span>
        <span v-else>Ctrl+K</span>
      </span>
    </div>

    <SpDialogPlus
      :is-show="dialogVisible"
      size="mini"
      :button-cancel="{ visible: false }"
      :button-confirm="{ visible: false }"
      @close="closeDialog"
    >
      <template #title>
        <div class="flex items-center h-[30px] bg-white border-gray-100 rounded-t-lg px-2">
          <div class="flex-1 min-w-0 max-w-full mr-2.5 relative">
            <div
              class="absolute left-1 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none"
            >
              <Search theme="outline" :size="16" fill="#c0c4cc" />
            </div>
            <sp-form-plus
              ref="searchForm"
              class="menu-search-title-form"
              :form-items="[
                {
                  fieldName: 'keyword',
                  label: '',
                  component: 'input',
                  cellWidth: 2,
                  componentProps: {
                    placeholder: $t('37d406b5.f346ed')
                  }
                }
              ]"
              form-type="searchForm"
              :show-default-actions="false"
              inline
              label-width="0px"
              :value="{ keyword: keyword }"
              @input="handleInputChange"
            />
          </div>
        </div>
      </template>

      <template #body>
        <div class="relative min-h-[200px] flex flex-col h-full overflow-hidden">
          <div
            class="flex-1 overflow-y-auto overflow-x-hidden min-h-0"
            :class="needsScroll ? 'max-h-[355px] pr-2' : ''"
            @mousemove="handleMouseMove"
          >
            <div v-if="keyword?.trim()">
              <div v-if="filteredMenus.length > 0" class="menu-list">
                <div
                  v-for="(menu, index) in filteredMenus"
                  :key="menu.permission"
                  class="menu-item p-3 mb-2 cursor-pointer rounded border"
                  :class="selectedIndex === index ? 'menu-item-selected' : ''"
                  :style="
                    selectedIndex === index
                      ? {
                          background: 'color-mix(in srgb, #ffffff 90%, var(--primary))',
                          borderColor: 'transparent'
                        }
                      : { background: 'transparent' }
                  "
                  @click="handleMenuClick(menu)"
                  @mouseenter="handleMouseEnter(index)"
                >
                  <div
                    class="font-medium flex items-center"
                    :style="
                      selectedIndex === index ? { color: 'var(--primary)' } : { color: '#333' }
                    "
                  >
                    <SpIcon
                      v-if="menu.icon"
                      :name="menu.icon"
                      :size="16"
                      class="mr-2 flex-shrink-0"
                    />
                    <span
                      v-html="highlightText(menu.name, keyword, selectedIndex === index)"
                    />
                  </div>
                  <div v-if="menu.path" class="text-xs text-gray-400 mt-1">{{ menu.path }}</div>
                </div>
              </div>
              <div v-else class="text-sm text-gray-400 text-center py-4">
                {{ $t('37d406b5.12e43b') }}
              </div>
            </div>
            <div v-else>
              <div v-if="searchHistory.length > 0">
                <div class="text-xs text-gray-500 mb-2">{{ $t('37d406b5.e9c38f') }}</div>
                <div class="menu-list">
                  <div
                    v-for="(historyItem, index) in searchHistory"
                    :key="`history-${index}`"
                    class="menu-item p-3 mb-2 cursor-pointer rounded border relative"
                    :class="selectedIndex === index ? 'menu-item-selected' : ''"
                    :style="{
                      paddingRight: '40px',
                      ...(selectedIndex === index
                        ? {
                            background: 'color-mix(in srgb, #ffffff 90%, var(--primary))',
                            borderColor: 'transparent'
                          }
                        : { background: 'transparent' })
                    }"
                    @click="handleHistoryItemClick(historyItem)"
                    @mouseenter="handleMouseEnter(index)"
                  >
                    <div
                      class="font-medium flex items-center"
                      :style="
                        selectedIndex === index ? { color: 'var(--primary)' } : { color: '#333' }
                      "
                    >
                      {{ historyItem.name }}
                    </div>
                    <div v-if="historyItem.path" class="text-xs text-gray-400 mt-1">
                      {{ historyItem.path }}
                    </div>
                    <span
                      class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-300 cursor-pointer text-lg font-bold"
                      style="line-height: 1; padding: 4px"
                      @click.stop="deleteHistoryItem(index, $event)"
                      >×</span
                    >
                  </div>
                </div>
              </div>
              <div v-else class="text-sm text-gray-400 text-center py-4">
                {{ $t('37d406b5.941fcf') }}
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex items-center gap-3 text-xs text-gray-700">
          <div class="flex items-center gap-1">
            <EnterKey theme="outline" :size="12" fill="#333" />
            <span>{{ $t('37d406b5.153fa6') }}</span>
          </div>
          <div class="flex items-center gap-1">
            <SortThree theme="outline" :size="12" fill="#333" />
            <span>{{ $t('37d406b5.056f2d') }}</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="text-xs">ESC</span>
            <span>{{ $t('37d406b5.b15d91') }}</span>
          </div>
        </div>
      </template>
    </SpDialogPlus>
  </div>
</template>

<script>
import { getBasePath, isMac as checkIsMac } from '@/utils'
import { Search, EnterKey, SortThree } from '@icon-park/vue'
import SpDialogPlus from '@/components/sp-dialog-plus/main.vue'

export default {
  name: 'MenuSearch',
  components: {
    Search,
    EnterKey,
    SortThree,
    SpDialogPlus
  },
  data() {
    return {
      dialogVisible: false,
      keyword: '',
      filteredMenus: [],
      searchHistory: [],
      selectedIndex: -1,
      searchHistoryKey: 'menu_search_history',
      allowMouseEnter: true
    }
  },
  computed: {
    isMac() {
      return checkIsMac()
    },
    needsScroll() {
      const hasMoreHistory = this.searchHistory.length > 5
      const hasMoreResults = this.keyword?.trim() && this.filteredMenus.length > 5
      return hasMoreHistory || hasMoreResults
    },
    availableList() {
      if (this.keyword?.trim()) {
        return this.filteredMenus
      }
      return this.searchHistory.map((item) => {
        const menu = this.getAllMenuItems().find(
          (m) => m.permission === item.permission || m.name === item.name
        )
        return (
          menu || {
            name: item.name,
            path: item.path,
            permission: item.permission,
            isHistoryItem: true
          }
        )
      })
    }
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        this.loadSearchHistory()
        this.$nextTick(() => {
          this.focusInput()
          this.allowMouseEnter = true
          if (this.availableList.length > 0) {
            this.selectedIndex = 0
          }
          this.dialogKeydownHandler = (e) => {
            this.handleKeydownInDialog(e)
          }
          document.addEventListener('keydown', this.dialogKeydownHandler, true)
        })
      } else {
        this.selectedIndex = -1
        this.keyword = ''
        this.filteredMenus = []
        //移除键盘事件监听
        if (this.dialogKeydownHandler) {
          document.removeEventListener('keydown', this.dialogKeydownHandler, true)
          this.dialogKeydownHandler = null
        }
      }
    },
    keyword(newVal) {
      if (newVal?.trim()) {
        this.updateFilteredMenus(newVal)
      } else {
        this.filteredMenus = []
      }
      this.$nextTick(() => {
        if (this.availableList.length > 0) {
          this.selectedIndex = 0
        } else {
          this.selectedIndex = -1
        }
      })
    }
  },
  mounted() {
    this.handleKeydown = (e) => {
      const isCtrlK = (e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')
      if (isCtrlK) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        if (this.dialogVisible) {
          return false
        }
        this.openSearchDialog()
      }
    }
    window.addEventListener('keydown', this.handleKeydown, true)
  },
  beforeDestroy() {
    if (this.handleKeydown) {
      window.removeEventListener('keydown', this.handleKeydown, true)
    }
    if (this.dialogKeydownHandler) {
      document.removeEventListener('keydown', this.dialogKeydownHandler, true)
    }
  },
  methods: {
    openSearchDialog() {
      if (this.dialogVisible) {
        return
      }
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
    },
    focusInput() {
      this.$nextTick(() => {
        const dialog = document.querySelector('.el-dialog')
        if (dialog) {
          const input = dialog.querySelector('input')
          if (input) {
            input.focus()
          }
        }
      })
    },
    handleInputChange(formData) {
      const val = formData?.keyword || ''
      this.keyword = val
    },
    handleMouseMove() {
      this.allowMouseEnter = true
    },
    handleMouseEnter(index) {
      //只有在允许的情况下才更新选中项
      if (this.allowMouseEnter) {
        this.selectedIndex = index
      }
    },
    handleKeydownInDialog(e) {
      // 只在对话框打开时处理
      if (!this.dialogVisible) {
        return
      }
      const availableList = this.availableList

      if (e.key === 'Enter') {
        e.preventDefault()
        e.stopPropagation()
        if (this.selectedIndex >= 0 && this.selectedIndex < availableList.length) {
          const selectedItem = availableList[this.selectedIndex]
          if (selectedItem.isHistoryItem) {
            this.handleHistoryItemClick(selectedItem)
          } else {
            this.handleMenuClick(selectedItem)
          }
        } else if (availableList.length > 0) {
          const firstItem = availableList[0]
          if (firstItem.isHistoryItem) {
            this.handleHistoryItemClick(firstItem)
          } else {
            this.handleMenuClick(firstItem)
          }
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        e.stopPropagation()
        this.allowMouseEnter = false
        if (availableList.length > 0) {
          if (this.selectedIndex < 0 || this.selectedIndex >= availableList.length) {
            this.selectedIndex = 0
          } else {
            this.selectedIndex = (this.selectedIndex + 1) % availableList.length
          }
          this.scrollToSelected()
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        e.stopPropagation()
        this.allowMouseEnter = false
        if (availableList.length > 0) {
          if (this.selectedIndex < 0 || this.selectedIndex >= availableList.length) {
            this.selectedIndex = availableList.length - 1
          } else if (this.selectedIndex === 0) {
            this.selectedIndex = availableList.length - 1
          } else {
            this.selectedIndex = this.selectedIndex - 1
          }
          this.scrollToSelected()
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        this.closeDialog()
      }
    },
    scrollToSelected() {
      this.$nextTick(() => {
        if (this.selectedIndex >= 0 && this.selectedIndex < this.availableList.length) {
          const menuItems = this.$el?.querySelectorAll('.menu-item')
          if (menuItems && menuItems[this.selectedIndex]) {
            menuItems[this.selectedIndex].scrollIntoView({
              behavior: 'smooth',
              block: 'nearest'
            })
          }
        }
      })
    },
    loadSearchHistory() {
      try {
        const history = localStorage.getItem(this.searchHistoryKey)
        if (history) {
          this.searchHistory = JSON.parse(history)
        }
      } catch (e) {
        this.searchHistory = []
      }
    },
    deleteHistoryItem(index, e) {
      e.stopPropagation()
      e.preventDefault()

      this.searchHistory.splice(index, 1)

      if (this.selectedIndex >= index) {
        this.selectedIndex = this.selectedIndex === index ? -1 : this.selectedIndex - 1
      }
      if (this.availableList.length === 0) {
        this.selectedIndex = -1
      } else if (this.selectedIndex >= this.availableList.length) {
        this.selectedIndex = this.availableList.length - 1
      } else if (this.selectedIndex < -1) {
        this.selectedIndex = -1
      }

      try {
        localStorage.setItem(this.searchHistoryKey, JSON.stringify(this.searchHistory))
      } catch (e) {
        console.error('保存搜索历史失败:', e)
      }

      this.focusInput()
    },
    updateFilteredMenus(keyword) {
      this.filteredMenus = this.getFilteredMenus(keyword)
    },
    handleHistoryItemClick(historyItem) {
      const menu = this.getAllMenuItems().find((m) => m.permission === historyItem.permission)
      if (menu) {
        this.handleMenuClick(menu)
      }
    },
    highlightText(text, keyword, isSelected = false) {
      if (!keyword || !text) return text
      const regex = new RegExp(`(${keyword})`, 'gi')
      const parts = text.split(regex).filter((part) => part)
      return parts
        .map((part) => {
          if (part.toLowerCase() === keyword.toLowerCase()) {
            if (isSelected) {
              return `<span style="color: var(--primary); font-weight: 600;">${part}</span>`
            } else {
              return `<span style="background-color: color-mix(in srgb, #ffffff 70%, var(--primary));">${part}</span>`
            }
          }
          return part
        })
        .join('')
    },
    findRouteByPermission(permission) {
      return this.$router.getRoutes().find((route) => route.meta?.permissions?.includes(permission))
    },
    getMenuIconByAlias(aliasName) {
      if (!aliasName) return ''
      const route = this.$router.getRoutes().find((route) => route.meta?.aliasName === aliasName)
      return route?.meta?.icon || ''
    },
    getAllMenuItems() {
      const menus = this.$store.state.user.accessMenus || []
      const result = []

      const flattenMenu = (items, parentPath = '') => {
        items.forEach((item) => {
          if (item.is_menu === false && item.is_show === true) {
            return
          }
          const currentPath = parentPath ? `${parentPath} / ${item.name}` : item.name
          const menuItem = {
            name: item.name,
            alias_name: item.alias_name,
            permission: item.permission,
            path: currentPath,
            icon: this.getMenuIconByAlias(item.alias_name),
            originalItem: item,
            hasChildren: !!item.children?.length,
            children: item.children || []
          }
          result.push(menuItem)

          if (item.children?.length) {
            const childPath = parentPath ? `${parentPath} / ${item.name}` : item.name
            flattenMenu(item.children, childPath)
          }
        })
      }

      flattenMenu(menus)
      return result
    },
    findFirstLeafMenu(menuItem) {
      if (!menuItem?.originalItem) return null

      const findFirstChild = (item) => {
        if (item.is_menu && !item.children?.length) {
          return item
        }
        if (item.children?.length) {
          for (const child of item.children) {
            const result = findFirstChild(child)
            if (result) return result
          }
        }
        return null
      }
      return findFirstChild(menuItem.originalItem)
    },
    getFilteredMenus(keyword = '') {
      const lowerKeyword = keyword.toLowerCase().trim()
      return this.getAllMenuItems()
        .filter(
          (menu) =>
            menu.name.toLowerCase().includes(lowerKeyword) ||
            menu.path.toLowerCase().includes(lowerKeyword)
        )
        .slice(0, 20)
    },
    saveSearchHistory(menu) {
      let history = []
      const historyStr = localStorage.getItem(this.searchHistoryKey)
      if (historyStr) {
        history = JSON.parse(historyStr)
      }
      history = history.filter((item) => item.permission !== menu.permission)
      history.unshift({
        name: menu.name,
        path: menu.path,
        permission: menu.permission
      })
      localStorage.setItem(this.searchHistoryKey, JSON.stringify(history))
    },
    handleMenuClick(menu) {
      if (!menu) return

      this.closeDialog()
      let route = null
      let menuToSave = menu

      if (menu.hasChildren) {
        const firstLeafMenu = this.findFirstLeafMenu(menu)
        if (firstLeafMenu?.permission) {
          route = this.findRouteByPermission(firstLeafMenu.permission)
          if (route) {
            const leafMenuPath = menu.path?.includes('/')
              ? `${menu.path} / ${firstLeafMenu.name}`
              : firstLeafMenu.name
            menuToSave = {
              name: firstLeafMenu.name,
              path: leafMenuPath,
              permission: firstLeafMenu.permission
            }
          }
        }
      } else if (menu.permission) {
        route = this.findRouteByPermission(menu.permission)
      }

      if (route) {
        this.saveSearchHistory(menuToSave)
        this.$router.push({ path: route.path }).catch(() => {})
      } else {
        const basePath = getBasePath()
        this.$router
          .push({ path: basePath ? `/${basePath}/not-found` : '/not-found' })
          .catch(() => {})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-item-selected {
  background: color-mix(in srgb, #ffffff 90%, var(--primary)) !important;
  border-color: transparent !important;

  .font-medium {
    color: var(--primary) !important;
  }
}

.menu-search-title-form {
  ::v-deep {
    background: #fff !important;
    padding: 0 !important;

    .sp-form-plus__wrapper {
      background: #fff !important;
      padding: 0 !important;
    }

    .el-form-item {
      margin-bottom: 0 !important;
    }

    .el-input {
      background: #fff !important;

      &__inner {
        background: #fff !important;
        border: none !important;
        box-shadow: none !important;
        padding-left: 24px !important;
        height: 28px !important;
        line-height: 28px !important;

        &:focus {
          border: none !important;
          box-shadow: none !important;
          outline: none !important;
        }

        &::placeholder {
          color: #c0c4cc !important;
        }
      }

      &:focus-within {
        border: none !important;
        box-shadow: none !important;
      }
    }
  }
}
</style>
