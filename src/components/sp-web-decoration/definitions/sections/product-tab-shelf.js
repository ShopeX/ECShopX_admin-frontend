export default {
  type: 'product-tab-shelf',
  scope: 'template',
  name: 'Tab产品系列',
  defaultSettings: {
    title: '',
    intro: '新品',
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
    { type: 'product-tab', settings: { tab_label: '产品系列', product_ids: [], limit: 8 } }
  ],
  blocks: {
    allowed: ['product-tab'],
    addable: true,
    sortable: true,
    removable: true
  }
}
