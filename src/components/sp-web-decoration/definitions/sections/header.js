import { i18nValue } from '../../utils/i18n.js'

export default {
  type: 'header',
  scope: 'header',
  fixedId: 'header',
  name: i18nValue('d65dbcac.917f14', '标头'),
  defaultSettings: {
    color_mode: 'dark',
    full_width: false,
    sticky_header_type: 'none',
    padding_top: 'xxs',
    menu_color_style: 'pure',
    menu_type_desktop: 'dropdown',
    show_line_separator: true,
    menu: null,
    color_scheme: 'scheme-1',
    layout: 'middle',
    margin_bottom: 0,
    enable_country_selector: true,
    mobile_logo_position: 'center',
    menu_color_mode: 'dark',
    logo_position: 'center',
    enable_customer_avatar: true,
    padding_bottom: 'xxs',
    menu_color_scheme: 'scheme-1',
    enable_language_selector: true
  },
  defaultBlocks: [],
  blocks: {
    // allowed: ['header_product_list', 'header_collection_product_list', 'mega_menu'],
    allowed: [],
    addable: true,
    sortable: true,
    removable: true
  }
}
