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

// 斗拱支付方式基础配置
export const BSPAY_PAYMENT_CHANNELS = [
  { name: '微信支付', label: 'wx_lite' },
  { name: '微信公众号支付', label: 'wx_pub' },
  { name: '微信扫码支付', label: 'wx_qr' },
  { name: '支付宝支付', label: 'alipay_wap' },
  { name: '支付宝扫码支付', label: 'alipay_qr' }
]

// 自动生成支付方式显示名称映射
export const BSPAY_PAYMENT_DISPLAY_NAMES = BSPAY_PAYMENT_CHANNELS.reduce((acc, item) => {
  acc[item.label] = item.name
  return acc
}, {})

// 自动生成下拉选择选项
export const BSPAY_PAYMENT_OPTIONS = BSPAY_PAYMENT_CHANNELS.map((item) => ({
  label: item.name,
  value: item.label
}))
