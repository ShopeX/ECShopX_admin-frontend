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
      <!-- <SpIcon class="p-2" button radius name="translate" :size="16" @click="handleSystemInfo" /> -->

      <SpLanguage />

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
          <el-dropdown-item command="user-center">
            <div class="flex items-center gap-2">
              <SpIcon name="user" :size="16" />
              <span>个人中心</span>
            </div>
          </el-dropdown-item>
          <el-dropdown-item command="password">
            <div class="flex items-center gap-2">
              <SpIcon name="key" :size="16" />
              <span>修改密码</span>
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
import UserInfo from './components/user-info.vue'
import ChangePassword from './components/change-password.vue'
import config from '../../../package.json'

export default {
  name: 'LayoutHeader',
  data() {
    return {
      systemInfo: []
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
            text: '保存'
          },
          title: '个人信息',
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
        if (this.accountInfo.logintype === 'admin') {
          window.location.href = 'https://account.shopex.cn/account/security'
        } else {
          await this.$dialog.open({
            title: '修改密码',
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
        title: '系统信息',
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
