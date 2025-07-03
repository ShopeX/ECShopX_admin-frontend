<template>
  <div class="flex h-[50px] items-center justify-between bg-white">
    <div class="flex items-center gap-2">
      <slot />
      <!-- <Menu /> -->
      <!-- <ExIcon type="button" name="Menu" :size="20" /> -->

      <!-- 面包屑 -->
      <!-- <el-breadcrumb class="ml-2" v-if="!$slots.default">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>promotion list</el-breadcrumb-item>
      </el-breadcrumb> -->
    </div>

    <div class="flex items-center gap-2 px-3">
      <SpIcon class="p-2" button radius name="setting-two" :size="16" @click="handleSystemInfo" />

      <SpIcon
        v-if="IS_DISTRIBUTOR()"
        button
        radius
        name="shop"
        :size="16"
        @click="handleShopList"
      />
      <!-- <SpIcon name="briefcase-business" :size="20" /> -->

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
import moment from 'moment'
import { getBasePath, IS_DISTRIBUTOR } from '@/utils'
import DEFAULT_USER from '@/assets/images/default-user.png'
import config from '../../../package.json'

export default {
  name: 'LayoutHeader',
  data() {
    return {
      systemInfo: []
    }
  },
  computed: {
    accountAvatar() {
      return this.$store.state.user?.accountInfo?.head_portrait || DEFAULT_USER
    }
  },
  async mounted() {
    const res = await this.$api.company.getActivateInfo()
    this.systemInfo = [
      { label: 'COMPANY_ID', value: res.company_id },
      { label: '到期时间', value: moment(res.expired_at * 1000).format('YYYY-MM-DD HH:mm:ss') },
      { label: '管理后台', value: config.version },
      { label: 'API端', value: res.version },
      { label: 'PHP版本', value: res.php_version },
      { label: '服务器系统', value: res.os },
      { label: 'web服务器', value: res.web_server },
      { label: '数据库版本', value: res.db_version },
      { label: 'REDIS版本', value: res.redis_version },
      // { label: 'API域名', value: res.app_url },
      { label: '存储驱动', value: res.disk_driver },
      { label: 'Lumen框架', value: res.lumen_version }
    ]
  },
  methods: {
    async handleCommand(command) {
      if (command === 'logout') {
        await this.$confirm('确定退出登录吗？', '提示')
        await this.$api.login.getAuthorizelogout()
        await this.$api.login.invalidateToken()
        this.$store.commit('user/logout')
        this.$store.commit('system/logout')
        const basePath = getBasePath()
        this.$router.push(basePath ? `/${basePath}/login` : '/login')
      }
    },
    handleShopList() {
      this.$router.push('/shopadmin/shoplist')
    },
    handleSystemInfo() {
      this.$dialog.open({
        buttonConfirm: {
          visible: false
        },
        title: '系统信息',
        content: (
          <div>
            <el-descriptions column={3} border size="medium">
              {this.systemInfo.map(item => (
                <el-descriptions-item>
                  <template slot="label">{item.label}</template>
                  <span>{item.value}</span>
                </el-descriptions-item>
              ))}
            </el-descriptions>
          </div>
        ),
        size: 'medium'
      })
    }
  }
}
</script>

<style scoped></style>
