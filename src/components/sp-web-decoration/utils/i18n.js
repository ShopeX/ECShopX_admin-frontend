import { i18n } from '@/i18n'

export function decorationT(key, fallback = '') {
  if (!key) return fallback
  const translated = i18n.t(key)
  return translated && translated !== key ? translated : fallback
}

export function i18nValue(key, fallback = '') {
  return { __decorationI18n: true, key, fallback }
}

export function resolveDecorationI18nValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => resolveDecorationI18nValue(item))
  }
  if (value && typeof value === 'object') {
    if (value.__decorationI18n === true) {
      return decorationT(value.key, value.fallback)
    }
    return Object.keys(value).reduce((result, key) => {
      result[key] = resolveDecorationI18nValue(value[key])
      return result
    }, {})
  }
  return value
}

export default {
  decorationT,
  i18nValue,
  resolveDecorationI18nValue
}
