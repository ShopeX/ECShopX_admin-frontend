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
  <div>
    <slot />
    <div v-for="item in t_data" class="poster">
      <img v-if="item.imgUrl" class="i" :src="item.imgUrl">
    </div>
  </div>
</template>
<script>
export default {
  name: 'Poster',
  props: {
    data: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data() {
    return {
      t_data: this.data.data
    }
  }
}
</script>
<style lang="scss" scoped>
.poster {
  img {
    width: 100%;
  }
}
</style>
