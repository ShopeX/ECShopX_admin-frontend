<script>
import { PickerImage, PickerGoods, PickerShop } from './pickers'

function resolvePicker(type) {
  switch (type) {
    case 'pickerImage':
      return PickerImage
    case 'pickerGoods':
      return PickerGoods
    case 'pickerShop':
      return PickerShop
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
