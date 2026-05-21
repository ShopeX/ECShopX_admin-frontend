/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Main from './main'

export default {
  install(Vue, options = {}) {
    const Ctor = Vue.extend(Main)

    const fn = (value, parent) => {
      const data = {
        ...value,
        isShow: true
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
          }
        }).$mount()
        document.body.appendChild(vm.$el)
      })
    }

    const createPickerMethods = (parent) => ({
      image: (args) => fn({ value: { ...args }, type: 'pickerImage' }, parent),
      film: (args) => fn({ value: { ...args }, type: 'pickerFilm', width: '788px' }, parent),
      coupon: (args) => fn({ value: { ...args }, type: 'pickerCoupon' }, parent),
      couponPackage: (args) => fn({ value: { ...args }, type: 'pickerCouponPackage' }, parent),
      video: (args) => fn({ value: { ...args }, type: 'pickerVideo', width: '855px' }, parent),
      goods: (args) => fn({ value: { ...args }, type: 'pickerGoods', width: '1110px' }, parent),
      goodsList: (args) =>
        fn({ value: { ...args }, type: 'pickerGoodsList', width: '1110px' }, parent),
      goodsitem: (args) =>
        fn({ value: { ...(args || {}), type: 'pickerGoodsItem' }, type: 'pickerGoodsItem' }, parent),
      goodsSku: (args) => fn({ value: { ...args }, type: 'pickerGoodsSku' }, parent),
      goodsParams: (args) => fn({ value: { ...args }, type: 'pickerGoodsParams' }, parent),
      supplier: (args) => fn({ value: { ...args }, type: 'pickerSupplier' }, parent),
      zitiList: (args) => fn({ value: { ...args }, type: 'pickerZitiList' }, parent),
      afterSalesList: (args) => fn({ value: { ...args }, type: 'pickerAfterSalesList' }, parent),
      template: (args) => fn({ value: { ...args }, type: 'pickerTemplate' }, parent),
      company: (args) => fn({ value: { ...args }, type: 'pickerCompany' }, parent),
      shop: (args) => fn({ value: { ...args }, type: 'pickerShop' }, parent),
      seckill: (args) => fn({ value: { ...args }, type: 'pickerSeckill' }, parent),
      path: (args) => fn({ value: { ...args }, type: 'pickerPath' }, parent),
      tag: (args) => fn({ value: { ...args }, type: 'pickerTag' }, parent),
      shopTag: (args) => fn({ value: { ...args }, type: 'pickerShopTag' }, parent),
      editBoard: (args) =>
        fn({ value: { ...args }, type: 'pickerEditBoard', width: '892px' }, parent),
      planting: (args) => fn({ value: { ...args }, type: 'pickerPlanting' }, parent),
      pages: (args) => fn({ value: { ...args }, type: 'pickerPages' }, parent),
      widget: (args) => fn({ value: { ...args }, type: 'pickerWidget' }, parent),
      lottery: (args) => fn({ value: { ...args }, type: 'pickerLottery' }, parent),
      couponV2: (args) => fn({ value: { ...args }, type: 'pickerCouponV2' }, parent),
      saleCategory: (args) => fn({ value: { ...args }, type: 'pickerSaleCategory' }, parent),
      category: (args) => fn({ value: { ...args }, type: 'pickerCategory' }, parent),
      crowds: (args) => fn({ value: { ...args }, type: 'pickerCrowds' }, parent),
      store: (args) => fn({ value: { ...args }, type: 'pickerStore' }, parent),
      groups: (args) => fn({ value: { ...args }, type: 'pickerGroups' }, parent),
      activityCollection: (args) =>
        fn({ value: { ...args }, type: 'pickerActivityCollection' }, parent),
      ranking: (args) => fn({ value: { ...args }, type: 'pickerRanking' }, parent)
    })

    Object.defineProperty(Vue.prototype, '$picker', {
      get() {
        return createPickerMethods(this)
      },
      configurable: true
    })
  }
}
