// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------

import Vue from 'vue'
import VueRouter from 'vue-router'
import router from '@/router'
import store from '@/store'
import App from '@/App.vue'
import { SYSTEM_CONFIG } from '@/config'
import ElementUI from 'element-ui'
import VueClipboard from 'vue-clipboard2'
import VueVideoPlayer from 'vue-video-player'

import { install as API } from '@/api'
import { install as Filter } from '@/filters'
import { install as Directives } from '@/directives'
import { VuePrototype, unmountGlobalLoading } from '@/utils'
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

  unmountGlobalLoading()
}

export { bootstrap }
