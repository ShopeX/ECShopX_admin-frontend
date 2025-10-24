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
  <div class="hover-delete" @mouseenter="hovering = true" @mouseleave="hovering = false">
    <slot />
    <div v-if="hovering" class="hover-cover" @click="handleClick">
      <i class="el-icon-delete-solid" @click="$emit('delete')" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hovering: false
    }
  },
  methods: {
    handleClick: function (e) {
      e.stopPropagation()
    }
  }
}
</script>

<style lang="scss">
.hover-delete {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .hover-cover {
    position: absolute;
    inset: 0 0 0 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;

    .el-icon-delete-solid {
      color: white;
      font-size: 20px;
    }
  }
}
</style>
