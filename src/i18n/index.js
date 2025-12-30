/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
const i18n = {
  zhcn: '简体中文',
  en: 'English',
  // zhtw: '繁體中文',
  ar: 'العربية'
}

export const langMap = {
  zhcn: 'zh-CN',
  en: 'en-CN',
  zhtw: 'zh-TW',
  ar: 'ar-SA'
}

// 同时支持 CommonJS 导出，供 Tailwind 插件使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { langMap, default: i18n }
}

export default i18n
