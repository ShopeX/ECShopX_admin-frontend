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
  <transition name="fade" mode="out-in">
    <storeDefault v-if="template_name === 'yykweishop'" />
    <marketingGroup v-if="template_name !== 'yykweishop'" />
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import storeDefault from '@/view/wxapp/cartremind'
import marketingGroup from '@/view/wxapp/template/marketing/group'

export default {
  components: {
    storeDefault: storeDefault,
    marketingGroup: marketingGroup
  },
  data() {
    return {
      activeIndex: '',
      currentCode: '',
      wxapps: []
    }
  },
  computed: {
    ...mapGetters(['template_name'])
  }
}
</script>
