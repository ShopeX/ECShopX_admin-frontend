import { i18nValue } from '../../utils/i18n.js'

export default {
  type: 'footer',
  scope: 'footer',
  fixedId: 'footer',
  name: i18nValue('d65dbcac.4eb88f', '页脚'),
  defaultSettings: {
    content_alignment: 'center',
    title: '',
    copyright: '',
    newsletter_heading: '',
    color_mode: 'dark',
    margin_top: 48,
    full_width: false,
    padding_top: 'm',
    color_scheme: 'scheme-3',
    show_social: true,
    payment_enable: true,
    newsletter_enable: false,
    enable_country_selector: true,
    show_policy: true,
    padding_bottom: 'xs',
    enable_brand_information: true,
    enable_language_selector: true
  },
  defaultBlocks: [
    {
      type: 'footer-menu'
    }
  ],
  blocks: {
    allowed: ['footer-menu', 'footer-image', 'footer-text'],
    addable: true,
    sortable: true,
    removable: true
  }
}
