<template>
  <div class="relative flex min-h-full w-full">
    <el-container>
      <el-aside width="250px">
        <LayoutSidebar />
      </el-aside>

      <el-container>
        <el-header height="50px">
          <LayoutHeader />
          <!-- <div class="flex justify-between items-center">
            <div></div>
            <div>
              <BasicToolbar />
            </div>
          </div> -->
          <!-- <LayoutHeader />
          < /> -->
        </el-header>

        <el-main class="!px-0 !py-0">
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
  computed: {
    footerBackground: () => {
      return require(`@/assets/images/${DEFAULT_CONFIG.footerBackground}`)
    }
  },
  mounted() {
    this.getSystemSetting()
  },
  methods: {
    async getSystemSetting() {
      const { logo } = await this.$api.system.getBrandLogo()
      this.$store.commit('system/setSystemLogo', { logo })
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
