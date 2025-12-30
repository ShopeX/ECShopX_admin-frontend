// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------

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
