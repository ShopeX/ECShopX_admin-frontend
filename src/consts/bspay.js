/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
export const BSPAY_PAYMENT_CHANNELS = [
  { name: '8ddcacac.bffe28', label: 'wx_lite' },
  { name: '8ddcacac.f661cb', label: 'wx_pub' },
  { name: '8ddcacac.777d5d', label: 'wx_qr' },
  { name: '8ddcacac.e3b206', label: 'alipay_wap' },
  { name: '8ddcacac.bd7030', label: 'alipay_qr' }
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
