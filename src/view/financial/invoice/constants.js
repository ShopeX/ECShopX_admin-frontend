/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

/**
 * 以下为 vue-i18n 文案 key（src/i18n/locales/*.json），界面展示须通过 this.$t(key) 转换，
 * 勿把 key 当作最终展示字符串使用。
 */
export const status = [
  { value: 'all', i18nKey: '625757bc.a8b0c2' },
  { value: 'pending', i18nKey: '625757bc.963609' },
  { value: 'inProgress', i18nKey: '625757bc.030e4d' },
  { value: 'success', i18nKey: '625757bc.186ded' },
  { value: 'failed', i18nKey: '625757bc.65dcda' },
  { value: 'waste', i18nKey: '625757bc.b7fc00' },
  { value: 'cancel', i18nKey: '625757bc.625fb2' }
]

export const open_status_map = {
  inProgress: '625757bc.030e4d',
  success: '625757bc.186ded',
  waste: '625757bc.b7fc00',
  failed: '625757bc.65dcda',
  pending: '625757bc.963609',
  cancel: '625757bc.625fb2'
}

export const open_status_step_map = {
  online: '625757bc.1f931c',
  offline: '625757bc.6be6e5'
}

export const invoice_type_code_map = {
  '01': '625757bc.558f83',
  '02': '625757bc.8a487a'
}

export const open_status_arr = [
  { value: 'pending', i18nKey: '625757bc.963609' },
  { value: 'inProgress', i18nKey: '625757bc.030e4d' },
  { value: 'success', i18nKey: '625757bc.186ded' },
  { value: 'waste', i18nKey: '625757bc.b7fc00' },
  { value: 'failed', i18nKey: '625757bc.65dcda' },
  { value: 'cancel', i18nKey: '625757bc.625fb2' }
]

export const invoice_source_map = {
  user: '625757bc.52ffb1',
  oms: '625757bc.6bd7ad'
}

export const invoice_source_arr = [
  { value: 'user', i18nKey: '625757bc.52ffb1' },
  { value: 'oms', i18nKey: '625757bc.6bd7ad' }
]

export const invoice_log_type_map = {
  update: '625757bc.32ac15',
  update_remark: '625757bc.f95807',
  create: '625757bc.d9ac92',
  resend_email: '625757bc.76a64e'
}
