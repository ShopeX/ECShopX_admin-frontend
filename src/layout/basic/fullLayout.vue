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
  <div class="relative flex min-h-full w-full">
    <el-container>
      <router-view v-slot="{ Component }">
        <Transition name="fade" appear mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </el-container>
  </div>
</template>

<script>
export default {}
</script>

<style scoped lang="scss">
.el-header {
  padding-left: 8px;
  padding-right: 0;
}
</style>
