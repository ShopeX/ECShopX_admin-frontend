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
Vue.use(exportTip)
initFinder(Vue, {
  fetchLibrary: fetch,
  context: {
    qs: false,
    globalHooks: {
      beforeQuery: (p) => {
        let params = {
          ...p,
          page_size: p.pageSize,
          page: p.pageNum,
          finderId: 100
        }
        delete params.pageSize
        delete params.pageNum
        return params
      },
      afterQuery:(response)=>{
        const { status_code, message } = response.data.data
        if (status_code == 500) {
          return Vue.prototype.$message.error(message)
        } else {
          return {
            ...response.data.data,
            count: response.data.data.total_count,
          }
        }
      }
    },
    
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

installComponent(Vue)
// micrApp.init()

// import fetch from './utils/fetch'

// import { Base64 } from 'js-base64';
// Vue.use( Base64 )

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
