import { blockFields, toDefaultSettings } from '../schema.js'

export default {
  type: 'product-tab',
  name: '产品系列',
  fields: blockFields['product-tab'],
  defaultSettings: toDefaultSettings(blockFields['product-tab']),
  legacyDefaultSettings: {
    tab_label: '产品系列',
    product_ids: [],
    limit: 8
  }
}
