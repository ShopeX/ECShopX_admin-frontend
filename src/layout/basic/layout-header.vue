<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

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
      <MenuSearch />
      <div class="text-[#B3B3B3] text-[13px] mx-2">|</div>
      <!-- <SpIcon class="p-2" button radius name="translate" :size="16" @click="handleSystemInfo" /> -->

      <SpLanguage>
        <span class="text-[13px] ml-1">{{ currentLang }}</span>
      </SpLanguage>

      <div class="text-[#B3B3B3] text-[13px] mx-2">|</div>

      <el-dropdown @command="handleCommand">
        <div
          class="h-[36px] hover:bg-gray-100 rounded-full flex items-center justify-center"
          style="padding: 6px"
        >
          <el-avatar :size="24" :src="accountAvatar" />
          <span class="text-[13px] ml-1">{{ accountInfo.username }}</span>
        </div>
        <el-dropdown-menu slot="dropdown" style="width: 200px">
          <el-dropdown-item command="user-center">
            <div class="flex items-center gap-2">
              <SpIcon name="user" :size="16" />
              <span>{{ $t('3282e396.409120') }}</span>
            </div>
          </el-dropdown-item>
          <el-dropdown-item command="password">
            <div class="flex items-center gap-2">
              <SpIcon name="key" :size="16" />
              <span>{{ $t('3282e396.7fc88a') }}</span>
            </div>
          </el-dropdown-item>
          <el-dropdown-item divided command="logout">
            <div class="flex items-center gap-2">
              <SpIcon name="logout" :size="16" />
              <span>{{ $t('3282e396.44efd1') }}</span>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <div v-if="IS_DISTRIBUTOR()" class="text-[#B3B3B3] text-[13px] mx-2">|</div>

      <SpIcon
        v-if="IS_DISTRIBUTOR()"
        button
        radius
        name="shop"
        :size="16"
        @click="handleShopList"
      />

      <div class="text-[#B3B3B3] text-[13px] mx-2">|</div>

      <SpIcon class="p-2" button radius name="info" :size="16" @click="handleSystemInfo">
        <span class="text-[13px] ml-1">{{ $t('3282e396.b7ea5e') }}</span>
      </SpIcon>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getBasePath, IS_DISTRIBUTOR } from '@/utils'
import DEFAULT_USER from '@/assets/images/default-user.png'
import i18n from '@/i18n'
import UserInfo from './components/user-info.vue'
import SYSTEM_CONFIG from '@/config'
import ChangePassword from './components/change-password.vue'
import config from '../../../package.json'
import MenuSearch from './components/menu-search.vue'

export default {
  name: 'LayoutHeader',
  components: {
    MenuSearch
  },
  data() {
    return {
      systemInfo: [],
      currentLang: ''
    }
  },
  computed: {
    accountInfo() {
      return this.$store.state.user.accountInfo
    },
    accountAvatar() {
      return this.$store.state.user.accountInfo?.head_portrait || DEFAULT_USER
    }
  },
  async mounted() {
    const res = await this.$api.company.getActivateInfo()
    this.systemInfo = [
      { label: 'COMPANY_ID', value: res.company_id },
      {
        label: this.$t('3282e396.22e888'),
        value: moment(res.expired_at * 1000).format('YYYY-MM-DD HH:mm:ss')
      },
      { label: this.$t('3282e396.ec58b1'), value: config.version },
      { label: this.$t('3282e396.21a55d'), value: res.version },
      { label: this.$t('3282e396.b5441a'), value: res.php_version },
      { label: this.$t('3282e396.defd5b'), value: res.os },
      { label: this.$t('3282e396.db055e'), value: res.web_server },
      { label: this.$t('3282e396.3dbe51'), value: res.db_version },
      { label: this.$t('3282e396.5da695'), value: res.redis_version },
      // { label: 'API域名', value: res.app_url },
      { label: this.$t('3282e396.dc935e'), value: res.disk_driver },
      { label: this.$t('3282e396.358523'), value: res.lumen_version },
      { label: this.$t('3282e396.ff6855'), value: SYSTEM_CONFIG.productName }
    ]

    this.currentLang = i18n[this.$store.state.system.lang]
  },
  methods: {
    async handleCommand(command) {
      if (command === 'logout') {
        await this.$confirm(this.$t('3282e396.980e0f'), this.$t('3282e396.02d981'))
        this.handleLogout()
      } else if (command === 'user-center') {
        const userInfo = {
          account: this.accountInfo.mobile,
          nickname: this.accountInfo.username,
          avatar: this.accountInfo.head_portrait || ''
        }
        console.log('accountInfo', userInfo)
        await this.$dialog.open({
          buttonConfirm: {
            text: this.$t('3282e396.be5fbb')
          },
          title: this.$t('3282e396.eab129'),
          content: <UserInfo ref='userInfoForm' value={userInfo} />,
          size: 'mini',
          confirmBefore: async () => {
            try {
              await this.$refs.userInfoForm.onSubmit()
              setTimeout(async () => {
                this.handleLogout()
              }, 1000)
            } catch (error) {
              throw new Error(error)
            }
          }
        })
      } else if (command === 'password') {
        await this.$dialog.open({
          title: this.$t('3282e396.7fc88a'),
          content: <ChangePassword ref='changePasswordForm' />,
          size: 'mini',
          confirmBefore: async () => {
            try {
              await this.$refs.changePasswordForm.onSubmit()
              setTimeout(async () => {
                this.handleLogout()
              }, 1000)
            } catch (error) {
              throw new Error(error)
            }
          }
        })
      }
    },
    async handleLogout() {
      const basePath = getBasePath()
      await this.$api.login.getAuthorizelogout()
      await this.$api.login.invalidateToken()
      this.$store.commit('user/logout')
      this.$store.commit('system/logout')
      this.$router.push(basePath ? `/${basePath}/login` : '/login')
    },
    handleShopList() {
      this.$router.push('/shopadmin/shoplist')
    },
    handleSystemInfo() {
      this.$dialog.open({
        buttonConfirm: {
          visible: false
        },
        title: this.$t('3282e396.b7ea5e'),
        content: (
          <div>
            <el-descriptions column={3} border size='medium'>
              {this.systemInfo.map((item) => (
                <el-descriptions-item>
                  <template slot='label'>{item.label}</template>
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
