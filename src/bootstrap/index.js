/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import router from '@/router'
import store from '@/store'
import App from '@/App.vue'
import ElementUI from 'element-ui'
import VueClipboard from 'vue-clipboard2'
import VueVideoPlayer from 'vue-video-player'

import { install as API } from '@/api'
import { install as Filter } from '@/filters'
import { install as Directives } from '@/directives'
import { VuePrototype } from '@/utils'
import { install as Finder } from './finder'
import { install as Component } from './component'

async function bootstrap() {
  Vue.use(API)

  Vue.use(ElementUI)

  Vue.use(Filter)

  Vue.use(Directives)

  Vue.use(Finder)

  Vue.use(Component)

  Vue.use(VuePrototype)

  Vue.use(VueClipboard)

  Vue.use(VueVideoPlayer)

  // 将 store 挂载到 globalThis，以便全局访问
  globalThis.$store = store

  new Vue({
    router,
    store,
    mounted() {},
    render: (h) => h(App)
  }).$mount('#app')
}

export { bootstrap }
