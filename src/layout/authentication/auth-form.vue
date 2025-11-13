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
  <div class="bg-white px-20 py-16 shadow-lg rounded-[16px]">
    <!-- <slot></slot> -->
    <router-view v-slot="{ Component, route }">
      <Transition>
        <KeepAlive>
          <component :is="Component" />
        </KeepAlive>
      </Transition>
    </router-view>
  </div>
</template>

<script>
export default {
  name: 'AuthForm'
}
</script>

<style lang="scss" scoped>
  .page-login {
    .bg-white {
      box-shadow: 0 0 30px 20px rgba(0, 0, 0, .2);
    }
    ::v-deep .el-form-item__label {
      font-weight: 500;
    }
  } 
</style>
