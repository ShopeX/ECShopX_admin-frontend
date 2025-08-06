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
      image: (args) => fn({ value: { ...args }, type: 'pickerImage' }),
      film: (args) => fn({ value: { ...args }, type: 'pickerFilm', width: '788px' }),
      coupon: (args) => fn({ value: { ...args }, type: 'pickerCoupon' }),
      couponPackage: (args) => fn({ value: { ...args }, type: 'pickerCouponPackage' }),
      video: (args) => fn({ value: { ...args }, type: 'pickerVideo', width: '855px' }),
      goods: (args) => fn({ value: { ...args }, type: 'pickerGoods', width: '1110px' }),
      goodsList: (args) => fn({ value: { ...args }, type: 'pickerGoodsList', width: '1110px' }),
      goodsitem: (args) => fn({ value: { ...args }, type: 'pickerGoodsItem' }),
      goodsSku: (args) => fn({ value: { ...args }, type: 'pickerGoodsSku' }),
      goodsParams: (args) => fn({ value: { ...args }, type: 'pickerGoodsParams' }),
      zitiList: (args) => fn({ value: { ...args }, type: 'pickerZitiList' }),
      afterSalesList: (args) => fn({ value: { ...args }, type: 'pickerAfterSalesList' }),
      template: (args) => fn({ value: { ...args }, type: 'pickerTemplate' }),
      company: (args) => fn({ value: { ...args }, type: 'pickerCompany' }),
      shop: (args) => fn({ value: { ...args }, type: 'pickerShop' }),
      seckill: (args) => fn({ value: { ...args }, type: 'pickerSeckill' }),
      path: (args) => fn({ value: { ...args }, type: 'pickerPath' }),
      tag: (args) => fn({ value: { ...args }, type: 'pickerTag' }),
      shopTag: (args) => fn({ value: { ...args }, type: 'pickerShopTag' }),
      editBoard: (args) => fn({ value: { ...args }, type: 'pickerEditBoard', width: '892px' }),
      planting: (args) => fn({ value: { ...args }, type: 'pickerPlanting' }),
      pages: (args) => fn({ value: { ...args }, type: 'pickerPages' })
    }

    Vue.prototype.$picker = $picker
  }
}
