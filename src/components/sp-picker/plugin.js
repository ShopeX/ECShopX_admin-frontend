import Main from './main'

export default {
  install (Vue, options = {}) {
    const Ctor = Vue.extend(Main)

    const fn = ({ value }) => {
      const data = {
        value
      }
      return new Promise((resolve, reject) => {
        const vm = new Ctor({
          propsData: data,
          create () {}
        }).$mount()
        document.body.appendChild(vm.$el)
      })
    }

    const $picker = {
      image: (args) => fn({ ...args, comp: 'pickerImage' }),
      goods: fn,
      path: fn
    }

    Vue.prototype.$picker = $picker
  }
}
