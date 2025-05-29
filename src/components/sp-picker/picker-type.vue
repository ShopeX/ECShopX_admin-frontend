<script>
import {
  PickerImage,
  PickerFilm,
  PickerCoupon,
  PickerCouponPackage,
  PickerGoods,
  PickerGoodsList,
  PickerGoodsSku,
  PickerGoodsParams,
  PickerShop,
  PickerSupplier,
  PickerSeckill,
  PickerPath,
  pickerPathV2,
  PickerTag,
  PickerShopTag,
  PickerVideo,
  PickerZitiList,
  PickerAfterSalesList,
  PickerTemplate,
  PickerCompany,
  PickerEditBoard,
  PickerPlanting,
  PickerPages,
  PickerGoodsItem,
  PickerSaleCategory,
  PickerShopV2,
  PickerShopV3,
  PickerGoodsLive,
  PickerCouponV2,
  PickerTotZone,
  PickerWidget,
  PickerGroups,
  PickerWxapp,
  PickerCrowds,
  PickerActivity,
  PickerCategory
} from './pickers'

function resolvePicker(type) {
  switch (type) {
    case 'pickerImage':
      return PickerImage
    case 'pickerFilm':
      return PickerFilm
    case 'pickerCoupon':
      return PickerCoupon
    case 'pickerCouponV2':
      return PickerCouponV2
    case 'pickerCouponPackage':
      return PickerCouponPackage
    case 'pickerVideo':
      return PickerVideo
    case 'pickerGoods':
      return PickerGoods
    case 'PickerGoodsLive':
      return PickerGoodsLive
    case 'pickerGoodsList':
      return PickerGoodsList
    case 'pickerGoodsSku':
      return PickerGoodsSku
    case 'pickerGoodsParams':
      return PickerGoodsParams
    case 'pickerShop':
      return PickerShop
    case 'PickerShopV2':
      return PickerShopV2
    case 'PickerShopV3':
      return PickerShopV3
    case 'pickerSupplier':
      return PickerSupplier
    case 'pickerSeckill':
      return PickerSeckill
    case 'pickerPath':
      return PickerPath
    case 'pickerPathV2':
      return pickerPathV2
    case 'pickerTag':
      return PickerTag
    case 'pickerShopTag':
      return PickerShopTag
    case 'pickerZitiList':
      return PickerZitiList
    case 'pickerAfterSalesList':
      return PickerAfterSalesList
    case 'pickerTemplate':
      return PickerTemplate
    case 'pickerCompany':
      return PickerCompany
    case 'pickerEditBoard':
      return PickerEditBoard
    case 'pickerPlanting':
      return PickerPlanting
    case 'pickerPages':
      return PickerPages
    case 'pickerHotZone':
      return PickerTotZone
    case 'pickerGoodsItem':
      return PickerGoodsItem
    case 'pickerSaleCategory':
      return PickerSaleCategory
    case 'pickerWidget':
      return PickerWidget
    case 'pickerGroups':
      return PickerGroups
    case 'pickerWxapp':
      return PickerWxapp
    case 'pickerCrowds':
      return PickerCrowds
    case 'pickerActivity':
      return PickerActivity
    case 'pickerCategory':
      return PickerCategory
    default:
      throw new Error(`picker: ${type} not registered`)
    // break
  }
}

export default {
  functional: true,

  render(h, ctx) {
    const type = ctx.props.type
    const data = {
      ...ctx.data,
      value: ctx.data.attrs.value
    }
    console.log(`picker type data:`, data, type)
    return h(resolvePicker(type), data, ctx.children)
  },

  resolvePickerConfig(type) {
    const Picker = resolvePicker(type)
    return Picker.config || {}
  }
}
</script>
