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
      image: (args) => fn({ value: { ...args }, type: 'pickerImage', width: '788px' }),
      goods: (args) => fn({ value: { ...args }, type: 'pickerGoods', width: '1110px' }),
      goodsList: (args) => fn({ value: { ...args }, type: 'pickerGoodsList', width: '1110px' }),
      goodsSku: (args) => fn({ value: { ...args }, type: 'pickerGoodsSku' }),
      shop: (args) => fn({ value: { ...args }, type: 'pickerShop' }),
      zitiList: (args) => fn({ value: { ...args }, type: 'pickerZitiList' }),
      afterSalesList: (args) => fn({ value: { ...args }, type: 'pickerAfterSalesList' }),
      template: (args) => fn({ value: { ...args }, type: 'pickerTemplate' }),
      company: (args) => fn({ value: { ...args }, type: 'pickerCompany' }),
      path: fn
    }

    Vue.prototype.$picker = $picker
  }
}
