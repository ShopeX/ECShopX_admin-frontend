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
  <div class="flex w-full border-b transition-all h-full px-2">
    <SpIcon name="store" :size="20" />
    <SpIcon name="briefcase-business" :size="20" />

    <el-avatar :size="36" :src="accountAvatar" />
  </div>
</template>

<script>
export default {
  name: 'LayoutToolbar',
  computed: {
    accountAvatar() {
      return this.$store.state.user?.accountInfo?.head_portrait
    }
  }
}
</script>

<!-- <script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed } from 'vue'
// import { preferences } from '../../preferences'

const style = computed((): CSSProperties => {
  return {
    height: `${preferences.tabbar.height}px`
  }
})
</script> -->

<style scoped></style>
