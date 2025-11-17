/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
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
