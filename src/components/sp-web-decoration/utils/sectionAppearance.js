export const SECTION_PADDING_OPTIONS = [
  { label: '无', value: 'none' },
  { label: '极小', value: 'xxs' },
  { label: '特小', value: 'xs' },
  { label: '小', value: 's' },
  { label: '中', value: 'm' },
  { label: '大', value: 'l' },
  { label: '特大', value: 'xl' }
]

export const SECTION_COLOR_SCHEMES = [
  { label: '默认', value: 'scheme-1', background: '#ffffff', foreground: '#191A1D' },
  { label: '浅灰', value: 'scheme-2', background: '#f5f7fb', foreground: '#191A1D' },
  { label: '深色', value: 'scheme-3', background: '#111214', foreground: '#ffffff' },
  { label: '品牌', value: 'scheme-4', background: '#7c3aed', foreground: '#ffffff' },
  { label: '柔和', value: 'scheme-5', background: '#eef2ff', foreground: '#191A1D' }
]

export function getSectionPaddingValue(value) {
  return SECTION_PADDING_OPTIONS.some((item) => item.value === value) ? value : 'm'
}

export function getSectionColorScheme(value) {
  return SECTION_COLOR_SCHEMES.find((item) => item.value === value) || SECTION_COLOR_SCHEMES[0]
}
