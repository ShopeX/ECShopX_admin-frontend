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
<!-- layouts/DynamicLayout.vue -->
<template>
  <component :is="currentLayout">
    <slot />
  </component>
</template>

<script>
import DefaultLayout from './layout.vue'
import EmptyLayout from './layout-empty.vue'

export default {
  components: {
    DefaultLayout,
    EmptyLayout
  },
  computed: {
    currentLayout() {
      // 根据路由元信息选择布局
      switch (this.$route.meta.layout) {
        case 'empty':
          return 'EmptyLayout'
        default:
          return 'DefaultLayout'
      }
    }
  }
}
</script>
