export const SECTION_PADDING_OPTIONS = [
  { labelKey: '24ca8e2b.d81bb2', value: 'none' },
  { labelKey: '24ca8e2b.23ecf4', value: 'xxs' },
  { labelKey: '24ca8e2b.f72ce9', value: 'xs' },
  { labelKey: '24ca8e2b.391b8f', value: 's' },
  { labelKey: '24ca8e2b.aed1df', value: 'm' },
  { labelKey: '24ca8e2b.ab18e3', value: 'l' },
  { labelKey: '24ca8e2b.3386da', value: 'xl' }
]

export const SECTION_COLOR_SCHEMES = [
  {
    labelKey: '24ca8e2b.18c634',
    value: 'scheme-1',
    background: '#ffffff',
    foreground: '#191A1D'
  },
  {
    labelKey: '24ca8e2b.536a2a',
    value: 'scheme-2',
    background: '#f5f7fb',
    foreground: '#191A1D'
  },
  {
    labelKey: '24ca8e2b.41e8e8',
    value: 'scheme-3',
    background: '#111214',
    foreground: '#ffffff'
  },
  {
    labelKey: '24ca8e2b.09307c',
    value: 'scheme-4',
    background: '#7c3aed',
    foreground: '#ffffff'
  },
  {
    labelKey: '24ca8e2b.eecfde',
    value: 'scheme-5',
    background: '#eef2ff',
    foreground: '#191A1D'
  }
]

export function getSectionPaddingValue(value) {
  return SECTION_PADDING_OPTIONS.some((item) => item.value === value) ? value : 'm'
}

export function getSectionColorScheme(value) {
  return SECTION_COLOR_SCHEMES.find((item) => item.value === value) || SECTION_COLOR_SCHEMES[0]
}
