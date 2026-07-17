import { i18nValue } from '../../utils/i18n.js'

export default {
  type: 'image-hotspot',
  scope: 'template',
  name: i18nValue('d65dbcac.081a81', '图片热区'),
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
