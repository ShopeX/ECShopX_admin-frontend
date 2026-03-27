/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 *
 * 标准 vue-i18n 接入
 * 语言包维护于 src/i18n/locales/*.json，新增 key 时在所有语言文件中同步添加。
 *
 * 扩展新语言只需：
 * 1. 在 LANGUAGES 中添加配置
 * 2. 创建对应的 locales/*.json 文件
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zhCN from './locales/zh-CN.json'
import en from './locales/en.json'
import ar from './locales/ar.json'

Vue.use(VueI18n)

/**
 * 语言配置（单一配置源）
 * 扩展新语言只需在此添加一项
 *
 * @property {string} locale - vue-i18n locale 标识
 * @property {string} label - 界面展示名称
 * @property {string} htmlLang - HTML lang 属性值（BCP 47）
 * @property {string} dir - 文字方向 ltr/rtl
 * @property {object} messages - 语言包
 */
const LANGUAGES = {
  zhcn: {
    locale: 'zh-CN',
    label: '简体中文',
    htmlLang: 'zh-CN',
    dir: 'ltr',
    messages: zhCN
  },
  en: {
    locale: 'en',
    label: 'English',
    htmlLang: 'en',
    dir: 'ltr',
    messages: en
  },
  ar: {
    locale: 'ar',
    label: 'العربية',
    htmlLang: 'ar-SA',
    dir: 'rtl',
    messages: ar
  }
}

const DEFAULT_LANG = 'zhcn'

function getStoredLang() {
  if (typeof localStorage === 'undefined' || typeof localStorage.getItem !== 'function') {
    return DEFAULT_LANG
  }
  const lang = localStorage.getItem('lang')
  return lang && LANGUAGES[lang] ? lang : DEFAULT_LANG
}

const initialLang = getStoredLang()
const initialConfig = LANGUAGES[initialLang] || LANGUAGES[DEFAULT_LANG]

const i18n = new VueI18n({
  locale: initialConfig.locale,
  fallbackLocale: LANGUAGES[DEFAULT_LANG].locale,
  messages: Object.fromEntries(Object.values(LANGUAGES).map((cfg) => [cfg.locale, cfg.messages])),
  silentTranslationWarn: true
})

// 从 LANGUAGES 自动生成的映射表（向后兼容）
export const langMap = Object.fromEntries(
  Object.entries(LANGUAGES).map(([key, cfg]) => [key, cfg.htmlLang])
)

export const localeNames = Object.fromEntries(
  Object.entries(LANGUAGES).map(([key, cfg]) => [key, cfg.label])
)

function setDocumentLang(storeLang) {
  if (typeof document === 'undefined') return
  const config = LANGUAGES[storeLang] || LANGUAGES[DEFAULT_LANG]
  const html = document.documentElement
  html.setAttribute('lang', config.htmlLang)
  html.setAttribute('dir', config.dir)
}

setDocumentLang(initialLang)

/**
 * 切换语言（更新 vue-i18n、HTML lang/dir）
 */
export function changeLang(storeLang) {
  const config = LANGUAGES[storeLang] || LANGUAGES[DEFAULT_LANG]
  i18n.locale = config.locale
  setDocumentLang(storeLang)
}

export { i18n, getStoredLang, LANGUAGES }

export default localeNames

// 供 Tailwind 等 CommonJS 使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { langMap, localeNames, LANGUAGES, default: localeNames }
}
