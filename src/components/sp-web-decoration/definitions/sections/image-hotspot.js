import { i18n } from '@/i18n'

export default {
  type: 'image-hotspot',
  scope: 'template',
  name: i18n.t('d65dbcac.081a81'),
  defaultSettings: {
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
