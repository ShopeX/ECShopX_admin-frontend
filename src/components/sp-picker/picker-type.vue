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
  PickerSeckill,
  PickerPath,
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
  PickerGoodsItem
} from './pickers'

function resolvePicker(type) {
  switch (type) {
    case 'pickerImage':
      return PickerImage
    case 'pickerFilm':
      return PickerFilm
    case 'pickerCoupon':
      return PickerCoupon
    case 'pickerCouponPackage':
      return PickerCouponPackage
    case 'pickerVideo':
      return PickerVideo
    case 'pickerGoods':
      return PickerGoods
    case 'pickerGoodsList':
      return PickerGoodsList
    case 'pickerGoodsSku':
      return PickerGoodsSku
    case 'pickerGoodsParams':
      return PickerGoodsParams
    case 'pickerShop':
      return PickerShop
    case 'pickerSeckill':
      return PickerSeckill
    case 'pickerPath':
      return PickerPath
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
    case 'pickerGoodsItem':
      return PickerGoodsItem
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
