import { i18nValue } from '../../utils/i18n.js'

export default {
  type: 'product-shelf',
  scope: 'template',
  name: i18nValue('d65dbcac.4a02ad', '商品货架'),
  defaultSettings: {
    title: '',
    sourceMode: 'manual',
    itemIds: [],
    categoryId: '',
    columns: 4,
    limit: 8,
    color_mode: 'light',
    color_scheme: 'scheme-1',
    padding_top: 'm',
    padding_bottom: 'm',
    full_width: false
  },
  defaultBlocks: [],
  blocks: {
    allowed: [],
    addable: false,
    sortable: false,
    removable: false
  }
}
