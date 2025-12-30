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

  if (typeof document !== 'undefined') {
    const setFormLabelPosition = (formEl) => {
      const hasLabelPosition = formEl.classList.contains('el-form--label-left')
      if (!hasLabelPosition) {
        formEl.classList.add('el-form--label-right')
      }
    }

    // 处理所有已存在的 el-form
    const processExistingForms = () => {
      const isRTL =
        document.documentElement.getAttribute('dir') === 'rtl' ||
        document.documentElement.getAttribute('lang') === 'ar-SA'

      if (isRTL) {
        const forms = document.querySelectorAll('.el-form')
        forms.forEach(setFormLabelPosition)
      }
    }

    // 初始处理
    Vue.nextTick(() => {
      processExistingForms()
    })

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver((mutations) => {
      const isRTL =
        document.documentElement.getAttribute('dir') === 'rtl' ||
        document.documentElement.getAttribute('lang') === 'ar-SA'

      if (!isRTL) return

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            // Element node
            // 检查是否是 el-form
            if (node.classList && node.classList.contains('el-form')) {
              Vue.nextTick(() => {
                setFormLabelPosition(node)
              })
            }
            // 检查子元素中是否有 el-form
            const forms = node.querySelectorAll?.('.el-form') || []
            forms.forEach((form) => {
              Vue.nextTick(() => {
                setFormLabelPosition(form)
              })
            })
          }
        })
      })
    })

    // 开始观察
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    // 监听语言变化
    const langObserver = new MutationObserver(() => {
      Vue.nextTick(() => {
        processExistingForms()
      })
    })

    langObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['dir', 'lang']
    })
  }

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
