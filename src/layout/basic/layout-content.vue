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
  <el-container class="h-full">
    <el-container class="h-full">
      <div id="page-container" class="w-full h-full bg-background-deep overflow-y-auto">
        <slot />
      </div>
    </el-container>
    <el-aside v-if="!VUE_APP_FREE" class="bg-white h-full" width="50px">
      <div class="flex flex-col items-center justify-center gap-4">
        <el-popover placement="left" width="200" trigger="click">
          <div slot="reference">
            <SpIcon button class="bg-gray-100" name="headset" size="16" />
            <div class="text-xs text-center mt-1">售前</div>
          </div>
          <div>
            <SpImage :src="serviceImage" height="200" fit="contain" />
          </div>
        </el-popover>
      </div>
    </el-aside>
  </el-container>
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
