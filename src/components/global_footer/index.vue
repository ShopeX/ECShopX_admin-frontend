<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="global_footer">
    <slot />
  </div>
</template>

<script>
export default {}
</script>

<style scoped lang="scss">
.global_footer {
  position: fixed;
  right: 0;
  bottom: 0;
  width: calc(100% - 250px);
  background: #fff;
  padding: 12px 24px;
  line-height: 44px;
  border-top: 1px solid #f0f0f0;
  box-shadow: 0 -6px 16px -8px rgba(0, 0, 0, 0.08), 0 -9px 28px 0 rgba(0, 0, 0, 0.05),
    0 -12px 48px 16px rgba(0, 0, 0, 0.03);
  transition: width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
