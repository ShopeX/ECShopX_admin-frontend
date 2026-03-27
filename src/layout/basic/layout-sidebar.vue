<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="flex h-full">
    <div class="w-[100px] bg-[#fff] h-screen overflow-auto no-scrollbar">
      <div class="flex items-center mt-2 px-2">
        <SpImage
          class="bg-white mx-auto"
          :src="$store.state.system?.logo || '/images/logo.png'"
          height="38"
          fit="contain"
        />
      </div>

      <ul class="main-menu-list mt-2 mb-8">
        <li
          v-for="item in mainMenus"
          :key="item.alias_name"
          class="main-menu-item py-2 mx-1 my-1 flex flex-col items-center cursor-pointer"
          :class="{ 'main-menu-item--active': activeMainMenu === item.alias_name }"
          @click="handleMainMenuClick(item)"
        >
          <!-- {{ computedMenuIcon(item) }} -->
          <SpIcon
            class="menu-icon"
            :name="computedMenuIcon(item)"
            :size="18"
            :fill="activeMainMenu === item.alias_name ? computedPrimaryColor : '#333'"
          />
          <span
            class="text-sm mt-1 text-center"
            :style="{ color: activeMainMenu === item.alias_name ? computedPrimaryColor : '#333' }"
            >{{ item.name }}</span
          >
        </li>
        <!-- <li @click="handleMainMenuClick({ alias_name: 'license' })" class="text-center text-gray-500 text-sm mt-2 mb-2 cursor-pointer">License</li> -->
      </ul>
    </div>

    <div
      class="sub-menu-list w-[170px] border-border border-l border-r h-screen overflow-auto no-scrollbar"
      v-if="subMenus.length > 0"
    >
      <!-- activeSubIndex: {{ activeSubIndex }} -->
      <div class="h-[50px] pl-[18px]">
        <div class="light flex h-full items-center text-xl text-[#333]">
          <span>{{ systemTitle }}</span>
        </div>
      </div>
      <!-- 菜单展开状态管理 -->
      <el-menu
        ref="subMenu"
        class="!border-none w-full"
        :default-active="activeSubIndex"
        :openeds="openedMenus"
        @open="handleMenuOpen"
        @close="handleMenuClose"
      >
        <template v-for="item in subMenus">
          <template v-if="resolveChildren(item.children)">
            <el-submenu :key="item.alias_name" :index="item.alias_name">
              <template slot="title">
                <span
                  class="block w-full"
                  @click="handleSubmenuTitleClick(item.alias_name, $event)"
                >{{ item.name }}</span>
              </template>
              <!-- 三级菜单 -->
              <template v-for="child in item.children">
                <el-menu-item
                  class="third-menu-item"
                  v-if="child.is_menu"
                  :key="child.alias_name"
                  :index="child.alias_name"
                  @click="handleSubMenuClick(child)"
                >
                  <span>{{ child.name }}</span>
                </el-menu-item>
              </template>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item
              class="second-menu-item"
              v-if="item.is_menu"
              :key="item.alias_name"
              :index="item.alias_name"
              @click="handleSubMenuClick(item)"
            >
              <span>{{ item.name }}</span>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script>
import { getBasePath, getSystemTitle } from '@/utils'
import Config from '@/config'

export default {
  name: 'LayoutSidebar',
  data() {
    return {
      mainMenus: [],
      subMenus: [],
      //当前打开的二级菜单标识列表
      openedMenus: []
    }
  },
  computed: {
    activeMainMenu() {
      return this.$route.matched[0]?.meta?.aliasName
    },
    systemTitle() {
      // 如果有选中的一级菜单，返回该菜单的title
      if (this.activeMainMenu) {
        const activeMenu = this.mainMenus.find((item) => item.alias_name === this.activeMainMenu)
        if (activeMenu) {
          return activeMenu.name
        }
      }
      // 否则返回默认系统标题
      return this.$t(getSystemTitle())
    },
    activeSubIndex() {
      //通过权限标识查找三级菜单
      const lastRoute = this.$route.matched[this.$route.matched.length - 1]
      if (
        lastRoute?.meta?.permissions &&
        lastRoute.meta.permissions.length > 0 &&
        this.subMenus.length > 0
      ) {
        const permission = lastRoute.meta.permissions[0]

        // 在所有二级菜单的 children 中查找匹配的三级菜单
        for (const item of this.subMenus) {
          if (item.children && item.children.length > 0) {
            const childMenu = item.children.find((child) => {
              return child.is_menu && child.permission === permission
            })
            if (childMenu && childMenu.alias_name) {
              return childMenu.alias_name
            }
          }
        }
      }
      return null
    },
    computedPrimaryColor() {
      return Config.themeConfig.primaryColor
    }
  },
  watch: {
    subMenus: {
      handler(val) {
        this.$emit('change', val.length > 0)
        this.updateMenuState()
      },
      immediate: true
    },
    // 监听路由变化，自动更新菜单状态
    '$route': {
      handler() {
        this.updateSubMenus()
        this.$nextTick(() => {
          this.updateMenuState()
        })
      },
      immediate: true
    }
  },
  mounted() {
    this.mainMenus = this.$store.state.user.accessMenus || []
    this.updateSubMenus()
  },
  methods: {
    // 更新中间二级菜单列表
    updateSubMenus() {
      const [mainRoute] = this.$route.matched
      if (mainRoute?.meta?.aliasName) {
        const mainMenu = this.mainMenus.find((item) => item.alias_name === mainRoute.meta.aliasName)
        if (mainMenu) {
          this.subMenus = mainMenu.children || []
        } else {
          this.subMenus = []
        }
      } else {
        this.subMenus = []
      }
    },
    toNotFound() {
      const basePath = getBasePath()
      if (!this.$route.path.includes('not-found')) {
        this.$router
          .push({ path: basePath ? `/${basePath}/not-found` : '/not-found' })
          ?.catch((err) => {
            console.log('err', err)
          })
      }
    },
    computedMenuIcon(item) {
      return this.getMenuIconByAlias(item.alias_name)
    },
    getMenuIconByAlias(aliasName) {
      if (!aliasName) return ''
      const route = this.$router.getRoutes().find((route) => route.meta?.aliasName === aliasName)
      return route?.meta?.icon || ''
    },
    resolveChildren(children) {
      return children && children.length > 0 && children.some((child) => child.is_menu)
    },
    handleMainMenuClick(item) {
      if (item.alias_name == this.$route.matched?.[0]?.meta?.aliasName) {
        return
      }
      this.subMenus = item?.children || []
      // 获取第一个子路由
      const firstChild = (_submenu) => {
        for (const item of _submenu) {
          if (item.children) {
            const result = firstChild(item.children)
            if (result) return result
          } else if (item.is_menu) {
            return item?.permission
          }
        }
        return null
      }
      // 如果只有一级菜单，就直接那当前一级菜单的权限
      let permission = ''
      if (this.subMenus.length === 0) {
        permission = item.permission
      } else {
        permission = firstChild(this.subMenus)
      }

      const route = this.findRouteByPermission(permission)
      if (route) {
        this.$router.push({ path: route.path })
      } else {
        this.toNotFound()
      }
    },
    handleSubMenuClick(item) {
      const route = this.findRouteByPermission(item.permission)
      if (route) {
        if (this.$route.path === route.path) {
          return
        }
        this.$router.push({ path: route.path })
      } else {
        this.toNotFound()
      }
    },
    findRouteByPermission(permission) {
      return this.$router.getRoutes().find((route) => route.meta?.permissions?.includes(permission))
    },
    // 查找父级二级菜单
    findParentSubMenu(menuAlias) {
      return this.subMenus.find((item) => {
        if (item.children && item.children.length > 0) {
          return item.children.some((child) => child.is_menu && child.alias_name === menuAlias)
        }
        return false
      })
    },
    // 查找需要打开的二级菜单
    findMenuToOpen() {
      const activeMenuAlias = this.activeSubIndex
      if (!activeMenuAlias) {
        return null
      }

      const activeSubMenu = this.subMenus.find(
        (item) => item.alias_name === activeMenuAlias && item.children && item.children.length > 0
      )
      if (activeSubMenu) {
        return activeSubMenu.alias_name
      }

      const parentSubMenu = this.findParentSubMenu(activeMenuAlias)
      return parentSubMenu?.alias_name || null
    },
    closeOtherSubMenus(menuToOpen) {
      const menuComponent = this.$refs.subMenu
      const menusToClose = this.openedMenus.filter((index) => index !== menuToOpen)
      this.openedMenus = this.openedMenus.filter((index) => index === menuToOpen)

      const allSubmenus = menuComponent.$el.querySelectorAll('.el-submenu')
      menusToClose.forEach((indexToClose) => {
        if (typeof menuComponent.close === 'function') {
          try {
            menuComponent.close(indexToClose)
          } catch (e) {
            this.closeSubMenuByClick(allSubmenus, indexToClose)
          }
        } else {
          this.closeSubMenuByClick(allSubmenus, indexToClose)
        }
      })
    },
    // 通过点击关闭指定的二级菜单
    closeSubMenuByClick(allSubmenus, indexToClose) {
      const submenu = Array.from(allSubmenus).find((el) => {
        const idx = el.getAttribute('index') || el.getAttribute('data-index')
        return idx === indexToClose
      })

      if (submenu) {
        const isOpened =
          submenu.classList.contains('is-opened') ||
          submenu.getAttribute('aria-expanded') === 'true'
        if (isOpened) {
          const titleEl = submenu.querySelector('.el-submenu__title')
          if (titleEl) {
            titleEl.click()
          }
        }
      }
    },
    //查找菜单DOM元素
    findSubMenuElement(menuAlias) {
      const menuComponent = this.$refs.subMenu
      if (!menuComponent || !menuComponent.$el) {
        return null
      }
      const allSubmenus = menuComponent.$el.querySelectorAll('.el-submenu')
      if (!allSubmenus) {
        return null
      }
      for (const submenu of allSubmenus) {
        const index = submenu.getAttribute('index') || submenu.getAttribute('data-index')
        if (index === menuAlias) {
          return submenu
        }
      }
      const menuItem = this.subMenus.find((item) => item.alias_name === menuAlias)
      if (menuItem) {
        for (const submenu of allSubmenus) {
          const titleEl = submenu.querySelector('.el-submenu__title')
          if (titleEl && titleEl.textContent.trim() === menuItem.name) {
            return submenu
          }
        }
      }
      return null
    },
    // 展开指定的二级菜单（会关闭其他二级菜单）
    openSubMenu(menuToOpen) {
      if (!menuToOpen || !this.$refs.subMenu) {
        return
      }

      this.closeOtherSubMenus(menuToOpen)

      setTimeout(() => {
        const menuComponent = this.$refs.subMenu
        if (!menuComponent) return

        if (!this.openedMenus.includes(menuToOpen)) {
          this.openedMenus.push(menuToOpen)
        }

        const submenuEl = this.findSubMenuElement(menuToOpen)
        if (submenuEl) {
          const isOpened =
            submenuEl.classList.contains('is-opened') ||
            submenuEl.getAttribute('aria-expanded') === 'true'
          if (!isOpened) {
            const titleEl = submenuEl.querySelector('.el-submenu__title')
            if (titleEl) {
              titleEl.click()
            }
          }
        } else if (typeof menuComponent.open === 'function') {
          try {
            menuComponent.open(menuToOpen)
          } catch (e) {
            // 忽略错误
          }
        }
      }, 100)
    },
    // 仅确保指定二级菜单展开，不关闭其他已展开的二级菜单（用于路由切换时保持多开）
    ensureSubMenuOpen(menuToOpen) {
      if (!menuToOpen || !this.$refs.subMenu) return
      if (!this.openedMenus.includes(menuToOpen)) {
        this.openedMenus.push(menuToOpen)
      }
      this.$nextTick(() => {
        const menuComponent = this.$refs.subMenu
        if (!menuComponent) return
        const submenuEl = this.findSubMenuElement(menuToOpen)
        if (submenuEl) {
          const isOpened =
            submenuEl.classList.contains('is-opened') ||
            submenuEl.getAttribute('aria-expanded') === 'true'
          if (!isOpened) {
            const titleEl = submenuEl.querySelector('.el-submenu__title')
            if (titleEl) titleEl.click()
          }
        } else if (typeof menuComponent.open === 'function') {
          try {
            menuComponent.open(menuToOpen)
          } catch (e) {
            // 忽略 el-menu.open 异常
          }
        }
      })
    },
    // 统一更新菜单状态（展开和高亮）：只确保当前路由父级展开，不折叠其他二级菜单
    updateMenuState() {
      if (this.subMenus.length === 0) {
        return
      }

      const menuToOpen = this.findMenuToOpen()
      if (menuToOpen) {
        this.ensureSubMenuOpen(menuToOpen)
      }

      setTimeout(() => {
        this.setActiveMenuItem()
      }, 150)
    },
    // 处理菜单展开事件
    handleMenuOpen(index) {
      if (!this.openedMenus.includes(index)) {
        this.openedMenus.push(index)
      }
    },
    // 点击二级菜单标题时：当前路由所在父级不允许收起，保持铺开
    handleSubmenuTitleClick(aliasName, e) {
      const menuToKeepOpen = this.findMenuToOpen()
      if (menuToKeepOpen && aliasName === menuToKeepOpen && this.openedMenus.includes(aliasName)) {
        e.preventDefault()
        e.stopPropagation()
      }
    },
    // 处理菜单折叠事件（当前路由所在父级不从 openedMenus 移除，避免被收起）
    handleMenuClose(index) {
      const menuToKeepOpen = this.findMenuToOpen()
      if (menuToKeepOpen && index === menuToKeepOpen) {
        return
      }
      const indexPos = this.openedMenus.indexOf(index)
      if (indexPos > -1) {
        this.openedMenus.splice(indexPos, 1)
      }
    },
    // 设置菜单高亮
    setActiveMenuItem() {
      const activeIndex = this.activeSubIndex
      if (!activeIndex || !this.$refs.subMenu) {
        return
      }

      const menuComponent = this.$refs.subMenu
      menuComponent.activeIndex = activeIndex

      setTimeout(() => {
        const allMenuItems = menuComponent.$el?.querySelectorAll('.el-menu-item')
        if (!allMenuItems) return

        allMenuItems.forEach((item) => item.classList.remove('is-active'))

        let activeMenuItem = menuComponent.$el?.querySelector(
          `.el-menu-item[index="${activeIndex}"]`
        )

        if (!activeMenuItem) {
          const targetMenu = this.findMenuByAlias(activeIndex)
          if (targetMenu) {
            for (const menuItem of allMenuItems) {
              if (menuItem.textContent.trim() === targetMenu.name) {
                activeMenuItem = menuItem
                break
              }
            }
          }
        }

        if (activeMenuItem) {
          activeMenuItem.classList.add('is-active')
        }
      }, 50)
    },
    // 通过菜单标识查找菜单项数据
    findMenuByAlias(aliasName) {
      for (const item of this.subMenus) {
        if (item.alias_name === aliasName) {
          return item
        }
        if (item.children && item.children.length > 0) {
          const childMenu = item.children.find(
            (child) => child.is_menu && child.alias_name === aliasName
          )
          if (childMenu) {
            return childMenu
          }
        }
      }
      return null
    }
  }
}
</script>

<style scoped lang="scss">
.main-menu-list {
  .main-menu-item {
    &:hover {
      color: var(--primary);
      background: rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      .menu-icon {
        transform: scale(1.1);
        transition: all 0.25s ease;
      }
    }
    &--active {
      border-radius: 6px;
      span {
        color: var(--primary) !important;
      }
    }
  }
}

.third-menu-item {
  padding-left: 34px !important;
}

:deep(.el-menu-item) {
  border-radius: 6px;
  height: 42px;
  display: flex;
  align-items: center;
  margin: 0 8px 2px;
  padding-right: 12px !important;

  min-width: auto;
  color: #666;
}

:deep(.el-menu-item.is-active) {
  color: var(--primary) !important;
  background: color-mix(in srgb, #ffffff 90%, var(--primary)) !important;
}

:deep(.el-submenu__title) {
  border-radius: 6px;
  height: 42px;
  display: flex;
  align-items: center;
  margin: 0 8px 2px;
  color: #666;
}
</style>
