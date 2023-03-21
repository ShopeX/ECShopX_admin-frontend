<script>
import {
  PickerImage,
  PickerVideo,
  PickerGoods,
  PickerGoodsParams,
  PickerShop,
  PickerZitiList,
  PickerAftersalesList
} from './pickers'

function resolvePicker(type) {
  switch (type) {
    case 'pickerImage':
      return PickerImage
    case 'pickerVideo':
      return PickerVideo
    case 'pickerGoods':
      return PickerGoods
    case 'pickerGoodsParams':
      return PickerGoodsParams
    case 'pickerShop':
      return PickerShop
    case 'pickerZitiList':
      return PickerZitiList
    case 'pickerAftersalesList':
      return PickerAftersalesList
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
