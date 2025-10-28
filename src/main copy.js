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
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import { install as apiInstall } from '@/api'
import VueClipboard from 'vue-clipboard2'

import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'

import App from './App'
import router from './router'
import store from './store'
import vueExtend from './utils/src/prototype'
import Directives from './directives'
import { install as Filter } from '@/filters'

// import './style/common.scss'
// import './style/index.scss'

import { fetch } from './request'
import { initFinder } from '@shopex/finder'
import '@shopex/finder/lib/finder.css'
import exportTip from '@/utils/components'
import { export_open } from '@/utils'
import { SYSTEM_CONFIG } from '@/consts'
import { SpPickerPlugin } from '@/components/sp-picker'

import './styles/index.scss'

Vue.use(exportTip)
initFinder(Vue, {
  fetchLibrary: fetch,
  context: {
    qs: false,
    globalHooks: {
      beforeQuery: (p) => {
        let params = {
          ...p,
          pageSize: p.pageSize,
          page: p.pageNum,
          finderId: 100
        }
        // delete params.pageSize
        delete params.pageNum
        return params
      },
      afterQuery: (response) => {
        const { status_code, message } = response.data.data
        if (status_code == 500) {
          return Vue.prototype.$message.error(message)
        } else {
          return {
            ...response.data.data,
            count: parseInt(response.data.data.total_count)
          }
        }
      }
    }
  }
})

apiInstall(Vue)
// H5EditorInstall(Vue)

VueClipboard.config.autoSetContainer = true // add this line
Vue.use(ElementUI)
Vue.use(Vuex)

Vue.use(VueClipboard)
Vue.use(Directives)

Vue.use(VueVideoPlayer)

Vue.use(Filter)
Vue.use(VueRouter)

const plugins = {
  SpPickerPlugin
}

const installComponent = (Vue) => {
  const baseContext = require.context('./components', true, /index(\.vue|\.js)$/)
  const components = {}
  function resloveModule(mod) {
    Object.keys(mod).forEach((key) => {
      mod[key].name && (components[mod[key].name] = mod[key])
    })
  }

  baseContext.keys().forEach((key) => {
    const mod = baseContext(key)
    resloveModule(mod)
  })

  console.log('components:', components, plugins)
  Object.keys(components).forEach((key) => {
    const comp = components[key]
    Vue.component(comp.name, comp)
  })

  Object.keys(plugins).forEach((name) => {
    const plugin = plugins[name]
    Vue.use(plugin)
  })
}

const installPlugin = (Vue) => {
  Object.keys(plugins).forEach((name) => {
    const plugin = plugins[name]
    Vue.use(plugin)
  })
}

// installComponent(Vue)
installPlugin(Vue)

Vue.config.productionTip = false
Vue.prototype.$export_open = export_open
new Vue({
  router,
  store,
  mounted() {
    const { theme } = SYSTEM_CONFIG[store.getters.versionMode]
    const red = parseInt(theme.replace('#', '').slice(0, 2), 16)
    const green = parseInt(theme.replace('#', '').slice(2, 4), 16)
    const blue = parseInt(theme.replace('#', '').slice(4, 6), 16)
    console.log(theme)
    document.body.style.setProperty('--themeColor', theme)
    document.body.style.setProperty('--themeColorRgb', [red, green, blue].join(','))
  },
  render: (h) => h(App)
}).$mount('#app')
