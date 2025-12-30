<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
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
