import { i18nValue } from '../../utils/i18n.js'

export default {
  type: 'video',
  name: i18nValue('bdd52c70.7fcf42', '视频'),
  defaultSettings: {
    videoUrl: '',
    posterUrl: '',
    mobileVideoUrl: '',
    introduction: '<div>1231231</div>',
    introduction_size: 'l',
    heading: i18nValue('bdd52c70.563009', '关键主题或焦点，简明直接'),
    heading_size: 'm',
    description: i18nValue('bdd52c70.23614c', '简要概述幻灯片内容，突出重点'),
    description_size: 'm',
    button_text: i18nValue('bdd52c70.24bdc7', '按钮文字'),
    button_size: 'small',
    button_style: 'primary',
    button_scheme: 'brand',
    content_alignment: 'left',
    content_layout: 'middle-left',
    image_opacity: 15,
    color_mode: 'light',
    enable_card: true,
    color_style: 'pure'
  }
}
