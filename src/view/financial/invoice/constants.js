/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
export const status = [
  { value: 'all', label: '625757bc.a8b0c2' },
  { value: 'pending', label: '625757bc.963609' },
  { value: 'inProgress', label: '625757bc.030e4d' },
  { value: 'success', label: '625757bc.186ded' },
  { value: 'failed', label: '625757bc.65dcda' },
  { value: 'waste', label: '625757bc.b7fc00' },
  { value: 'cancel', label: '625757bc.625fb2' }
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
  { value: 'pending', label: '625757bc.963609', title: '625757bc.963609' },
  { value: 'inProgress', label: '625757bc.030e4d', title: '625757bc.030e4d' },
  { value: 'success', label: '625757bc.186ded', title: '625757bc.186ded' },
  { value: 'waste', label: '625757bc.b7fc00', title: '625757bc.b7fc00' },
  { value: 'failed', label: '625757bc.65dcda', title: '625757bc.65dcda' },
  { value: 'cancel', label: '625757bc.625fb2', title: '625757bc.625fb2' }
]

export const invoice_source_map = {
  user: '625757bc.52ffb1',
  oms: '625757bc.6bd7ad'
}

export const invoice_source_arr = [
  { value: 'user', label: '625757bc.52ffb1', title: '625757bc.52ffb1' },
  { value: 'oms', label: '625757bc.6bd7ad', title: '625757bc.6bd7ad' }
]

export const invoice_log_type_map = {
  update: '625757bc.32ac15',
  update_remark: '625757bc.f95807',
  create: '625757bc.d9ac92',
  resend_email: '625757bc.76a64e'
}
