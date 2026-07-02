import { sectionFields, toDefaultSettings } from '../schema.js'

export default {
  type: 'native-product-list',
  scope: 'template',
  name: '商品列表',
  fixedId: 'product_list',
  native: true,
  locked: true,
  addable: false,
  fields: sectionFields['native-product-list'],
  defaultSettings: toDefaultSettings(sectionFields['native-product-list']),
  legacyDefaultSettings: {
    locked: true
  },
  defaultBlocks: [],
  blocks: {
    allowed: [],
    addable: false,
    sortable: false,
    removable: false
  }
}
