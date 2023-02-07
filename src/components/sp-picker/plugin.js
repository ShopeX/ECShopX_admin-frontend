import Main from './main'

export default {
  install(Vue, options = {}) {
    const Ctor = Vue.extend(Main)

    const fn = (value) => {
      const data = {
        ...value,
        isShow: true
      }
      console.log('sp-picker data:', data)
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
          }
        }).$mount()
        document.body.appendChild(vm.$el)
      })
    }

    const $picker = {
      image: (args) => fn({ value: { ...args }, type: 'pickerImage', width: '1008px' }),
      video: (args) => fn({ value: { ...args }, type: 'pickerVideo', width: '855px' }),
      goods: (args) => fn({ value: { ...args }, type: 'pickerGoods', width: '1110px' }),
      shop: (args) => fn({ value: { ...args }, type: 'pickerShop' }),
      zitilist: (args) => fn({ value: { ...args }, type: 'pickerZitiList' }),
      aftersalesList: (args) => fn({ value: { ...args }, type: 'pickerAftersalesList' }),
      path: fn
    }

    Vue.prototype.$picker = $picker
  }
}
