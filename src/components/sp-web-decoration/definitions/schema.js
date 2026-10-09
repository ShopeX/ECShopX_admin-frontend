function field(type, defaultValue, extra = {}) {
  return {
    type,
    default: defaultValue,
    ...extra
  }
}

export const sectionTypeAliases = {
  carousel: 'main-carousel'
}

export const blockTypeAliases = {}

export const sectionFields = {
  header: {
    color_mode: field('enum', 'dark', { values: ['light', 'dark'] }),
    full_width: field('boolean', false),
    sticky_header_type: field('string', 'none'),
    padding_top: field('string', 'xxs'),
    menu_color_style: field('string', 'pure'),
    menu_type_desktop: field('string', 'dropdown'),
    show_line_separator: field('boolean', true),
    menu: field('object', null),
    color_scheme: field('string', 'scheme-1'),
    layout: field('string', 'middle'),
    margin_bottom: field('number', 0),
    enable_country_selector: field('boolean', true),
    mobile_logo_position: field('string', 'center'),
    menu_color_mode: field('enum', 'dark', { values: ['light', 'dark'] }),
    logo_position: field('string', 'center'),
    enable_customer_avatar: field('boolean', true),
    padding_bottom: field('string', 'xxs'),
    menu_color_scheme: field('string', 'scheme-1'),
    enable_language_selector: field('boolean', true)
  },
  footer: {
    content_alignment: field('string', 'center'),
    title: field('string', ''),
    copyright: field('string', ''),
    newsletter_heading: field('string', ''),
    color_mode: field('enum', 'dark', { values: ['light', 'dark'] }),
    margin_top: field('number', 48),
    full_width: field('boolean', false),
    padding_top: field('string', 'm'),
    color_scheme: field('string', 'scheme-3'),
    show_social: field('boolean', true),
    payment_enable: field('boolean', true),
    newsletter_enable: field('boolean', false),
    enable_country_selector: field('boolean', true),
    show_policy: field('boolean', true),
    padding_bottom: field('string', 'xs'),
    enable_brand_information: field('boolean', true),
    enable_language_selector: field('boolean', true)
  },
  'announcement-bar': {
    full_width: field('boolean', false),
    auto_rotate: field('boolean', false),
    enable_country_selector: field('boolean', false),
    color_mode: field('enum', 'light', { values: ['light', 'dark'] }),
    show_line_separator: field('boolean', true),
    change_slides_speed: field('number', 5),
    color_scheme: field('string', 'scheme-1'),
    padding_top: field('string', 'none'),
    padding_bottom: field('string', 'none'),
    show_social: field('boolean', false),
    enable_language_selector: field('boolean', false)
  },
  'main-carousel': {
    image_height: field('enum', 'medium', { values: ['small', 'medium', 'large', 'adapt'] }),
    height: field('string', ''),
    paginate_type: field('enum', 'point', { values: ['point', 'counter', 'number'] }),
    paginate_size: field('enum', 'medium', { values: ['small', 'medium', 'large'] }),
    enable_auto_play: field('boolean', false),
    enable_arrow: field('boolean', true),
    showDots: field('boolean', true),
    full_width: field('boolean', false),
    interval: field('number', 5),
    show_text_below: field('boolean', false),
    color_mode: field('enum', 'light', { values: ['light', 'dark'] }),
    color_scheme: field('string', 'scheme-1'),
    padding_top: field('string', 'm'),
    padding_bottom: field('string', 'm')
  },
  'image-hotspot': {
    pc_image: field('string', '', { aliases: ['imageUrl', 'image_url', 'image'] }),
    mobile_image: field('string', '', { aliases: ['mobileImage', 'mobile_image_url'] }),
    pc_hotspots: field('array', []),
    mobile_hotspots: field('array', []),
    full_width: field('boolean', false),
    color_mode: field('enum', 'light', { values: ['light', 'dark'] }),
    color_scheme: field('string', 'scheme-1'),
    padding_top: field('string', 'm'),
    padding_bottom: field('string', 'm')
  },
  'product-shelf': {
    title: field('string', ''),
    displayMode: field('enum', 'manual', {
      values: ['category', 'manual'],
      aliases: ['sourceMode']
    }),
    itemIds: field('string[]', []),
    categoryId: field('string', ''),
    columns: field('number', 4),
    limit: field('number', 8),
    showPrice: field('boolean', true),
    showAddCart: field('boolean', true),
    color_mode: field('enum', 'light', { values: ['light', 'dark'] }),
    color_scheme: field('string', 'scheme-1'),
    padding_top: field('string', 'm'),
    padding_bottom: field('string', 'm'),
    full_width: field('boolean', false)
  },
  'product-tab-shelf': {
    title: field('string', ''),
    intro: field('string', '新品'),
    size: field('enum', 'medium', {
      values: ['xsmall', 'small', 'medium', 'large', 'xlarge']
    }),
    alignment: field('enum', 'center', { values: ['left', 'center', 'right'] }),
    columns: field('number', 4),
    spacing: field('enum', 'medium', { values: ['none', 'small', 'medium', 'large'] }),
    full_width: field('boolean', false),
    show_price: field('boolean', true),
    show_add_cart: field('boolean', true),
    color_mode: field('enum', 'light', { values: ['light', 'dark'] }),
    color_scheme: field('string', 'scheme-1'),
    padding_top: field('string', 'm'),
    padding_bottom: field('string', 'm')
  },
  'native-product-list': {
    locked: field('boolean', true)
  }
}

export const blockFields = {
  announcement: {
    text: field('string', '')
  },
  header_product_list: {
    title: field('string', ''),
    link: field('string', ''),
    columns_desktop: field('number', 4),
    full_width: field('boolean', false),
    show_discount: field('boolean', false),
    image_ratio: field('string', 'square'),
    show_secondary_image: field('boolean', false),
    color_mode: field('enum', 'light', { values: ['light', 'dark'] }),
    color_style: field('string', 'pure')
  },
  header_collection_product_list: {
    title: field('string', ''),
    link: field('string', ''),
    columns_desktop: field('number', 4),
    full_width: field('boolean', false),
    show_discount: field('boolean', false),
    image_ratio: field('string', 'adapt'),
    show_secondary_image: field('boolean', false),
    color_mode: field('enum', 'light', { values: ['light', 'dark'] }),
    color_style: field('string', 'pure')
  },
  mega_menu: {
    mega_menu_item: field('string', ''),
    alignment: field('string', 'page'),
    image_position: field('string', 'right'),
    image_length: field('string', 'one'),
    enable_image_1_link: field('boolean', false),
    enable_image_2_link: field('boolean', false),
    enable_image_3_link: field('boolean', false),
    image_layout: field('string', 'outside'),
    image_content_alignment: field('string', 'center'),
    image_ratio: field('number', 1),
    image_shape: field('string', 'none'),
    color_mode: field('enum', 'light', { values: ['light', 'dark'] }),
    color_style: field('string', 'pure')
  },
  image: {
    pc_image: field('string', '', { aliases: ['imageUrl'] }),
    mobile_image: field('string', '', { aliases: ['imageUrl'] }),
    introduction: field('string', '提供背景或介绍，吸引用户注意'),
    introduction_size: field('string', 's'),
    heading: field('string', '关键主题或焦点，简明直接'),
    heading_size: field('string', 'm'),
    description: field('string', '简要概述幻灯片内容，突出重点'),
    description_size: field('string', 's'),
    button_text: field('string', '按钮文字'),
    button_size: field('string', 'large'),
    button_style: field('string', 'primary'),
    button_scheme: field('string', 'brand'),
    content_alignment: field('string', 'left'),
    content_layout: field('string', 'top-left'),
    image_opacity: field('number', 20),
    color_mode: field('enum', 'light', { values: ['light', 'dark'] }),
    enable_card: field('boolean', false),
    color_style: field('string', 'pure')
  },
  video: {
    videoUrl: field('string', ''),
    posterUrl: field('string', ''),
    mobileVideoUrl: field('string', ''),
    introduction: field('string', '<div>1231231</div>'),
    introduction_size: field('string', 'l'),
    heading: field('string', '关键主题或焦点，简明直接'),
    heading_size: field('string', 'm'),
    description: field('string', '简要概述幻灯片内容，突出重点'),
    description_size: field('string', 'm'),
    button_text: field('string', '按钮文字'),
    button_size: field('string', 'small'),
    button_style: field('string', 'primary'),
    button_scheme: field('string', 'brand'),
    content_alignment: field('string', 'left'),
    content_layout: field('string', 'middle-left'),
    image_opacity: field('number', 15),
    color_mode: field('enum', 'light', { values: ['light', 'dark'] }),
    enable_card: field('boolean', true),
    color_style: field('string', 'pure')
  },
  hotspot: {
    label: field('string', ''),
    x: field('number', 0),
    y: field('number', 0),
    link: field('string', ''),
    shape: field('enum', 'circle', { values: ['circle', 'rect'] })
  },
  'product-tab': {
    tab_label: field('string', '产品系列'),
    product_ids: field('string[]', []),
    product_snapshots: field('array', []),
    limit: field('number', 8)
  },
  'footer-link': {
    label: field('string', ''),
    url: field('string', '/help')
  },
  'footer-menu': {
    title: field('string', ''),
    menu: field('object', null),
    menu_items: field('array', []),
    size: field('string', 'small'),
    alignment: field('string', 'left'),
    column_span: field('number', 3)
  },
  'footer-image': {
    image: field('string', ''),
    alignment: field('string', 'left'),
    width: field('string', '100'),
    radius: field('string', 'medium'),
    column_span: field('number', 4)
  },
  'footer-text': {
    title: field('string', ''),
    content: field('string', ''),
    title_size: field('string', 'medium'),
    content_size: field('string', 'small'),
    alignment: field('string', 'left'),
    column_span: field('number', 6)
  }
}

export function cloneValue(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value))
}

export function toDefaultSettings(fields = {}) {
  return Object.entries(fields).reduce((settings, [name, spec]) => {
    settings[name] = cloneValue(spec.default)
    return settings
  }, {})
}

export function resolveSectionType(type) {
  return sectionTypeAliases[type] || type
}

export function resolveBlockType(type) {
  return blockTypeAliases[type] || type
}

export function getSectionFields(type) {
  return sectionFields[resolveSectionType(type)] || null
}

export function getBlockFields(type) {
  return blockFields[resolveBlockType(type)] || null
}

export function createDecorationSchema() {
  return {
    sections: cloneValue(sectionFields),
    blocks: cloneValue(blockFields),
    aliases: {
      sections: cloneValue(sectionTypeAliases),
      blocks: cloneValue(blockTypeAliases)
    }
  }
}
