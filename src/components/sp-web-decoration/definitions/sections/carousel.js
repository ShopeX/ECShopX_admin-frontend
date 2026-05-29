import { i18n } from '@/i18n'

export default {
  type: 'main-carousel',
  scope: 'template',
  name: i18n.t('d65dbcac.0c0180'),
  defaultSettings: {
    image_height: 'medium',
    paginate_type: 'point',
    paginate_size: 'medium',
    enable_auto_play: false,
    enable_arrow: true,
    full_width: false,
    interval: 5,
    show_text_below: false,
    color_mode: 'light',
    color_scheme: 'scheme-1',
    padding_top: 'm',
    padding_bottom: 'm'
  },
  defaultBlocks: [{ type: 'image' }, { type: 'image' }, { type: 'image' }],
  blocks: {
    allowed: ['image', 'video'],
    addable: true,
    sortable: true,
    removable: true
  }
}
