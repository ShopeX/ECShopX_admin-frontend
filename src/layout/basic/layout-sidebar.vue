<template>
  <div class="flex h-full">
    <div class="w-[70px] h-full">
      <div class="flex h-12 items-center">
        <SpImage :src="$store.state.system?.logo" height="50" fit="contain" />
      </div>

      <ul class="main-menu-list mt-2">
        <li
          v-for="item in mainMenus"
          :key="item.alias_name"
          class="main-menu-item py-2 mx-1 my-1 flex flex-col items-center cursor-pointer"
          :class="{ 'main-menu-item--active': activeMainMenu === item.alias_name }"
          @click="handleMainMenuClick(item)"
        >
          <SpIcon class="menu-icon" :name="computedMenuIcon(item)" :size="16" />
          <span class="text-sm mt-1">{{ item.name }}</span>
        </li>
      </ul>
    </div>

    <div class="sub-menu-list w-[180px] border-border border-l border-r h-full">
      <!-- activeSubIndex: {{ activeSubIndex }} -->
      <div class="h-[50px] pl-2">
        <div class="light flex h-full items-center text-lg px-3">
          <span>{{ systemTitle }}</span>
        </div>
      </div>
      <el-menu class="!border-none w-full" :default-active="activeSubIndex" unique-opened>
        <template v-for="item in subMenus">
          <template v-if="item.children">
            <el-submenu :key="item.alias_name" :index="item.alias_name">
              <template slot="title">
                <span>{{ item.name }}</span>
              </template>
              <!-- 三级菜单 -->
              <el-menu-item
                v-for="child in item.children"
                :key="child.alias_name"
                :index="child.alias_name"
                @click="handleSubMenuClick(child)"
              >
                <span>{{ child.name }}</span>
              </el-menu-item>
            </el-submenu>
          </template>
          <template v-else>
            <el-menu-item
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
// import { MENU_ICON_MAP } from '@/constants'
// import { preferences } from '../../preferences'
import DEFAULT_CONFIG from '@/config'

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
      return DEFAULT_CONFIG.systemTitle
    },
    activeMainMenu() {
      return this.$route.matched[0]?.meta?.aliasName
    },
    activeSubIndex() {
      return this.$route.matched[1]?.meta?.aliasName
    }
  },
  mounted() {
    this.mainMenus = this.$store.state.user.accessMenus || []
    const [mainRoute] = this.$route.matched
    this.subMenus =
      this.mainMenus.find(item => item.alias_name === mainRoute?.meta?.aliasName)?.children || []
  },
  methods: {
    computedMenuIcon(item) {
      const allRoutes = this.$router.getRoutes()
      const route = allRoutes.find(route => route.meta?.aliasName === item.alias_name)
      return route?.meta?.icon || 'layout-dashboard'
    },
    handleMainMenuClick(item) {
      this.subMenus = item.children || []
    },
    handleSubMenuClick(item) {
      const allRoutes = this.$router.getRoutes()
      console.log('allRoutes:', allRoutes)
      const route = allRoutes.find(route => route.meta?.permissions?.includes(item.permission))

      if (route) {
        if (this.$route.path == route?.path) {
          return
        }
        this.$router.push({ path: route.path })
      } else {
        console.log('没有权限', item)
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
      background: hsl(var(--background-deep));
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

:deep(.el-menu-item) {
  border-radius: 6px;
  height: 42px;
  line-height: 42px;
  margin: 0 8px 2px;
  padding-right: 12px !important;
  padding-left: 34px !important;
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
