<script>
import {
  PickerImage,
  PickerGoods,
  PickerGoodsList,
  PickerGoodsSku,
  PickerShop,
  PickerZitiList,
  PickerAfterSalesList,
  PickerTemplate,
  PickerCompany
} from './pickers'

function resolvePicker(type) {
  switch (type) {
    case 'pickerImage':
      return PickerImage
    case 'pickerGoods':
      return PickerGoods
    case 'pickerGoodsList':
      return PickerGoodsList
    case 'pickerGoodsSku':
      return PickerGoodsSku
    case 'pickerShop':
      return PickerShop
    case 'pickerZitiList':
      return PickerZitiList
    case 'pickerAfterSalesList':
      return PickerAfterSalesList
    case 'pickerTemplate':
      return PickerTemplate
    case 'pickerCompany':
      return PickerCompany
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
