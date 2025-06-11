import Vue from 'vue'
import VueRouter from 'vue-router'
import router from '@/router'
import store from '@/store'
import App from '@/App.vue'
import { SYSTEM_CONFIG } from '@/config'
import ElementUI from 'element-ui'
import VueClipboard from 'vue-clipboard2'
import { install as API } from '@/api'
import { install as Filter } from '@/filters'
import { install as Directives } from '@/directives'
import { VuePrototype } from '@/utils'
import { install as Component } from './component'
import { install as Finder } from './finder'

async function bootstrap() {
  Vue.use(API)

  Vue.use(ElementUI)

  Vue.use(Filter)

  Vue.use(Directives)

  Vue.use(Component)

  Vue.use(VuePrototype)

  Vue.use(Finder)

  Vue.use(VueClipboard)

  new Vue({
    router,
    store,
    mounted() {
      // const { theme } = SYSTEM_CONFIG[store.getters.versionMode]
      // const red = parseInt(theme.replace('#', '').slice(0, 2), 16)
      // const green = parseInt(theme.replace('#', '').slice(2, 4), 16)
      // const blue = parseInt(theme.replace('#', '').slice(4, 6), 16)
      // console.log(theme)
      // document.body.style.setProperty('--themeColor', theme)
      // document.body.style.setProperty('--themeColorRgb', [red, green, blue].join(','))
    },
    render: h => h(App)
  }).$mount('#app')
}

export { bootstrap }
