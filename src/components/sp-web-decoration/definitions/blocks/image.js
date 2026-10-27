import { i18nValue } from '../../utils/i18n.js'

export default {
  type: 'image',
  name: i18nValue('0e42b54b.20def7', '图片'),
  defaultSettings: {
    pc_image: '',
    mobile_image: '',
    link: {
      linkType: 0,
      linkUrl: '',
      linkPage: '',
      id: '',
      title: ''
    },
    introduction: i18nValue('0e42b54b.272f12', '提供背景或介绍，吸引用户注意'),
    introduction_size: 's',
    heading: i18nValue('0e42b54b.563009', '关键主题或焦点，简明直接'),
    heading_size: 'm',
    description: i18nValue('0e42b54b.23614c', '简要概述幻灯片内容，突出重点'),
    description_size: 's',
    button_text: i18nValue('0e42b54b.24bdc7', '按钮文字'),
    button_size: 'large',
    button_style: 'primary',
    button_scheme: 'brand',
    content_alignment: 'left',
    content_layout: 'top-left',
    image_opacity: 20,
    color_mode: 'light',
    enable_card: false,
    color_style: 'pure'
  }
}
