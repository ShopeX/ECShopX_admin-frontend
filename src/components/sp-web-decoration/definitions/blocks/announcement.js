import { i18n } from '@/i18n'
import { blockFields, toDefaultSettings } from '../schema.js'

export default {
  type: 'announcement',
  name: i18n.t('d65dbcac.fa86f1'),
  fields: blockFields.announcement,
  defaultSettings: toDefaultSettings(blockFields.announcement),
  legacyDefaultSettings: {
    text: ''
  }
}
