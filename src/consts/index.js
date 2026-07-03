/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { i18n } from '@/i18n'
export const ICON_MAP = {
  'tachometer-alt': 'gaikuang',
  'shopping-bag': 'shangpin',
  'clipboard-list': 'jiaoyi',
  'store-alt': 'jingxiaoshang',
  gem1: 'huiyuan',
  brush: 'moban',
  gift: 'yingxiao',
  'file-invoice-dollar': 'caiwu',
  'chart-bar': 'tongji',
  sitemap: 'zhandian',
  'yingyong-01': 'yingyong',
  cog: 'shezhi'
}

export const OPEN_STATUS_ARR = [
  { value: 'pending', label: i18n.t('e3a5dbf4.963609'), title: i18n.t('e3a5dbf4.963609') },
  { value: 'inProgress', label: i18n.t('e3a5dbf4.030e4d'), title: i18n.t('e3a5dbf4.030e4d') },
  { value: 'success', label: i18n.t('e3a5dbf4.186ded'), title: i18n.t('e3a5dbf4.186ded') },
  { value: 'waste', label: i18n.t('e3a5dbf4.b7fc00'), title: i18n.t('e3a5dbf4.b7fc00') },
  { value: 'failed', label: i18n.t('e3a5dbf4.65dcda'), title: i18n.t('e3a5dbf4.65dcda') },
  { value: 'cancel', label: i18n.t('e3a5dbf4.625fb2'), title: i18n.t('e3a5dbf4.625fb2') },
  { value: 'waitProgress', label: i18n.t('e3a5dbf4.0b5880'), title: i18n.t('e3a5dbf4.0b5880') }
]

export const SALES_STATUS = [
  { title: i18n.t('e3a5dbf4.9b7481'), value: 'onsale' },
  { title: i18n.t('e3a5dbf4.2c50a0'), value: 'offline_sale' },
  { title: i18n.t('e3a5dbf4.acf86b'), value: 'only_show' },
  { title: i18n.t('e3a5dbf4.ae83a3'), value: 'instock' }
]

export const DISTRIBUTION_TYPE = [
  { title: i18n.t('e3a5dbf4.a8b0c2'), value: '' },
  { title: i18n.t('e3a5dbf4.249bfe'), value: 'logistics' },
  { title: i18n.t('e3a5dbf4.583dcd'), value: 'dada' },
  { title: i18n.t('e3a5dbf4.3f6ca2'), value: 'ziti' },
  { title: i18n.t('e3a5dbf4.0e903e'), value: 'merchant' }
]

export const DISTRIBUTION_STATUS = [
  { title: i18n.t('e3a5dbf4.a8b0c2'), value: '' },
  { title: i18n.t('e3a5dbf4.2a2772'), value: 'CONFIRMING' },
  { title: i18n.t('e3a5dbf4.08fefc'), value: 'RECEIVEORDER' },
  { title: i18n.t('e3a5dbf4.891cb5'), value: 'PACKAGED' },
  { title: i18n.t('e3a5dbf4.739c91'), value: 'DELIVERING' },
  { title: i18n.t('e3a5dbf4.f87f48'), value: 'DONE' }
]

export const ORDER_STATUS = [
  { title: i18n.t('e3a5dbf4.a8b0c2'), value: '' },
  { title: i18n.t('e3a5dbf4.9246fe'), value: 'notpay' },
  { title: i18n.t('e3a5dbf4.d8476e'), value: 'notship' },
  { title: i18n.t('e3a5dbf4.4933ca'), value: 'shipping' },
  { title: i18n.t('e3a5dbf4.6b715b'), value: 'cancelapply' },
  { title: i18n.t('e3a5dbf4.25d532'), value: 'ziti' },
  { title: i18n.t('e3a5dbf4.2111cc'), value: 'cancel' },
  { title: i18n.t('e3a5dbf4.fad522'), value: 'finish' },
  { title: i18n.t('e3a5dbf4.1ef6f1'), value: 'dada_0' },
  { title: i18n.t('e3a5dbf4.f8c921'), value: 'dada_1' },
  { title: i18n.t('e3a5dbf4.186671'), value: 'dada_2' },
  { title: i18n.t('e3a5dbf4.b5b1a5'), value: 'dada_100' },
  { title: i18n.t('e3a5dbf4.739c91'), value: 'dada_3' },
  { title: i18n.t('e3a5dbf4.ed23e1'), value: 'dada_9' }
]

export const ORDER_ZITI_STATUS_MAP = {
  PENDING: { label: i18n.t('e3a5dbf4.25d532'), type: 'danger' },
  DONE: { label: i18n.t('e3a5dbf4.feb802'), type: 'success' }
}

export const ORDER_DELIVERY_STATUS_MAP = {
  DONE: { label: i18n.t('e3a5dbf4.355409'), type: 'success' },
  PARTAIL: { label: i18n.t('e3a5dbf4.5296ac'), type: 'success' }
}

export const ORDER_STATUS_MAP = {
  PAYED: { label: i18n.t('e3a5dbf4.8d02a5'), type: 'success' },
  NOTPAY: { label: i18n.t('e3a5dbf4.608afd'), type: 'info' },
  CANCEL: { label: i18n.t('e3a5dbf4.2111cc'), type: 'info' },
  WAIT_BUYER_CONFIRM: { label: i18n.t('e3a5dbf4.4933ca'), type: 'danger' }
}

export const GLOBAL_ORDER_STATUS_MAP = {
  WAIT_GROUPS_SUCCESS: { label: i18n.t('e3a5dbf4.425a40'), type: 'warning' },
  NOTPAY: { label: i18n.t('e3a5dbf4.9246fe'), type: 'info' },
  SUPPLY_PRESCRIPTION_INFO: { label: i18n.t('e3a5dbf4.0f4547'), type: 'info' },
  WAIT_PRESCRIPTION: { label: i18n.t('e3a5dbf4.81d6cc'), type: 'info' },
  WAIT_PAID_CONFIRM: { label: i18n.t('e3a5dbf4.7ec818'), type: 'warning' },
  PAYED_WAIT_PROCESS: { label: i18n.t('e3a5dbf4.73ce8f'), type: 'warning' },
  PAYED_PENDING: { label: i18n.t('e3a5dbf4.25d532'), type: 'warning' },
  PAYED_PARTAIL: { label: i18n.t('e3a5dbf4.5296ac'), type: 'warning' },
  WAIT_BUYER_CONFIRM: { label: i18n.t('e3a5dbf4.4933ca'), type: 'warning' },
  PAYED: { label: i18n.t('e3a5dbf4.d8476e'), type: 'warning' },
  REVIEW_PASS_PARTAIL: { label: i18n.t('e3a5dbf4.d40bd5'), type: 'warning' },
  REVIEW_PASS: { label: i18n.t('e3a5dbf4.36d3df'), type: 'warning' },
  CLOSED: { label: i18n.t('e3a5dbf4.9c5850'), type: 'info' },
  CANCEL: { label: i18n.t('e3a5dbf4.2111cc'), type: 'info' },
  CANCEL_WAIT_PROCESS: { label: i18n.t('e3a5dbf4.73ce8f'), type: 'warning' },
  CANCEL_REFUND_PROCESS: { label: i18n.t('e3a5dbf4.73ce8f'), type: 'warning' },
  CANCEL_REFUND_FAIL: { label: i18n.t('e3a5dbf4.12e196'), type: 'warning' },
  DONE: { label: i18n.t('e3a5dbf4.fad522'), type: 'success' },
  REFUND_PROCESS: { label: i18n.t('e3a5dbf4.73ce8f'), type: 'warning' },
  REFUND_SUCCESS: { label: i18n.t('e3a5dbf4.e85018'), type: 'info' },
  PART_PAYMENT: { label: i18n.t('e3a5dbf4.38b508'), type: 'warning' },
  ORDER_ABERRANT: { label: i18n.t('e3a5dbf4.d0e67b'), type: 'danger' }
}

export const ORDER_B2C_STATUS = [
  { title: i18n.t('e3a5dbf4.a8b0c2'), value: '' },
  { title: i18n.t('e3a5dbf4.9246fe'), value: 'notpay' },
  { title: i18n.t('e3a5dbf4.d8476e'), value: 'notship' },
  { title: i18n.t('e3a5dbf4.4933ca'), value: 'shipping' },
  { title: i18n.t('e3a5dbf4.6b715b'), value: 'cancelapply' },
  { title: i18n.t('e3a5dbf4.2111cc'), value: 'cancel' },
  { title: i18n.t('e3a5dbf4.fad522'), value: 'finish' }
]

export const IN_PURCHASE_STATUS = [
  { title: i18n.t('e3a5dbf4.a8b0c2'), value: '' },
  { title: i18n.t('e3a5dbf4.9246fe'), value: 'notpay' },
  { title: i18n.t('e3a5dbf4.d8476e'), value: 'notship' },
  { title: i18n.t('e3a5dbf4.4933ca'), value: 'shipping' },
  { title: i18n.t('e3a5dbf4.6b715b'), value: 'cancelapply' },
  { title: i18n.t('e3a5dbf4.2111cc'), value: 'cancel' },
  { title: i18n.t('e3a5dbf4.fad522'), value: 'finish' }
]

export const ORDER_TYPE = [
  { title: i18n.t('e3a5dbf4.a8b0c2'), value: '' },
  { title: i18n.t('e3a5dbf4.9b251e'), value: 'groups' },
  { title: i18n.t('e3a5dbf4.ee8bc9'), value: 'seckill' },
  { title: i18n.t('e3a5dbf4.e7978e'), value: 'normal' },
  { title: i18n.t('e3a5dbf4.991e15'), value: 'community' },
  { title: i18n.t('e3a5dbf4.8e09cc'), value: 'excard' },
  { title: i18n.t('e3a5dbf4.0f238d'), value: 'shopadmin' },
  { title: i18n.t('e3a5dbf4.d753bc'), value: 'employee_purchase' }
]

export const INVOICE_STATUS = [
  { title: i18n.t('e3a5dbf4.a8b0c2'), value: '' },
  { title: i18n.t('e3a5dbf4.5613ba'), value: 0 },
  { title: i18n.t('e3a5dbf4.ca4355'), value: 1 }
]

export const INVOICE_STATUS_ARR = [
  { value: 'all', label: i18n.t('e3a5dbf4.a8b0c2'), title: i18n.t('e3a5dbf4.a8b0c2') },
  { value: 'pending', label: i18n.t('e3a5dbf4.963609'), title: i18n.t('e3a5dbf4.963609') },
  { value: 'inProgress', label: i18n.t('e3a5dbf4.030e4d'), title: i18n.t('e3a5dbf4.030e4d') },
  { value: 'success', label: i18n.t('e3a5dbf4.186ded'), title: i18n.t('e3a5dbf4.186ded') },
  { value: 'failed', label: i18n.t('e3a5dbf4.65dcda'), title: i18n.t('e3a5dbf4.65dcda') },
  { value: 'waste', label: i18n.t('e3a5dbf4.b7fc00'), title: i18n.t('e3a5dbf4.b7fc00') }
]

export const GOOD_CATEGORY = [
  { title: i18n.t('e3a5dbf4.491c0c'), value: 'self' },
  { title: i18n.t('e3a5dbf4.b1c9d7'), value: 'distributor' },
  { title: i18n.t('e3a5dbf4.45a570'), value: 'supplier' }
]

export const GOOD_CATEGORY_MAP = {
  self: i18n.t('e3a5dbf4.491c0c'),
  distributor: i18n.t('e3a5dbf4.b1c9d7'),
  supplier: i18n.t('e3a5dbf4.45a570')
}

export const ORDER_CATEGORY = [
  { title: i18n.t('e3a5dbf4.a8b0c2'), value: '' },
  { title: i18n.t('e3a5dbf4.a509ca'), value: 'self' },
  { title: i18n.t('e3a5dbf4.d25231'), value: 'distributor' },
  { title: i18n.t('e3a5dbf4.185202'), value: 'supplier' },
  { title: i18n.t('e3a5dbf4.d76790'), value: 'self_supplier' }
]

export const SELF_ORDER_CATEGORY = [
  { title: i18n.t('e3a5dbf4.a8b0c2'), value: 'self,self_supplier' },
  { title: i18n.t('e3a5dbf4.a509ca'), value: 'self' },
  { title: i18n.t('e3a5dbf4.d76790'), value: 'self_supplier' }
]

export const REFUND_STATUS = {
  READY: i18n.t('e3a5dbf4.5cb424'),
  AUDIT_SUCCESS: i18n.t('e3a5dbf4.202a8b'),
  SUCCESS: i18n.t('e3a5dbf4.d58cbd'),
  SHOP_CHECK_FAILS: i18n.t('e3a5dbf4.0e14e3'),
  CANCEL: i18n.t('e3a5dbf4.0a7dff'),
  PROCESSING: i18n.t('e3a5dbf4.cd3291'),
  FAILS: i18n.t('e3a5dbf4.7c2544'),
  WAIT_CHECK: i18n.t('e3a5dbf4.5cb424'),
  WAIT_REFUND: i18n.t('e3a5dbf4.12e196')
}

export const REFUND_PROCESS = {
  0: i18n.t('e3a5dbf4.047109'),
  1: i18n.t('e3a5dbf4.2111cc'),
  2: i18n.t('e3a5dbf4.07e608'),
  3: i18n.t('e3a5dbf4.fad522'),
  4: i18n.t('e3a5dbf4.dbf36d')
}

export const PROFIT_TYPE = {
  1: i18n.t('e3a5dbf4.43d81b'),
  2: i18n.t('e3a5dbf4.7635bc'),
  3: i18n.t('e3a5dbf4.3c78d2')
}

export const PAY_TYPE = {
  offline: i18n.t('e3a5dbf4.2d8019'),
  offline_pay: i18n.t('e3a5dbf4.2d8019'),
  wxpay: i18n.t('e3a5dbf4.bffe28'),
  amorepay: i18n.t('e3a5dbf4.bffe28'),
  wechat: i18n.t('e3a5dbf4.bffe28'),
  wepayjs: i18n.t('e3a5dbf4.bffe28'),
  wxpaypc: i18n.t('e3a5dbf4.67a318'),
  wxpayh5: i18n.t('e3a5dbf4.df7033'),
  alipay: i18n.t('e3a5dbf4.e3b206'),
  alipayh5: i18n.t('e3a5dbf4.5a3c52'),
  deposit: i18n.t('e3a5dbf4.89ac23'),
  point: i18n.t('e3a5dbf4.accd19'),
  pos: i18n.t('e3a5dbf4.330ef6'),
  wxpaypos: i18n.t('e3a5dbf4.777d5d'),
  alipaypos: i18n.t('e3a5dbf4.bd7030'),
  chinaums: i18n.t('e3a5dbf4.1d7dae'),
  wx_lite: i18n.t('e3a5dbf4.bffe28'),
  wx_pub: i18n.t('e3a5dbf4.df7033'),
  wx_qr: i18n.t('e3a5dbf4.67a318'),
  alipay_wap: i18n.t('e3a5dbf4.5a3c52'),
  alipay_qr: i18n.t('e3a5dbf4.e20bf0'),
  alipaymini: i18n.t('e3a5dbf4.42d922'),
  localPay: i18n.t('e3a5dbf4.941a4a'),
  doumen_intl: i18n.t('822436ab.e37lpb')
}

export const PAY_STATUS = {
  SUCCESS: i18n.t('e3a5dbf4.eb5dc9'),
  REFUND: i18n.t('e3a5dbf4.8e2b9d'),
  CANCEL_CLOSED: i18n.t('e3a5dbf4.2111cc'),
  REFUND_SUCCESS: i18n.t('e3a5dbf4.d58cbd'),
  NOTPAY: i18n.t('e3a5dbf4.608afd'),
  CLOSED: i18n.t('e3a5dbf4.9c5850'),
  REVOKED: i18n.t('e3a5dbf4.50239f'),
  PAYERROR: i18n.t('e3a5dbf4.8e51b3')
}

export const PICKER_DATE_OPTIONS = {
  shortcuts: [
    {
      text: i18n.t('e3a5dbf4.56ee10'),
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: i18n.t('e3a5dbf4.335dfc'),
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: i18n.t('e3a5dbf4.d96eb4'),
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        picker.$emit('pick', [start, end])
      }
    }
  ]
}

export const FORM_COMP = {
  INPUT: 1,
  NUMBER: 2,
  DATE: 3,
  RADIO: 4,
  CHECKBOX: 5,
  MOBILE: 6,
  IMAGE: 7
}

export const LINK_PATH = {
  'goods': i18n.t('e3a5dbf4.9897d8'),
  'store': i18n.t('e3a5dbf4.295713'),
  'sale_category': i18n.t('e3a5dbf4.392d49'),
  'category': i18n.t('e3a5dbf4.b3ed9f'),
  'tag': i18n.t('e3a5dbf4.0f394b'),
  'article': i18n.t('e3a5dbf4.c75625'),
  'planting': i18n.t('e3a5dbf4.e8f87a'),
  'link': i18n.t('e3a5dbf4.59ceff'),
  // 'marketing': '营销',
  'regactivity': i18n.t('e3a5dbf4.2bc045'),
  'purchase_activity': i18n.t('e3a5dbf4.dc7202'),
  'seckill': i18n.t('e3a5dbf4.55c758'),
  'custom_page': i18n.t('e3a5dbf4.cee6eb'),
  'liverooms': i18n.t('e3a5dbf4.7bbe8e'),
  'other_wxapp': i18n.t('e3a5dbf4.f5a0d7'),
  'shop_tag': i18n.t('e3a5dbf4.0f09a8'),
  'lottery': i18n.t('e3a5dbf4.283be6'),
  'customer_service': i18n.t('e3a5dbf4.e7dea7')
}

export const CARD_TYPE = {
  discount: i18n.t('e3a5dbf4.9268f9'),
  cash: i18n.t('e3a5dbf4.f23195'),
  new_gift: i18n.t('e3a5dbf4.8bc752')
}

export const SECKILL_ACTIVITY_STATUS = {
  waiting: i18n.t('e3a5dbf4.1568ba'),
  in_the_notice: i18n.t('e3a5dbf4.7e19ab'),
  in_sale: i18n.t('e3a5dbf4.fb852f'),
  it_has_ended: i18n.t('e3a5dbf4.047fab')
}

export const GOODS_APPLY_STATUS = {
  submiting: i18n.t('e3a5dbf4.a9c09d'),
  approved: i18n.t('e3a5dbf4.9d5b9b'),
  processing: i18n.t('e3a5dbf4.b720a6'),
  rejected: i18n.t('e3a5dbf4.81233d')
}

export const GOODS_TAX_RATE = [
  { title: '1%', value: 1 },
  { title: '6%', value: 6 },
  { title: '9%', value: 9 },
  { title: '13%', value: 13 },
  { title: i18n.t('e3a5dbf4.9f3af5'), value: 0 }
]

export const ROLE_LIST = [
  { label: i18n.t('e3a5dbf4.7527da'), value: 1 },
  { label: i18n.t('e3a5dbf4.9597e9'), value: 6 },
  { label: i18n.t('e3a5dbf4.5f6339'), value: 9 }
]
