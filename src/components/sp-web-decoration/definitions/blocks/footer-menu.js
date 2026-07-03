import { i18n } from '@/i18n'
import { blockFields, toDefaultSettings } from '../schema.js'

export default {
  type: 'footer-menu',
  name: '菜单',
  fields: blockFields['footer-menu'],
  defaultSettings: toDefaultSettings(blockFields['footer-menu']),
  legacyDefaultSettings: {
    title: '',
    menu: null,
    size: 'small',
    alignment: 'left',
    column_span: 3
  }
}
