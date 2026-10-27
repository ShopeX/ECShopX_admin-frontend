<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="flex items-center justify-center gap-2">
    <!-- If you remove or alter Shopex brand identifiers, you must obtain a branding removal license from Shopex.  Contact us at:  http://www.shopex.cn to purchase a branding removal license.   -->
    <div class="style-medium size-13 text-[#B3B3B3]">Powered by</div>
    <SpImage
      :src="logoPowerBySrc"
      class="cursor-pointer mt-1"
      height="15"
      fit="contain"
      @click="openShopex"
    />
  </div>
</template>

<script>
import { resolvePublicAsset } from '@/utils'

export default {
  name: 'LicenseLogo',
  data() {
    return {
      isYD: process.env.VUE_APP_PLATFORM == 'yd',
      logoPowerBySrc: resolvePublicAsset('images/logo-powerby.png')
    }
  },
  computed: {},
  methods: {
    openShopex() {
      window.open('https://www.shopex.cn', '_blank')
    }
  }
}
</script>
