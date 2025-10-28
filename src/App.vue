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
  <div id="app">
    <!-- <Transition name="fade" appear mode="out-in" @before-enter="beforeEnter"
    @after-enter="afterEnter">
      <router-view />
    </Transition> -->

    <router-view v-slot="{ Component }">
      <Transition
        name="fade"
        appear
        mode="out-in"
        @before-enter="beforeEnter"
        @after-enter="afterEnter"
      >
        <component :is="Component" />
      </Transition>
    </router-view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Config from '@/config'
import { getSystemTitle } from '@/utils'
export default {
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {
    document.title = getSystemTitle()
  },
  methods: {
    beforeEnter(el) {
      console.log('beforeEnter', el)
    },
    afterEnter(el) {
      console.log('afterEnter', el)
    }
  }
}
</script>

<style lang="scss">
// .fade-transition-enter-active,
// .fade-transition-leave-active {
//   transition: opacity 0.2s ease-in-out;
// }

// .fade-transition-enter-from,
// .fade-transition-leave-to {
//   opacity: 0;
// }

// .fade-enter-active,
// .fade-leave-active {
//   // transition: opacity 1s ease-in-out;
// }

// .fade-enter-from,
// .fade-leave-to {
//   opacity: 0;
// }
</style>
