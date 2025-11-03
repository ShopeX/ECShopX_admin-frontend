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
  <div class="relative flex min-h-full w-full">
    <el-container>
      <el-aside class="!w-auto">
        <LayoutSidebar @change="handleSidebarChange" />
      </el-aside>

      <el-container>
        <el-header height="50px">
          <LayoutHeader>
            <div
              class="light flex h-full items-center text-xl px-3 text-[#333]"
              v-if="!showSubMenu"
            >
              {{ systemTitle }}
            </div>
          </LayoutHeader>
          <!-- <div class="flex justify-between items-center">
            <div></div>
            <div>
              <BasicToolbar />
            </div>
          </div> -->
          <!-- <LayoutHeader />
          < /> -->
        </el-header>

        <el-main class="!px-0 !py-0" style="height: calc(100vh - 100px)">
          <LayoutContent v-if="!$route.path.includes('/decoration/web/template/edit')">
            <!-- <RouterView /> -->
            <router-view v-slot="{ Component }">
              <Transition name="fade" appear mode="out-in">
                <component :is="Component" />
              </Transition>
            </router-view>
          </LayoutContent>

          <div id="design-view" v-else class="relative h-full" />
        </el-main>

        <el-footer class="flex justify-center items-center gap-2" height="50px">
          <LicenseLogo />
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import DEFAULT_CONFIG from '@/config'
import { getSystemTitle } from '@/utils'
import { micrApp } from '@/utils/micr-app'
import LayoutSidebar from './layout-sidebar.vue'
import LayoutContent from './layout-content.vue'
import LayoutHeader from './layout-header.vue'
import BasicToolbar from './layout-toolbar.vue'
import EmptyLayout from './layout-empty.vue'
import LicenseLogo from '@/layout/basic/components/license-logo'
export default {
  components: {
    LayoutSidebar,
    LayoutContent,
    LayoutHeader,
    BasicToolbar,
    EmptyLayout,
    LicenseLogo
  },
  data() {
    return {
      refresh: true,
      showSubMenu: false
    }
  },
  computed: {
    systemTitle: () => {
      return getSystemTitle()
    }
  },
  mounted() {
    this.getSystemSetting()
    micrApp.init()
  },
  methods: {
    async getSystemSetting() {
      const { logo } = await this.$api.system.getBrandLogo()
      this.$store.commit('system/setSystemLogo', { logo })
    },
    handleSidebarChange(val) {
      this.showSubMenu = val
    }
  }
}
</script>

<style scoped lang="scss">
.el-header {
  padding-left: 8px;
  padding-right: 0;
}
</style>
