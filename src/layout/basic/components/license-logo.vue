<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="flex items-center justify-center gap-2">
    <div class="style-medium size-13 text-[#B3B3B3]">
      <!-- ECShopX © Licensed under
      <span class="cursor-pointer border-b border-gray-300" @click="openLicense">Apache 2.0</span> · -->
      Powered by
    </div>
    <SpImage
      :src="footerBackground"
      class="cursor-pointer mt-1"
      height="15"
      fit="contain"
      @click="openShopex"
    />
  </div>
</template>

<script>
import { getBasePath } from '@/utils'

export default {
  name: 'LicenseLogo',
  data() {
    return {
      isYD: process.env.VUE_APP_PLATFORM == 'yd'
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
