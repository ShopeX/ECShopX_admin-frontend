import Vue from 'vue'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import { install as apiInstall } from '@/api'
// import { micrApp } from '@/utils/micr-app'
import VueClipboard from 'vue-clipboard2'
import { VueMasonryPlugin } from 'vue-masonry'

import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'

import { install as H5EditorInstall } from '@/utils/vue-h5-editor'

import App from './App'
import router from './router'
import store from './store'
import vueExtend from './utils/vueExtend'
import Directives from './directives'
import { install as Filter } from '@/filters'

import './style/common.scss'
import './style/index.scss'

// import fetch from '@/api/req'
import fetch from '@/utils/fetch'
import { initFinder } from '@shopex/finder'
import '@shopex/finder/lib/finder.css'
import exportTip from '@/utils/components'
import { export_open } from '@/utils'
import { SYSTEM_CONFIG } from '@/consts'
import { SpPickerPlugin } from '@/components/sp-picker'

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
H5EditorInstall(Vue)

VueClipboard.config.autoSetContainer = true // add this line
Vue.use(ElementUI)
Vue.use(Vuex)

Vue.use(VueClipboard)
Vue.use(Directives)

Vue.use(VueMasonryPlugin)

Vue.use(VueVideoPlayer)

Vue.use(Filter)

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

  console.log('components:', components)
  Object.keys(components).forEach((key) => {
    const comp = components[key]
    Vue.component(comp.name, comp)
  })
}

const installPlugin = (Vue) => {
  Object.keys(plugins).forEach((name) => {
    const plugin = plugins[name]
    Vue.use(plugin)
  })
}

installComponent(Vue)
installPlugin(Vue)
// micrApp.init()

// import fetch from './utils/fetch'

// import { Base64 } from 'js-base64';
// Vue.use( Base64 )
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
    document.body.style.setProperty('--themeColor', theme)
    document.body.style.setProperty('--themeColorRgb', [red, green, blue].join(','))
  },
  render: (h) => h(App)
}).$mount('#app')
