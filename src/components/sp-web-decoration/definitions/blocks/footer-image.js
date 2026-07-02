import { i18n } from '@/i18n'
import { blockFields, toDefaultSettings } from '../schema.js'

export default {
  type: 'footer-image',
  name: '图片',
  fields: blockFields['footer-image'],
  defaultSettings: toDefaultSettings(blockFields['footer-image']),
  legacyDefaultSettings: {
    image: '',
    alignment: 'left',
    width: '100',
    radius: 'medium',
    column_span: 4
  }
}
