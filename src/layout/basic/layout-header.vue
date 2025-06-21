<template>
  <div class="flex h-[50px] items-center justify-between">
    <div class="flex items-center gap-2">
      <slot />
      <!-- <Menu /> -->
      <!-- <ExIcon type="button" name="Menu" :size="20" /> -->

      <!-- 面包屑 -->
      <el-breadcrumb class="ml-2" v-if="!$slots.default">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>promotion list</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="flex items-center gap-2 px-3">
      <!-- <SpIcon name="store" :size="20" />
      <SpIcon name="briefcase-business" :size="20" /> -->

      <el-dropdown @command="handleCommand">
        <div class="h-[44px] w-[44px] hover:bg-gray-100 rounded-full" style="padding: 6px">
          <el-avatar :size="32" :src="accountAvatar" />
        </div>
        <el-dropdown-menu slot="dropdown" style="width: 200px">
          <el-dropdown-item>
            <div class="flex items-center gap-2">
              <SpIcon name="user" :size="16" />
              <span>个人中心</span>
            </div>
          </el-dropdown-item>
          <el-dropdown-item divided command="logout">
            <div class="flex items-center gap-2">
              <SpIcon name="logout" :size="16" />
              <span>退出登录</span>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- <GlobalSearch :menus="accessStore.accessMenus" />

      <ExIcon type="button" name="Settings" :size="20" />

      <ExIcon fill="black" type="button" name="Moon" :size="20" />

      <ExIcon type="button" name="Sun" :size="20" />

      <ExIcon type="button" name="Codesandbox" :size="20" />

      <ExIcon type="button" name="Languages" :size="20" />

      <ExIcon type="button" name="Bell" :size="20" /> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'LayoutHeader',
  computed: {
    accountAvatar() {
      return this.$store.state.user?.accountInfo?.head_portrait
    }
  },
  methods: {
    async handleCommand(command) {
      if (command === 'logout') {
        await this.$confirm('确定退出登录吗？', '提示')
        await this.$api.login.getAuthorizelogout()
        await this.$api.login.invalidateToken()
        this.$store.commit('user/logout')
        this.$store.commit('system/logout')
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style scoped></style>
