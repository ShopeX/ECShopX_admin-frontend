import { i18n } from '@/i18n'
import { blockFields, toDefaultSettings } from '../schema.js'

export default {
  type: 'mega_menu',
  name: '超级菜单',
  fields: blockFields.mega_menu,
  defaultSettings: toDefaultSettings(blockFields.mega_menu),
  legacyDefaultSettings: {
    mega_menu_item: '',
    alignment: 'page',
    image_position: 'right',
    image_length: 'one',
    enable_image_1_link: false,
    enable_image_2_link: false,
    enable_image_3_link: false,
    image_layout: 'outside',
    image_content_alignment: 'center',
    image_ratio: 1,
    image_shape: 'none',
    color_mode: 'light',
    color_style: 'pure'
  }
}
