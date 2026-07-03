import { i18n } from '@/i18n'
import { blockFields, toDefaultSettings } from '../schema.js'
export default {
  type: 'footer-link',
  name: i18n.t('d65dbcac.406baf'),
  fields: blockFields['footer-link'],
  defaultSettings: toDefaultSettings(blockFields['footer-link']),
  legacyDefaultSettings: {
    label: '',
    url: '/help'
  }
}
