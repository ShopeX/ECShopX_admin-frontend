import { i18nValue } from '../../utils/i18n.js'

export default {
  type: 'product-tab-shelf',
  scope: 'template',
  name: i18nValue('6daca440.78964b', 'Tab产品系列'),
  defaultSettings: {
    title: '',
    intro: i18nValue('6daca440.5f3ca6', '新品'),
    size: 'medium',
    alignment: 'center',
    columns: 4,
    spacing: 'medium',
    full_width: false,
    show_price: true,
    show_add_cart: true,
    color_mode: 'light',
    color_scheme: 'scheme-1',
    padding_top: 'm',
    padding_bottom: 'm'
  },
  defaultBlocks: [
    {
      type: 'product-tab',
      settings: { tab_label: i18nValue('6daca440.81af76', '产品系列'), product_ids: [], limit: 8 }
    }
  ],
  blocks: {
    allowed: ['product-tab'],
    addable: true,
    sortable: true,
    removable: true
  }
}
