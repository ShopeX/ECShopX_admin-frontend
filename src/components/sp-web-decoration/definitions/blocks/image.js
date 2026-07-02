import { i18n } from '@/i18n'
import { blockFields, toDefaultSettings } from '../schema.js'

export default {
  type: 'image',
  name: '图片',
  fields: blockFields.image,
  defaultSettings: toDefaultSettings(blockFields.image),
  legacyDefaultSettings: {
    pc_image: '',
    mobile_image: '',
    introduction: '提供背景或介绍，吸引用户注意',
    introduction_size: 's',
    heading: '关键主题或焦点，简明直接',
    heading_size: 'm',
    description: '简要概述幻灯片内容，突出重点',
    description_size: 's',
    button_text: '按钮文字',
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
