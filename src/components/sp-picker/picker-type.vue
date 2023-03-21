<script>
import {
  PickerImage,
  PickerFilm,
  PickerCoupon,
  PickerCouponPackage,
  PickerGoods,
  PickerGoodsParams,
  PickerShop,
  PickerSeckill,
  PickerPath,
  PickerTag,
  PickerShopTag,
  PickerVideo,
  PickerZitiList,
  PickerAftersalesList,
  PickerEditBoard,
  PickerPlanting
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
    case 'pickerAftersalesList':
      return PickerAftersalesList
    case 'pickerEditBoard':
      return PickerEditBoard
    case 'pickerPlanting':
      return PickerPlanting
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
