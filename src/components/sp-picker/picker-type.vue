<script>
import {
  PickerImage,
  PickerFilm,
  PickerCoupon,
  PickerGoods,
  PickerShop,
  PickerPath,
  PickerTag,
  PickerVideo,
  PickerZitiList,
  PickerAftersalesList,
  PickerEditBoard
} from './pickers'

function resolvePicker(type) {
  switch (type) {
    case 'pickerImage':
      return PickerImage
    case 'pickerFilm':
      return PickerFilm
    case 'pickerCoupon':
      return PickerCoupon
    case 'pickerVideo':
      return PickerVideo
    case 'pickerGoods':
      return PickerGoods
    case 'pickerShop':
      return PickerShop
    case 'pickerPath':
      return PickerPath
    case 'pickerTag':
      return PickerTag
    case 'pickerZitiList':
      return PickerZitiList
    case 'pickerAftersalesList':
      return PickerAftersalesList
    case 'pickerEditBoard':
      return PickerEditBoard
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
