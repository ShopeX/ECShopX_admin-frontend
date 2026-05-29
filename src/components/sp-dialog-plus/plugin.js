/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { isFunction } from '@/utils'
import Main from './main.vue'

export default {
  install(Vue, options = {}) {
    const Ctor = Vue.extend(Main)

    const fn = (value, parent) => {
      const data = {
        buttonCancel: value.buttonCancel,
        buttonConfirm: value.buttonConfirm,
        isShow: true,
        size: value.size,
        value: {
          title: value.title,
          content: value.content
        },
        ...(value.width ? { width: value.width } : {}),
        confirmBefore:
          value.confirmBefore ||
          (async () => {
            return true
          })
      }
      return new Promise((resolve, reject) => {
        const vm = new Ctor({
          parent: parent || undefined,
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
            const inner =
              data.value.content == null
                ? []
                : [isFunction(data.value.content) ? h(data.value.content) : data.value.content]
            // 作为 Main 的默认插槽传入（与 body 具名插槽在 main.vue 内一并渲染，避免二选一误判）
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
              inner
            )
          }
        }).$mount()
        document.body.appendChild(vm.$el)
      })
    }

    const openComponent = (component, options = {}, parent) => {
      const {
        title = '',
        props = {},
        width,
        size,
        buttonCancel,
        buttonConfirm,
        confirmBefore
      } = options
      const data = {
        buttonCancel,
        buttonConfirm,
        isShow: true,
        size,
        ...(width ? { width } : {}),
        value: {
          title,
          content: null
        }
      }

      return new Promise((resolve) => {
        let contentVm
        const vm = new Ctor({
          parent: parent || undefined,
          propsData: data,
          created() {
            const teardown = () => {
              this.$destroy()
              this.$el.remove()
            }
            this.$once('close', () => {
              resolve(null)
              teardown()
            })
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
                    const submit = () => {
                      const dialogContent = this.$refs.dialogContent || contentVm
                      if (dialogContent && typeof dialogContent.submit === 'function') {
                        dialogContent.submit()
                        callback()
                        return
                      }
                      callback()
                    }
                    if (confirmBefore) {
                      confirmBefore()
                        .then(submit)
                        .catch(() => callback())
                      return
                    }
                    submit()
                  }
                }
              },
              [
                h(component, {
                  props,
                  on: {
                    close: (val) => {
                      this.$emit('input', val)
                    }
                  },
                  ref: 'dialogContent'
                })
              ]
            )
          },
          mounted() {
            contentVm = this.$refs.dialogContent
          }
        }).$mount()
        document.body.appendChild(vm.$el)
      })
    }

    const createDialogMethods = (parent) => ({
      open(componentOrOptions, options) {
        if (options === undefined) {
          return fn(componentOrOptions, parent)
        }
        const component = componentOrOptions.component || componentOrOptions
        return openComponent(component, options, parent)
      }
    })

    Object.defineProperty(Vue.prototype, '$dialog', {
      get() {
        return createDialogMethods(this)
      },
      configurable: true
    })
  }
}
