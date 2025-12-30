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
            class="text-sm mt-1"
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
      <el-menu class="!border-none w-full" :default-active="activeSubIndex">
        <template v-for="item in subMenus">
          <template v-if="resolveChildren(item.children)">
            <el-submenu :key="item.alias_name" :index="item.alias_name">
              <template slot="title">
                <span>{{ item.name }}</span>
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
      subMenus: []
    }
  },
  computed: {
    activeMainMenu() {
      return this.$route.matched[0]?.meta?.aliasName
    },
    systemTitle() {
      // 如果有选中的一级菜单，返回该菜单的title
      if (this.activeMainMenu) {
        const activeMenu = this.mainMenus.find(item => item.alias_name === this.activeMainMenu)
        if (activeMenu) {
          return activeMenu.name
        }
      }
      // 否则返回默认系统标题
      return getSystemTitle()
    },
    activeSubIndex() {
      return this.$route.matched[1]?.meta?.aliasName
    },
    computedPrimaryColor() {
      return Config.themeConfig.primaryColor
    }
  },
  watch: {
    subMenus: {
      handler(val) {
        this.$emit('change', val.length > 0)
      },
      immediate: true
    }
  },
  mounted() {
    this.mainMenus = this.$store.state.user.accessMenus || []
    const [mainRoute] = this.$route.matched
    this.subMenus =
      this.mainMenus.find((item) => item.alias_name === mainRoute?.meta?.aliasName)?.children || []
  },
  methods: {
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
      const allRoutes = this.$router.getRoutes()
      const route = allRoutes.find((route) => route.meta?.aliasName === item.alias_name)
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

      const allRoutes = this.$router.getRoutes()
      const route = allRoutes.find((route) => route.meta?.permissions?.includes(permission))
      if (route) {
        this.$router.push({ path: route.path })
      } else {
        this.toNotFound()
      }
    },
    handleSubMenuClick(item) {
      const allRoutes = this.$router.getRoutes()
      const route = allRoutes.find((route) => route.meta?.permissions?.includes(item.permission))
      console.log('handleSubMenuClick:', route)

      if (route) {
        if (this.$route.path == route?.path) {
          return
        }
        this.$router.push({ path: route.path })
      } else {
        this.toNotFound()
      }
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
  line-height: 42px;
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
  line-height: 42px;
  margin: 0 8px 2px;
  background: 216 14% 93% !important;
  color: #666;
}
</style>
