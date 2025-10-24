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

import { isFunction } from '@/utils'
import Main from './main.vue'

export default {
  install(Vue, options = {}) {
    const Ctor = Vue.extend(Main)

    const fn = (value) => {
      const data = {
        buttonCancel: value.buttonCancel,
        buttonConfirm: value.buttonConfirm,
        isShow: true,
        size: value.size,
        value: {
          title: value.title,
          content: value.content
        },
        confirmBefore:
          value.confirmBefore ||
          (async () => {
            return true
          })
      }
      return new Promise((resolve, reject) => {
        const vm = new Ctor({
          propsData: data,
          created() {
            const teardown = () => {
              this.$destroy()
              this.$el.remove()
            }
            this.$once('close', teardown)
            this.$once('input', (val) => {
              resolve(val)
              teardown()
            })
          },
          render(h) {
            return h(
              Main,
              {
                props: data,
                on: {
                  close: () => {
                    this.$emit('close')
                  },
                  confirm: (callback) => {
                    data
                      .confirmBefore()
                      .then(() => {
                        this.$emit('input')
                      })
                      .catch(() => {
                        callback()
                      })
                  }
                }
              },
              [isFunction(data.value.content) ? h(data.value.content) : data.value.content]
            )
          }
        }).$mount()
        document.body.appendChild(vm.$el)
      })
    }

    const $dialog = {
      open: ({ title = '', content = null, confirmBefore, buttonCancel, buttonConfirm, size }) =>
        fn({ title, content, confirmBefore, buttonCancel, buttonConfirm, size })
    }

    Vue.prototype.$dialog = $dialog
  }
}
