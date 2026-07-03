import { i18n } from '@/i18n'
import { sectionFields, toDefaultSettings } from '../schema.js'

export default {
  type: 'image-hotspot',
  scope: 'template',
  name: i18n.t('d65dbcac.081a81'),
  fields: sectionFields['image-hotspot'],
  defaultSettings: toDefaultSettings(sectionFields['image-hotspot']),
  legacyDefaultSettings: {
    pc_image: '',
    mobile_image: '',
    pc_hotspots: [],
    mobile_hotspots: [],
    full_width: false,
    color_mode: 'light',
    color_scheme: 'scheme-1',
    padding_top: 'm',
    padding_bottom: 'm'
  },
  defaultBlocks: [],
  blocks: {
    // allowed: ['hotspot'],
    allowed: [],
    addable: true,
    sortable: true,
    removable: true
  }
}
