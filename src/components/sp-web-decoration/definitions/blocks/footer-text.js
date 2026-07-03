import { i18n } from '@/i18n'
import { blockFields, toDefaultSettings } from '../schema.js'

export default {
  type: 'footer-text',
  name: '文本',
  fields: blockFields['footer-text'],
  defaultSettings: toDefaultSettings(blockFields['footer-text']),
  legacyDefaultSettings: {
    title: '',
    content: '',
    title_size: 'medium',
    content_size: 'small',
    alignment: 'left',
    column_span: 6
  }
}
