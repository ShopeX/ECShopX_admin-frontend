import { i18n } from '@/i18n'
import { blockFields, toDefaultSettings } from '../schema.js'

export default {
  type: 'hotspot',
  name: i18n.t('d65dbcac.50da72'),
  fields: blockFields.hotspot,
  defaultSettings: toDefaultSettings(blockFields.hotspot),
  legacyDefaultSettings: {
    label: '',
    x: 0,
    y: 0,
    link: ''
  }
}
