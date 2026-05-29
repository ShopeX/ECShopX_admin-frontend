<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div id="page-container" class="w-full h-full p-4 bg-background-deep overflow-y-auto">
    <slot />
  </div>
</template>

<script>
import serviceImage from '@/assets/images/customer-service.jpg'
export default {
  name: 'LayoutContent',
  data() {
    return {
      serviceImage
    }
  }
}
</script>

<style lang="scss" scoped></style>
