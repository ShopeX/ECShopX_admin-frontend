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
    <MallList v-if="store" :rel-store="store" />
  </div>
</template>

<script>
import MallList from '@/components/function/mallList'
export default {
  components: {
    MallList
  },
  data() {
    return {
      store: null
    }
  },
  mounted() {
    const { distributor_id, address, name } = this.$route.query
    this.store = {
      id: distributor_id,
      address,
      name
    }
  }
}
</script>
