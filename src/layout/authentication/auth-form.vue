<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
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
