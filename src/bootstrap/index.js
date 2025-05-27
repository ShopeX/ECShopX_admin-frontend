import Vue from 'vue'
import VueRouter from 'vue-router'
import router from '@/router'
import store from '@/store'
import App from '@/App.vue'
import { SYSTEM_CONFIG } from '@/config'
import ElementUI from 'element-ui'
import { install as API } from '@/api'
import { installComponent } from './component'

async function bootstrap() {
  Vue.use(API)

  Vue.use(ElementUI)

  installComponent(Vue)

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
    render: (h) => h(App)
  }).$mount('#app')
}

export { bootstrap }
