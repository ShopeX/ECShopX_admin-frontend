/**
 * Tailwind CSS 语言变体插件
 * 支持基于 HTML lang 属性的变体，例如：en-CN:pt-4, zh-CN:pt-2
 * 动态从 langMap 生成语言变体
 */
const { langMap } = require('./src/i18n/index.js')

module.exports = function ({ addVariant }) {
  // 遍历 langMap，动态生成语言变体
  Object.values(langMap).forEach((langAttr) => {
    // 为每个语言属性添加变体
    // 当 HTML lang 属性匹配时应用样式
    addVariant(langAttr, `html[lang="${langAttr}"] &`)
  })
}
