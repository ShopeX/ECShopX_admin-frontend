import { isFunction } from '@/utils'
import Main from './main.vue'

export default {
  install(Vue, options = {}) {
    const Ctor = Vue.extend(Main)

    const fn = value => {
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
            this.$once('input', val => {
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
                  confirm: callback => {
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
