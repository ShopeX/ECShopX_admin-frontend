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
  <el-dropdown @command="handleCommand" trigger="click">
    <SpIcon class="p-2" button radius name="translate" :size="16">
      <slot />
    </SpIcon>

    <el-dropdown-menu slot="dropdown" style="width: 130px">
      <el-dropdown-item v-for="item in languageList" :key="item.value" :command="item.value">
        <div class="flex items-center gap-1">
          <div class="w-[14px] h-[14px] flex items-center justify-center">
            <SpIcon v-show="lang === item.value" name="dot" :size="14" />
          </div>
          <span>{{ item.label }}</span>
        </div>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import i18n from '@/i18n'
import { getBasePath } from '@/utils'
export default {
  name: 'SpLanguage',
  data() {
    const languageList = Object.keys(i18n).map((key) => ({
      label: i18n[key],
      value: key
    }))
    return {
      languageList
    }
  },
  computed: {
    lang() {
      return this.$store.state.system.lang
    }
  },
  methods: {
    async handleCommand(command) {
      const basePath = getBasePath()
      window.localStorage.setItem('lang', command)
      await this.$store.commit('system/updateLang', { lang: command })
      console.log('command', this.$route.path)
      if (this.$route.path != (basePath ? `/${basePath}/login` : '/login')) {
        await this.$store.dispatch('user/fetchAccessMenus')
        await this.$store.dispatch('user/fetchAccountInfo')
      }
      window.location.reload()
    }
  }
}
</script>

<style lang="scss" scoped></style>
