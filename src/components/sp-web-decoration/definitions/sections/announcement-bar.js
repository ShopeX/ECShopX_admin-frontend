import { i18nValue } from '../../utils/i18n.js'

export default {
  type: 'announcement-bar',
  scope: 'header',
  name: i18nValue('d65dbcac.3921b6', '公告栏'),
  defaultSettings: {
    full_width: false,
    auto_rotate: false,
    enable_country_selector: false,
    color_mode: 'light',
    show_line_separator: true,
    change_slides_speed: 5,
    color_scheme: 'scheme-1',
    padding_top: 'none',
    padding_bottom: 'none',
    show_social: false,
    enable_language_selector: false
  },
  defaultBlocks: [
    {
      type: 'announcement'
    }
  ],
  blocks: {
    allowed: ['announcement'],
    addable: true,
    sortable: true,
    removable: true
  }
}
