<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <div class="flex h-full">
    <div class="w-[70px] bg-[#353439] h-screen overflow-auto">
      <div class="flex items-center mt-2">
        <SpImage
          class="w-[56px] bg-white mx-auto rounded-full"
          :src="$store.state.system?.logo"
          height="56"
          fit="contain"
        />
      </div>

      <ul class="main-menu-list mt-2">
        <li
          v-for="item in mainMenus"
          :key="item.alias_name"
          class="main-menu-item py-2 mx-1 my-1 flex flex-col items-center cursor-pointer"
          :class="{ 'main-menu-item--active': activeMainMenu === item.alias_name }"
          @click="handleMainMenuClick(item)"
        >
          <!-- {{ computedMenuIcon(item) }} -->
          <SpIcon class="menu-icon" :name="computedMenuIcon(item)" :size="16" fill="#fff" />
          <span class="text-sm mt-1 text-white">{{ item.name }}</span>
        </li>
        <li @click="handleMainMenuClick({ alias_name: 'license' })" class="text-center text-gray-500 text-sm mt-2 cursor-pointer">License</li>
      </ul>
    </div>

    <div
      class="sub-menu-list w-[160px] border-border border-l border-r h-screen overflow-auto"
      v-if="subMenus.length > 0"
    >
      <!-- activeSubIndex: {{ activeSubIndex }} -->
      <div class="h-[50px] pl-2">
        <div class="light flex h-full items-center text-xl px-3 text-[#333]">
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

export default {
  name: 'LayoutSidebar',
  data() {
    return {
      mainMenus: [],
      subMenus: []
    }
  },
  computed: {
    systemTitle: () => {
      return getSystemTitle()
    },
    activeMainMenu() {
      return this.$route.matched[0]?.meta?.aliasName
    },
    activeSubIndex() {
      return this.$route.matched[1]?.meta?.aliasName
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
      this.mainMenus.find(item => item.alias_name === mainRoute?.meta?.aliasName)?.children || []
  },
  methods: {
    toNotFound() {
      const basePath = getBasePath()
      if (!this.$route.path.includes('not-found')) {
        this.$router.push({ path: basePath ? `/${basePath}/not-found` : '/not-found' })?.catch(err => {
          console.log('err', err)
        })
      }
    },
    computedMenuIcon(item) {
      const allRoutes = this.$router.getRoutes()
      const route = allRoutes.find(route => route.meta?.aliasName === item.alias_name)
      console.log('computedMenuIcon:', route, item)
      return route?.meta?.icon || ''
    },
    resolveChildren(children) {
      return children && children.length > 0 && children.some(child => child.is_menu)
    },
    handleMainMenuClick(item) {
      if (item.alias_name == this.$route.matched?.[0]?.meta?.aliasName) {
        return
      }
      this.subMenus = item?.children || []
      // 获取第一个子路由
      const firstChild = _submenu => {
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
      const route = allRoutes.find(route => route.meta?.permissions?.includes(permission))
      if (route) {
        this.$router.push({ path: route.path })
      } else if (item.alias_name == 'license') {
        this.$router.push({ path: '/license' })
      } else {
        this.toNotFound()
      }
    },
    handleSubMenuClick(item) {
      const allRoutes = this.$router.getRoutes()
      const route = allRoutes.find(route => route.meta?.permissions?.includes(item.permission))
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
        transform: scale(1.2);
        transition: all 0.25s ease;
      }
    }
    &--active {
      color: hsl(var(--primary-foreground)) !important;
      background: var(--primary) !important;
      border-radius: 6px;
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
