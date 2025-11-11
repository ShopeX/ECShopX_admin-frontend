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
  <div class="flex items-center gap-2">
    <template v-if="!isYD"    >
    <div class="style-medium size-13 text-[#B3B3B3]"> ECShopX © Licensed under <span class="cursor-pointer border-b border-gray-300" @click="openLicense">Apache 2.0</span> · Powered by </div>
    <SpImage :src="footerBackground" class="cursor-pointer mt-1" height="15" fit="contain" @click="openShopex" />
  </template>
  </div>
</template>

<script>
import { getBasePath } from '@/utils'

export default {
  name: 'LicenseLogo',
  data(){
    return {
      isYD:process.env.VUE_APP_PLATFORM == 'yd'
    }
  },
  computed: {
    footerBackground: () => {
      return require(`@/assets/svgs/logo.svg`)
    }
  },
  methods: {
    openLicense() {
      const basePath = getBasePath()
      window.open(`${basePath ? `/${basePath}` : ''}/license`, '_blank')
    },
    openShopex() {
      window.open('https://www.shopex.cn', '_blank')
    }
  }
}
</script>