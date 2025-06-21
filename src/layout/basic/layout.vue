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
          <LayoutContent>
            <RouterView />
          </LayoutContent>
        </el-main>

        <el-footer class="flex justify-center items-center" height="50px">
          <SpImage :src="footerBackground" height="28" fit="contain" />
        </el-footer>
      </el-container>
    </el-container>

    <!--
    <div class="flex flex-1 flex-col overflow-hidden">
      <div>





      </div>
    </div> -->
  </div>
</template>

<script>
import DEFAULT_CONFIG from '@/config'
import LayoutSidebar from './layout-sidebar.vue'
import LayoutContent from './layout-content.vue'
import LayoutHeader from './layout-header.vue'
import BasicToolbar from './layout-toolbar.vue'

export default {
  components: {
    LayoutSidebar,
    LayoutContent,
    LayoutHeader,
    BasicToolbar
  },
  data() {
    return {
      showSubMenu: false
    }
  },
  computed: {
    footerBackground: () => {
      return require(`@/assets/images/${DEFAULT_CONFIG.footerBackground}`)
    },
    systemTitle: () => {
      return DEFAULT_CONFIG.systemTitle
    }
  },
  mounted() {
    this.getSystemSetting()
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
