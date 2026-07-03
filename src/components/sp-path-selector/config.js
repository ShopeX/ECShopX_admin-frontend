export const PATH_SELECTOR_TYPES = [
  { name: 'goods', labelKey: 'd81d8932.9897d8' },
  { name: 'sale_category', labelKey: 'd81d8932.392d49' },
  { name: 'category', labelKey: 'd81d8932.b3ed9f' },
  { name: 'tag', labelKey: 'd81d8932.0f394b' },
  { name: 'article', labelKey: 'd81d8932.c75625' },
  { name: 'planting', labelKey: 'd81d8932.e8f87a' },
  { name: 'custom_page', labelKey: 'd81d8932.cee6eb' },
  { name: 'regactivity', labelKey: 'd81d8932.2bc045' },
  { name: 'purchase_activity', labelKey: 'd81d8932.dc7202' },
  { name: 'live', labelKey: 'd81d8932.7bbe8e' },
  { name: 'other_wxapp', labelKey: 'd81d8932.f5a0d7' },
  { name: 'lottery', labelKey: 'd81d8932.283be6' },
  { name: 'share_page', labelKey: 'd81d8932.787963' },
  { name: 'customer_service', labelKey: 'd81d8932.e7dea7' },
  { name: 'link', labelKey: 'd81d8932.59ceff' }
]

export const PATH_SELECTOR_PLATFORM_TYPES = {
  web: ['goods', 'sale_category', 'category', 'custom_page']
}

export function getPathSelectorTypes(platform) {
  const names = PATH_SELECTOR_PLATFORM_TYPES[platform]
  if (!names) return PATH_SELECTOR_TYPES
  return PATH_SELECTOR_TYPES.filter((item) => names.includes(item.name))
}
